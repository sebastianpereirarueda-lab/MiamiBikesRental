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

## Click tracking & the client portal
Every link and button click on the site is recorded as an event named
`<kind>/<page>/<section>/<name>`, for example:

| Event | Meaning |
|---|---|
| `booking/home/bikes/honda-nt1100` | "Rent this bike" on the Honda card |
| `booking/home/contact/honda-nt1100` | Honda link in the Contact section |
| `riders-share/home/reviews/see-all-reviews` | Riders Share profile button |
| `internal/home/nav/routes` | "Routes" in the top menu |
| `outbound/routes/<route>/google-maps` | A route's Google Maps (or `apple-maps`) button |
| `action/home/gallery/photo-<label>` | Opened a gallery photo |

Each click also carries the visitor's **traffic source** (Instagram, google.com, a `utm_source`, or "direct"),
so the portal can show which sources lead to which clicks. Override a name with `data-track="..."`, or skip
an element with `data-track="off"`.

### Client portal — `www.miamibikesrentals.com/admin/`
A private dashboard showing visitors, clicks per day, booking clicks per bike, clicks by part of the site,
every link clicked (select one to see where those clicks came from), traffic sources, campaigns,
locations, devices, plus a tracked-link builder for Instagram/ads/flyers. Preview it with sample data
at `/admin/#demo`. It is not linked from the site and is hidden from search engines.

**One-time setup (GoatCounter — free, no cookie banner needed)**
1. Sign up at https://www.goatcounter.com/signup and pick a code, e.g. `miamibikesrentals`.
2. In `js/site-data.js` set `analytics: { goatcounter: "miamibikesrentals", ga4: "" }` and push.
3. In GoatCounter go to **Settings → API → New API key**, tick only **Read statistics**, and copy the key.
4. Your client's portal link is
   `https://www.miamibikesrentals.com/admin/#key=PASTE_KEY_HERE`
   (or open `/admin/`, paste the key, then use **Copy portal link**).
   Opening the link signs them in and keeps them signed in on that device. The key sits after `#`, so it is
   never sent to any server, but anyone holding the link can view the stats. To revoke access, delete the key in
   GoatCounter and send a new link.

**Google Analytics 4 (optional, in addition)**: put the `G-XXXXXXX` ID in `ga4`. Clicks arrive as
`booking_click` / `site_click` events with `link_label`, `link_url`, `traffic_source` and `campaign`
parameters. The portal reads GoatCounter only.

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
