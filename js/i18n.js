/* Language: English by default, Spanish with ?lang=es, the nav toggle, or a Spanish browser.
 * Static text carries data-i18n="key" (English lives in the HTML); the Spanish for each key is below.
 * Content from js/site-data.js keeps its Spanish next to the English there. */
(function () {
  const ES = {
    "nav.bikes": "Motos",
    "nav.quiz": "Encuentra tu moto",
    "nav.compare": "Comparar",
    "nav.how": "Cómo funciona",
    "nav.reviews": "Reseñas",
    "nav.faq": "Preguntas",
    "nav.contact": "Contacto",
    "nav.rent": "Rentar ya",
    "nav.gallery": "Galería",
    "hero.sub": "Renta de motos premium en Miami. Cuatro máquinas elegidas a mano, cero concesiones. Reserva directo por Riders Share y adueñate del camino.",
    "hero.cta": "Ver las motos",
    "hero.quiz": "Encuentra tu moto",
    "rating.owner": "Power Owner en Riders Share",
    "rating.reviews": "reseñas",
    "fleet.eyebrow": "La flota",
    "fleet.title": "CUATRO MÁQUINAS.<br /><span>CERO CONCESIONES.</span>",
    "fleet.sub": "Renta de motos premium en Miami. Cuatro máquinas elegidas a mano, cero concesiones.",
    "bike.rent": "Rentar esta moto",
    "bike.details": "Fotos y detalles",
    "bike.bestFor": "Ideal para",
    "quiz.eyebrow": "Test de 30 segundos",
    "quiz.title": "ENCUENTRA <span>TU MOTO</span>",
    "quiz.sub": "Tres preguntas rápidas y te decimos cuál de las cuatro va contigo.",
    "quiz.step": "Pregunta",
    "quiz.of": "de",
    "quiz.q1": "¿Cuánto has rodado últimamente?",
    "quiz.q1a": "Estoy retomando",
    "quiz.q1b": "Ruedo con frecuencia",
    "quiz.q1c": "Mucha experiencia",
    "quiz.q2": "¿Quién viene contigo?",
    "quiz.q2a": "Voy solo",
    "quiz.q2b": "Llevo acompañante",
    "quiz.q3": "¿Cuál es el plan?",
    "quiz.q3a": "Pasear por la ciudad con estilo",
    "quiz.q3b": "Días largos de carretera",
    "quiz.q3c": "Un poco de todo",
    "quiz.result": "Tu moto es",
    "quiz.why": "Por qué",
    "quiz.again": "Empezar de nuevo",
    "quiz.back": "Atrás",
    "compare.eyebrow": "Lado a lado",
    "compare.title": "COMPARA <span>LAS MOTOS</span>",
    "compare.year": "Año",
    "compare.engine": "Motor",
    "compare.power": "Potencia",
    "compare.gearbox": "Caja",
    "compare.seat": "Altura del asiento",
    "compare.passenger": "Acompañante",
    "compare.luggage": "Equipaje",
    "compare.bestFor": "Ideal para",
    "compare.price": "Precio y fechas",
    "compare.seePrice": "Ver en Riders Share",
    "compare.note": "Altura del asiento: dato aproximado del fabricante.",
    "how.eyebrow": "Fácil y rápido",
    "how.title": "CÓMO <span>FUNCIONA</span>",
    "how.included": "Qué incluye",
    "gallery.eyebrow": "Fotos y videos",
    "gallery.title": "LA <span>GALERÍA</span>",
    "reviews.eyebrow": "Reseñas de Riders Share",
    "reviews.title": "LO QUE DICEN <span>LOS RIDERS</span>",
    "reviews.rating": "Power Owner con 5 estrellas en Riders Share",
    "reviews.more": "Ver más reseñas",
    "reviews.all": "Ver todas las reseñas en Riders Share",
    "riders.eyebrow": "Nuestros riders",
    "riders.title": "EL MURO DE <span>LOS RIDERS</span>",
    "faq.eyebrow": "Antes de reservar",
    "faq.title": "PREGUNTAS <span>FRECUENTES</span>",
    "contact.eyebrow": "Contáctanos",
    "contact.title": "¿LISTO PARA <span>RODAR?</span>",
    "contact.place": "Miami, Florida",
    "contact.placeText": "Todas las motos se entregan en el área de Miami. La dirección exacta se comparte al reservar por Riders Share.",
    "contact.booking": "Todas las reservas se hacen por <strong>Riders Share</strong>, la forma más segura de rentar motos. Tu viaje va asegurado y protegido.",
    "contact.side": "Miami Bikes Rentals — motos premium, cero complicaciones.<br />Reserva por Riders Share y nosotros nos encargamos del resto.",
    "contact.cta": "Contáctanos aquí",
    "wa.label": "Escríbenos por WhatsApp",
    "wa.text": "Hola Nelson, quiero rentar una moto en Miami.",
    "bp.back": "Todas las motos",
    "bp.who": "¿PARA QUIÉN <span>ES?</span>",
    "bp.specs": "FICHA <span>TÉCNICA</span>",
    "bp.photos": "FOTOS <span>Y VIDEO</span>",
    "bp.reviews": "RESEÑAS DE <span>ESTA MOTO</span>",
    "bp.others": "LAS OTRAS <span>MOTOS</span>",
    "bp.book": "Ver precio y fechas",
    "bp.bookNote": "Reserva segura en Riders Share · seguro incluido",
    "bp.style": "Estilo",
    "preview.note": "Vista previa: esta sección todavía no es pública.",
  };

  const saved = (() => { try { return localStorage.getItem("mbr-lang"); } catch (e) { return null; } })();
  const param = new URLSearchParams(location.search).get("lang");
  const lang = ["en", "es"].includes(param) ? param : saved || (/^es\b/i.test(navigator.language || "") ? "es" : "en");
  if (param) { try { localStorage.setItem("mbr-lang", lang); } catch (e) {} }
  document.documentElement.lang = lang;

  window.I18N = {
    lang,
    // t("key", "English text") → Spanish when the site is in Spanish and a translation exists.
    t: (key, en) => (lang === "es" && ES[key]) || en,
    // pick(obj, "field") → obj.es.field in Spanish when present, else obj.field.
    pick: (obj, field) => (lang === "es" && obj.es && obj.es[field]) || obj[field],
    // loc({ en, es }) → the value for the current language.
    loc: (o) => (lang === "es" && o.es) || o.en,
    set: (l) => {
      try { localStorage.setItem("mbr-lang", l); } catch (e) {}
      const u = new URL(location.href);
      u.searchParams.delete("lang");
      location.replace(u.pathname + u.search + u.hash);
      if (u.href === location.href) location.reload();
    },
  };

  if (lang === "es") {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = ES[el.dataset.i18n];
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-label]").forEach((el) => {
      const v = ES[el.dataset.i18nLabel];
      if (v) el.setAttribute("aria-label", v);
    });
  }
})();
