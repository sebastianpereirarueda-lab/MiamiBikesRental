# Perplexity task list — Miami Bikes Rentals

Ready-to-paste prompts for growing **www.miamibikesrentals.com** with Perplexity, so Claude is only
needed for the final "put this on the site" step.

**How to use**
1. Start every Perplexity thread by pasting the **Project context** block below.
2. Paste one task prompt. Ask follow-ups in the same thread until you're happy.
3. When a task says *"Return format: …"*, keep that format. Then hand the result to Claude with one line,
   e.g. *"Add these routes to js/routes-data.js"*, and it's a cheap, quick change.
4. Check off tasks as you go. ⭐ = highest impact for bookings.

---

## Project context (paste first in every thread)

```
I run Miami Bikes Rentals (www.miamibikesrentals.com), a small premium motorcycle rental
business in Miami, Florida (pickup near Doral). All bookings happen on the Riders Share
peer-to-peer platform, where I'm a 5-star "Power Owner" (my host name is Nelson).
Fleet: 2023 BMW R nineT Scrambler, 2026 Honda NT1100 DCT (with top case),
2026 Harley-Davidson Nightster, 2024 BMW F 800 GS (with top case). Previously also a
2022 BMW F 900 XR.
Customers: tourists (many Spanish-speaking / Latin American), riders visiting Miami,
couples, and locals. Brand: "Ride Freedom", dark/orange style, premium but friendly.
The website is a static site (HTML/CSS/JS on GitHub Pages) with: bikes, gallery,
reviews, contact, and a Routes page of South Florida rides with maps.
Be specific to Miami/South Florida, cite sources with links, and flag anything you're
not sure about. Today's date matters: prefer sources from the last 12 months.
```

---

## 1. Market & competitors

- [ ] ⭐ **1.1 Competitor map**
  > List every motorcycle rental option in Miami-Dade and Broward (EagleRider, Riders Share hosts, Twisted Road, local shops, scooter/moto rentals in Miami Beach). For each: name, URL, bikes offered, daily price range, deposit, minimum age/license rules, insurance, delivery options, review rating and count, and what they do better than me. Return format: a table, then a "gaps I can win" list.
- [ ] ⭐ **1.2 Price benchmarking**
  > For each of my 4 bikes, find what comparable bikes (same or similar model) rent for in Miami and in other big US tourist cities: daily, 3-day, weekly. Include Riders Share and EagleRider prices. Return format: table per bike with low / typical / high, then a recommended price for weekday, weekend, and weekly, with reasoning.
- [ ] **1.3 Demand seasonality**
  > When is motorcycle rental demand highest in Miami? Cover tourist seasons, big events (Art Basel, Miami Bike Week/Biketoberfest-style events, F1 Miami Grand Prix, Ultra, boat show, spring break, Key West events like Poker Run and Bike Week), weather/hurricane season. Return format: month-by-month calendar with expected demand (low/med/high) and events with dates for the next 12 months.
- [ ] **1.4 Customer profile research**
  > Who rents motorcycles in Miami? Where do they come from (countries/states), what bikes they prefer, what they worry about (insurance, tolls, license, heat, rain, theft), and how they search. Return format: 3–4 customer personas with needs, objections, and the message that wins them.
- [ ] **1.5 Riders Share platform deep-dive**
  > Research Riders Share in depth for owners: fees and payouts, how search ranking works, Power Owner benefits, referral program (I use ref links like /ref-NelsonManuelp+WYKZD — what do I earn?), insurance tiers, toll handling, delivery options, instant book, owner tips from forums/Reddit. Return format: bullet summary + "10 things I should change in my listings".
- [ ] **1.6 Alternative / extra booking channels**
  > Compare channels I could add besides Riders Share: Twisted Road, EagleRider franchise/partner, Turo (does it allow motorcycles?), Airbnb Experiences for guided rides, GetYourGuide/Viator for tours, my own direct booking. Fees, insurance, requirements, pros/cons. Return format: comparison table + recommendation.

## 2. Pricing, policies & operations

- [ ] ⭐ **2.1 Florida legal requirements**
  > What does a renter legally need to ride a rented motorcycle in Florida: motorcycle endorsement, international license / IDP rules for foreign visitors, minimum age, helmet law (over/under 21 with $10k medical coverage), eye protection, insurance minimums. Also what I as an owner must have (registration, insurance, business license, sales tax on rentals in Miami-Dade, Florida rental car surcharge?). Return format: two checklists (renter / owner) with source links.
- [ ] ⭐ **2.2 FAQ content**
  > Write 20 FAQ questions and answers for a Miami motorcycle rental site: license, international riders, age, helmets/gear included?, deposit, tolls (SunPass/toll-by-plate), fuel policy, mileage, passengers, rain, Keys trips, cancellations, insurance, pickup location (near Doral), delivery, late return, damage. Keep answers short and friendly; mark any answer I must confirm with [CONFIRM]. Return format: list of `{ q: "...", a: "..." }` objects (JavaScript), English and Spanish versions.
- [ ] **2.3 Toll policy wording**
  > How do tolls work for rented motorcycles in Miami (SunPass, toll-by-plate, Card Sound Road, Rickenbacker Causeway, Florida Turnpike)? Draft a clear 3-sentence toll policy for my site that says tolls are charged after the rental from the deposit. Return format: policy text + list of tolled roads on popular rides.
- [ ] **2.4 Pickup / return checklist**
  > Create a professional pickup and return checklist for motorcycle rentals (photos, fuel, mileage, tire check, damage walk-around, documents, gear, emergency contacts). Return format: printable checklist in two columns.
- [ ] **2.5 Rider briefing card**
  > Create a one-page "Miami riding tips" card for renters: lane splitting is illegal in Florida, afternoon thunderstorms, heat, sand on A1A, I-95 traffic, police, parking rules in Miami Beach, where to get gas, emergency numbers. Return format: 10–12 short bullets, English + Spanish.
- [ ] **2.6 Add-ons & upsells**
  > What add-ons do moto rental businesses sell (helmets, jackets, phone mounts, intercoms, luggage, GoPro, delivery, extra insurance, guided ride)? Typical prices? Which ones can I offer on Riders Share vs directly? Return format: table with suggested price.
- [ ] **2.7 Fleet expansion research**
  > Which 2–3 bikes should I add next for Miami rental demand and margin? Compare purchase price, insurance cost, reliability, rental rates, and popularity (e.g., BMW R 1300 GS, Harley Road Glide/Street Glide, Ducati Scrambler, Triumph Bonneville/Tiger, Honda Rebel 1100, Yamaha Tracer 9). Return format: ranked table with payback estimate.

## 3. Routes & guided rides (feeds the Routes page)

Routes on the site use this exact format — ask Perplexity to return it so Claude can paste it in:

```js
{
  tag: "The Island One",                 // short nickname
  title: "Overseas Highway to Key West",
  summary: "2–3 sentence pitch.",
  start: "Downtown Miami",
  miles: "165 mi one way",
  time: "4–5 hrs",
  level: "Easy",                          // Easy | Moderate | Hard
  bike: "Best bike from my fleet and why",
  warning: "Optional safety note",        // optional
  tips: ["Tip 1", "Tip 2"],
  tags: ["US-1", "Key Largo"],
  stops: [                                // [name, latitude, longitude]
    ["Downtown Miami", 25.7743, -80.1937],
    ["Key West", 24.5551, -81.78],
  ],
},
```

- [ ] ⭐ **3.1 Fact-check my 6 routes**
  > Fact-check these motorcycle routes from Miami: (1) Overseas Highway to Key West, (2) Key Largo loop via Old Cutler Rd and Card Sound Rd, (3) Tamiami Trail + Loop Road to Everglades City, (4) A1A South Pointe to Fort Lauderdale, (5) Rickenbacker Causeway to Cape Florida Lighthouse, (6) Brickell–Wynwood–Design District–Julia Tuttle–Ocean Drive–MacArthur loop. Check distances, times, tolls, fuel availability, Loop Road surface conditions, park fees, and best stops (food, photos). Return format: corrections per route + 3 recommended stops each with name, why, and lat/long.
- [ ] ⭐ **3.2 New routes (6–10 more)**
  > Suggest 8 more great motorcycle rides from Miami: e.g. Lake Okeechobee loop, Palm Beach & Jupiter coastal, Homestead/Redland farms & Robert Is Here, Flamingo (Everglades National Park), Big Cypress/Naples, Sebastian Inlet, Venetian Causeway night ride, Coral Gables & Coconut Grove canopy roads. Return each in the JavaScript format above with real coordinates for every stop (verify on a map).
- [ ] **3.3 Stops & food guide per route**
  > For each route, list the best biker-friendly stops: restaurants, cafés, photo spots, gas stations, rest areas, with address and lat/long. Return format: JSON array per route `{ route, name, type, address, lat, lng, why }`.
- [ ] **3.4 Guided tour product**
  > Design a guided motorcycle tour product (like "guided tours starting Fall 2026"): 3 tour options (half-day city, full-day Keys, sunset), group size, pricing, what's included, insurance/legal requirements for guiding in Florida, booking platforms (Airbnb Experiences, Viator, GetYourGuide), and a simple sales page outline. Return format: product sheet per tour.
- [ ] **3.5 Weather & safety per month**
  > For South Florida riding, give a month-by-month summary: temperature, rain chance, thunderstorm timing, hurricane risk, best time of day to ride, and gear advice. Return format: table (12 rows).
- [ ] **3.6 GPX sources**
  > Where can I legally get or create GPX files for these routes (Google My Maps export, Kurviger, Calimoto, REVER, Scenic, BaseCamp)? Step-by-step for the easiest free method. Return format: how-to steps.

## 4. Website content & copywriting

- [ ] ⭐ **4.1 Spanish version of the whole site**
  > Translate this website copy into natural Latin-American Spanish (not robotic), keeping the brand tone "Ride Freedom". [Paste text from the home page, routes page, bike descriptions, FAQ.] Return format: two columns English | Spanish, same order.
- [ ] **4.2 Better bike descriptions**
  > Rewrite the description for each of my 4 bikes (2–3 sentences each, punchy, benefit-focused, mention who it's best for and best Miami ride). Also give 4 key specs per bike verified from the manufacturer (engine, power, seat height, weight or fuel range). Return format: `{ name, description, specs: [["Engine","…"],["Power","…"],["Seat height","…"],["Range","…"]] }`.
- [ ] **4.3 Home page headline tests**
  > Give 10 alternative hero subheadlines and 10 call-to-action button texts for a premium Miami motorcycle rental site. Short, confident, not cheesy. Return format: two numbered lists.
- [ ] **4.4 About / Meet Nelson section**
  > Write a short "About us / Meet your host" section (120–160 words) for a small owner-operated moto rental in Miami, warm and trustworthy, based on reviews that praise Nelson as a gentleman, flexible, punctual, with spotless bikes. [Paste reviews.] Return format: English + Spanish.
- [ ] **4.5 "How it works" section**
  > Write a 4-step "How renting works" section (choose bike → book on Riders Share → pickup near Doral → ride) with one-line descriptions and icon suggestions. Return format: list of `{ title, text, icon }`.
- [ ] **4.6 Blog post ideas + drafts**
  > Give 20 blog post ideas that Miami visitors search for (e.g., "Riding to Key West on a rented motorcycle", "Do I need a motorcycle license to rent in Florida", "Best motorcycle roads near Miami"). Then write the top 3 as 800-word posts with headings, internal link suggestions, and a call to action. Return format: Markdown.
- [ ] **4.7 Trust badges & guarantees**
  > What trust signals convert best for rental sites (insurance, 24/7 roadside, free cancellation, clean bike guarantee, review counts)? Which can I truthfully claim using Riders Share's policies? Return format: list with exact short wording.

## 5. SEO & local search

- [ ] ⭐ **5.1 Keyword research**
  > Find the top 40 keywords (English and Spanish) people use to find motorcycle rentals in Miami, Miami Beach, Doral, Fort Lauderdale, Key West trips. Include estimated monthly volume and difficulty if available. Return format: table grouped by intent (rent, specific bike, routes/tours, Spanish).
- [ ] ⭐ **5.2 Google Business Profile setup**
  > Step-by-step guide to create and optimize a Google Business Profile for a motorcycle rental that books through a third-party platform and has a pickup area near Doral (service-area business vs storefront?). Best category, description (750 chars), services list, photos to upload, posts schedule, how to get reviews. Return format: checklist + ready-to-paste description.
- [ ] **5.3 Page titles & meta descriptions**
  > Write SEO title tags (≤60 chars) and meta descriptions (≤155 chars) for: home page, routes page, and each future page (each bike, FAQ, Spanish home). Return format: table.
- [ ] **5.4 Structured data**
  > Give JSON-LD schema markup for my site: LocalBusiness/AutoRental (or MotorcycleDealer?) with service area Miami, aggregateRating from Riders Share reviews (is that allowed by Google's rules?), FAQPage, and TouristTrip for routes. Return format: JSON-LD code blocks with notes on what Google allows.
- [ ] **5.5 Local directories & backlinks**
  > List 30 places to list my business or get links: Yelp, TripAdvisor, Apple Business Connect, Bing Places, Miami tourism sites, biker forums, Facebook groups, motorcycle travel blogs, hotel concierge directories. Return format: table with URL, cost, and priority.
- [ ] **5.6 Competitor SEO gap**
  > Look at the top 5 Google results for "motorcycle rental Miami". What pages, content, and features do they have that I don't? Return format: gap list with suggested pages.

## 6. Marketing & social media

- [ ] ⭐ **6.1 Instagram/TikTok content plan**
  > Create a 30-day Instagram + TikTok plan for a Miami motorcycle rental: post ideas (reels, carousels), hooks, captions in English and Spanish, hashtags, best posting times, and which of my 4 bikes + 6 routes to feature. Return format: table day-by-day.
- [ ] **6.2 Shot list for photos & videos**
  > Make a shot list to film my bikes and routes for the website and social (golden hour on Rickenbacker, Seven Mile Bridge, Ocean Drive at night, Wynwood murals, POV riding, detail shots). Include gear settings for iPhone/GoPro and drone rules in Miami. Return format: checklist per location.
- [ ] **6.3 Google Ads / Meta Ads starter plan**
  > Plan a $300/month ad test for motorcycle rentals in Miami: Google search keywords + negative keywords, 3 ad texts, Meta ad audiences (tourists planning Miami trips, Spanish speakers), creative ideas, and what to measure. Return format: campaign outline.
- [ ] **6.4 Partnerships list**
  > Find 30 local partners who could send me renters: hotels near Doral/Brickell/Miami Beach (concierge), Airbnb hosts, motorcycle dealers, tour companies, Key West hotels, riding clubs, coworking spaces. Include contact page URLs. Then write a short partnership email (English + Spanish) offering a referral commission. Return format: table + email.
- [ ] **6.5 Review generation**
  > Write a friendly post-rental message (WhatsApp/text, English + Spanish) asking for a Riders Share review and a Google review, plus a follow-up 3 days later. Return format: 4 message templates.
- [ ] **6.6 Email/WhatsApp marketing**
  > Plan a simple repeat-customer program: WhatsApp broadcast or email list, discount for returning riders, seasonal promos (e.g., Bike Week, Art Basel). Free tools to use. Return format: plan + 5 message templates.
- [ ] **6.7 Brand assets**
  > Suggest a complete brand kit for "Miami Bikes Rentals — Ride Freedom": color codes (dark #0d0f13 + orange #ff6a0d), font pairing, logo usage rules, social templates, business card and sticker ideas, merch ideas (shirts, patches). Return format: brand sheet.

## 7. Website features (research only — Claude builds)

For each: ask Perplexity for **options + recommendation + exact setup steps**. Then give Claude the
chosen option in one message.

- [ ] ⭐ **7.1 Analytics setup**: Compare GoatCounter vs Google Analytics 4 vs Plausible vs Cloudflare Web Analytics for a small static site (free tier, privacy/cookie banner needs, outbound click tracking). Give setup steps for the winner. *(Then send Claude just the code/ID.)*
- [ ] **7.2 WhatsApp chat button**: Best practice for a floating WhatsApp button (link format `wa.me`, pre-filled message in English/Spanish, business account setup).
- [ ] **7.3 Direct booking option**: Could I take direct bookings outside Riders Share (calendar + deposit)? Compare Calendly/Cal.com + Stripe, Booqable, Rentle, Checkfront, Bookeo. Insurance implications of leaving the platform. Recommendation.
- [ ] **7.4 Live availability**: Does Riders Share offer an embeddable calendar, API, or iCal feed for listings? If not, alternatives to show availability on my site.
- [ ] **7.5 Multilingual site**: Best simple way to run English/Spanish on a static site (separate `/es/` pages vs language toggle), hreflang tags, SEO impact.
- [ ] **7.6 Newsletter/signup form** for a static site without a backend (Formspree, Buttondown, Mailchimp, Brevo) — free tiers and spam protection.
- [ ] **7.7 Instagram feed embed** options for a static site (free, fast, no heavy plugins).
- [ ] **7.8 Accessibility & speed checklist**: WCAG basics and Core Web Vitals checklist for a dark-theme image-heavy site; free tools to test (PageSpeed Insights, WAVE). Return what to send to Claude to fix.
- [ ] **7.9 Cookie/privacy requirements**: Does a Florida small business site with analytics need a privacy policy or cookie banner (US visitors, EU/LatAm tourists)? Draft a short privacy policy.
- [ ] **7.10 Domain & email**: How to set up a professional email (nelson@miamibikesrentals.com) with my Wix domain — Google Workspace, Zoho free, Cloudflare Email Routing — and the DNS records needed so the website keeps working.

## 8. Legal, insurance & risk (research — confirm with a professional)

- [ ] **8.1 Insurance options** beyond Riders Share for owners (commercial rental insurance in Florida, typical costs, providers).
- [ ] **8.2 Rental agreement & waiver outline** — key clauses used by motorcycle rental companies (liability, damage, tolls/tickets, gear, prohibited use, track days, Keys trips, late fees). Return as an outline to review with a lawyer.
- [ ] **8.3 Business structure & taxes** — LLC in Florida, sales tax on short-term vehicle rentals in Miami-Dade, any rental surcharges, bookkeeping tools.
- [ ] **8.4 Theft & damage prevention** — GPS trackers (AirTag vs dedicated trackers), disc locks, storage, best practices from rental owners.
- [ ] **8.5 Tour guiding requirements** — permits/insurance needed to run paid guided motorcycle tours in Florida and Everglades/Keys parks (commercial use authorization?).

## 9. Data & content to collect for Claude (copy-paste ready)

- [ ] **9.1** All remaining Riders Share reviews (pages 5–15) in this format, newest first:
  `{ name: "…", bike: "2026 Honda NT1100 DCT", date: "Jun 2026", text: "…" },`
  *(Perplexity may not be able to open Riders Share; if not, copy them by hand in this format.)*
- [ ] **9.2** Exact specs of each bike from manufacturer sites (engine, hp, torque, seat height, wet weight, fuel capacity, range).
- [ ] **9.3** 10 photos per bike + route photos (you shoot; see 6.2) — name files like `honda-nt1100-02.jpg`.
- [ ] **9.4** Your total Riders Share review count and exact rating, to show "★ 5.0 · 45 reviews" on the site.
- [ ] **9.5** WhatsApp number / Instagram / TikTok / Google Business links for the footer.

---

## What to bring back to Claude (cheap, quick requests)

| Bring this | Say this to Claude |
|---|---|
| Routes in the JS format (3.2) | "Add these routes to js/routes-data.js and render the maps" |
| FAQ objects (2.2) | "Add an FAQ section with these" |
| Bike descriptions/specs (4.2) | "Replace bike descriptions/specs with these" |
| Reviews (9.1) | "Add these reviews to site-data.js" |
| Spanish copy (4.1) | "Make a Spanish version /es/ with this copy" |
| GoatCounter code (7.1) | "Turn on GoatCounter with code X" |
| Titles/meta + JSON-LD (5.3, 5.4) | "Add these meta tags and schema" |
| WhatsApp number (7.2, 9.5) | "Add a WhatsApp button with this number and message" |
| Shot photos (9.3) | upload them: "Add these to the gallery" |

Tip: batch several of these into **one** Claude message — one request with everything costs far
less than many small ones.
