/* Shared behaviour for every page: nav, analytics and click tracking. */
(function () {
  const S = window.SITE || {};
  const A = S.analytics || {};
  const I = window.I18N;
  // ?preview=1 shows sections still waiting for approval (see "published" in js/site-data.js).
  const preview = new URLSearchParams(location.search).has("preview");

  window.MBR = {
    esc: (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
    slug: (s) =>
      String(s)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    ext: '<svg class="ext" width="14" height="14"><use href="#i-ext" /></svg>',
    // The page for one bike, e.g. rent-honda-nt1100-miami.html
    bikePage: (b) => `rent-${MBR.slug(b.name)}-miami.html`,
    // A section is shown when it is published, or when previewing.
    visible: (key) => !!(S.published || {})[key] || preview,
    isDraft: (key) => !(S.published || {})[key],
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
  // page:    home, or a bike's name on that bike's page
  // section: the part of the page clicked (nav, hero, bikes, gallery, reviews, contact, footer…)
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
  const page = document.body.dataset.page || "home";

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
    if (url.hostname === "wa.me") return "whatsapp";
    if (/riders-share\.com$/.test(url.hostname)) return /\/user\//.test(url.pathname) ? "riders-share" : "booking";
    return url.hostname === location.hostname || url.protocol === "file:" ? "internal" : "outbound";
  };

  const send = (kind, label, target) => {
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
  };
  // Record something that is not a click, e.g. MBR.track("quiz", "result-honda-nt1100").
  MBR.track = (section, name, title) => send("action", `action/${page}/${section}/${name}`, title || name);

  document.addEventListener("click", (e) => {
    const el = e.target.closest("a, button, summary");
    if (!el || el.dataset.track === "off") return;
    const kind = kindOf(el);
    const name =
      el.dataset.track ||
      MBR.slug(el.getAttribute("aria-label") || el.textContent).slice(0, 48) ||
      (kind === "internal" || kind === "action" ? "link" : MBR.slug(new URL(el.href).hostname));
    // Link destination without query strings (keeps the visitor's utm tags out of the title).
    const target = el.tagName === "A" ? el.href.replace(/\?[^#]*/, "") : el.textContent.trim().slice(0, 80);
    send(kind, `${kind}/${page}/${sectionOf(el)}/${name}`, target);
  }, true); // capture: read the element's section before a page script re-renders it

  // ---- Sections waiting for approval ----
  document.querySelectorAll("[data-draft]").forEach((el) => {
    const key = el.dataset.draft;
    if (!MBR.visible(key)) return el.remove();
    if (MBR.isDraft(key) && el.tagName === "SECTION") {
      el.classList.add("is-draft");
      el.insertAdjacentHTML("afterbegin", `<p class="draft-note">${MBR.esc(I.t("preview.note", "Preview: this section is not public yet."))}</p>`);
    }
  });
  // Keep preview mode (and nothing else) when moving between pages.
  if (preview) {
    document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach((a) => {
      const [path, hash] = a.getAttribute("href").split("#");
      a.setAttribute("href", `${path}?preview=1${hash ? "#" + hash : ""}`);
    });
  }

  // ---- Language toggle ----
  document.querySelectorAll(".lang-toggle").forEach((b) => {
    const other = I.lang === "es" ? "en" : "es";
    b.textContent = other === "es" ? "Español" : "English";
    b.dataset.track = `language-${other}`;
    b.addEventListener("click", () => I.set(other));
  });

  // ---- Profile / contact buttons and rating text (run again after a page renders more of them) ----
  MBR.hydrate = () => {
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
    const R = S.rating || {};
    document.querySelectorAll(".js-rating").forEach((el) => {
      el.textContent = [R.score, R.count && `${R.count} ${I.t("rating.reviews", "reviews")}`, I.t("rating.owner", "Power Owner on Riders Share")]
        .filter(Boolean)
        .join(" · ");
    });
  };
  MBR.hydrate();

  // ---- WhatsApp button (only when a number is set) ----
  const wa = String(S.whatsapp || "").replace(/\D/g, "");
  if (wa) {
    const label = I.t("wa.label", "Chat on WhatsApp");
    const text = encodeURIComponent(I.t("wa.text", "Hi Nelson, I'd like to rent a motorcycle in Miami."));
    document.body.insertAdjacentHTML(
      "beforeend",
      `<a class="wa-float" href="https://wa.me/${wa}?text=${text}" target="_blank" rel="noopener" data-section="whatsapp" data-track="chat" aria-label="${MBR.esc(label)}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z"/></svg>
        <span>${MBR.esc(label)}</span>
      </a>`
    );
  }

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

  // ---- Shared pieces ----
  MBR.bookingLink = (b, inner, cls = "", track) =>
    b.url && b.url !== "#"
      ? `<a class="${cls}" href="${MBR.esc(b.url)}" target="_blank" rel="noopener" data-track="${track || MBR.slug(b.name)}">${inner}</a>`
      : `<a class="${cls}" href="index.html#contact" data-track="${track || MBR.slug(b.name)}">${inner}</a>`;

  MBR.reviewCard = (r, hidden) => `
    <figure class="review-card"${hidden ? " hidden" : ""}>
      <div class="stars">★★★★★</div>
      <blockquote>"${MBR.esc(r.text)}"</blockquote>
      <figcaption>
        <div><strong>${MBR.esc(r.name)}</strong><span>${MBR.esc(r.bike)}</span></div>
        <time>${MBR.esc(r.date)}</time>
      </figcaption>
    </figure>`;

  MBR.mediaItem = (g, i) => `
    <button class="gallery-item" data-index="${i}" data-track="photo-${MBR.slug(g.label)}" aria-label="Open ${MBR.esc(g.label)}">
      ${
        g.type === "video"
          ? `<video src="${MBR.esc(g.src)}" muted loop playsinline preload="metadata"></video><span class="play">▶</span>`
          : `<img src="${MBR.esc(g.src)}" alt="${MBR.esc(g.label)}" loading="lazy" onerror="this.classList.add('missing')" />`
      }
      <span class="gallery-label">${MBR.esc(g.label)}</span>
    </button>`;

  // Opens items of a media grid full-screen. `items` matches the grid's data-index order.
  MBR.lightbox = (grid, items) => {
    const lb = document.getElementById("lightbox");
    const body = document.getElementById("lightbox-body");
    if (!grid || !lb) return;
    const close = () => {
      lb.hidden = true;
      body.innerHTML = "";
      document.body.style.overflow = "";
    };
    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (!item) return;
      const g = items[item.dataset.index];
      body.innerHTML =
        g.type === "video"
          ? `<video src="${MBR.esc(g.src)}" controls autoplay playsinline></video>`
          : `<img src="${MBR.esc(g.src)}" alt="${MBR.esc(g.label)}" />`;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    });
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lightbox-close")) close();
    });
    document.addEventListener("keydown", (e) => e.key === "Escape" && !lb.hidden && close());
  };

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
