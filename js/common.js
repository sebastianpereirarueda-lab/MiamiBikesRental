/* Shared behaviour for every page: nav, analytics and click tracking. */
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

  // ---- Click tracking ----
  // Every link/button click is recorded as an event named
  //   <kind>/<page>/<section>/<name>   e.g. "booking/home/bikes/honda-nt1100"
  // kind:    booking (a bike's Riders Share page), riders-share (profile/contact),
  //          outbound (any other site), internal (links within this site), action (buttons)
  // page:    home | routes
  // section: the part of the page clicked (nav, hero, bikes, gallery, reviews, contact, footer, a route…)
  // name:    the element's data-track value, or its text
  // The visitor's traffic source (instagram, google.com, a utm_source…) is sent as the
  // event's referrer, so the admin dashboard can show which sources lead to which clicks.
  const store = (() => {
    try {
      return window.sessionStorage;
    } catch (e) {
      return null;
    }
  })();
  const source = (() => {
    try {
      const saved = store && store.getItem("mbr-source");
      if (saved) return saved;
      const q = new URLSearchParams(location.search);
      let src = q.get("utm_source") || q.get("ref") || q.get("source") || "";
      if (!src && document.referrer) {
        const host = new URL(document.referrer).hostname.replace(/^www\./, "");
        if (host !== location.hostname.replace(/^www\./, "")) src = host;
      }
      src = src || "direct";
      if (store) store.setItem("mbr-source", src);
      return src;
    } catch (e) {
      return "direct";
    }
  })();
  const campaign = new URLSearchParams(location.search).get("utm_campaign") || "";
  const page = /routes/.test(location.pathname) ? "routes" : "home";

  const sectionOf = (el) => {
    const tagged = el.closest("[data-section]");
    if (tagged) return tagged.dataset.section;
    if (el.closest("#nav")) return "nav";
    if (el.closest("footer")) return "footer";
    if (el.closest(".hero, .page-hero")) return "hero";
    if (el.closest("#lightbox")) return "gallery";
    const area = el.closest("article[id], section[id]");
    return area ? area.id : "page";
  };
  const kindOf = (el) => {
    if (el.tagName !== "A") return "action";
    let url;
    try {
      url = new URL(el.href, location.href);
    } catch (e) {
      return "internal";
    }
    if (/riders-share\.com$/.test(url.hostname)) return /\/user\//.test(url.pathname) ? "riders-share" : "booking";
    return url.hostname === location.hostname || url.protocol === "file:" ? "internal" : "outbound";
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("a, button");
    if (!el || el.dataset.track === "off") return;
    const kind = kindOf(el);
    const name =
      el.dataset.track ||
      MBR.slug(el.getAttribute("aria-label") || el.textContent).slice(0, 48) ||
      (kind === "internal" || kind === "action" ? "link" : MBR.slug(new URL(el.href).hostname));
    const label = `${kind}/${page}/${sectionOf(el)}/${name}`;
    // Link destination without query strings (keeps the visitor's utm tags out of the title).
    const target = el.tagName === "A" ? el.href.replace(/\?[^#]*/, "") : el.textContent.trim().slice(0, 80);
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: label, title: target, referrer: source, event: true });
    }
    if (window.gtag) {
      window.gtag("event", kind === "booking" ? "booking_click" : "site_click", {
        link_label: label,
        link_url: target,
        traffic_source: source,
        campaign,
        transport_type: "beacon",
      });
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
