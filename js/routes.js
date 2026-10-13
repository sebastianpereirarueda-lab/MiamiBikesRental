/* Routes page: renders each ride from js/routes-data.js with a mini route map. */
(function () {
  const { esc, slug, ext } = window.MBR;
  const MAP_VERSION = "202610130232"; // bump after re-rendering assets/routes/*.svg
  const pin =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  const clock =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  const gauge =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3.3 15a9 9 0 1 1 17.4 0"/><path d="m12 13 4-5"/></svg>';
  const warnIcon =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

  const mapsUrl = (stops) => {
    const ll = (s) => `${s[1]},${s[2]}`;
    const mid = stops.slice(1, -1).map(ll).join("|");
    return (
      "https://www.google.com/maps/dir/?api=1&travelmode=driving" +
      `&origin=${encodeURIComponent(ll(stops[0]))}&destination=${encodeURIComponent(ll(stops[stops.length - 1]))}` +
      (mid ? `&waypoints=${encodeURIComponent(mid)}` : "")
    );
  };

  // Apple Maps directions link (multi-stop needs iOS 18.4 / macOS 15.4 or newer;
  // older devices open the route from the first stop to the last).
  const appleUrl = (stops) => {
    const ll = (s) => encodeURIComponent(`${s[1]},${s[2]}`);
    const mid = stops.slice(1, -1).map((s) => `&waypoint=${ll(s)}`).join("");
    return `https://maps.apple.com/directions?source=${ll(stops[0])}&destination=${ll(stops[stops.length - 1])}${mid}&mode=driving`;
  };

  // Draw the route from real coordinates, scaled to fit the panel.
  const routeSvg = (stops, id) => {
    const W = 600, H = 440, PAD = 70, PADX = 105;
    const k = Math.cos((stops[0][1] * Math.PI) / 180);
    const xs = stops.map((s) => s[2] * k), ys = stops.map((s) => -s[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = Math.min((W - 2 * PADX) / (maxX - minX || 1), (H - 2 * PAD) / (maxY - minY || 1));
    const ox = (W - (maxX - minX) * scale) / 2, oy = (H - (maxY - minY) * scale) / 2;
    const P = stops.map((s, i) => [ox + (xs[i] - minX) * scale, oy + (ys[i] - minY) * scale]);
    let d = `M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
    for (let i = 1; i < P.length; i++) {
      const [x0, y0] = P[i - 1], [x1, y1] = P[i];
      const bend = (i % 2 ? 1 : -1) * 0.12;
      const cx = (x0 + x1) / 2 - (y1 - y0) * bend, cy = (y0 + y1) / 2 + (x1 - x0) * bend;
      d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    const seen = new Set();
    const marks = P.map(([x, y], i) => {
      const key = stops[i][0];
      if (seen.has(key)) return "";
      seen.add(key);
      const first = i === 0, last = i === P.length - 1;
      const pos = stops[i][3] || (x < W * 0.62 ? "r" : "l");
      const [dx, dy, anchor] = { r: [13, 5, "start"], l: [-13, 5, "end"], t: [0, -14, "middle"], b: [0, 24, "middle"] }[pos] || [];
      const label = pos === "none" ? "" : `<text x="${(x + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}">${esc(key)}</text>`;
      return `<g class="rm-stop${first ? " is-start" : ""}${last ? " is-end" : ""}">
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${first || last ? 7 : 5}"/>${label}
      </g>`;
    }).join("");
    return `<svg class="route-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Route map">
      <defs><pattern id="g-${id}" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern></defs>
      <rect width="${W}" height="${H}" fill="url(#g-${id})"/>
      <path d="${d}" class="rm-glow"/><path d="${d}" class="rm-line"/>${marks}
    </svg>`;
  };

  document.getElementById("route-list").innerHTML = window.ROUTES.map((r, i) => {
    const id = slug(r.title);
    const url = mapsUrl(r.stops);
    const startUrl = `https://www.google.com/maps/search/?api=1&query=${r.stops[0][1]},${r.stops[0][2]}`;
    return `
    <article class="route-card${i % 2 ? " flip" : ""}" id="${id}">
      <div class="route-visual">
        <img class="route-img" src="assets/routes/${id}.svg?v=${MAP_VERSION}" alt="Map of the ${esc(r.title)} route" loading="${i < 2 ? "eager" : "lazy"}" data-index="${i}" />
        <span class="route-tag">${esc(r.tag)}</span>
        <span class="route-credit">Map data © OpenStreetMap contributors</span>
      </div>
      <div class="route-body">
        <h2>${esc(r.title)}</h2>
        <p>${esc(r.summary)}</p>
        <p class="route-start">Starts at <a href="${startUrl}" target="_blank" rel="noopener">${esc(r.start)}</a>.</p>
        <ul class="route-stats">
          <li>${pin}${esc(r.miles)}</li>
          <li>${clock}${esc(r.time)}</li>
          <li class="lvl-${slug(r.level)}">${gauge}${esc(r.level)}</li>
        </ul>
        <p class="route-bike"><strong>Best bike:</strong> ${esc(r.bike)}</p>
        ${r.warning ? `<div class="route-warn">${warnIcon}<p>${esc(r.warning)}</p></div>` : ""}
        ${r.tips && r.tips.length ? `<ul class="route-tips">${r.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        <div class="chips">${r.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="route-actions">
          <p class="route-open">Open this route in</p>
          <div class="route-maps">
            <a class="btn btn-primary" href="${url}" target="_blank" rel="noopener">Google Maps ${ext}</a>
            <a class="btn btn-primary" href="${appleUrl(r.stops)}" target="_blank" rel="noopener">Apple Maps ${ext}</a>
          </div>
          <a class="btn btn-outline" href="index.html#bikes">Rent a bike for this ride</a>
        </div>
      </div>
    </article>`;
  }).join("");

  // If a map image is missing, fall back to the simple drawn route.
  document.querySelectorAll(".route-img").forEach((img) => {
    img.addEventListener("error", () => {
      const i = +img.dataset.index;
      img.outerHTML = routeSvg(window.ROUTES[i].stops, i);
    });
  });

  MBR.reveal(".route-card, .section-head");
})();
