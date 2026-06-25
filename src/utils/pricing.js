// Pricing, routes, and coordinate data for Premier Lanka Tours

export const EXCHANGE_RATE = 300; // 1 USD = 300 LKR

export const DESTINATIONS = {
  negombo: {
    name: "Negombo",
    coords: { x: 115, y: 325 },
    description: "Golden sandy beaches & historic Dutch canals near the airport.",
    rates: {
      bia: { priceUSD: 18, time: "20 mins", distance: "12 km" },
      colombo: { priceUSD: 30, time: "45 mins", distance: "38 km" }
    }
  },
  sigiriya: {
    name: "Sigiriya",
    coords: { x: 210, y: 220 },
    description: "The ancient Lion Rock fortress & stunning cultural triangle.",
    rates: {
      bia: { priceUSD: 85, time: "4h 0m", distance: "150 km" },
      colombo: { priceUSD: 95, time: "4h 30m", distance: "175 km" }
    }
  },
  kandy: {
    name: "Kandy",
    coords: { x: 200, y: 300 },
    description: "Sacred Temple of the Tooth & lush botanical gardens in the hills.",
    rates: {
      bia: { priceUSD: 70, time: "3h 0m", distance: "115 km" },
      colombo: { priceUSD: 75, time: "3h 30m", distance: "120 km" }
    }
  },
  nuwara_eliya: {
    name: "Nuwara Eliya",
    coords: { x: 210, y: 360 },
    description: "Misty tea estates, waterfalls, and cool colonial charm.",
    rates: {
      bia: { priceUSD: 95, time: "4h 45m", distance: "160 km" },
      colombo: { priceUSD: 100, time: "5h 0m", distance: "170 km" }
    }
  },
  ella: {
    name: "Ella",
    coords: { x: 240, y: 380 },
    description: "Scenic hikes, Nine Arch Bridge, and panoramic mountain passes.",
    rates: {
      bia: { priceUSD: 120, time: "5h 30m", distance: "210 km" },
      colombo: { priceUSD: 125, time: "5h 45m", distance: "220 km" }
    }
  },
  galle: {
    name: "Galle",
    coords: { x: 130, y: 480 },
    description: "UNESCO Dutch Fort, cobblestone streets, and ocean views.",
    rates: {
      bia: { priceUSD: 85, time: "2h 15m", distance: "155 km" },
      colombo: { priceUSD: 75, time: "2h 0m", distance: "125 km" }
    }
  },
  mirissa: {
    name: "Mirissa",
    coords: { x: 160, y: 495 },
    description: "Coconut tree hills, whale watching, and laid-back surf vibes.",
    rates: {
      bia: { priceUSD: 95, time: "2h 45m", distance: "175 km" },
      colombo: { priceUSD: 85, time: "2h 30m", distance: "150 km" }
    }
  },
  bentota: {
    name: "Bentota",
    coords: { x: 110, y: 420 },
    description: "Thrilling water sports, river safaris, and premium beach resorts.",
    rates: {
      bia: { priceUSD: 65, time: "1h 45m", distance: "110 km" },
      colombo: { priceUSD: 55, time: "1h 30m", distance: "80 km" }
    }
  },
  yala: {
    name: "Yala",
    coords: { x: 280, y: 450 },
    description: "Thriving national park home to leopards, elephants, and birds.",
    rates: {
      bia: { priceUSD: 135, time: "5h 0m", distance: "250 km" },
      colombo: { priceUSD: 130, time: "4h 45m", distance: "280 km" }
    }
  }
};

// Base coordinates for starting locations
export const START_COORDS = {
  bia: { name: "BIA Airport", x: 112, y: 345 },
  colombo: { name: "Colombo City", x: 120, y: 370 }
};

export const HOTEL_TIERS = {
  budget: {
    id: "budget",
    name: "Budget Homestay",
    pricePerNightUSD: 20,
    description: "Charming family-run guesthouses, clean rooms, local Sri Lankan home-cooked breakfast.",
    hotels: {
      negombo: "Negombo Beachside Villa",
      sigiriya: "Sigiriya River View Lodge",
      kandy: "Kandy Hilltop Homestay",
      nuwara_eliya: "Misty Mountain Cottage",
      ella: "Ella View Guesthouse",
      galle: "Fort Edge Homestay",
      mirissa: "Mirissa Surf Cabanas",
      bentota: "River Breeze Guest",
      yala: "Jungle Vista Homestay"
    }
  },
  standard: {
    id: "standard",
    name: "Standard Comfort",
    pricePerNightUSD: 55,
    description: "Highly-rated 3-star hotels & boutique villas featuring A/C, swimming pools, and hot showers.",
    hotels: {
      negombo: "Camelot Beach Hotel",
      sigiriya: "Sigiriya Village Resort",
      kandy: "Oak Ray Regency Hotel",
      nuwara_eliya: "Ramboda Falls Hotel",
      ella: "Oak Ray Ella Gap",
      galle: "Galle Fort Hotel (Standard)",
      mirissa: "Paradise Beach Club",
      bentota: "Bentota Beachside Resort",
      yala: "Yala Wild Coast Lodge (Standard)"
    }
  },
  luxury: {
    id: "luxury",
    name: "Premium Boutique",
    pricePerNightUSD: 140,
    description: "Premium 4/5-star boutique hotels, eco-lodges, infinity pools, and fine dining.",
    hotels: {
      negombo: "Jetwing Blue Resort",
      sigiriya: "Heritance Kandalama (Eco-Luxury)",
      kandy: "The Grand Kandyan",
      nuwara_eliya: "The Grand Hotel Nuwara Eliya",
      ella: "98 Acres Resort & Spa",
      galle: "Jetwing Lighthouse Galle",
      mirissa: "Sri Sharavi Beach Villas",
      bentota: "Cinnamon Bentota Beach",
      yala: "Cinnamon Wild Yala"
    }
  }
};

export const PRESET_ROUTES = [
  {
    id: "route1",
    name: "Relax & Culture Quick Loop",
    days: 3,
    description: "Ideal for short holidays. Land at BIA, relax by Negombo beach overnight, climb Sigiriya Fortress on Day 2, and explore Kandy before returning.",
    stops: ["negombo", "sigiriya", "kandy"],
    startPoint: "bia",
    costPerDayUSD: 65, // Base vehicle + fuel + driver fee per day
    hotelTierDefault: "standard"
  },
  {
    id: "route2",
    name: "Grand Lanka Adventure",
    days: 7,
    description: "Our bestseller. Covers the cultural triangle, Kandy tea plantations, beautiful train ride to Ella, a leopard safari in Yala, and relaxing beaches in Mirissa.",
    stops: ["negombo", "sigiriya", "kandy", "nuwara_eliya", "ella", "yala", "mirissa"],
    startPoint: "bia",
    costPerDayUSD: 60,
    hotelTierDefault: "standard"
  }
];

export const DRIVER_CONTACT = "+94771234567"; // Mock driver WhatsApp number (Sri Lanka format)
