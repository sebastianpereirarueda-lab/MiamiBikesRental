/* Shared behaviour for every page: nav, analytics and Riders Share click tracking. */
(function () {
  const S = window.SITE || {};
  const A = S.analytics || {};

  window.MBR = {
    esc: (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
    slug: (s) =>
      String(s)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    ext: '<svg class="ext"><use href="#i-ext" /></svg>',
  };

  // ---- Analytics (only loads when an ID is set in js/site-data.js) ----
  const addScript = (src, attrs = {}) => {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    document.head.appendChild(s);
  };
  if (A.goatcounter) {
    addScript("https://gc.zgo.at/count.js", { "data-goatcounter": `https://${A.goatcounter}.goatcounter.com/count` });
  }
  if (A.ga4) {
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(A.ga4)}`);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", A.ga4);
  }

  // Every click on a Riders Share link is recorded as an event named after the
  // link's data-track label, e.g. "riders-share/booking/honda-nt1100/bike-card".
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="riders-share.com"]');
    if (!a) return;
    const label = a.dataset.track || "riders-share/other/" + MBR.slug(a.textContent);
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: label, title: a.href, event: true });
    }
    if (window.gtag) {
      window.gtag("event", "riders_share_click", { link_label: label, link_url: a.href, transport_type: "beacon" });
    }
  });

  // ---- Profile / contact buttons ----
  const setLink = (sel, url) =>
    document.querySelectorAll(sel).forEach((a) => {
      if (url && url !== "#") a.href = url;
      else {
        a.href = "index.html#contact";
        a.removeAttribute("target");
      }
    });
  setLink(".js-profile-link", S.ridersShareProfile);
  setLink(".js-contact-link", S.contactUrl);

  // ---- Nav ----
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") links.classList.remove("open");
  });
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll (call after rendering) ----
  MBR.reveal = (selector) => {
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
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  };
})();
