"""Render the Routes page maps (assets/routes/<slug>.svg) in the site's dark/orange style.

Input: tools/route-data/<slug>.json (real OpenStreetMap roads, coastline and the
driving route, fetched by tools/fetch-route-data.mjs in GitHub Actions) and the
stop names/label positions from js/routes-data.js.

Usage:  pip install shapely && python3 tools/render_route_maps.py
"""
import json, math, os, re, subprocess, sys
from shapely.geometry import LineString, Point, box, MultiLineString
from shapely.ops import unary_union, polygonize

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 880
ORANGE = "#ff6a0d"


def load_routes():
    js = "const fs=require('fs');const vm=require('vm');const c={window:{}};" \
         "vm.runInNewContext(fs.readFileSync('js/routes-data.js','utf8'),c);" \
         "process.stdout.write(JSON.stringify(c.window.ROUTES))"
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))


def slug(s):
    import unicodedata
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", s))


def render(route, data):
    s, w, n, e = data["bbox"]
    px = lambda lng, lat: ((lng - w) / (e - w) * W, (n - lat) / (n - s) * H)
    proj = lambda pts: [px(*p) for p in pts]
    frame = box(0, 0, W, H)
    big = box(-40, -40, W + 40, H + 40)

    # ---- land from coastline (OSM convention: land is on the left of the way) ----
    land = []
    coast = [LineString(proj(c)) for c in data["coast"] if len(c) > 1]
    if coast:
        lines = unary_union([c.intersection(big) for c in coast] + [frame.exterior])
        faces = [f.intersection(frame) for f in polygonize(lines)]
        faces = [f for f in faces if not f.is_empty and f.area > 1]
        votes = [0] * len(faces)
        for c in data["coast"]:
            pts = proj(c)
            for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
                L = math.hypot(x1 - x0, y1 - y0)
                if L < 1e-6:
                    continue
                mx, my = (x0 + x1) / 2, (y0 + y1) / 2
                # geographic "left" == screen right-hand normal because the y axis is flipped
                nx, ny = (y1 - y0) / L, -(x1 - x0) / L
                for sign in (1, -1):
                    p = Point(mx + sign * nx * 1.5, my + sign * ny * 1.5)
                    for i, f in enumerate(faces):
                        if f.contains(p):
                            votes[i] += sign
                            break
        roads = unary_union([LineString(proj(r)) for r in data["major"] + data["mid"] + data["minor"] if len(r) > 1])
        for f, v in zip(faces, votes):
            if v > 0 or (v == 0 and f.intersection(roads).length > 0.002 * f.area):
                land.append(f)
    else:
        land = [frame]
    land = unary_union(land) if land else None

    def path(geoms, prec=1):
        out = []
        for g in geoms:
            for part in getattr(g, "geoms", [g]):
                if part.is_empty:
                    continue
                if part.geom_type == "Polygon":
                    for ring in [part.exterior, *part.interiors]:
                        out.append("M" + "L".join(f"{x:.{prec}f} {y:.{prec}f}" for x, y in ring.coords) + "Z")
                elif part.geom_type == "LineString" and part.length > 0.5:
                    out.append("M" + "L".join(f"{x:.{prec}f} {y:.{prec}f}" for x, y in part.coords))
        return "".join(out)

    clip = lambda lst: [LineString(proj(p)).intersection(big) for p in lst if len(p) > 1]
    route_line = LineString(proj(data["route"]))

    # ---- stops snapped onto the real route ----
    marks, labels, seen = [], [], set()
    stops = route["stops"]
    for i, st in enumerate(stops):
        name, lat, lng = st[0], st[1], st[2]
        pos = st[3] if len(st) > 3 else None
        if pos == "none" or name in seen:
            continue
        seen.add(name)
        pt = route_line.interpolate(route_line.project(Point(px(lng, lat))))
        x, y = pt.x, pt.y
        first, last = i == 0, i == len(stops) - 1
        kind = "start" if first else "end" if last else "mid"
        marks.append((x, y, kind))
        pos = pos or ("r" if x < W * 0.62 else "l")
        dx, dy, anchor = {"r": (18, 8, "start"), "l": (-18, 8, "end"), "t": (0, -20, "middle"), "b": (0, 34, "middle")}[pos]
        labels.append((x + dx, y + dy, anchor, name))

    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
           '<defs><radialGradient id="v" cx="50%" cy="50%" r="70%"><stop offset="55%" stop-color="#0d0f13" stop-opacity="0"/>'
           '<stop offset="100%" stop-color="#0d0f13" stop-opacity=".85"/></radialGradient>'
           '<filter id="g" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7"/></filter></defs>',
           f'<rect width="{W}" height="{H}" fill="#0c0e12"/>']
    if land is not None and not land.is_empty:
        svg.append(f'<path d="{path([land])}" fill="#171a21" fill-rule="evenodd" stroke="#ffffff" stroke-opacity=".32" stroke-width="1.6"/>')
    svg.append(f'<path d="{path(clip(data["water"]))}" fill="none" stroke="#5b8bd6" stroke-opacity=".22" stroke-width="1.2"/>')
    svg.append(f'<path d="{path(clip(data["minor"]))}" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="1"/>')
    svg.append(f'<path d="{path(clip(data["mid"]))}" fill="none" stroke="#ffffff" stroke-opacity=".20" stroke-width="1.6"/>')
    svg.append(f'<path d="{path(clip(data["major"]))}" fill="none" stroke="#ffffff" stroke-opacity=".34" stroke-width="2.6" stroke-linecap="round"/>')
    svg.append(f'<rect width="{W}" height="{H}" fill="url(#v)"/>')
    rd = path([route_line])
    svg.append(f'<path d="{rd}" fill="none" stroke="{ORANGE}" stroke-opacity=".55" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" filter="url(#g)"/>')
    svg.append(f'<path d="{rd}" fill="none" stroke="{ORANGE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>')
    for x, y, kind in marks:
        if kind == "start":
            svg.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="13" fill="#fff" stroke="#0c0e12" stroke-width="4"/>')
        elif kind == "end":
            svg.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="13" fill="{ORANGE}" stroke="#fff" stroke-width="4"/>')
        else:
            svg.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="#0c0e12" stroke="#fff" stroke-width="4"/>')
    for x, y, anchor, name in labels:
        svg.append(f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-family="Inter, Arial, Helvetica, sans-serif" '
                   f'font-size="25" font-weight="700" fill="#f2f3f5" stroke="#0c0e12" stroke-width="7" paint-order="stroke" '
                   f'stroke-linejoin="round">{name.replace("&", "&amp;")}</text>')
    svg.append("</svg>")
    return "".join(svg)


def main():
    os.makedirs(os.path.join(ROOT, "assets/routes"), exist_ok=True)
    for r in load_routes():
        sid = slug(r["title"])
        src = os.path.join(ROOT, "tools/route-data", sid + ".json")
        if not os.path.exists(src):
            print("missing data for", sid)
            continue
        data = json.load(open(src))
        out = os.path.join(ROOT, "assets/routes", sid + ".svg")
        open(out, "w").write(render(r, data))
        print(sid, data["distance_mi"], "mi", data["duration_min"], "min", os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    main()
