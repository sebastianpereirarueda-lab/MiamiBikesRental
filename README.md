# Miami Bikes Rentals

Static website for **www.miamibikesrentals.com** — plain HTML/CSS/JS, no build step, no monthly fees.

## Editing content
All text, bikes, links, gallery items and reviews live in **`js/site-data.js`**.
Replace every `"#"` with the real Riders Share URL (one per bike, plus the profile/contact link).

## Images to add
Put these files in place (names must match, or edit the paths in `js/site-data.js`):

| File | Used for |
|---|---|
| `assets/images/logo.png` | Logo (nav, hero, contact, footer, favicon) |
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
