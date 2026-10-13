# Miami Bikes Rentals

Static website for **www.miamibikesrentals.com** — plain HTML/CSS/JS, no build step, no monthly fees.

## Editing content
- Bikes, Riders Share links, gallery and reviews: **`js/site-data.js`**
- Ride routes (the Routes page): **`js/routes-data.js`** — each stop is `[name, lat, lng, labelPos?]`; the
  stops build the "Open in Google Maps" link and the route map.

### Updating the route maps
The maps in `assets/routes/` are drawn from real OpenStreetMap roads and driving routes:
1. Edit `js/routes-data.js` and push. The **Fetch route map data** GitHub Action downloads fresh data
   into `tools/route-data/` and commits it (takes ~2 minutes).
2. Pull, then run `pip install shapely && python3 tools/render_route_maps.py` to redraw the SVGs.
3. Bump `MAP_VERSION` in `js/routes.js` so browsers load the new maps, then push.

## Tracking booking clicks
Every Riders Share link on the site reports a click event named like
`riders-share/booking/honda-nt1100/bike-card` (bike + where on the page it was clicked) or
`riders-share/profile/see-all-reviews`. Nothing is recorded until you add an analytics ID:

**GoatCounter (free, no cookie banner needed — recommended)**
1. Sign up at https://www.goatcounter.com/signup and pick a code, e.g. `miamibikesrentals`.
2. In `js/site-data.js` set `analytics: { goatcounter: "miamibikesrentals", ga4: "" }`.
3. Push. Your dashboard at `https://miamibikesrentals.goatcounter.com` shows page visits plus each
   `riders-share/...` click (filter by "Events").

**Google Analytics 4 (alternative)**: create a GA4 property, copy the `G-XXXXXXX` measurement ID into
`ga4`. Clicks appear as the `riders_share_click` event with a `link_label` parameter.

## Images to add
Put these files in place (names must match, or edit the paths in `js/site-data.js`):

| File | Used for |
|---|---|
| `assets/images/logo.jpg` / `logo-icon.png` | Logo (hero + contact) / round icon (nav, footer) |
| `assets/images/bmw-r-ninet-scrambler.jpg` | Bike card |
| `assets/images/honda-nt1100.jpg` | Bike card |
| `assets/images/harley-nightster.jpg` | Bike card |
| `assets/images/bmw-f800gs.jpg` | Bike card |
| Extra gallery photos/videos | Add anywhere under `assets/` and list them in `gallery` in `js/site-data.js` |

## Publishing free on GitHub Pages with your domain
1. Repo **Settings → Pages** → Source: *Deploy from a branch*, pick the `claude/serene-davinci-cdsjlo` branch (or `main` if you rename it), folder `/ (root)`.
2. The `CNAME` file already contains `www.miamibikesrentals.com` (the bare `miamibikesrentals.com` will redirect to it).
3. At your domain registrar, set DNS:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `sebastianpereirarueda-lab.github.io`
   - Remove any old Base44 records.
4. Back in Settings → Pages, tick **Enforce HTTPS** once the certificate is issued.

Netlify, Vercel or Cloudflare Pages also work: just point them at this folder.

## Preview locally
Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.
