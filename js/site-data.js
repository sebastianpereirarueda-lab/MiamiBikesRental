/*
 * ============================================================
 *  MIAMI BIKES RENTALS — SITE CONTENT
 *  Edit this file to change bikes, links, gallery, reviews, FAQ and more.
 *  No other file needs to change for normal content updates.
 * ============================================================
 */
window.SITE = {
  // Riders Share profile: all reviews, 5-star rating and every bike.
  ridersShareProfile: "https://www.riders-share.com/user/hakPjWedg6JsWYKZD", // "See all reviews" button
  contactUrl: "https://www.riders-share.com/user/hakPjWedg6JsWYKZD",         // "Contact us here" button

  // Click tracking for Riders Share links (see README "Tracking booking clicks").
  // Paste your GoatCounter code (the "xxx" in xxx.goatcounter.com) and/or a
  // Google Analytics 4 ID ("G-XXXXXXX"). Leave empty to turn tracking off.
  analytics: {
    goatcounter: "miamibikesrentals",
    ga4: "",
  },

  // Sections waiting for the owner's approval. While false, a section is hidden from the
  // public and only shows when you open the site with ?preview=1 at the end of the address.
  // Change to true to publish it.
  published: {
    how: false, // "How it works" + "What's included"
    faq: false, // Frequently asked questions
  },

  // WhatsApp number with country code, digits only (e.g. "13055551234").
  // Leave empty to hide the WhatsApp chat button.
  whatsapp: "",

  // Riders Share rating shown at the top of the page. "count" is your total number
  // of reviews on Riders Share (e.g. "45"); leave empty to show the rating without a count.
  rating: { score: "5.0", count: "" },

  // Delivery offer shown under "What's included", e.g.
  // { en: "Airport and hotel delivery available on request.", es: "Entrega en aeropuerto u hotel a pedido." }
  // Leave both empty to hide it.
  delivery: { en: "", es: "" },

  // Each bike gets its own page (rent-<bike-name>-miami.html). "photos" are extra pictures for
  // that page, "video" an optional mp4. "es" holds the Spanish text.
  bikes: [
    {
      tag: "The Scrambler",
      name: "BMW R nineT Scrambler",
      match: "R nineT",
      gearbox: "6-speed manual",
      seat: "32.3 in (820 mm)",
      passenger: "Fine for short rides",
      luggage: "None — travel light",
      bestFor: "Style and city cruising",
      who: [
        "Riders who want a classic look with real punch",
        "Cruising Miami Beach, Wynwood and Brickell",
        "Experienced riders: a 109 HP boxer twin with plenty of torque",
      ],
      photos: [],
      video: "",
      es: {
        tag: "La Scrambler",
        description:
          "Alma retro, músculo moderno. La R nineT Scrambler combina el carácter clásico del motor bóxer con la practicidad del día a día: la moto perfecta para pasear por Miami.",
        gearbox: "Manual de 6 velocidades",
        passenger: "Bien para trayectos cortos",
        luggage: "Sin maletas — viaja ligero",
        bestFor: "Estilo y paseo urbano",
        who: [
          "Para quien busca un look clásico con verdadero empuje",
          "Pasear por Miami Beach, Wynwood y Brickell",
          "Pilotos con experiencia: bóxer bicilíndrico de 109 HP con mucho par",
        ],
        specs: [["Motor", "Bóxer bicilíndrico 1170cc"], ["Potencia", "109 HP"], ["Estilo", "Scrambler"], ["Color", "Gris Option 719"]],
      },
      year: 2023,
      image: "assets/images/bmw-r-ninet-scrambler.jpg",
      description:
        "Retro soul, modern muscle. The R nineT Scrambler blends classic boxer character with everyday capability — the perfect Miami cruiser.",
      specs: [
        ["Engine", "1170cc Boxer Twin"],
        ["Power", "109 HP"],
        ["Style", "Scrambler"],
        ["Color", "Option 719 Grey"],
      ],
      url: "https://www.riders-share.com/listing/GCR5GPWKZyxtytfqr/ref-NelsonManuelp+WYKZD",
    },
    {
      tag: "The Grand Tourer",
      name: "Honda NT1100",
      match: "NT1100",
      gearbox: "DCT automatic — no clutch lever",
      seat: "32.3 in (820 mm)",
      passenger: "Excellent — built for two",
      luggage: "Top case included",
      bestFor: "Long days and riding two-up",
      who: [
        "Couples and anyone riding with a passenger",
        "Long days in the saddle: wind protection and a relaxed seat",
        "Riders who'd rather skip the clutch — the DCT shifts for you",
      ],
      photos: [],
      video: "",
      es: {
        tag: "La Gran Turismo",
        description:
          "Lujo de largo recorrido con estilo Miami. Transmisión DCT y top case incluido: todo lo que necesitas para explorar el sur de Florida.",
        gearbox: "DCT automática — sin embrague",
        passenger: "Excelente — hecha para dos",
        luggage: "Top case incluido",
        bestFor: "Días largos y viajar en pareja",
        who: [
          "Parejas y quien viaje con acompañante",
          "Días largos sobre la moto: protección contra el viento y asiento relajado",
          "Para quien prefiere olvidarse del embrague — la DCT cambia por ti",
        ],
        specs: [["Motor", "Bicilíndrico paralelo 1084cc"], ["Potencia", "102 HP"], ["Estilo", "Gran Turismo"], ["Caja", "DCT automática"]],
      },
      year: 2026,
      image: "assets/images/honda-nt1100.jpg",
      description:
        "Long-haul luxury meets Miami style. DCT transmission, top case included — everything you need to explore South Florida.",
      specs: [
        ["Engine", "1084cc Parallel Twin"],
        ["Power", "102 HP"],
        ["Style", "Grand Tourer"],
        ["Gearbox", "DCT Auto"],
      ],
      url: "https://www.riders-share.com/listing/EAeaW4doc22d6nh6G/ref-NelsonManuelp+WYKZD",
    },
    {
      tag: "The Dark Horse",
      name: "Harley-Davidson Nightster",
      match: "Nightster",
      gearbox: "6-speed manual",
      seat: "27.8 in (705 mm)",
      passenger: "Comfortable passenger seat",
      luggage: "None — travel light",
      bestFor: "Low seat, cruiser attitude",
      who: [
        "Riders who like a low seat and both feet flat on the ground",
        "Evening cruises through the streets of Miami",
        "Harley fans who want the modern, liquid-cooled take",
      ],
      photos: [],
      video: "",
      es: {
        tag: "La Oscura",
        description:
          "Puro músculo americano. La Nightster está hecha para disfrutar el camino, no el destino. Actitud cruiser con prestaciones modernas.",
        gearbox: "Manual de 6 velocidades",
        passenger: "Asiento cómodo para acompañante",
        luggage: "Sin maletas — viaja ligero",
        bestFor: "Asiento bajo, actitud cruiser",
        who: [
          "Para quien prefiere un asiento bajo y los dos pies en el suelo",
          "Paseos al atardecer por las calles de Miami",
          "Fans de Harley que quieren la versión moderna, refrigerada por líquido",
        ],
        specs: [["Motor", "Revolution Max 975cc"], ["Potencia", "90 HP"], ["Estilo", "Cruiser"], ["Onda", "Oscura y ruda"]],
      },
      year: 2026,
      image: "assets/images/harley-nightster.jpg",
      description:
        "Raw American muscle. The Nightster is built for the ride, not the destination. Cruiser attitude with modern performance.",
      specs: [
        ["Engine", "975cc Revolution Max"],
        ["Power", "90 HP"],
        ["Style", "Cruiser"],
        ["Vibe", "Dark & Mean"],
      ],
      url: "https://www.riders-share.com/listing/ynyFmqSogoD8MXa2M/ref-NelsonManuelp+WYKZD",
    },
    {
      tag: "The Ride",
      name: "BMW F 800 GS",
      match: "F 800 GS",
      gearbox: "6-speed manual",
      seat: "32.1 in (815 mm)",
      passenger: "Very good — carries two with ease",
      luggage: "Top case included",
      bestFor: "One bike for everything",
      who: [
        "Riders who want one bike for city, highway and back roads",
        "Riding two-up with luggage",
        "An upright, commanding riding position",
      ],
      photos: [],
      video: "",
      es: {
        tag: "La Aventurera",
        description:
          "Lista para la aventura y hábil en la ciudad. La F 800 GS domina las calles de Miami y las carreteras de Florida con la misma confianza. Top case incluido.",
        gearbox: "Manual de 6 velocidades",
        passenger: "Muy buena — lleva a dos con facilidad",
        luggage: "Top case incluido",
        bestFor: "Una moto para todo",
        who: [
          "Para quien quiere una sola moto para ciudad, autopista y carreteras secundarias",
          "Viajar en pareja con equipaje",
          "Posición de manejo erguida y dominante",
        ],
        specs: [["Motor", "Bicilíndrico paralelo 853cc"], ["Potencia", "87 HP"], ["Estilo", "Aventura"], ["Color", "Blanco / Negro"]],
      },
      year: 2024,
      image: "assets/images/bmw-f800gs.jpg",
      description:
        "Adventure-ready and street-savvy. The F 800 GS conquers Miami streets and Florida backroads with equal confidence. Top case included.",
      specs: [
        ["Engine", "853cc Parallel Twin"],
        ["Power", "87 HP"],
        ["Style", "Adventure"],
        ["Color", "White / Black"],
      ],
      url: "https://www.riders-share.com/listing/FN33jkyKFmo67YCjk/ref-NelsonManuelp+WYKZD",
    },
  ],

  // Gallery: add files under assets/ and list them here.
  // For videos use type: "video" (mp4 recommended).
  gallery: [
    { type: "image", src: "assets/images/bmw-r-ninet-scrambler.jpg", label: "BMW R nineT Scrambler" },
    { type: "image", src: "assets/images/honda-nt1100.jpg", label: "Honda NT1100" },
    { type: "image", src: "assets/images/harley-nightster.jpg", label: "Harley-Davidson Nightster" },
    { type: "image", src: "assets/images/bmw-f800gs.jpg", label: "BMW F 800 GS" },
  ],

  // Newest first. Text is copied from Riders Share as written by each rider.
  reviews: [
    { name: "Camilo", bike: "2026 Honda NT1100 DCT", date: "Sep 2026", text: "Excelente todo viaje y moto ok" },
    {
      name: "Alvaro",
      bike: "2024 BMW F 800 GS",
      date: "Sep 2026",
      text: "The process of rental was flawless and quick. For those in Doral, this location is very convenient. The motorcycle was in perfect condition and responded very well even with 2 persons. I especially like the fact that you can pay tolls later being deducted from deposit",
    },
    { name: "Juan", bike: "2022 BMW F 900 XR", date: "Aug 2026", text: "Nelson fue super amable todo el tiempo. Las motos en perfectas condiciones." },
    { name: "Joseph", bike: "2026 Honda NT1100 DCT", date: "Jul 2026", text: "Excellent service and bike rental! Thanks, Nelson!" },
    {
      name: "Daniel",
      bike: "2022 BMW F 900 XR",
      date: "Jul 2026",
      text: "Nelson es una persona que cumple con lo pactado. Me gustó mucho la forma ágil de entregarnos las motos y la verdad un caballero. Muy agradecido por su atención y lo recomiendo para todos aquellos que quieran recorrer EE UU en moto. Las motos impecables y gracias Nelson",
    },
    { name: "César", bike: "2026 Honda NT1100 DCT", date: "Jul 2026", text: "Nelson es un caballero, amable, paciente y lo recomiendo!!!!!!" },
    {
      name: "Vladislav",
      bike: "2022 BMW F 900 XR",
      date: "May 2026",
      text: "Amazing host and amazing bike! Highly recommended to anyone looking for a motorcycle to rent, especially this specific bike!",
    },
    { name: "Edric", bike: "2026 Honda NT1100 DCT", date: "May 2026", text: "Mr. Nelson is top renter, friendly and easy to communicate. I definitely recommended." },
    {
      name: "Bilal",
      bike: "2026 Harley-Davidson Nightster",
      date: "May 2026",
      text: "Mr Nelson was an amazing host, very accommodating, and flexible. The bike was also in amazing condition, perfect for the streets of Miami. Passenger seat also super comfortable and definitely recommended for anyone visiting Miami alone or as a couple. 5 stars.",
    },
    { name: "Daniel", bike: "2026 Harley-Davidson Nightster", date: "May 2026", text: "Súper recomendable!!!" },
    {
      name: "Micce",
      bike: "2022 BMW F 900 XR",
      date: "Apr 2026",
      text: "A bike in perfect condition and very easy pickup and when we left the bike. Well organized and easy to chat with! Definitely recommend him.",
    },
  ],

  // "How it works" steps.
  steps: [
    { en: ["Pick your bike", "Choose from our four machines, or take the 30-second quiz."],
      es: ["Elige tu moto", "Escoge entre nuestras cuatro máquinas, o haz el test de 30 segundos."] },
    { en: ["Book on Riders Share", "Tap “Rent this bike”. Riders Share handles payment, licence check and insurance."],
      es: ["Reserva en Riders Share", "Toca “Rentar esta moto”. Riders Share gestiona el pago, la licencia y el seguro."] },
    { en: ["Pick it up", "Meet Nelson in the Miami area. A quick walk-around of the bike and you're set."],
      es: ["Recógela", "Te encuentras con Nelson en el área de Miami. Un repaso rápido de la moto y listo."] },
    { en: ["Ride", "The road is yours. Bring it back at the agreed time."],
      es: ["A rodar", "La carretera es tuya. Devuélvela a la hora acordada."] },
  ],

  // "What's included" list.
  included: [
    { en: "Insurance through Riders Share on every booking", es: "Seguro a través de Riders Share en cada reserva" },
    { en: "Top case on the Honda NT1100 and BMW F 800 GS", es: "Top case en la Honda NT1100 y la BMW F 800 GS" },
    { en: "Clean, well-maintained bikes — see the reviews", es: "Motos limpias y bien mantenidas — mira las reseñas" },
    { en: "A 5-star Power Owner host", es: "Un anfitrión Power Owner de 5 estrellas" },
    { en: "We speak English and Spanish", es: "Hablamos español e inglés" },
  ],

  // Frequently asked questions: [question, answer].
  faq: [
    { en: ["How do I book?", "Pick a bike and tap “Rent this bike”. You finish the booking on Riders Share, which handles the payment, licence verification and insurance."],
      es: ["¿Cómo reservo?", "Elige una moto y toca “Rentar esta moto”. Terminas la reserva en Riders Share, que gestiona el pago, la verificación de la licencia y el seguro."] },
    { en: ["What licence do I need?", "A valid motorcycle licence or endorsement. Riders Share verifies it when you book."],
      es: ["¿Qué licencia necesito?", "Una licencia de moto válida. Riders Share la verifica al reservar."] },
    { en: ["I'm visiting from another country. Can I rent?", "Yes — many of our riders are international visitors. Riders Share checks your licence during booking and shows you exactly what it needs. Bring your passport and your home licence to pickup."],
      es: ["Vengo de otro país. ¿Puedo rentar?", "Sí — muchos de nuestros clientes son visitantes internacionales. Riders Share revisa tu licencia durante la reserva y te indica exactamente qué necesita. Trae tu pasaporte y tu licencia el día de la entrega."] },
    { en: ["Is insurance included?", "Bookings through Riders Share include insurance coverage. The coverage options and details are shown at checkout."],
      es: ["¿El seguro está incluido?", "Las reservas en Riders Share incluyen cobertura de seguro. Las opciones y los detalles aparecen al pagar."] },
    { en: ["Where do I pick up the bike?", "In the Miami area, near Doral. You get the exact address once your booking is confirmed."],
      es: ["¿Dónde recojo la moto?", "En el área de Miami, cerca de Doral. Recibes la dirección exacta cuando se confirma tu reserva."] },
    { en: ["How do the deposit and tolls work?", "Riders Share shows the deposit at checkout. Tolls from your trip are settled after you return, so you never have to stop and pay."],
      es: ["¿Cómo funcionan el depósito y los peajes?", "Riders Share muestra el depósito al pagar. Los peajes de tu viaje se liquidan al devolver la moto, así que no tienes que parar a pagar."] },
    { en: ["Can I bring a passenger?", "Yes, all four bikes carry a passenger. The Honda NT1100 and BMW F 800 GS are the most comfortable for two and come with a top case."],
      es: ["¿Puedo llevar acompañante?", "Sí, las cuatro motos llevan acompañante. La Honda NT1100 y la BMW F 800 GS son las más cómodas para dos y traen top case."] },
    { en: ["Do I have to wear a helmet?", "Florida law requires a helmet if you are under 21. Riders 21 and over may ride without one only if they carry at least $10,000 in medical insurance. We strongly recommend always wearing one — ask us about gear before your trip."],
      es: ["¿Es obligatorio el casco?", "La ley de Florida exige casco a menores de 21 años. Los mayores de 21 pueden ir sin casco solo si tienen un seguro médico de al menos $10,000. Recomendamos usarlo siempre — pregúntanos por el equipo antes de tu viaje."] },
    { en: ["Can I change or cancel my booking?", "Changes and cancellations follow the Riders Share policy shown when you book."],
      es: ["¿Puedo cambiar o cancelar mi reserva?", "Los cambios y cancelaciones siguen la política de Riders Share que aparece al reservar."] },
    { en: ["Do you speak Spanish?", "Yes. Hablamos español."],
      es: ["¿Hablan español?", "Sí, claro. También hablamos inglés."] },
  ],

  // Rider wall: customer photos (ask permission first). Hidden while empty.
  // { src: "assets/riders/maria.jpg", name: "María", bike: "Honda NT1100", from: "Colombia" }
  riders: [],
};
