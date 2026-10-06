(function () {
  const S = window.SITE;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ext = '<svg class="ext"><use href="#i-ext" /></svg>';
  const linkAttrs = (url) => (url && url !== "#" ? `href="${esc(url)}" target="_blank" rel="noopener"` : 'href="#contact"');

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
        <a class="btn btn-primary btn-block" ${linkAttrs(b.url)}>Rent this bike ${ext}</a>
      </div>
    </article>`
    )
    .join("");

  // Gallery
  $("#gallery-grid").innerHTML = S.gallery
    .map(
      (g, i) => `
    <button class="gallery-item" data-index="${i}" aria-label="Open ${esc(g.label)}">
      ${
        g.type === "video"
          ? `<video src="${esc(g.src)}" muted loop playsinline preload="metadata"></video><span class="play">▶</span>`
          : `<img src="${esc(g.src)}" alt="${esc(g.label)}" loading="lazy" onerror="this.classList.add('missing')" />`
      }
      <span class="gallery-label">${esc(g.label)}</span>
    </button>`
    )
    .join("");

  // Reviews
  $("#review-grid").innerHTML = S.reviews
    .map(
      (r) => `
    <figure class="review-card">
      <div class="stars">★★★★★</div>
      <blockquote>"${esc(r.text)}"</blockquote>
      <figcaption>
        <div><strong>${esc(r.name)}</strong><span>${esc(r.bike)}</span></div>
        <time>${esc(r.date)}</time>
      </figcaption>
    </figure>`
    )
    .join("");

  // Booking links
  $("#booking-links").innerHTML = S.bikes
    .map((b) => `<a ${linkAttrs(b.url)}><span>${esc(b.name)} ${esc(b.year)}</span>${ext}</a>`)
    .join("");

  const setLink = (sel, url) =>
    document.querySelectorAll(sel).forEach((a) => {
      if (url && url !== "#") {
        a.href = url;
      } else {
        a.href = "#contact";
        a.removeAttribute("target");
      }
    });
  setLink(".js-profile-link", S.ridersShareProfile);
  setLink(".js-contact-link", S.contactUrl);

  $("#year").textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = $(".nav-toggle");
  const links = $(".nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") links.classList.remove("open");
  });

  // Nav background on scroll
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".bike-card, .gallery-item, .review-card, .section-head").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
})();
