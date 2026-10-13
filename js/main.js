/* Home page: renders bikes, gallery, reviews and booking links from js/site-data.js. */
(function () {
  const S = window.SITE;
  const { esc, slug, ext } = window.MBR;
  const $ = (sel) => document.querySelector(sel);
  const VISIBLE_REVIEWS = 6;

  const bookingLink = (b, inner, cls = "") =>
    b.url && b.url !== "#"
      ? `<a class="${cls}" href="${esc(b.url)}" target="_blank" rel="noopener" data-track="${slug(b.name)}">${inner}</a>`
      : `<a class="${cls}" href="#contact" data-track="${slug(b.name)}">${inner}</a>`;

  // Bikes
  $("#bike-grid").innerHTML = S.bikes
    .map(
      (b) => `
    <article class="bike-card">
      <div class="bike-media">
        <img src="${esc(b.image)}" alt="${esc(b.name)}" loading="lazy" onerror="this.classList.add('missing')" />
        <span class="badge">${esc(b.year)}</span>
        <span class="bike-tag">${esc(b.tag)}</span>
      </div>
      <div class="bike-body">
        <h3>${esc(b.name)}</h3>
        <p>${esc(b.description)}</p>
        <dl class="specs">
          ${b.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
        </dl>
        ${bookingLink(b, `Rent this bike ${ext}`, "btn btn-primary btn-block")}
      </div>
    </article>`
    )
    .join("");

  // Gallery
  $("#gallery-grid").innerHTML = S.gallery
    .map(
      (g, i) => `
    <button class="gallery-item" data-index="${i}" data-track="photo-${slug(g.label)}" aria-label="Open ${esc(g.label)}">
      ${
        g.type === "video"
          ? `<video src="${esc(g.src)}" muted loop playsinline preload="metadata"></video><span class="play">▶</span>`
          : `<img src="${esc(g.src)}" alt="${esc(g.label)}" loading="lazy" onerror="this.classList.add('missing')" />`
      }
      <span class="gallery-label">${esc(g.label)}</span>
    </button>`
    )
    .join("");

  // Reviews (first few visible, the rest behind "Show more")
  $("#review-grid").innerHTML = S.reviews
    .map(
      (r, i) => `
    <figure class="review-card"${i >= VISIBLE_REVIEWS ? " hidden" : ""}>
      <div class="stars">★★★★★</div>
      <blockquote>"${esc(r.text)}"</blockquote>
      <figcaption>
        <div><strong>${esc(r.name)}</strong><span>${esc(r.bike)}</span></div>
        <time>${esc(r.date)}</time>
      </figcaption>
    </figure>`
    )
    .join("");
  const more = $("#reviews-more");
  if (S.reviews.length > VISIBLE_REVIEWS) {
    more.hidden = false;
    more.addEventListener("click", () => {
      document.querySelectorAll("#review-grid .review-card[hidden]").forEach((c) => {
        c.hidden = false;
        c.classList.add("in");
      });
      more.hidden = true;
    });
  }

  // Booking links in the contact section
  $("#booking-links").innerHTML = S.bikes
    .map((b) => bookingLink(b, `<span>${esc(b.name)} ${esc(b.year)}</span>${ext}`))
    .join("");

  // Lightbox
  const lb = $("#lightbox");
  const lbBody = $("#lightbox-body");
  const close = () => {
    lb.hidden = true;
    lbBody.innerHTML = "";
    document.body.style.overflow = "";
  };
  $("#gallery-grid").addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    const g = S.gallery[item.dataset.index];
    lbBody.innerHTML =
      g.type === "video"
        ? `<video src="${esc(g.src)}" controls autoplay playsinline></video>`
        : `<img src="${esc(g.src)}" alt="${esc(g.label)}" />`;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  });
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lightbox-close")) close();
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && !lb.hidden && close());

  MBR.reveal(".bike-card, .gallery-item, .review-card:not([hidden]), .section-head, .routes-teaser");
})();
