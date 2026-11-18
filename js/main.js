/* Home page: renders bikes, quiz, comparison, FAQ, gallery and reviews from js/site-data.js. */
(function () {
  const S = window.SITE;
  const { esc, slug, ext, bookingLink, bikePage } = window.MBR;
  const { t, pick, loc } = window.I18N;
  const $ = (sel) => document.querySelector(sel);
  const VISIBLE_REVIEWS = 6;

  // Bikes
  $("#bike-grid").innerHTML = S.bikes
    .map(
      (b) => `
    <article class="bike-card">
      <a class="bike-media" href="${bikePage(b)}" data-track="${slug(b.name)}-photo">
        <img src="${esc(b.image)}" alt="${esc(b.name)}" loading="lazy" onerror="this.classList.add('missing')" />
        <span class="badge">${esc(b.year)}</span>
        <span class="bike-tag">${esc(pick(b, "tag"))}</span>
      </a>
      <div class="bike-body">
        <h3><a href="${bikePage(b)}" data-track="${slug(b.name)}-title">${esc(b.name)}</a></h3>
        <p>${esc(pick(b, "description"))}</p>
        <dl class="specs">
          ${pick(b, "specs").map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
        </dl>
        <div class="bike-actions">
          ${bookingLink(b, `${t("bike.rent", "Rent this bike")} ${ext}`, "btn btn-primary btn-block")}
          <a class="btn btn-ghost btn-block" href="${bikePage(b)}" data-track="${slug(b.name)}-details">${t("bike.details", "Photos & details")}</a>
        </div>
      </div>
    </article>`
    )
    .join("");

  // ---- Find your bike (quiz) ----
  // Each answer adds points to bikes, matched by the "match" text in js/site-data.js.
  const QUIZ = [
    {
      key: "q1", q: "How much have you been riding lately?",
      a: [
        ["a", "Getting back into it", { Nightster: 2, NT1100: 2, "F 800 GS": 1 }],
        ["b", "I ride regularly", { "F 800 GS": 2, NT1100: 1, Nightster: 1, "R nineT": 1 }],
        ["c", "Very experienced", { "R nineT": 3, "F 800 GS": 1, Nightster: 1 }],
      ],
    },
    {
      key: "q2", q: "Who's coming with you?",
      a: [
        ["a", "Riding solo", { "R nineT": 2, Nightster: 2, "F 800 GS": 1 }],
        ["b", "Bringing a passenger", { NT1100: 3, "F 800 GS": 2, Nightster: 1 }],
      ],
    },
    {
      key: "q3", q: "What's the plan?",
      a: [
        ["a", "Cruising the city in style", { "R nineT": 3, Nightster: 3 }],
        ["b", "Long days on the road", { NT1100: 3, "F 800 GS": 2 }],
        ["c", "A bit of everything", { "F 800 GS": 3, NT1100: 1, "R nineT": 1 }],
      ],
    },
  ];
  const quizBox = $("#quiz-box");
  if (quizBox) {
    let answers = [];
    const draw = () => {
      const i = answers.length;
      if (i < QUIZ.length) {
        const step = QUIZ[i];
        quizBox.innerHTML = `
          <p class="quiz-step">${t("quiz.step", "Question")} ${i + 1} ${t("quiz.of", "of")} ${QUIZ.length}</p>
          <div class="quiz-bar"><i style="width:${(i / QUIZ.length) * 100}%"></i></div>
          <h3>${esc(t(`quiz.${step.key}`, step.q))}</h3>
          <div class="quiz-options">
            ${step.a.map(([id, label], n) => `<button type="button" class="quiz-option" data-n="${n}" data-track="${step.key}-${slug(label)}">${esc(t(`quiz.${step.key}${id}`, label))}</button>`).join("")}
          </div>
          ${i ? `<button type="button" class="quiz-link" data-back data-track="back">← ${t("quiz.back", "Back")}</button>` : ""}`;
        return;
      }
      const score = (b) => answers.reduce((sum, n, q) => sum + (QUIZ[q].a[n][2][b.match] || 0), 0);
      const best = S.bikes.slice().sort((x, y) => score(y) - score(x))[0];
      quizBox.innerHTML = `
        <div class="quiz-result">
          <a class="quiz-photo" href="${bikePage(best)}" data-track="result-photo"><img src="${esc(best.image)}" alt="${esc(best.name)}" /></a>
          <div>
            <p class="quiz-step">${t("quiz.result", "Your bike is")}</p>
            <h3>${esc(best.name)}</h3>
            <p class="quiz-tag">${esc(pick(best, "bestFor"))}</p>
            <ul class="ticks">${pick(best, "who").map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
            <div class="quiz-cta">
              ${bookingLink(best, `${t("bike.rent", "Rent this bike")} ${ext}`, "btn btn-primary", `result-rent-${slug(best.name)}`)}
              <a class="btn btn-ghost" href="${bikePage(best)}" data-track="result-details-${slug(best.name)}">${t("bike.details", "Photos & details")}</a>
            </div>
            <button type="button" class="quiz-link" data-again data-track="start-over">↺ ${t("quiz.again", "Start over")}</button>
          </div>
        </div>`;
      window.MBR.track("quiz", `result-${slug(best.name)}`, `Quiz recommended ${best.name}`);
    };
    quizBox.addEventListener("click", (e) => {
      const opt = e.target.closest(".quiz-option");
      if (opt) answers.push(Number(opt.dataset.n));
      else if (e.target.closest("[data-back]")) answers.pop();
      else if (e.target.closest("[data-again]")) answers = [];
      else return;
      draw();
    });
    draw();
  }

  // ---- Compare the bikes ----
  const cmp = $("#compare-table");
  if (cmp) {
    const spec = (b, i) => pick(b, "specs")[i][1];
    const rows = [
      [t("compare.year", "Year"), (b) => esc(b.year)],
      [t("compare.engine", "Engine"), (b) => esc(spec(b, 0))],
      [t("compare.power", "Power"), (b) => esc(spec(b, 1))],
      [t("compare.gearbox", "Gearbox"), (b) => esc(pick(b, "gearbox"))],
      [t("compare.seat", "Seat height"), (b) => esc(b.seat)],
      [t("compare.passenger", "Passenger"), (b) => esc(pick(b, "passenger"))],
      [t("compare.luggage", "Luggage"), (b) => esc(pick(b, "luggage"))],
      [t("compare.bestFor", "Best for"), (b) => `<strong>${esc(pick(b, "bestFor"))}</strong>`],
      [t("compare.price", "Price & dates"), (b) => bookingLink(b, `${t("compare.seePrice", "See on Riders Share")} ${ext}`, "cmp-link")],
    ];
    cmp.innerHTML = `
      <thead><tr><th></th>${S.bikes
        .map((b) => `<th scope="col"><a href="${bikePage(b)}" data-track="${slug(b.name)}-head"><img src="${esc(b.image)}" alt="" loading="lazy" /><span>${esc(b.name)}</span></a></th>`)
        .join("")}</tr></thead>
      <tbody>${rows.map(([label, cell]) => `<tr><th scope="row">${esc(label)}</th>${S.bikes.map((b) => `<td>${cell(b)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  }

  // ---- How it works + what's included ----
  if ($("#how-steps")) {
    $("#how-steps").innerHTML = S.steps
      .map((s, i) => `<li><span class="step-n">${i + 1}</span><h3>${esc(loc(s)[0])}</h3><p>${esc(loc(s)[1])}</p></li>`)
      .join("");
    const delivery = loc(S.delivery || {});
    $("#included-list").innerHTML = S.included
      .map((x) => loc(x))
      .concat(delivery ? [delivery] : [])
      .map((x) => `<li>${esc(x)}</li>`)
      .join("");
  }

  // ---- FAQ ----
  if ($("#faq-list")) {
    $("#faq-list").innerHTML = S.faq
      .map((f) => `<details><summary data-track="${slug(f.en[0]).slice(0, 48)}">${esc(loc(f)[0])}</summary><p>${esc(loc(f)[1])}</p></details>`)
      .join("");
    if (!window.MBR.isDraft("faq")) {
      const ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: S.faq.map((f) => ({ "@type": "Question", name: loc(f)[0], acceptedAnswer: { "@type": "Answer", text: loc(f)[1] } })),
      });
      document.head.appendChild(ld);
    }
  }

  // Gallery
  $("#gallery-grid").innerHTML = S.gallery.map(window.MBR.mediaItem).join("");
  window.MBR.lightbox($("#gallery-grid"), S.gallery);

  // Reviews (first few visible, the rest behind "Show more")
  $("#review-grid").innerHTML = S.reviews.map((r, i) => window.MBR.reviewCard(r, i >= VISIBLE_REVIEWS)).join("");
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

  // Rider wall (only when there are photos)
  const riders = S.riders || [];
  if (riders.length) {
    $("#riders").hidden = false;
    $("#rider-grid").innerHTML = riders
      .map(
        (r) => `
      <figure class="rider-card">
        <img src="${esc(r.src)}" alt="${esc(r.name)}" loading="lazy" onerror="this.closest('figure').remove()" />
        <figcaption><strong>${esc(r.name)}</strong><span>${esc([r.bike, r.from].filter(Boolean).join(" · "))}</span></figcaption>
      </figure>`
      )
      .join("");
  }

  // Booking links in the contact section
  $("#booking-links").innerHTML = S.bikes
    .map((b) => bookingLink(b, `<span>${esc(b.name)} ${esc(b.year)}</span>${ext}`))
    .join("");

  window.MBR.reveal(".bike-card, .gallery-item, .review-card:not([hidden]), .section-head, .quiz-box, .compare-wrap, .steps li, .included, .faq-list details, .rider-card");
})();
