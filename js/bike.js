/* A single bike's page (rent-<bike>-miami.html): built from that bike's entry in js/site-data.js. */
(function () {
  const S = window.SITE;
  const { esc, slug, ext, bookingLink, bikePage, reviewCard, mediaItem } = window.MBR;
  const { t, pick } = window.I18N;
  const b = S.bikes.find((x) => slug(x.name) === document.body.dataset.bike);
  if (!b) return location.replace("index.html#bikes");

  const media = [{ type: "image", src: b.image, label: b.name }]
    .concat((b.photos || []).map((src, i) => ({ type: "image", src, label: `${b.name} ${i + 2}` })))
    .concat(b.video ? [{ type: "video", src: b.video, label: `${b.name} video` }] : []);
  const reviews = S.reviews.filter((r) => r.bike.includes(b.match));
  const others = S.bikes.filter((x) => x !== b);
  const rent = (track, cls = "btn btn-primary btn-lg") => bookingLink(b, `${t("bp.book", "See price & dates")} ${ext}`, cls, track);
  const gearLabel = t("compare.gearbox", "Gearbox");
  const facts = pick(b, "specs")
    .filter(([k]) => k !== gearLabel)
    .concat([
      [gearLabel, pick(b, "gearbox")],
      [t("compare.seat", "Seat height"), b.seat],
      [t("compare.passenger", "Passenger"), pick(b, "passenger")],
      [t("compare.luggage", "Luggage"), pick(b, "luggage")],
    ]);

  document.getElementById("top").innerHTML = `
    <section class="bp-hero" data-section="hero">
      <div class="container bp-hero-grid">
        <div class="bp-photo"><img src="${esc(b.image)}" alt="${esc(b.name)}" /><span class="badge">${esc(b.year)}</span></div>
        <div class="bp-intro">
          <a class="bp-back" href="index.html#bikes" data-track="all-bikes">← ${t("bp.back", "All bikes")}</a>
          <p class="eyebrow">${esc(pick(b, "tag"))}</p>
          <h1>${esc(b.name)}</h1>
          <p class="bp-lead">${esc(pick(b, "description"))}</p>
          <p class="bp-best"><span>${t("bike.bestFor", "Best for")}</span> ${esc(pick(b, "bestFor"))}</p>
          ${rent("rent-top")}
          <p class="bp-note">${t("bp.bookNote", "Secure booking on Riders Share · insurance included")}</p>
          <a href="#" class="hero-badge js-profile-link" target="_blank" rel="noopener" data-track="rating-badge"><span class="stars">★★★★★</span> <span class="js-rating"></span></a>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="who">
      <div class="container bp-two">
        <div>
          <h2 class="section-title bp-h2">${t("bp.who", "WHO IT'S <span>FOR</span>")}</h2>
          <ul class="ticks ticks-lg">${pick(b, "who").map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
        </div>
        <div>
          <h2 class="section-title bp-h2">${t("bp.specs", "THE <span>DETAILS</span>")}</h2>
          <dl class="bp-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          <p class="compare-note">${t("compare.note", "Seat height: approximate manufacturer figure.")}</p>
        </div>
      </div>
    </section>

    ${
      media.length > 1
        ? `<section class="section" id="gallery">
      <div class="container">
        <h2 class="section-title bp-h2">${t("bp.photos", "PHOTOS <span>&amp; VIDEO</span>")}</h2>
        <div class="gallery-grid" id="gallery-grid">${media.map(mediaItem).join("")}</div>
      </div>
    </section>`
        : ""
    }

    ${
      reviews.length
        ? `<section class="section section-alt" id="reviews">
      <div class="container">
        <h2 class="section-title bp-h2">${t("bp.reviews", "REVIEWS OF <span>THIS BIKE</span>")}</h2>
        <div class="review-grid">${reviews.map((r) => reviewCard(r)).join("")}</div>
        <div class="center review-actions">
          <a href="#" class="btn btn-outline js-profile-link" target="_blank" rel="noopener" data-track="see-all-reviews">${t("reviews.all", "See all reviews on Riders Share")} ${ext}</a>
        </div>
      </div>
    </section>`
        : ""
    }

    <section class="section" id="other-bikes">
      <div class="container">
        <h2 class="section-title bp-h2">${t("bp.others", "THE OTHER <span>BIKES</span>")}</h2>
        <div class="other-grid">
          ${others
            .map(
              (o) => `<a class="other-card" href="${bikePage(o)}" data-track="${slug(o.name)}">
            <img src="${esc(o.image)}" alt="${esc(o.name)}" loading="lazy" />
            <span><strong>${esc(o.name)}</strong><small>${esc(pick(o, "bestFor"))}</small></span>
          </a>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <div class="bp-sticky" data-section="sticky-bar">
      <span><strong>${esc(b.name)}</strong><small>${esc(b.year)}</small></span>
      ${rent("rent-sticky", "btn btn-primary")}
    </div>`;

  window.MBR.hydrate();
  window.MBR.lightbox(document.getElementById("gallery-grid"), media);
  window.MBR.reveal(".gallery-item, .review-card, .other-card");
})();
