import maraExImage from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 1.jpg';
import DubaiSkyImage from '../assets/Dubai sky.jpeg';
import Swahili from '../assets/swahili.jpg';
import Nairobi from '../assets/JAMAL LABELED IMAGES/GIRAFFE CENTRE SHOT.jpg';
import Homabay from '../assets/Homabay.jpg';
import Ambo from '../assets/Ambo.jpg';
import Hotair from '../assets/hotair.png';
import SAC from '../assets/SAC.jfif';
import Tsavo from '../assets/Tsavo west.jpg';
import Rally from '../assets/Rally accomodation.jpg';
import Saf from '../assets/saf.jpeg';
import Seychelles from '../assets/Seychelles.jpg';
import Luxury1 from '../assets/LUXURY 1.jpg';

export const tours = [
  {
    id: "kenyas-grand-classic-safari",
    currency: "KES",
    title: "Kenya's Grand Classic Safari",
    price: 52000,
    duration: "4 Days 3 Nights",
    location: "Amboseli, Kenya",
    image: Ambo,
    tag: "Ultra-Luxury",
    description: "Set against the magnificent backdrop of Africa's highest mountain, Amboseli National Park offers one of Kenya's most iconic safari experiences. Renowned for its large elephant herds, stunning landscapes, and spectacular views of Mount Kilimanjaro.",
    fullDescription: "Set against the magnificent backdrop of Africa's highest mountain, Amboseli National Park offers one of Kenya's most iconic safari experiences. Renowned for its large elephant herds, stunning landscapes, and spectacular views of Mount Kilimanjaro, this four-day adventure combines exceptional wildlife encounters with breathtaking scenery. From open savannahs and seasonal wetlands to acacia woodlands teeming with wildlife, Amboseli promises unforgettable moments for nature lovers, photographers, families, and first-time safari travellers alike.",
    highlights: [
      { title: "Mount Kilimanjaro Views", description: "Spectacular views of Africa's highest mountain as a dramatic backdrop to your safari." },
      { title: "Elephant Herds", description: "Large herds of free-roaming elephants — some of Africa's most relaxed and photogenic." },
      { title: "Big Cat Country", description: "Excellent opportunities to spot lions, cheetahs, buffaloes and giraffes across open plains." },
      { title: "Game Drives", description: "Morning and afternoon game drives timed for the best wildlife activity and light." },
      { title: "Photography", description: "Outstanding wildlife photography opportunities with iconic Kilimanjaro backdrops." },
      { title: "Birdlife", description: "Diverse birdlife and scenic landscapes across wetlands, savannah and acacia woodland." }
    ],
    itinerary: [
      {
        day: 1,
        title: "Nairobi – Amboseli National Park",
        description: "Your safari adventure begins with an early morning departure from Nairobi. Travel south through the picturesque Kenyan countryside towards Amboseli National Park, arriving in time for lunch at your selected lodge or camp. After some time to relax and enjoy the surrounding scenery, depart for your first afternoon game drive. Amboseli's vast plains provide excellent opportunities to encounter elephants, buffaloes, zebras, wildebeests and numerous antelope species. On clear days, Mount Kilimanjaro provides a spectacular backdrop for photography. Return to your lodge as the sun sets over the African wilderness.",
        meals: "Lunch & Dinner"
      },
      {
        day: 2,
        title: "Full Day Amboseli Safari Experience",
        description: "Wake up to breathtaking views and enjoy an early breakfast before setting out for a full day of exploration within the park. Visit Amboseli's famous swamps and wetlands, sustained by underground rivers flowing from Mount Kilimanjaro. These fertile areas attract wildlife throughout the year and provide excellent opportunities for close wildlife encounters. Spend the day searching for elephants, lions, hyenas, cheetahs and a variety of bird species while learning about the ecosystem from your experienced safari guide. Return to your lodge in the evening.",
        meals: "Breakfast, Lunch & Dinner"
      },
      {
        day: 3,
        title: "Another Day in Amboseli",
        description: "Enjoy another rewarding day in the park as you continue exploring different sections of Amboseli National Park. Early morning and late afternoon game drives offer the best opportunities to witness wildlife activity. Capture unforgettable images of elephants crossing the plains beneath the snow-capped peaks of Mount Kilimanjaro. Optional visits to a traditional Maasai village can be arranged at an additional cost for those interested in experiencing local culture and traditions. Dinner and overnight at your lodge.",
        meals: "Breakfast, Lunch & Dinner"
      },
      {
        day: 4,
        title: "Amboseli – Nairobi",
        description: "Enjoy breakfast at your lodge before checking out and beginning your journey back to Nairobi. Arrive in the afternoon with incredible memories of Kenya's spectacular wildlife, breathtaking landscapes and unforgettable safari experiences.",
        meals: "Breakfast"
      }
    ],
    accommodations: [
      {
        name: "AA LODGE AMBOSELI",
        location: "AMBOSELI, KENYA",
        category: "Budget",
        description: "Budget-friendly lodge with comfortable rooms and excellent views of Kilimanjaro.",
        rates: {
          KES: { single: "From 52,000", sharing2pax: "From 42,000", sharing4pax: "From 36,000" },
          USD: { single: "From 780", sharing2pax: "From 620", sharing4pax: "From 520" }
        },
        facilities: ["Restaurant", "Bar", "Swimming Pool", "Wi-Fi", "Game Drives"]
      },
      {
        name: "AMBOSELI SOPA LODGE",
        location: "AMBOSELI, KENYA",
        category: "Mid-Range",
        description: "Mid-range lodge offering spacious rooms, stunning Kilimanjaro views and excellent amenities.",
        rates: {
          KES: { single: "From 68,000", sharing2pax: "From 56,000", sharing4pax: "From 49,000", sharing6pax: "From 33,000", sharing8pax: "From 45,000" },
          USD: { single: "From 1,050", sharing2pax: "From 840", sharing4pax: "From 710", sharing6pax: "From 470", sharing8pax: "From 650" }
        },
        facilities: ["Restaurant", "Bar", "Swimming Pool", "Spa", "Wi-Fi", "Game Drives", "Cultural Visits"]
      },
      {
        name: "AMBOSELI SERENA SAFARI LODGE",
        location: "AMBOSELI, KENYA",
        category: "Luxury",
        description: "Luxury lodge blending seamlessly with the natural environment, offering world-class service.",
        rates: {
          KES: { single: "From 98,000", sharing2pax: "From 82,000", sharing4pax: "From 74,000", sharing6pax: "From 69,000" },
          USD: { single: "From 1,520", sharing2pax: "From 1,220", sharing4pax: "From 1,030", sharing6pax: "From 950" }
        },
        facilities: ["Restaurant", "Bar", "Swimming Pool", "Spa", "Wi-Fi", "Game Drives", "Cultural Visits", "Gym"]
      },
      {
        name: "OL TUKAI LODGE",
        location: "AMBOSELI, KENYA",
        category: "Luxury",
        description: "Premier luxury lodge at the heart of Amboseli, with unrivalled Kilimanjaro and elephant views.",
        rates: {
          KES: { single: "From 108,000", sharing2pax: "From 92,000", sharing4pax: "From 84,000", sharing6pax: "From 79,000" },
          USD: { single: "From 1,650", sharing2pax: "From 1,320", sharing4pax: "From 1,120", sharing6pax: "From 1,030" }
        },
        facilities: ["Restaurant", "Bar", "Swimming Pool", "Spa", "Wi-Fi", "Game Drives", "Bush Walks", "Gym"]
      }
    ],
    inclusions: [
      "Transport in a 4x4 Safari Land Cruiser with pop-up roof",
      "Services of a professional English-speaking driver-guide",
      "Accommodation in selected lodge or camp",
      "Meals as specified in the itinerary",
      "Game drives as outlined in the itinerary",
      "Bottled drinking water during safari",
      "Government taxes and levies where applicable",
      "Pick-up and drop-off within Nairobi"
    ],
    exclusions: [
      "Park fees and conservancy fees",
      "International and domestic flights",
      "Visa fees",
      "Travel and medical insurance",
      "Balloon safari",
      "Maasai village visits",
      "Alcoholic and premium beverages",
      "Laundry services",
      "Tips and gratuities",
      "Personal expenses",
      "Any item not specifically mentioned under inclusions"
    ],
    notes: "Park fees are excluded from package rates and are payable at prevailing rates set by the relevant conservation authorities. Park fees are subject to change without prior notice. Rates are subject to availability, seasonality, room occupancy and changes in government taxes and conservation levies."
  },
  {
    id: "exclusive-maasai-mara",
    currency: "USD",
    title: "Exclusive Maasai Mara Safari Expedition",
    price: 71500,
    duration: "3 Days 2 Nights",
    location: "Maasai Mara, Kenya",
    image: Hotair,
    tag: "Best Seller",
    description: "Experience the magic of the Maasai Mara with our exclusive expedition. Witness the Great Migration, enjoy luxury tented camps, and embark on thrilling game drives led by expert guides.",
    itinerary: [
      { day: 1, title: 'Flight to Mara & Evening Game Drive', description: 'Depart from Nairobi for a scenic flight to the Maasai Mara. Upon arrival, transfer to your luxury tented camp. After lunch, enjoy your first evening game drive in search of the Big Five.' },
      { day: 2, title: 'Full Day Game Observation', description: 'Early morning breakfast followed by a full day of game viewing. Picnic lunch will be served in the heart of the savanna. Witness the vast herds and the predators that follow them.' },
      { day: 3, title: 'Cultural Visit & Departure', description: 'Visit a traditional Maasai village to learn about their ancient culture and traditions. After lunch, transfer to the airstrip for your flight back to Nairobi.' }
    ],
    inclusions: [
      'Return flights from Nairobi',
      'Luxury tented camp accommodation',
      'All meals and selected drinks',
      'Daily guided game drives',
      'Maasai village visit',
      'Park entrance fees'
    ]
  },
  {
    id: "dubai-skyline",
    currency: "USD",
    title: "Dubai Skyline & Luxury Desert Escape",
    price: 262500,
    duration: "5 Days 4 Nights",
    location: "Dubai, UAE",
    image: DubaiSkyImage,
    tag: "Top Rated",
    description: "A perfect blend of modern luxury and traditional desert adventure. Stay in world-class skyscrapers and enjoy a private desert safari under the stars.",
    itinerary: [
      { day: 1, title: 'Arrival in the City of Gold', description: 'Transfer from Dubai International Airport to your 5-star hotel. Evening dinner cruise at Dubai Marina.' },
      { day: 2, title: 'Modern Dubai Tour & Burj Khalifa', description: 'Visit the Dubai Mall, watch the Fountain Show, and head to the At The Top observatory of Burj Khalifa. Afternoon at leisure.' },
      { day: 3, title: 'Private Desert Safari', description: 'Morning at leisure. Afternoon dune bashing adventure followed by a traditional BBQ dinner in a private desert camp under the stars.' },
      { day: 4, title: 'Old Dubai & Souks', description: "Explore the Al Fahidi Historical Neighborhood, cross the creek in an Abra, and visit the Gold and Spice Souks. Farewell dinner at an authentic Emirati restaurant." },
      { day: 5, title: 'Leisure & Departure', description: 'Final shopping opportunities at the Mall of the Emirates before your private transfer to the airport.' }
    ],
    inclusions: [
      '5-star hotel accommodation',
      'Daily breakfast and select dinners',
      'Private desert safari with BBQ',
      'Burj Khalifa entrance tickets',
      'Private airport transfers',
      'Professional city guides'
    ]
  },
  {
    id: "south-africa-combo",
    currency: "USD",
    title: "South Africa: Cape Town & Safari Combo",
    price: 240432,
    duration: "7 Days 6 Nights",
    location: "Cape Town, SA",
    image: SAC,
    tag: "Luxury",
    description: "Explore the vibrant city of Cape Town before heading into the wild for an unforgettable safari experience in South Africa's premier reserves.",
    itinerary: [
      { day: 1, title: 'Welcome to the Mother City', description: 'Arrive at Cape Town International and transfer to your luxury hotel at the V&A Waterfront.' },
      { day: 2, title: 'Table Mountain & City Sights', description: 'Cable car ride up Table Mountain followed by a guided tour of the Bo-Kaap and Company Gardens.' },
      { day: 3, title: 'Cape Peninsula Expedition', description: "Full day tour to Cape Point, Boulders Beach penguin colony, and the scenic Chapman's Peak Drive." },
      { day: 4, title: 'Flight to the Lowveld', description: 'Morning flight to the Kruger region and transfer to your private safari lodge. Sunset game drive.' },
      { day: 5, title: 'Safari Adventures', description: 'Morning and evening game drives in open vehicles. Bush walks with professional rangers.' },
      { day: 6, title: 'Wildlife Observation', description: 'Tracking the Big Five and learning about the smaller wonders of the African bush. Gala dinner in the boma.' },
      { day: 7, title: 'Farewell Safari', description: 'Final early morning game drive followed by a hearty breakfast and transfer for your flight home.' }
    ],
    inclusions: [
      'Internal flights (CPT to Kruger)',
      'Luxury hotel and safari lodge stays',
      'Most meals and all safari activities',
      'Expert guides and trackers',
      'All park and conservation fees',
      'Private ground transportation'
    ]
  },
  {
    id: "amboseli-kilimanjaro",
    currency: "USD",
    title: "Amboseli & Mt. Kilimanjaro View",
    price: 78000,
    duration: "3 Days 2 Nights",
    location: "Amboseli, Kenya",
    image: Ambo,
    tag: "Photography",
    description: "Capture the iconic views of Mt. Kilimanjaro from Amboseli National Park. Famous for its large herds of elephants and stunning backdrops.",
    itinerary: [
      { day: 1, title: 'Drive to Amboseli', description: 'Depart from Nairobi for Amboseli National Park. Enjoy a scenic drive with views of the Rift Valley. Afternoon game drive with Kilimanjaro backdrop.' },
      { day: 2, title: 'Elephants & Kilimanjaro', description: 'Full day exploring the park. Visit the Observation Hill for panoramic views. Witness the legendary elephant herds of Amboseli.' },
      { day: 3, title: 'Early Morning Drive & Return', description: 'Catch the mountain at its clearest during an early morning drive. After breakfast, depart for Nairobi.' }
    ],
    inclusions: [
      'Ground transport in 4x4 Land Cruiser',
      'Full board lodge accommodation',
      'Experienced driver-guide',
      'Park entrance fees',
      'All taxes and service charges'
    ]
  },
  {
    id: "tsavo-west",
    currency: "USD",
    title: "Tsavo West National Park Exploration",
    price: 273000,
    duration: "3 Days 2 Nights",
    location: "Tsavo West, Kenya",
    image: Tsavo,
    tag: "Premium",
    description: "A luxury exploration of Tsavo West. Visit Mzima Springs, the Shetani Lava Flow, and enjoy exceptional game viewing in one of Kenya's largest parks."
  },
  {
    id: "wrc-safari-rally",
    currency: "USD",
    title: "Exclusive WRC Safari Rally Accommodation",
    price: 23420,
    duration: "Per Night",
    location: "Naivasha, Kenya",
    image: Rally,
    tag: "Latest Deal",
    description: "Experience the thrill of the WRC Safari Rally with our exclusive accommodation packages at Sarova Lion Hill, Sawela Lodge, and Elmer Resort. Premium access to the rally action."
  }
];
