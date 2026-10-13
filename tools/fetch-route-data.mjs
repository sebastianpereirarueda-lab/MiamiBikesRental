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
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1e-12;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
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

  // Loop Road: route through the middle of the real Loop Road so OSRM doesn't skip it.
  if (r.stops.some((s) => s[0] === "Loop Road")) {
    const lr = await overpass('[out:json][timeout:60];way["name"="Loop Road"](25.6,-81.2,25.95,-80.7);out geom;');
    const nodes = lr.elements.flatMap((w) => w.geometry || []).sort((a, b) => a.lon - b.lon);
    if (nodes.length) {
      const mid = nodes[Math.floor(nodes.length / 2)];
      const i = r.stops.findIndex((s) => s[0] === "Loop Road");
      stops.splice(i + 1, 0, [mid.lon, mid.lat]);
      console.log("  loop road via", mid.lat, mid.lon);
    }
  }

  const coords = stops.map((p) => p.join(",")).join(";");
  const osrm = await getJSON(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&continue_straight=false`);
  const route = osrm.routes[0];
  let line = route.geometry.coordinates;
  console.log("  route", Math.round(route.distance / 1609), "mi,", Math.round(route.duration / 60), "min,", line.length, "pts");

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
