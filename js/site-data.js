/*
 * ============================================================
 *  MIAMI BIKES RENTALS — SITE CONTENT
 *  Edit this file to change bikes, links, gallery and reviews.
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

  bikes: [
    {
      tag: "The Scrambler",
      name: "BMW R nineT Scrambler",
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
};
