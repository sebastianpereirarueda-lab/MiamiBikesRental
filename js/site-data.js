/*
 * ============================================================
 *  MIAMI BIKES RENTALS — SITE CONTENT
 *  Edit this file to change bikes, links, gallery and reviews.
 *  No other file needs to change for normal content updates.
 * ============================================================
 */
window.SITE = {
  // Main Riders Share links. Replace the "#" placeholders with your real URLs.
  ridersShareProfile: "#", // "See all reviews" + "Contact us here" buttons
  contactUrl: "#",          // "Contact us here" button (can be same as profile)

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

  reviews: [
    { text: "Excelente todo viaje y moto ok", name: "Camilo", bike: "Honda NT1100", date: "Sep 2026" },
    {
      text: "The process of rental was flawless and quick. For those in Doral, this location is very convenient. The motorcycle was in perfect condition.",
      name: "Alvaro",
      bike: "BMW F 800 GS",
      date: "Sep 2026",
    },
    {
      text: "Nelson fue super amable todo el tiempo. Las motos en perfectas condiciones.",
      name: "Juan",
      bike: "BMW F 900 XR",
      date: "Aug 2026",
    },
  ],
};
