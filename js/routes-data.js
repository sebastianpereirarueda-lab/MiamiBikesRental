/*
 * ============================================================
 *  MIAMI BIKES RENTALS — RIDE ROUTES
 *  Each route: stops are [name, lat, lng, labelPosition?] where the optional
 *  label position is "r", "l", "t", "b" or "none" (to fix overlapping labels). They draw the mini map and
 *  build the "Open in Google Maps" link (first stop = start, last = end).
 *  Distances and times are approximate riding totals.
 * ============================================================
 */
window.ROUTES = [
  {
    tag: "The Island One",
    title: "Overseas Highway to Key West",
    summary:
      "The bucket-list ride. Leave Miami on US-1, cross into the Keys at Key Largo and ride 42 bridges over open water — including the Seven Mile Bridge — all the way to Mile 0 in Key West.",
    start: "Downtown Miami",
    miles: "165 mi one way",
    time: "4–5 hrs",
    level: "Easy",
    bike: "Honda NT1100 or BMW F 800 GS (top case for an overnight bag)",
    tips: [
      "Leave early — US-1 through the Keys is mostly one lane each way and slows down after 10am.",
      "Fill up in Florida City, Islamorada and Marathon. Crosswinds on the long bridges are real; keep a relaxed grip.",
    ],
    tags: ["US-1", "Key Largo", "Islamorada", "Seven Mile Bridge", "Bahia Honda", "Key West"],
    stops: [
      ["Downtown Miami", 25.7743, -80.1937],
      ["Florida City", 25.4479, -80.4792],
      ["Key Largo", 25.0865, -80.4473],
      ["Islamorada", 24.9243, -80.6278],
      ["Marathon", 24.7136, -81.0904],
      ["Seven Mile Bridge", 24.7, -81.17, "none"],
      ["Big Pine Key", 24.6696, -81.354, "t"],
      ["Key West", 24.5551, -81.78],
    ],
  },
  {
    tag: "The Day Trip",
    title: "Key Largo Loop via Card Sound Road",
    summary:
      "All the island vibes without the full Keys commitment. Tree-lined Old Cutler Road and the Homestead farmlands, then the quiet Card Sound Road bridge into Key Largo, and back up US-1 through Florida City.",
    start: "Coconut Grove",
    miles: "130 mi loop",
    time: "3–4 hrs",
    level: "Easy",
    bike: "Any bike in the fleet",
    tips: [
      "Card Sound Road has a small cashless toll — it's charged to your plate and settled after the rental.",
      "Alabama Jack's at the foot of the Card Sound bridge is the classic biker lunch stop.",
    ],
    tags: ["Old Cutler Road", "Homestead", "Card Sound Road", "Key Largo", "US-1"],
    stops: [
      ["Coconut Grove", 25.7281, -80.2414],
      ["Old Cutler Road", 25.6767, -80.2756],
      ["Homestead", 25.4687, -80.4776, "r"],
      ["Card Sound Road", 25.3173, -80.3739],
      ["Key Largo", 25.0865, -80.4473],
      ["Florida City", 25.4479, -80.4792, "l"],
      ["Coconut Grove", 25.7281, -80.2414],
    ],
  },
  {
    tag: "The Wild One",
    title: "Tamiami Trail to Everglades City",
    summary:
      "Straight into the River of Grass on US-41. Stop at Shark Valley, ride Loop Road through Big Cypress where gators sun themselves next to the pavement, then finish with stone crabs in Everglades City.",
    start: "Downtown Miami",
    miles: "180 mi round trip",
    time: "5–6 hrs",
    level: "Moderate",
    bike: "BMW F 800 GS for Loop Road; any bike if you stay on US-41",
    warning:
      "Loop Road is unpaved in sections and can get muddy after rain. It's optional — stay on US-41 to skip it. There is no fuel between the Miami suburbs and Everglades City, so fill up before you leave.",
    tips: ["Bring water and bug spray. Mornings are cooler and the wildlife is more active."],
    tags: ["Tamiami Trail", "Shark Valley", "Loop Road", "Big Cypress", "Everglades City"],
    stops: [
      ["Downtown Miami", 25.7743, -80.1937, "t"],
      ["Shark Valley", 25.7617, -80.7656, "b"],
      ["Loop Road", 25.7609, -80.82, "t"],
      ["Monroe Station", 25.8617, -81.1031, "b"],
      ["Everglades City", 25.857, -81.3856, "t"],
    ],
  },
  {
    tag: "The Coastal One",
    title: "A1A Coastal Cruise to Fort Lauderdale",
    summary:
      "Ocean on your right the whole way. Start at South Pointe, ride Collins Avenue past the Art Deco hotels and Bal Harbour, then A1A through Hollywood Beach to the Fort Lauderdale strip. Keep going to Palm Beach for a full day.",
    start: "South Pointe Park, Miami Beach",
    miles: "30 mi one way (75 mi to Palm Beach)",
    time: "1.5 hrs (3 hrs to Palm Beach)",
    level: "Easy",
    bike: "Harley-Davidson Nightster or BMW R nineT Scrambler",
    tips: ["Weekday mornings are best — A1A crawls on weekend afternoons.", "Take I-95 back if you're short on time."],
    tags: ["Ocean Drive", "Collins Ave", "Bal Harbour", "Hollywood Beach", "Fort Lauderdale"],
    stops: [
      ["South Pointe", 25.7653, -80.1341],
      ["Bal Harbour", 25.8915, -80.1268],
      ["Sunny Isles Beach", 25.9445, -80.1207, "none"],
      ["Hallandale Beach", 25.9858, -80.1187, "none"],
      ["Hollywood Beach", 26.0112, -80.1166],
      ["Dania Beach", 26.0526, -80.1142, "none"],
      ["Fort Lauderdale Beach", 26.1224, -80.1043],
    ],
  },
  {
    tag: "The Sunset One",
    title: "Key Biscayne & Rickenbacker Causeway",
    summary:
      "Short, scenic and unbeatable at golden hour. Cross the Rickenbacker Causeway with the Miami skyline behind you, cruise through Virginia Key and Crandon Park, and end at the Cape Florida Lighthouse.",
    start: "Brickell",
    miles: "22 mi round trip",
    time: "1 hr",
    level: "Easy",
    bike: "Any bike in the fleet",
    tips: [
      "The causeway has a cashless toll, charged to the plate after the rental.",
      "Bill Baggs Cape Florida State Park charges a small entry fee per vehicle.",
    ],
    tags: ["Brickell", "Rickenbacker Causeway", "Virginia Key", "Crandon Park", "Cape Florida Lighthouse"],
    stops: [
      ["Brickell", 25.7617, -80.1918],
      ["Rickenbacker Causeway", 25.7445, -80.18, "l"],
      ["Virginia Key", 25.7377, -80.1576],
      ["Crandon Park", 25.7085, -80.1548],
      ["Cape Florida Lighthouse", 25.6665, -80.1556],
    ],
  },
  {
    tag: "The City One",
    title: "Miami City Loop: Wynwood to Ocean Drive",
    summary:
      "See the whole city in one ride. Brickell's towers, Wynwood's murals and the Design District, then over the Julia Tuttle Causeway to Miami Beach, down Ocean Drive and back over the MacArthur Causeway.",
    start: "Brickell",
    miles: "25 mi loop",
    time: "1.5 hrs (plus stops)",
    level: "Easy",
    bike: "BMW R nineT Scrambler or Harley-Davidson Nightster",
    tips: ["Ocean Drive is slow and busy at night — that's the point. Park and walk for a bit."],
    tags: ["Brickell", "Wynwood", "Design District", "Julia Tuttle Causeway", "Ocean Drive", "MacArthur Causeway"],
    stops: [
      ["Brickell", 25.7617, -80.1918],
      ["Wynwood", 25.8008, -80.1994],
      ["Design District", 25.8131, -80.1925, "t"],
      ["Julia Tuttle Causeway", 25.8106, -80.16, "b"],
      ["Miami Beach", 25.8132, -80.1226, "t"],
      ["Ocean Drive", 25.7814, -80.1301],
      ["MacArthur Causeway", 25.7782, -80.165, "b"],
      ["Brickell", 25.7617, -80.1918],
    ],
  },
];
