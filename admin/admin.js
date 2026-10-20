/* Client portal: reads visit and click statistics from the GoatCounter API and draws the dashboard.
 *
 * Sign-in uses a GoatCounter API key with only the "Read statistics" permission. The portal link
 * admin/#key=<key> signs in directly; the key stays in the URL fragment, which is never sent to a server.
 * admin/#demo shows sample data. Click events are named <kind>/<page>/<section>/<name> by js/common.js.
 */
(function () {
  const SITE = window.SITE || {};
  const CODE = (SITE.analytics || {}).goatcounter || "";
  const KEY_STORE = "mbr-admin-key";
  const $ = (s) => document.querySelector(s);
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) =>
    String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fmt = (n) => Number(n || 0).toLocaleString("en-US");
  const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(a / b < 0.1 ? 1 : 0)}%` : "—");

  const storage = {
    get: () => { try { return localStorage.getItem(KEY_STORE) || sessionStorage.getItem(KEY_STORE); } catch (e) { return null; } },
    set: (k, keep) => { try { (keep ? localStorage : sessionStorage).setItem(KEY_STORE, k); } catch (e) {} },
    clear: () => { try { localStorage.removeItem(KEY_STORE); sessionStorage.removeItem(KEY_STORE); } catch (e) {} },
  };

  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => (t.hidden = true), 2600);
  };
  const copy = (text, msg) =>
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(() => toast(msg))
      .catch(() => window.prompt("Copy this:", text));

  // ---------- Friendly names ----------
  const BIKES = Object.fromEntries((SITE.bikes || []).map((b) => [slug(b.name), b.name]));
  const ROUTE_NAMES = Object.fromEntries((window.ROUTES || []).map((r) => [slug(r.title), r.title]));
  const KINDS = {
    booking: "Bike booking",
    "riders-share": "Riders Share profile",
    outbound: "Other website",
    internal: "Site link",
    action: "Button",
    other: "Other",
  };
  const SECTIONS = {
    nav: "Top menu", hero: "Top banner", bikes: "Our Bikes", gallery: "Gallery", reviews: "Reviews",
    routes: "Routes teaser", contact: "Contact", footer: "Footer", page: "Page",
  };
  const PAGES = { home: "Home", routes: "Routes page" };
  const words = (s) => String(s).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  const sectionName = (s) => SECTIONS[s] || ROUTE_NAMES[s] || words(s);
  const clickName = (name) => {
    if (BIKES[name]) return BIKES[name];
    if (name.startsWith("photo-")) return `Opened photo: ${words(name.slice(6))}`;
    return words(name);
  };
  const parseEvent = (h) => {
    const p = h.path.split("/");
    if (p.length >= 4 && KINDS[p[0]]) {
      return { kind: p[0], page: p[1], section: p[2], name: p.slice(3).join("/") };
    }
    return { kind: "other", page: "", section: "", name: h.path };
  };

  // ---------- API ----------
  let KEY = null;
  let DEMO = false;
  const api = async (path, params = {}) => {
    if (DEMO) return Demo.api(path, params);
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`https://${CODE}.goatcounter.com/api/v0${path}${q ? "?" + q : ""}`, {
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    });
    if (res.status === 401 || res.status === 403) throw Object.assign(new Error("auth"), { auth: true });
    if (res.status === 429) throw new Error("Too many requests — wait a minute and refresh.");
    if (!res.ok) throw new Error(`The analytics service answered ${res.status}.`);
    return res.json();
  };

  // ---------- Date range ----------
  let DAYS = 30;
  try { DAYS = Number(localStorage.getItem("mbr-admin-days")) || 30; } catch (e) {}
  const range = () => {
    const end = new Date();
    end.setMinutes(0, 0, 0);
    end.setHours(end.getHours() + 1);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (DAYS - 1));
    return { start, end, params: { start: start.toISOString().replace(".000", ""), end: end.toISOString().replace(".000", "") } };
  };
  const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const dayLabel = (key, opts = { month: "short", day: "numeric" }) =>
    new Date(key + "T12:00:00").toLocaleDateString("en-US", opts);

  // ---------- Rendering helpers ----------
  const bars = (el, rows, opts = {}) => {
    if (!rows.length) {
      el.innerHTML = `<p class="empty">${esc(opts.empty || "No data for this period yet.")}</p>`;
      return;
    }
    const max = Math.max(...rows.map((r) => r.count), 1);
    const total = opts.total || rows.reduce((a, r) => a + r.count, 0);
    el.innerHTML = `<ul class="bars${opts.alt ? " alt" : ""}">${rows
      .map(
        (r) => `<li title="${esc(r.title || r.name)}">
          <span class="name">${esc(r.name)}</span>
          <span class="val">${fmt(r.count)}<small>${pct(r.count, total)}</small></span>
          <span class="track"><span class="fill" style="width:${((r.count / max) * 100).toFixed(1)}%"></span></span>
        </li>`
      )
      .join("")}</ul>`;
  };
  const statRows = (stats, fallback) =>
    (stats || []).map((s) => ({ name: s.name || fallback, count: s.count })).filter((r) => r.count > 0);

  // Line chart: two series on one count axis, crosshair + tooltip on hover.
  const lineChart = (el, days, series) => {
    const w = el.clientWidth || 600, h = el.clientHeight || 260;
    const pad = { l: 36, r: 8, t: 10, b: 26 };
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    const max = Math.max(4, ...series.flatMap((s) => s.values));
    const step = Math.pow(10, Math.floor(Math.log10(max / 4)));
    const tick = [1, 2, 5, 10].map((m) => m * step).find((t) => max / t <= 5) || step * 10;
    const top = Math.ceil(max / tick) * tick;
    const x = (i) => pad.l + (days.length === 1 ? iw / 2 : (i / (days.length - 1)) * iw);
    const y = (v) => pad.t + ih - (v / top) * ih;
    let grid = "";
    for (let v = 0; v <= top; v += tick) {
      grid += `<line class="gridline" x1="${pad.l}" x2="${w - pad.r}" y1="${y(v)}" y2="${y(v)}"/>
        <text class="axis" x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v)}</text>`;
    }
    const every = Math.max(1, Math.ceil(days.length / Math.max(2, Math.floor(iw / 70))));
    const xl = days
      .map((d, i) => (i % every === 0 ? `<text class="axis" x="${x(i)}" y="${h - 6}" text-anchor="middle">${esc(dayLabel(d))}</text>` : ""))
      .join("");
    const paths = series
      .map((s) => {
        const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
        const area = `${d} L${x(s.values.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
        return `<path class="area" d="${area}" fill="${s.color}"/><path class="line" d="${d}" stroke="${s.color}"/>`;
      })
      .join("");
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Visitors and clicks per day">${grid}${xl}${paths}
      <g class="hover" visibility="hidden"><line class="cross" y1="${pad.t}" y2="${pad.t + ih}"/>
      ${series.map((s) => `<circle class="dot" r="4.5" fill="${s.color}"/>`).join("")}</g>
      <rect x="${pad.l}" y="0" width="${iw}" height="${h}" fill="transparent"/></svg>`;
    const svg = el.querySelector("svg"), g = svg.querySelector(".hover"), tip = $("#tooltip");
    const move = (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * w;
      const i = Math.max(0, Math.min(days.length - 1, Math.round(((px - pad.l) / iw) * (days.length - 1))));
      g.setAttribute("visibility", "visible");
      g.querySelector("line").setAttribute("x1", x(i));
      g.querySelector("line").setAttribute("x2", x(i));
      g.querySelectorAll("circle").forEach((c, k) => {
        c.setAttribute("cx", x(i));
        c.setAttribute("cy", y(series[k].values[i]));
      });
      tip.innerHTML = `<b>${esc(dayLabel(days[i], { weekday: "short", month: "short", day: "numeric" }))}</b>${series
        .map((s) => `<div><i style="background:${s.color}"></i>${esc(s.name)}<span>${fmt(s.values[i])}</span></div>`)
        .join("")}`;
      tip.hidden = false;
      const left = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
      tip.style.left = `${left}px`;
      tip.style.top = `${e.clientY - tip.offsetHeight - 12}px`;
    };
    const leave = () => {
      g.setAttribute("visibility", "hidden");
      tip.hidden = true;
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerleave", leave);
  };

  // ---------- Dashboard ----------
  let STATE = null;
  let FILTER = "all";

  const load = async () => {
    const { start, end, params } = range();
    $("#range-label").textContent =
      DAYS === 1
        ? `Today, ${dayLabel(dayKey(start), { weekday: "long", month: "long", day: "numeric" })}`
        : `${dayLabel(dayKey(start), { month: "long", day: "numeric", year: "numeric" })} – ${dayLabel(dayKey(new Date()), { month: "long", day: "numeric", year: "numeric" })}`;
    document.querySelectorAll("#range button").forEach((b) => b.classList.toggle("on", Number(b.dataset.days) === DAYS));
    $("#app").classList.add("loading");
    $("#load-error").hidden = true;
    try {
      const [total, hits, refs, campaigns, locations, sizes] = await Promise.all([
        api("/stats/total", params),
        api("/stats/hits", { ...params, limit: 200 }),
        api("/stats/toprefs", { ...params, limit: 10 }),
        api("/stats/campaigns", { ...params, limit: 10 }),
        api("/stats/locations", { ...params, limit: 8 }),
        api("/stats/sizes", { ...params, limit: 6 }),
      ]);
      STATE = { params, start, end, total, hits: hits.hits || [], refs, campaigns, locations, sizes };
      render();
    } catch (err) {
      if (err.auth) return signOut("That access key was not accepted. Ask for a new portal link.");
      $("#load-error").textContent =
        err.message === "Failed to fetch" ? "Could not reach the analytics service. Check your connection and refresh." : err.message;
      $("#load-error").hidden = false;
    } finally {
      $("#app").classList.remove("loading");
    }
  };

  const render = () => {
    const { hits, total, start } = STATE;
    const events = hits.filter((h) => h.event).map((h) => ({ ...h, ...parseEvent(h) }));
    const pages = hits.filter((h) => !h.event);
    const clicks = events.reduce((a, h) => a + h.count, 0);
    const bookings = events.filter((h) => h.kind === "booking").reduce((a, h) => a + h.count, 0);
    const visitors =
      total && typeof total.total === "number" ? Math.max(0, total.total - (total.total_events || 0)) : pages.reduce((a, h) => a + h.count, 0);

    $("#kpis").innerHTML = [
      ["Visitors", fmt(visitors), "People who visited the site"],
      ["Clicks", fmt(clicks), `${visitors ? (clicks / visitors).toFixed(1) : "0"} per visitor`],
      ["Booking clicks", fmt(bookings), "Sent to a bike on Riders Share"],
      ["Booking rate", pct(bookings, visitors), "Visitors who clicked to book"],
    ]
      .map(([k, v, s]) => `<div class="kpi"><p>${k}</p><strong>${v}</strong><small>${s}</small></div>`)
      .join("");

    // Daily trend
    const days = [];
    for (let d = new Date(start); days.length < DAYS; d.setDate(d.getDate() + 1)) days.push(dayKey(d));
    const perDay = (list) => {
      const m = Object.fromEntries(days.map((d) => [d, 0]));
      list.forEach((h) => (h.stats || []).forEach((s) => { if (s.day in m) m[s.day] += s.daily || 0; }));
      return days.map((d) => m[d]);
    };
    lineChart($("#trend"), days, [
      { name: "Visitors", color: "#4a8cf0", values: perDay(pages) },
      { name: "Clicks", color: "#f0600a", values: perDay(events) },
    ]);

    // Bookings by bike
    const group = (list, keyFn) => {
      const m = new Map();
      list.forEach((h) => { const k = keyFn(h); m.set(k, (m.get(k) || 0) + h.count); });
      return [...m].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    };
    bars($("#by-bike"), group(events.filter((h) => h.kind === "booking"), (h) => clickName(h.name)), {
      empty: "No booking clicks in this period yet.",
    });
    bars(
      $("#by-section"),
      group(events.filter((h) => h.kind !== "other"), (h) => `${PAGES[h.page] || words(h.page)} › ${sectionName(h.section)}`).slice(0, 10),
      { empty: "No clicks in this period yet." }
    );

    // Filter chips + table
    const kinds = ["all", ...Object.keys(KINDS).filter((k) => events.some((h) => h.kind === k))];
    if (!kinds.includes(FILTER)) FILTER = "all";
    $("#kind-filter").innerHTML = kinds
      .map((k) => `<button type="button" data-kind="${k}" class="${k === FILTER ? "on" : ""}">${k === "all" ? "All" : KINDS[k]}</button>`)
      .join("");
    renderTable(events);

    bars($("#sources"), statRows(STATE.refs.stats, "Direct (typed the address, bookmarks, apps)"), { alt: true });
    bars($("#campaigns"), statRows(STATE.campaigns.stats, "(none)"), {
      alt: true,
      empty: "No campaign visits yet. Share a link from the link builder to start.",
    });
    bars($("#pages"), pages.map((h) => ({ name: h.title || h.path, title: h.path, count: h.count })).slice(0, 8), { alt: true });
    bars($("#locations"), statRows(STATE.locations.stats, "Unknown"), { alt: true });
    bars($("#devices"), statRows(STATE.sizes.stats, "Unknown"), { alt: true });
  };

  const renderTable = (events) => {
    const rows = events.filter((h) => FILTER === "all" || h.kind === FILTER).sort((a, b) => b.count - a.count);
    const max = Math.max(1, ...rows.map((r) => r.count));
    $("#links-body").innerHTML = rows.length
      ? rows
          .map(
            (h) => `<tr class="row" tabindex="0" data-id="${esc(h.path_id)}" aria-expanded="false">
          <td class="what">${esc(h.kind === "other" ? h.path : clickName(h.name))}<small>${esc(h.title || "")}</small></td>
          <td><span class="badge ${esc(h.kind)}">${esc(KINDS[h.kind])}</span></td>
          <td class="where">${h.kind === "other" ? "—" : `${esc(PAGES[h.page] || words(h.page))} › ${esc(sectionName(h.section))}`}</td>
          <td class="num"><div class="count"><span class="mini"><i style="width:${((h.count / max) * 100).toFixed(1)}%"></i></span>${fmt(h.count)}</div></td>
        </tr>`
          )
          .join("")
      : `<tr><td colspan="4" class="empty">No clicks in this period yet.</td></tr>`;
  };

  const toggleDetail = async (tr) => {
    const open = tr.nextElementSibling && tr.nextElementSibling.classList.contains("detail");
    document.querySelectorAll("#links-body tr.detail").forEach((d) => d.remove());
    document.querySelectorAll("#links-body tr.row").forEach((r) => { r.classList.remove("open"); r.setAttribute("aria-expanded", "false"); });
    if (open) return;
    tr.classList.add("open");
    tr.setAttribute("aria-expanded", "true");
    const detail = document.createElement("tr");
    detail.className = "detail";
    detail.innerHTML = `<td colspan="4"><h3>Where these clicks came from</h3><div><p class="empty">Loading…</p></div></td>`;
    tr.after(detail);
    try {
      const res = await api(`/stats/hits/${encodeURIComponent(tr.dataset.id)}`, { ...STATE.params, limit: 10 });
      bars(detail.querySelector("div"), statRows(res.refs, "Direct (typed the address, bookmarks, apps)"), { alt: true });
    } catch (e) {
      detail.querySelector("div").innerHTML = `<p class="empty">Could not load sources: ${esc(e.message)}</p>`;
    }
  };

  // ---------- Link builder ----------
  const buildLink = () => {
    const src = $("#b-source").value === "other" ? slug($("#b-other").value) || "other" : $("#b-source").value;
    const camp = slug($("#b-campaign").value);
    const page = $("#b-page").value;
    const hash = page.startsWith("#") ? page : "";
    const path = hash ? "" : page;
    const q = new URLSearchParams({ utm_source: src });
    if (camp) q.set("utm_campaign", camp);
    $("#b-other-wrap").hidden = $("#b-source").value !== "other";
    $("#b-url").textContent = `https://www.miamibikesrentals.com/${path}?${q}${hash}`;
  };

  // ---------- Sign in / out ----------
  const showApp = () => {
    $("#login").hidden = true;
    $("#app").hidden = false;
    $("#demo-banner").hidden = !DEMO;
    $("#share-btn").hidden = DEMO;
    $("#signout-btn").textContent = DEMO ? "Exit preview" : "Sign out";
    buildLink();
    load();
  };
  const showLogin = (msg) => {
    $("#app").hidden = true;
    $("#login").hidden = false;
    $("#login-error").textContent = msg || "";
    $("#login-error").hidden = !msg;
    if (!CODE) {
      $("#login-error").textContent =
        "Tracking is not switched on yet: add the GoatCounter code to js/site-data.js (see README). You can still preview with sample data.";
      $("#login-error").hidden = false;
    }
  };
  const signOut = (msg) => {
    KEY = null;
    DEMO = false;
    storage.clear();
    history.replaceState(null, "", location.pathname);
    showLogin(msg);
  };

  const route = () => {
    const hash = new URLSearchParams(location.hash.slice(1));
    if (location.hash === "#demo") {
      DEMO = true;
      return showApp();
    }
    DEMO = false;
    if (hash.get("key")) {
      KEY = hash.get("key").trim();
      storage.set(KEY, true);
      history.replaceState(null, "", location.pathname); // keep the key out of the address bar and history
    } else {
      KEY = storage.get();
    }
    if (KEY && CODE) showApp();
    else showLogin();
  };

  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!CODE) return;
    KEY = $("#key").value.trim();
    storage.set(KEY, $("#remember").checked);
    $("#key").value = "";
    showApp();
  });
  $("#signout-btn").addEventListener("click", () => signOut());
  $("#demo-exit").addEventListener("click", (e) => { e.preventDefault(); signOut(); });
  $("#share-btn").addEventListener("click", () =>
    copy(`${location.origin}${location.pathname}#key=${encodeURIComponent(KEY)}`, "Portal link copied — anyone with it can view these stats.")
  );
  $("#range").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    DAYS = Number(b.dataset.days);
    try { localStorage.setItem("mbr-admin-days", DAYS); } catch (err) {}
    load();
  });
  $("#kind-filter").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !STATE) return;
    FILTER = b.dataset.kind;
    render();
  });
  $("#links-body").addEventListener("click", (e) => { const tr = e.target.closest("tr.row"); if (tr) toggleDetail(tr); });
  $("#links-body").addEventListener("keydown", (e) => {
    const tr = e.target.closest("tr.row");
    if (tr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggleDetail(tr); }
  });
  $("#builder-form").addEventListener("input", buildLink);
  $("#b-copy").addEventListener("click", () => copy($("#b-url").textContent, "Tracked link copied."));
  let resizeT;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => STATE && render(), 150); });
  window.addEventListener("hashchange", route);

  // ---------- Sample data (admin/#demo) ----------
  const Demo = (() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const bikes = Object.keys(BIKES).length ? Object.keys(BIKES) : ["bmw-r-ninet-scrambler", "honda-nt1100"];
    const routes = Object.keys(ROUTE_NAMES).slice(0, 3);
    const defs = [
      ...bikes.map((b, i) => [`booking/home/bikes/${b}`, 9 - i * 1.6, "https://www.riders-share.com/…"]),
      ...bikes.map((b, i) => [`booking/home/contact/${b}`, 3 - i * 0.5, "https://www.riders-share.com/…"]),
      ["riders-share/home/reviews/see-all-reviews", 4, SITE.ridersShareProfile],
      ["riders-share/home/contact/contact-us", 3.5, SITE.contactUrl],
      ["internal/home/hero/view-our-bikes", 11, "https://www.miamibikesrentals.com/#bikes"],
      ["internal/home/nav/routes", 6, "https://www.miamibikesrentals.com/routes.html"],
      ["internal/home/nav/rent-now", 5, "https://www.miamibikesrentals.com/#bikes"],
      ["action/home/gallery/photo-sunset-ride", 4, "Open gallery photo"],
      ["action/home/reviews/show-more-reviews", 3, "Show more reviews"],
      ...routes.map((r, i) => [`outbound/routes/${r}/google-maps`, 3 - i * 0.6, "https://www.google.com/maps/dir/…"]),
      ...routes.map((r, i) => [`internal/routes/${r}/rent-a-bike-for-this-ride`, 1.6 - i * 0.3, "https://www.miamibikesrentals.com/index.html#bikes"]),
    ];
    const sources = [["instagram", 38], ["google.com", 24], ["", 19], ["facebook.com", 8], ["riders-share.com", 6], ["tiktok", 5]];
    const statsFor = (base, p) => {
      const out = [];
      const s = new Date(p.start), e = new Date(p.end);
      for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
        const wk = [0, 6].includes(d.getDay()) ? 1.5 : 1;
        out.push({ day: dayKey(d), daily: Math.max(0, Math.round(base * wk * (0.5 + rand()))) });
      }
      return out;
    };
    const list = (rows) => ({ stats: rows.map(([name, count]) => ({ name, count: Math.round(count) })), more: false });
    return {
      api: async (path, p) => {
        await new Promise((r) => setTimeout(r, 150));
        seed = 7 + DAYS;
        const n = DAYS / 30;
        if (path === "/stats/hits") {
          const hits = [
            ["/", 52, "Miami Bikes Rentals | Premium Motorcycle Rentals in Miami", false],
            ["/routes.html", 14, "Miami Ride Routes | Miami Bikes Rentals", false],
            ...defs.map(([path, base, title]) => [path, Math.max(0.15, base * 0.3), title, true]),
          ].map(([path, base, title, event], i) => {
            const stats = statsFor(base, p);
            return { path_id: i + 1, path, title, event, count: stats.reduce((a, s) => a + s.daily, 0), stats };
          });
          return { hits: hits.sort((a, b) => b.count - a.count), total: hits.length, more: false };
        }
        if (path === "/stats/total") {
          const hits = await Demo.api("/stats/hits", p);
          const t = hits.hits.reduce((a, h) => a + h.count, 0);
          const ev = hits.hits.filter((h) => h.event).reduce((a, h) => a + h.count, 0);
          return { total: t, total_events: ev, stats: [] };
        }
        if (path === "/stats/toprefs") return list(sources.map(([s, c]) => [s, c * 20 * n]));
        if (path === "/stats/campaigns") return list([["bio-link", 120 * n], ["summer-promo", 45 * n], ["flyer-qr", 18 * n]]);
        if (path === "/stats/locations") return list([["United States", 610 * n], ["Brazil", 64 * n], ["Canada", 52 * n], ["Germany", 31 * n], ["Colombia", 27 * n]]);
        if (path === "/stats/sizes") return list([["Phones", 690 * n], ["Computer screens", 170 * n], ["Tablets", 28 * n]]);
        if (path.startsWith("/stats/hits/")) {
          const id = Number(path.split("/").pop());
          return { refs: sources.map(([s, c]) => ({ name: s, count: Math.max(1, Math.round((c / 10) * n * (0.4 + ((id * 37 + c) % 10) / 8))) })).sort((a, b) => b.count - a.count), more: false };
        }
        return { stats: [] };
      },
    };
  })();

  route();
})();
