// Downloads real map data for every ride in js/routes-data.js:
//   - the driving route through the stops (OSRM, OpenStreetMap data)
//   - roads, coastline and waterways around it (Overpass API, OpenStreetMap data)
// Output: tools/route-data/<slug>.json, used by tools/render_route_maps.py.
// Runs in GitHub Actions (see .github/workflows/route-data.yml).
import fs from "node:fs";
import vm from "node:vm";

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync("js/routes-data.js", "utf8"), ctx);
const ROUTES = ctx.window.ROUTES;
const only = process.argv[2];

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r5 = (n) => Math.round(n * 1e5) / 1e5;
const UA = { "User-Agent": "miamibikesrentals.com route map builder (github actions)" };

async function getJSON(url, opts = {}, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...opts, headers: { ...UA, ...(opts.headers || {}) } });
      if (res.ok) return await res.json();
      console.log("HTTP", res.status, url.slice(0, 120));
    } catch (e) {
      console.log("fetch error", e.message);
    }
    await sleep(5000 * (i + 1));
  }
  throw new Error("failed: " + url.slice(0, 160));
}

const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
async function overpass(q) {
  for (const ep of OVERPASS) {
    try {
      return await getJSON(ep, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" } }, 2);
    } catch (e) {
      console.log(e.message);
    }
  }
  throw new Error("overpass failed");
}

// Douglas-Peucker on [lng,lat] arrays
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0, idx = -1;
    const [x1, y1] = pts[a], [x2, y2] = pts[b];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    for (let i = a + 1; i < b; i++) {
      // closed rings (loops, islands) have identical endpoints: use point distance
      const d = len < 1e-12
        ? Math.hypot(pts[i][0] - x1, pts[i][1] - y1)
        : Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > max) (max = d), (idx = i);
    }
    if (max > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

fs.mkdirSync("tools/route-data", { recursive: true });

for (const r of ROUTES) {
  const id = slug(r.title);
  if (only && only !== id) continue;
  console.log("==", id);
  let stops = r.stops.map((s) => [s[2], s[1]]);

  // Loop Road is unpaved in parts, so routers skip it. Stitch in its real shape:
  // route to its east end, follow Loop Road, then route on from its west end.
  const osrmLeg = async (pts) => {
    const res = await getJSON(`https://router.project-osrm.org/route/v1/driving/${pts.map((p) => p.join(",")).join(";")}?overview=full&geometries=geojson&continue_straight=false`);
    return res.routes[0];
  };
  let line, distance = 0, duration = 0;
  const li = r.stops.findIndex((s) => s[0] === "Loop Road");
  if (li >= 0) {
    const lr = await overpass('[out:json][timeout:60];way["name"="Loop Road"](25.6,-81.2,25.95,-80.7);out geom;');
    let ways = lr.elements.filter((w) => w.geometry).map((w) => w.geometry.map((g) => [g.lon, g.lat]));
    // chain the ways starting from the easternmost end
    const ends = ways.flatMap((w) => [w[0], w[w.length - 1]]);
    let cur = ends.reduce((m, p) => (p[0] > m[0] ? p : m));
    let chain = [];
    while (ways.length) {
      let best = -1, rev = false, bd = Infinity;
      ways.forEach((w, i) => {
        const d0 = Math.hypot(w[0][0] - cur[0], w[0][1] - cur[1]);
        const d1 = Math.hypot(w[w.length - 1][0] - cur[0], w[w.length - 1][1] - cur[1]);
        if (d0 < bd) (bd = d0), (best = i), (rev = false);
        if (d1 < bd) (bd = d1), (best = i), (rev = true);
      });
      if (bd > 0.01) break; // not connected to the chain
      let w = ways.splice(best, 1)[0];
      if (rev) w = w.slice().reverse();
      chain = chain.concat(w);
      cur = w[w.length - 1];
    }
    console.log("  loop road chain", chain.length, "pts, west end", cur);
    const before = await osrmLeg([...stops.slice(0, li), chain[0]]);
    const after = await osrmLeg([chain[chain.length - 1], ...stops.slice(li + 1).filter((s, k) => r.stops[li + 1 + k][0] !== "Monroe Station")]);
    line = [...before.geometry.coordinates, ...chain, ...after.geometry.coordinates];
    let loopLen = 0;
    for (let i = 1; i < chain.length; i++) loopLen += Math.hypot((chain[i][0] - chain[i - 1][0]) * 100 * Math.cos(0.45), (chain[i][1] - chain[i - 1][1]) * 111);
    distance = before.distance + after.distance + loopLen * 1000;
    duration = before.duration + after.duration + (loopLen / 40) * 3600;
  } else {
    const res = await osrmLeg(stops);
    line = res.geometry.coordinates;
    distance = res.distance;
    duration = res.duration;
  }
  const route = { distance, duration };
  console.log("  route", Math.round(distance / 1609), "mi,", Math.round(duration / 60), "min,", line.length, "pts");

  // bbox around route, padded, widened to the panel aspect (600x440)
  let w = Math.min(...line.map((p) => p[0])), e = Math.max(...line.map((p) => p[0]));
  let s = Math.min(...line.map((p) => p[1])), n = Math.max(...line.map((p) => p[1]));
  const k = Math.cos(((s + n) / 2) * (Math.PI / 180));
  let spanX = (e - w) * k, spanY = n - s;
  const pad = 0.14;
  spanX *= 1 + 2 * pad; spanY *= 1 + 2 * pad;
  const aspect = 600 / 440;
  if (spanX / spanY < aspect) spanX = spanY * aspect; else spanY = spanX / aspect;
  const cx = (w + e) / 2, cy = (s + n) / 2;
  w = cx - spanX / k / 2; e = cx + spanX / k / 2; s = cy - spanY / 2; n = cy + spanY / 2;
  const bbox = [s, w, n, e].map(r5);
  const tol = spanY / 2500;

  const big = spanY > 0.35;
  const hw = big
    ? "motorway|trunk|primary|secondary|motorway_link|trunk_link"
    : spanY > 0.15
    ? "motorway|trunk|primary|secondary|tertiary|motorway_link|trunk_link|primary_link"
    : "motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street|motorway_link|trunk_link|primary_link|secondary_link";
  const q = `[out:json][timeout:240][maxsize:400000000];
(
  way["highway"~"^(${hw})$"](${bbox.join(",")});
  way["natural"="coastline"](${bbox.join(",")});
  way["waterway"~"^(river|canal)$"](${bbox.join(",")});
);
out geom;`;
  const data = await overpass(q);
  const major = /^(motorway|trunk|primary)/;
  const mid = /^(secondary|tertiary)/;
  const out = { id, bbox, distance_mi: Math.round(route.distance / 1609), duration_min: Math.round(route.duration / 60), route: simplify(line, tol / 2).map((p) => p.map(r5)), major: [], mid: [], minor: [], coast: [], water: [] };
  for (const el of data.elements) {
    if (!el.geometry) continue;
    const pts = simplify(el.geometry.map((g) => [g.lon, g.lat]), tol).map((p) => p.map(r5));
    if (pts.length < 2) continue;
    const t = el.tags || {};
    if (t.natural === "coastline") out.coast.push(pts);
    else if (t.waterway) out.water.push(pts);
    else if (major.test(t.highway)) out.major.push(pts);
    else if (mid.test(t.highway)) out.mid.push(pts);
    else out.minor.push(pts);
  }
  fs.writeFileSync(`tools/route-data/${id}.json`, JSON.stringify(out));
  console.log("  saved", ["major", "mid", "minor", "coast", "water"].map((k2) => `${k2}:${out[k2].length}`).join(" "), Math.round(fs.statSync(`tools/route-data/${id}.json`).size / 1024) + "KB");
  await sleep(3000);
}
