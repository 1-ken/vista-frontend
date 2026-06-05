import maraExImage from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 1.jpg';
import DubaiSkyImage from '../assets/Dubai sky.jpeg'
import Swahili from '../assets/swahili.jpg';
import Nairobi from '../assets/JAMAL LABELED IMAGES/GIRAFFE CENTRE SHOT.jpg';
import Homabay from '../assets/Homabay.jpg';
import Amboseli from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 7.jpg';
import Tsavo from '../assets/Tsavo west.jpg';
import Rally from '../assets/Rally accomodation.jpg';
import Saf from '../assets/saf.jpeg';
import Seychelles from '../assets/Seychelles.jpg';


import Luxury1 from '../assets/LUXURY 1.jpg';

export const tours = [
  {
    id: "kenyas-grand-classic-safari",
    currency: "USD",
    title: "Kenya's Grand Classic Safari",
    price: 76450,
    duration: "9 Days 8 Nights",
    location: "Amboseli · Mara · Laikipia",
    image: Luxury1,
    tag: "Ultra-Luxury",
    description: "The definitive ultra-luxury fly-in safari across Kenya's greatest landscapes. Crafted for travellers who expect excellence at every turn.",
    fullDescription: "This is the definitive ultra-luxury Kenya safari — crafted for travellers who expect excellence at every turn. Begin with a soft landing at Hemingways Nairobi, then fly to Angama Amboseli, where snowcapped Kilimanjaro frames vast elephant herds and Angama's signature design sets the tone.\n\nContinue to the Masai Mara for three nights at Mara Plains or Mara Nyika — two of the Mara ecosystem's most exclusive conservancy lodges, renowned for big cats, few vehicles, and extraordinary guiding.\n\nRewilded landscapes, night skies, and raw beauty — to restore the soul.\n\nConclude in Laikipia at &Beyond Suyian Lodge, a private conservancy retreat where rewilded landscapes and raw beauty restore the soul. All connections are fly-in, activities are shared with private arrangements on request, and Ongeri's concierge smooths every step.\n\nWhy we love this journey — this is not a compromise itinerary. Every lodge on this circuit sits at the very top of its category. We recommend this safari to guests who have done Kenya before and want to do it properly — or to those who want to start at the top and never look back.",
    highlights: [
      {
        title: "Angama Amboseli",
        description: "Design-forward suites, cinematic views of Mount Kilimanjaro, and some of Africa's finest elephant photography."
      },
      {
        title: "Mara Plains & Mara Nyika",
        description: "Private-conservancy privileges: few vehicles, walking safaris, night drives, and serious big-cat action."
      },
      {
        title: "&Beyond Suyian Lodge",
        description: "Private Laikipia wilderness, rewilding stories, guided walks, and sublime stargazing."
      },
      {
        title: "Balloon at dawn",
        description: "An optional sunrise hot-air balloon over the Mara with a champagne bush breakfast."
      },
      {
        title: "Fly-in throughout",
        description: "Flawless light-aircraft connections. No long road hauls. Every moment savoured."
      },
      {
        title: "Masterful guiding",
        description: "Gourmet cuisine, curated cellars, and concierge care from first transfer to final farewell."
      }
    ],
    itinerary: [
      {
        day: "01",
        location: "Nairobi",
        title: "Arrival",
        subtitle: "A SOFT LANDING IN KAREN.",
        description: "Private transfer to Hemingways Nairobi. Shake off the flight with terrace drinks and garden views; an early night is recommended to set the rhythm of the days ahead.",
        accommodation: "Hemingways Nairobi · Colonial elegance in leafy Karen, moments from Wilson Airport."
      },
      {
        day: "02–03",
        location: "Amboseli",
        title: "Amboseli · Angama Amboseli",
        subtitle: "IN THE SHADOW OF KILIMANJARO.",
        description: "Fly to Amboseli. Afternoon drives carry you along fever-tree forests and marshes, where elephants often appear at arm's-length photographic range. Mornings and late afternoons are timed for Kilimanjaro's clearest light; optional cultural encounters, pool, and spa between drives. A private candlelit dinner awaits, should you wish.",
        accommodation: "Angama Amboseli · Design-forward suites with cinematic Kilimanjaro views."
      },
      {
        day: "04–06",
        location: "Masai Mara",
        title: "The Mara Conservancies · Mara Plains or Mara Nyika",
        subtitle: "INTO THE THEATRE OF THE BIG CATS.",
        description: "Fly to the Mara conservancies. Settle into your suite; an afternoon drive typically yields lions at golden hour. One morning brings an optional sunrise balloon flight and champagne bush breakfast. Mix shared game drives, walking safaris, and — where permitted — night drives. Focus on cheetah on short grass, leopard in riverine woodland, and the seasonal migration scenes that define the Mara.",
        accommodation: "Mara Plains (Olare Motorogi) or Mara Nyika (Naboisho) · The Mara's most exclusive conservancy lodges."
      },
      {
        day: "07–08",
        location: "Laikipia",
        title: "Laikipia · &Beyond Suyian Lodge",
        subtitle: "REWILDED VALLEYS AND STARLIT SKIES.",
        description: "Fly to Laikipia. Walk with your guide across rewilded valleys, track wildlife on foot, and toast the day from a granite outcrop. Optional horse rides or community visits can be arranged. Evenings bring exceptional stargazing and slow, fireside dinners.",
        accommodation: "&Beyond Suyian Lodge · A private Laikipia conservancy retreat."
      },
      {
        day: "09",
        location: "Nairobi",
        title: "Departure",
        subtitle: "A FAREWELL, AND THE MEMORIES BEGIN.",
        description: "A final morning activity, then flight to Nairobi Wilson and transfer for onward travel. Your journey ends — yet the feeling of Africa has only just begun to settle.",
        accommodation: "Where You Will Rest"
      }
    ],
    accommodations: [
      {
        name: "HEMINGWAYS NAIROBI",
        location: "NAIROBI, KENYA",
        description: "Colonial elegance and tranquil gardens in leafy Karen — a graceful prelude to the wild.",
        longDescription: "WITH SWEEPING VIEWS OF THE NGONG HILLS AND INTERIORS THAT REFLECT THE GRACE OF KENYA’S HERITAGE, HEMINGWAYS NAIROBI BLENDS TIMELESS HOSPITALITY WITH THOUGHTFUL DESIGN.\n\nSet between Nairobi National Park and the foot of the Ngong Hills, Hemingways Nairobi is an exclusive boutique hotel far from the bustle of central Nairobi. An all-suite property providing full butler service, a brasserie and a bar, it is perfectly placed for trips to Nairobi National Park and the capital.\n\nHemingways Nairobi has a sophisticated and tranquil ambiance. Each of the 45 suites is a generous size, all with walk-in dressing rooms and a terrace with magnificent views of the Ngong Hills. Enjoy a light lunch in the Brasserie overlooking the well tended gardens.",
        facilities: ["Spa treatments", "Day tours", "Michelin Star Cuisine", "Visit to Nairobi National Park", "Business Center", "Bar", "Gym", "Restaurant", "Swimming Pool", "Wi-Fi"]
      },
      {
        name: "ANGAMA AMBOSELI",
        location: "AMBOSELI, KENYA",
        description: "Cinematic Kilimanjaro views, design-forward suites, and some of Africa's finest elephant photography.",
        longDescription: "AN INTIMATE LODGE IN THE HEART OF KIMANA SANCTUARY, KENYA’S FIRST COMMUNITY-OWNED CONSERVANCY, RENOWNED FOR ITS LUSH LANDSCAPE AND REMARKABLE DENSITY OF WILDLIFE — ALONG WITH ITS FAMED BACKDROP, MOUNT KILIMANJARO, THE HIGHEST PEAK IN AFRICA.\n\nSet within a Fever Tree forest where some of Africa’s last Super Tuskers roam ­— elephants with tusks so large they drag along the ground as they walk — Angama Amboseli is a gentle start or finish to any East African safari.With just 10 Guest Suites in a private wildlife conservancy, Angama Amboseli is respite from the world. A haven for the prolific elephant population in this ecosystem, get up close to the relaxed resident herds and their calves as they saunter through the Sanctuary just as you do.",
        facilities: ["24 Hour Security", "Laundry Service", "Library", "Swimming Pool", "Wi-Fi", "Game Drives", "Walking Safaris", "Hot Air Balloon Ride", "Photographic Studio", "Weaving Studio", "Weddings"]
      },
      {
        name: "MARA PLAINS / MARA NYIKA",
        location: "MAASAI MARA, KENYA",
        description: "Exclusive conservancy lodges with few vehicles, extraordinary guiding, and unforgettable big-cat encounters.",
        longDescription: "WHERE THE RHYTHM OF THE MARA MEETS THE REFINEMENT OF SAFARI LIVING, MARA PLAINS CAMP IS A SMALL AND PRIVATE LUXURY TENTED CAMP IN THE OLARE MOTOGORI CONSERVANCY, ON THE NORTHERN BORDER OF THE MASAI MARA NATIONAL RESERVE.\n\nAn intimate safari retreat hidden beneath the canopy of riverine forest on the banks of the Ntiakitiak River, Mara Plains Camp offers guests a rare sense of seclusion in the heart of the Maasai Mara.",
        facilities: ["Library", "Laundry Service", "BIrd Watching", "Cultural Visits", "Guided Walks", "Game Drives", "Local Village Visits", "Night Drives", "Photographic Safaris", "Scenig Drives", "Specialist Guides"]
      },
      {
        name: "&BEYOND SUYIAN LODGE",
        location: "LAIKIPIA, KENYA",
        description: "A private conservancy retreat where rewilded landscapes, raw beauty, and night skies restore the soul.",
        longDescription: "SANCTUARIES BEYOND THE SUITE. FROM SUNLIT POOLS TO SHADED COURTYARDS, CURATED DINING TO SOUL-DEEP WELLNESS, EVERY SPACE AT SUYIAN LODGE INVITES CONNECTION. HERE, MOMENTS UNFOLD IN OPEN AIR AND QUIET CORNERS WHERE COMFORT MEETS DISCOVERY",
        facilities: ["Bar", "Laundry Service", "Restaurant", "Steam Room/Hammam", "Fitness Center", "Pool", "Room Service", "Wi-Fi", "Walking Safaris", "Game Drives", "Camel & Horse back safaris", "Active Ranching", "River Picnics", "Yoga", "Scenic Helicopter flights", "Community vists"]
      }
    ],
    inclusions: [
      "Eight nights' accommodation as listed",
      "Scheduled light-aircraft flights: Nairobi → Amboseli → Mara → Laikipia → Nairobi",
      "Shared camp activities per lodge programme — game drives, walking and night drives where permitted",
      "All meals on safari; breakfast in Nairobi",
      "Park, conservancy, and concession fees",
      "Airstrip transfers, meet-and-assist, and 24/7 Ongeri Expeditions concierge"
    ],
    exclusions: [
      "International flights to and from Nairobi",
      "Kenya eVisa and Yellow Fever certification",
      "Travel and medical insurance",
      "Personal spend and gratuities",
      "Optional experiences — hot-air balloon, private vehicle, horse rides",
      "Dinner on the first evening in Nairobi"
    ]
  },
  {
    id: "exclusive-maasai-mara",
    currency: "USD",
    title: "Exclusive Maasai Mara Safari Expedition",
    price: 71500,
    duration: "3 Days 2 Nights",
    location: "Maasai Mara, Kenya",
    image: maraExImage,
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
      { day: 4, title: 'Old Dubai & Souks', description: 'Explore the Al Fahidi Historical Neighborhood, cross the creek in an Abra, and visit the Gold and Spice Souks. Farewell dinner at an authentic Emirati restaurant.' },
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
    image: Saf,
    tag: "Luxury",
    description: "Explore the vibrant city of Cape Town before heading into the wild for an unforgettable safari experience in South Africa's premier reserves.",
    itinerary: [
      { day: 1, title: 'Welcome to the Mother City', description: 'Arrive at Cape Town International and transfer to your luxury hotel at the V&A Waterfront.' },
      { day: 2, title: 'Table Mountain & City Sights', description: 'Cable car ride up Table Mountain followed by a guided tour of the Bo-Kaap and Company Gardens.' },
      { day: 3, title: 'Cape Peninsula Expedition', description: 'Full day tour to Cape Point, Boulders Beach penguin colony, and the scenic Chapman\'s Peak Drive.' },
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
    image: Amboseli,
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
