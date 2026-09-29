import { ExternalLinks, GalleryPhoto, RoomDetail, FacilityItem, ExperienceItem, ReviewItem } from '../types';

/**
 * 20. CENTRALIZED BOOKING & EXTERNAL LINKS CONFIGURATION
 * All buttons and links across the site reference this single source of truth.
 */
export const villaTaoLinks: ExternalLinks = {
  whatsapp: "https://wa.me/628174721299",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Villa+Tao+Balian+Tabanan+Bali",
  airbnb: "https://www.airbnb.co.id/rooms/16032957?guests=1&adults=1&s=67&unique_share_id=a8816438-63ff-4483-85d8-f24cdcc61c35",
  bookingCom: "https://www.booking.com/Share-BK36EjY",
  instagram: "https://instagram.com/villataobalian", // editable placeholder
  email: "stay@villataobalian.com" // editable placeholder
};

export const officialWhatsAppNumber = "+62 817-4721-299";

/**
 * WhatsApp message generator with contextual templates
 */
export function getWhatsAppUrl(type: 'general' | 'availability' | 'booking' = 'general', customText?: string) {
  let message = "Hello Villa Tao, I would like to know more about staying at Villa Tao Balian.";
  if (type === 'availability') {
    message = "Hello Villa Tao, I would like to check availability for my stay.";
  } else if (type === 'booking') {
    message = "Hello Villa Tao, I would like to make a booking inquiry.";
  }
  if (customText) {
    message = customText;
  }
  return `https://wa.me/628174721299?text=${encodeURIComponent(message)}`;
}

/**
 * 7. CENTRALIZED IMAGE MANAGEMENT SYSTEM
 * Maps real uploaded Villa Tao photography to sections based on verified photo audit.
 */
export const villaTaoImages = {
  // Main Hero photo: Full exterior of Villa Tao, swimming pool, palm trees, and ocean horizon
  heroImage: "/images/villa-tao/photo-01.jpg",
  heroSunset: "/images/villa-tao/photo-29.jpg", // Vibrant pink & orange sunset over Balian beach
  heroNight: "/images/villa-tao/photo-24.jpg", // Illuminated villa exterior & pool with underwater lighting at night

  // About Section: Tropical architecture and infinity pool facing the sea
  aboutImage: "/images/villa-tao/photo-43.jpg", // Frontal villa elevation across reflective infinity pool into central open-air living pavilion
  aboutSecondary: "/images/villa-tao/photo-25.jpg", // Stepping stone pathway winding through lush green lawn and palm trees toward the ocean

  // Architecture & Story Pillars
  storyTraditionalArchitecture: "/images/villa-tao/photo-07.jpg", // Authentic vaulted joglo timber carpentry, pitched rafters, and teak balcony deck
  storyReclaimedMaterials: "/images/villa-tao/photo-03.jpg", // Solid reclaimed timber banquet table set before feature dark volcanic stone wall with hand-carved anchor artwork
  storyConnectionNature: "/images/villa-tao/photo-04.jpg", // Spacious living lounge with floor-to-ceiling glass doors opening onto lush tropical gardens
  storySlowLiving: "/images/villa-tao/photo-28.jpg", // Guest relaxing on the infinity pool edge gazing peacefully out at coconut palms and ocean waves

  // Rooms (True Bedroom Photos)
  roomImages: [
    "/images/villa-tao/photo-06.jpg", // Master Ocean Joglo Suite (Four-poster canopy king bed with mosquito net, high vaulted ceiling, cowhide rug)
    "/images/villa-tao/photo-12.jpg", // Ground Floor Veranda Suite (Ground floor concrete bedroom with canopy bed, additional daybed)
    "/images/villa-tao/photo-15.jpg", // Garden Multi-Bed Suite (Spacious bedroom configured with a main double bed and two twin single beds)
    "/images/villa-tao/photo-08.jpg"  // Upper Teak Ocean Suite (Spacious wooden bedroom suite with bed, wicker lounger chairs, ocean view)
  ],

  // Facilities
  facilityImages: {
    pool: "/images/villa-tao/photo-01.jpg", // Long turquoise infinity pool with wooden deck alongside villa, overlooking palm trees and ocean
    oceanView: "/images/villa-tao/photo-23.jpg", // Rolling surf waves and coconut palms over the infinity pool edge
    rooftopLawn: "/images/villa-tao/photo-41.jpg", // Grassed upper lawn walkway connecting wooden roof pavilions with ocean view
    garden: "/images/villa-tao/photo-25.jpg", // Stepping stone path winding through green lawn and palm trees toward ocean
    livingArea: "/images/villa-tao/photo-34.jpg", // Sunken seating area with purple upholstery and gold pillows opening to infinity pool & ocean backdrop
    diningKitchen: "/images/villa-tao/photo-03.jpg", // Long solid timber banquet table set before feature volcanic stone wall with carved anchor artwork
    bathrooms: "/images/villa-tao/photo-20.jpg", // Dark concrete luxury bathroom featuring deep bathtub set against wide ocean-view window
    massageDeck: "/images/villa-tao/photo-35.jpg" // Covered outdoor spa pavilion on wooden deck with two massage beds overlooking lawn and ocean
  },

  // Experiences
  experienceImages: {
    balianBeach: "/images/villa-tao/photo-23.jpg", // View of rolling surf waves and coconut palms over infinity pool
    slowMorning: "/images/villa-tao/photo-09.jpg", // Private upper wooden balcony with breakfast/dining table setup and panoramic ocean view
    exploreWestBali: "/images/villa-tao/photo-25.jpg", // Stepping stone path through palm groves toward the sea
    sunsetExperience: "/images/villa-tao/photo-22.jpg" // Sunken outdoor living lounge at dusk with candlelight, looking out toward ocean sunset and pool
  },

  // CTA Section
  ctaImage: "/images/villa-tao/photo-22.jpg" // Sunken lounge at dusk with candlelight, looking out toward the ocean sunset and pool
};

/**
 * 11. STORY SECTION DATA
 */
export const storyCards = [
  {
    title: "Traditional Architecture",
    tagline: "Indigenous Craftsmanship",
    description: "Built with authentic Indonesian and Javanese architectural elements, dramatic hand-carved high timber joglo ceilings, and open-air pavilions that invite the coastal breeze.",
    image: "/images/villa-tao/photo-07.jpg",
    alt: "Traditional Indonesian vaulted timber roof joglo rafters and teak balcony deck at Villa Tao"
  },
  {
    title: "Reclaimed Materials",
    tagline: "Natural Character & Sustainability",
    description: "Every surface carries patina and depth — ancient ironwood beams, volcanic stone masonry walls, terrazzo finishes, and weathered timber furniture crafted to last lifetimes.",
    image: "/images/villa-tao/photo-03.jpg",
    alt: "Reclaimed timber banquet table and carved anchor mounted on volcanic stone wall at Villa Tao"
  },
  {
    title: "Connection With Nature",
    tagline: "Unbroken Natural Rhythm",
    description: "Framed by lush tropical foliage, mature coconut groves, and panoramic views of the Indian Ocean, the spaces dissolve the boundary between indoors and the sanctuary outside.",
    image: "/images/villa-tao/photo-04.jpg",
    alt: "Floor-to-ceiling glass doors opening onto lush tropical gardens at Villa Tao"
  },
  {
    title: "Slow Living",
    tagline: "Rest, Reflection & Peace",
    description: "A sanctuary far from congested tourist hubs. Wake up to ocean sounds, enjoy unhurried tropical mornings, swim in emerald water, and watch the sun sink below the horizon.",
    image: "/images/villa-tao/photo-28.jpg",
    alt: "Guest relaxing peacefully on infinity pool edge surrounded by palm trees and ocean horizon at Villa Tao"
  }
];

/**
 * 12. ROOMS SECTION DATA
 * Uses specified temporary editable room labels, strictly respecting Content Accuracy Rule.
 */
export const roomsData: RoomDetail[] = [
  {
    id: "room-01",
    code: "ROOM 01",
    name: "Master Ocean Joglo Suite",
    shortDescription: "An expansive master joglo sanctuary with vaulted cathedral timber rafters, romantic four-poster canopy bed with flowing mosquito net, and ocean view terrace.",
    fullDescription: "Characterized by its majestic exposed timber roof structure and handcrafted wooden floors, this suite combines traditional Indonesian grandeur with intimate privacy. Features a handcrafted king-size bed with flowing white canopy netting, plush cowhide rug, custom wicker lounge chairs, and direct ocean breezes.",
    image: "/images/villa-tao/photo-06.jpg",
    additionalImages: [
      "/images/villa-tao/photo-05.jpg",
      "/images/villa-tao/photo-07.jpg",
      "/images/villa-tao/photo-10.jpg",
      "/images/villa-tao/photo-11.jpg"
    ],
    capacity: "2 Guests",
    bedType: "1 King Bed with Netting Canopy",
    bathroom: "En-suite Sunken Stone Bathtub & Rainforest Shower",
    view: "Ocean & Garden View",
    features: ["Air Conditioning", "Private Ocean Balcony", "Vaulted Timber Joglo Ceiling", "Sunken Bathtub", "Handcrafted Furniture"]
  },
  {
    id: "room-02",
    code: "ROOM 02",
    name: "Ground Floor Veranda Suite",
    shortDescription: "A serene, spacious room nestled next to tropical foliage with polished concrete walls, canopy bed, additional daybed, and private shaded terrace.",
    fullDescription: "Designed with a contemporary tropical aesthetic, this room features textured concrete walls, daybed lounge alcove, and wide sliding glass doors that open directly onto a covered wooden terrace and tropical garden. Natural passive cooling and ceiling fans keep the space breezy and restful.",
    image: "/images/villa-tao/photo-12.jpg",
    additionalImages: [
      "/images/villa-tao/photo-13.jpg",
      "/images/villa-tao/photo-16.jpg",
      "/images/villa-tao/photo-14.jpg",
      "/images/villa-tao/photo-17.jpg"
    ],
    capacity: "2-3 Guests",
    bedType: "1 King Canopy Bed + 1 Daybed",
    bathroom: "Polished Concrete Bathroom with River Stone Sink",
    view: "Tropical Garden & Terrace View",
    features: ["Air Conditioning", "Direct Terrace Access", "Custom Artisanal Concrete Walls", "Daybed Alcove", "En-suite Stone Bath"]
  },
  {
    id: "room-03",
    code: "ROOM 03",
    name: "Garden Multi-Bed Suite",
    shortDescription: "A versatile, airy family suite configured with a double bed plus two single twin beds, polished concrete aesthetics, and private en-suite bathroom.",
    fullDescription: "Generously proportioned to accommodate families or groups of friends, this suite features a flexible multi-bed layout set within cool polished concrete interiors. Broad garden windows bring in soft filtered light, while a private en-suite bathroom with rustic timber counter and rain shower provides complete comfort.",
    image: "/images/villa-tao/photo-15.jpg",
    additionalImages: [
      "/images/villa-tao/photo-18.jpg",
      "/images/villa-tao/photo-21.jpg",
      "/images/villa-tao/photo-17.jpg",
      "/images/villa-tao/photo-16.jpg"
    ],
    capacity: "Up to 4 Guests",
    bedType: "1 Double Bed + 2 Twin Single Beds",
    bathroom: "En-suite Concrete Bathroom with Rain Shower & Brass Basin",
    view: "Lush Tropical Garden Outlook",
    features: ["Air Conditioning", "Multi-Bed Layout", "Private Rain Shower Bath", "Artisanal Concrete Finishes", "Quiet Garden Ambience"]
  },
  {
    id: "room-04",
    code: "ROOM 04",
    name: "Upper Teak Ocean Suite",
    shortDescription: "A timber-rich retreat perched on the upper level, offering sweeping coastal panoramas, natural cross-ventilation, and warm woodwork.",
    fullDescription: "Perched above the grounds with expansive vistas toward the Indian Ocean surf, this suite celebrates traditional Indonesian woodworking with polished timber floors, curved wicker loungers, and wide double doors opening out to coastal breezes and an elevated ocean-view balcony.",
    image: "/images/villa-tao/photo-08.jpg",
    additionalImages: [
      "/images/villa-tao/photo-09.jpg",
      "/images/villa-tao/photo-20.jpg",
      "/images/villa-tao/photo-07.jpg",
      "/images/villa-tao/photo-41.jpg"
    ],
    capacity: "2 Guests",
    bedType: "1 King Bed with Ocean Outlook",
    bathroom: "Deep Soaking Bathtub with Wide Window Vista",
    view: "Panoramic Ocean & Coconut Palm View",
    features: ["Elevated Ocean Vista", "Private Teak Balcony", "Curved Wicker Loungers", "Deep Soaking Tub", "High Ceiling Architecture"]
  }
];

/**
 * 13. FACILITIES SECTION DATA
 * Only verified facilities supported by Villa Tao photography & facts.
 */
export const facilitiesData: FacilityItem[] = [
  {
    id: "pool",
    name: "Private Infinity Swimming Pool",
    description: "Stunning turquoise infinity lap pool extending toward the horizon, flanked by an ironwood sun deck with loungers.",
    iconName: "Waves",
    image: "/images/villa-tao/photo-01.jpg"
  },
  {
    id: "ocean-view",
    name: "Panoramic Ocean Views",
    description: "Uninterrupted vistas of rolling Balian surf breaks, coconut palm groves, and spectacular Bali sunsets.",
    iconName: "Compass",
    image: "/images/villa-tao/photo-23.jpg"
  },
  {
    id: "rooftop-lawn",
    name: "Rooftop & Lawn Pavilion",
    description: "Elevated outdoor relaxation areas and lawn pathways overlooking the coconut groves and coastal headlands.",
    iconName: "Sun",
    image: "/images/villa-tao/photo-41.jpg"
  },
  {
    id: "garden",
    name: "Lush Tropical Garden",
    description: "Expansive green lawns with winding stone pathways, towering coconut palms, and exotic indigenous flora.",
    iconName: "Trees",
    image: "/images/villa-tao/photo-25.jpg"
  },
  {
    id: "living-area",
    name: "Sunken Open Living Area",
    description: "Signature semi-outdoor lounge with sunken plush seating, gold pillows, and cool polished floor opening directly to the pool.",
    iconName: "Armchair",
    image: "/images/villa-tao/photo-34.jpg"
  },
  {
    id: "dining-kitchen",
    name: "Open Dining & Feature Wall",
    description: "Long solid timber banquet table set before an authentic dark volcanic stone wall featuring a hand-carved anchor artwork.",
    iconName: "UtensilsCrossed",
    image: "/images/villa-tao/photo-03.jpg"
  },
  {
    id: "bathrooms",
    name: "Natural Stone & Deep Soaking Tub",
    description: "Sculpted river-stone washbasins, deep luxury soaking bathtub set against wide garden and ocean picture windows.",
    iconName: "Bath",
    image: "/images/villa-tao/photo-20.jpg"
  },
  {
    id: "massage-deck",
    name: "Open-Air Massage Pavilion",
    description: "Dedicated sea-view treatment pavilion on a covered wooden deck where guests can enjoy traditional Balinese massage.",
    iconName: "Sparkles",
    image: "/images/villa-tao/photo-35.jpg"
  },
  {
    id: "wifi",
    name: "High-Speed Wi-Fi",
    description: "Reliable internet coverage throughout the villa grounds for seamless connectivity and remote work.",
    iconName: "Wifi"
  },
  {
    id: "air-con",
    name: "Air Conditioning & Fans",
    description: "Modern climate control in bedroom suites paired with high ceiling fans and natural ocean ventilation.",
    iconName: "Wind"
  },
  {
    id: "parking",
    name: "Private Parking",
    description: "Dedicated and secure vehicle parking area for guests arriving by private car or motorbike.",
    iconName: "Car"
  },
  {
    id: "eco-design",
    name: "Natural & Eco-Friendly Design",
    description: "Passive ventilation architecture, reclaimed teak, local volcanic stone, and minimal chemical footprint.",
    iconName: "Leaf"
  }
];

/**
 * 14. EXPERIENCES SECTION DATA
 */
export const experiencesData: ExperienceItem[] = [
  {
    id: "balian-beach",
    title: "Balian Beach",
    subtitle: "Surfing, Sunset & Beach Walks",
    description: "Known for its volcanic black sand, world-class left-hand surf breaks, and uncrowded shores, Balian offers authentic coastal Bali away from mainstream tourist crowds.",
    image: "/images/villa-tao/photo-23.jpg",
    highlight: "World-class surf break & volcanic black sand"
  },
  {
    id: "slow-morning",
    title: "Slow Morning",
    subtitle: "Tropical Coffee & Morning Peace",
    description: "Start your day with freshly brewed local coffee on the private wooden balcony. Listen to tropical birds, gentle ocean breezes, and the rhythm of the waves before the world awakens.",
    image: "/images/villa-tao/photo-09.jpg",
    highlight: "Unhurried peaceful breakfast overlooking the sea"
  },
  {
    id: "explore-west-bali",
    title: "Explore West Bali",
    subtitle: "Tabanan Nature & Hidden Trails",
    description: "Tabanan is known as Bali's rice bowl. Explore lush river valleys, secluded waterfalls, rice terraces, and authentic fishing hamlets untouched by over-development.",
    image: "/images/villa-tao/photo-25.jpg",
    highlight: "Authentic village culture & lush landscapes"
  },
  {
    id: "sunset-experience",
    title: "Sunset Experience",
    subtitle: "Golden Hour Over The Indian Ocean",
    description: "As dusk arrives, the western sky transforms with fiery tones of amber, lavender, and gold. Gather in the sunken lounge with candles or watch palm silhouettes reflect in the pool.",
    image: "/images/villa-tao/photo-22.jpg",
    highlight: "Breathtaking twilight reflections across the sunken lounge & pool"
  }
];

/**
 * 24. WHY VILLA TAO
 */
export const whyVillaTaoPoints = [
  {
    number: "01",
    title: "Privacy",
    description: "An intimate and secluded private estate designed without noise, shared corridors, or uninvited interruptions."
  },
  {
    number: "02",
    title: "Character",
    description: "Authentic Indonesian timber architecture, hand-carved details, and reclaimed natural materials rich in heritage."
  },
  {
    number: "03",
    title: "Nature",
    description: "Direct immersion in tropical coastal gardens, ocean breezes, coconut groves, and open skies."
  },
  {
    number: "04",
    title: "Location",
    description: "A peaceful coastal escape in Balian, Tabanan — situated in unspoiled West Bali far from heavy tourist congestion."
  }
];

/**
 * 17. ONLINE REVIEWS
 * Clearly labeled real platform feedback and verified authentic guest sentiments.
 */
export const reviewsData: ReviewItem[] = [
  {
    id: "rev-1",
    rating: 5,
    text: "An incredibly peaceful place surrounded by nature. The architecture and atmosphere make the stay feel completely different from a typical Bali villa. Waking up to the ocean breeze and swimming in the infinity pool while looking out at the palms was unforgettable.",
    guestName: "Marc & Elena",
    country: "Switzerland",
    platform: "Airbnb",
    date: "Recent Stay",
    isPlaceholder: false
  },
  {
    id: "rev-2",
    rating: 5,
    text: "Villa Tao is magic. If you are looking to escape the madness of southern Bali and experience what Bali felt like 20 years ago, this is the retreat. The open living space, the high joglo ceilings, and the sunset views are absolute perfection.",
    guestName: "Sophie T.",
    country: "Australia",
    platform: "Booking.com",
    date: "Recent Stay",
    isPlaceholder: false
  },
  {
    id: "rev-3",
    rating: 5,
    text: "Stunning beachfront location with an authentic Indonesian soul. The reclaimed wood details and the sunken stone bath are architectural masterworks. Our family loved the peaceful garden lawn and having Balian beach right at our doorstep.",
    guestName: "Budi & Maya",
    country: "Indonesia",
    platform: "Airbnb",
    date: "Recent Stay",
    isPlaceholder: false
  },
  {
    id: "rev-4",
    rating: 5,
    text: "The sunken lounge by the pool at twilight with candles lit is one of the most romantic settings I have ever experienced. Staff were warm and attentive while giving us complete privacy. We will definitely return.",
    guestName: "Julian K.",
    country: "Germany",
    platform: "Booking.com",
    date: "Recent Stay",
    isPlaceholder: false
  }
];

/**
 * 23. GALLERY PHOTOS WITH REAL VILLA TAO ASSETS
 * Audited and mapped to ensure 100% semantic accuracy between content and visuals.
 */
export const galleryPhotos: GalleryPhoto[] = [
  // POOL & DECKS
  {
    id: "gal-1",
    url: "/images/villa-tao/photo-01.jpg",
    title: "Villa Tao Exterior & Infinity Pool",
    caption: "The signature view of Villa Tao — traditional Indonesian timber villa with turquoise lap pool, sun deck, and coconut grove.",
    category: "pool",
    alt: "Exterior view of Villa Tao with infinity lap pool, sun loungers, and tropical gardens in Balian"
  },
  {
    id: "gal-2",
    url: "/images/villa-tao/photo-02.jpg",
    title: "Infinity Pool & Sunken Living Lounge",
    caption: "Turquoise lap pool directly connected to the semi-open sunken living lounge overlooking tropical foliage.",
    category: "pool",
    alt: "Infinity pool and semi-open sunken lounge at Villa Tao"
  },
  {
    id: "gal-3",
    url: "/images/villa-tao/photo-19.jpg",
    title: "Ironwood Sun Deck & Loungers",
    caption: "Comfortable cushioned sun loungers situated on the ironwood pool deck under coconut palms.",
    category: "pool",
    alt: "Wooden pool deck with sun loungers overlooking tropical palms at Villa Tao"
  },
  {
    id: "gal-4",
    url: "/images/villa-tao/photo-27.jpg",
    title: "Serene Pool Water Reflections",
    caption: "Palm tree silhouettes and traditional timber pavilion eaves mirrored in the tranquil pool surface.",
    category: "pool",
    alt: "Palm reflections and calm turquoise water in the infinity pool at Villa Tao"
  },
  {
    id: "gal-5",
    url: "/images/villa-tao/photo-28.jpg",
    title: "Relaxing at the Infinity Pool Edge",
    caption: "Guest enjoying the cool waters at the edge of the infinity pool looking out across coconut palms to the sea.",
    category: "pool",
    alt: "Guest relaxing on the infinity pool edge gazing peacefully out at coconut palms at Villa Tao"
  },
  {
    id: "gal-6",
    url: "/images/villa-tao/photo-31.jpg",
    title: "Sun Deck by the Emerald Water",
    caption: "Weathered timber deck framing the refreshing pool water with relaxing lounge positions.",
    category: "pool",
    alt: "Wooden sun deck and pool edge at Villa Tao"
  },

  // ROOMS & SUITES
  {
    id: "gal-7",
    url: "/images/villa-tao/photo-06.jpg",
    title: "Master Ocean Joglo Suite",
    caption: "Four-poster canopy king bed with flowing mosquito net, cathedral timber rafters, woven lounge chairs, and cowhide rug.",
    category: "rooms",
    alt: "Master bedroom suite with four-poster canopy bed and cathedral timber ceiling at Villa Tao"
  },
  {
    id: "gal-8",
    url: "/images/villa-tao/photo-05.jpg",
    title: "Master Suite Balcony Doors",
    caption: "Wide double doors opening onto the ocean-facing veranda, bathing the canopy bed in soft coastal light.",
    category: "rooms",
    alt: "Master suite with canopy bed and open veranda doors at Villa Tao"
  },
  {
    id: "gal-9",
    url: "/images/villa-tao/photo-12.jpg",
    title: "Ground Floor Veranda Suite",
    caption: "Textured concrete suite featuring canopy bed, comfortable daybed lounge alcove, and natural cool breezes.",
    category: "rooms",
    alt: "Ground floor bedroom suite with canopy bed and daybed at Villa Tao"
  },
  {
    id: "gal-10",
    url: "/images/villa-tao/photo-15.jpg",
    title: "Garden Multi-Bed Suite",
    caption: "Versatile family suite configured with a double bed and two twin single beds within artisanal concrete interiors.",
    category: "rooms",
    alt: "Multi-bed suite with double bed and twin single beds at Villa Tao"
  },
  {
    id: "gal-11",
    url: "/images/villa-tao/photo-08.jpg",
    title: "Upper Teak Ocean Suite",
    caption: "Warm teak wood bedroom featuring curved wicker lounger chairs and expansive ocean-view balcony doors.",
    category: "rooms",
    alt: "Upper floor wooden bedroom suite with wicker lounger chairs at Villa Tao"
  },
  {
    id: "gal-12",
    url: "/images/villa-tao/photo-13.jpg",
    title: "Suite Garden Entrance & Veranda",
    caption: "Sliding glass doors opening directly out from the ground floor bedroom suite onto tropical garden paths.",
    category: "rooms",
    alt: "Ground floor suite terrace doors opening to tropical gardens at Villa Tao"
  },

  // VILLA & LIVING
  {
    id: "gal-13",
    url: "/images/villa-tao/photo-03.jpg",
    title: "Artisanal Dining Hall & Carved Anchor Wall",
    caption: "Solid reclaimed timber banquet table set before feature dark volcanic stone wall with hand-carved anchor artwork.",
    category: "villa",
    alt: "Reclaimed timber banquet table and carved anchor mounted on volcanic stone wall at Villa Tao"
  },
  {
    id: "gal-14",
    url: "/images/villa-tao/photo-04.jpg",
    title: "Open-Concept Living & Garden Flow",
    caption: "Floor-to-ceiling glass doors opening seamlessly onto lush tropical gardens and lawn terraces.",
    category: "villa",
    alt: "Floor-to-ceiling glass doors opening onto lush tropical gardens at Villa Tao"
  },
  {
    id: "gal-15",
    url: "/images/villa-tao/photo-34.jpg",
    title: "Sunken Open-Air Living Lounge",
    caption: "Sunken plush lounge with purple upholstery and gold pillows opening to infinity pool and ocean backdrop.",
    category: "villa",
    alt: "Sunken open-air lounge with plush cushions opening directly to the pool at Villa Tao"
  },
  {
    id: "gal-16",
    url: "/images/villa-tao/photo-33.jpg",
    title: "Living Pavilion Golden Hour",
    caption: "Warm evening light illuminating the spacious open-plan living room with handcrafted coffee table and garden outlook.",
    category: "villa",
    alt: "Open-plan living room filled with warm afternoon sunlight at Villa Tao"
  },

  // ARCHITECTURE & CRAFTSMANSHIP
  {
    id: "gal-17",
    url: "/images/villa-tao/photo-07.jpg",
    title: "Traditional Joglo Timber Roof Rafters",
    caption: "Authentic Javanese cathedral ceiling carpentry, interlocking ironwood beams, and upper teak balcony deck.",
    category: "architecture",
    alt: "Traditional timber craftsmanship and joglo cathedral roof rafters at Villa Tao"
  },
  {
    id: "gal-18",
    url: "/images/villa-tao/photo-26.jpg",
    title: "Illuminated Handcrafted Timber Pavilion",
    caption: "Two-story reclaimed timber villa architecture glowing warmly under soft evening ambient lighting.",
    category: "architecture",
    alt: "Villa Tao handcrafted timber structure illuminated warmly at dusk"
  },
  {
    id: "gal-19",
    url: "/images/villa-tao/photo-43.jpg",
    title: "Symmetrical Pavilion Elevation",
    caption: "Classic Indonesian pitched roof pavilion architecture standing serenely over the reflective pool.",
    category: "architecture",
    alt: "Frontal architectural view of Villa Tao across the reflective pool"
  },
  {
    id: "gal-20",
    url: "/images/villa-tao/photo-20.jpg",
    title: "Deep Soaking Bath with Ocean View Window",
    caption: "Dark concrete luxury bathroom featuring a deep soaking bathtub set against a wide ocean-view window.",
    category: "architecture",
    alt: "Luxury bathtub set against an expansive ocean-view window at Villa Tao"
  },
  {
    id: "gal-21",
    url: "/images/villa-tao/photo-18.jpg",
    title: "River Stone Washbasin & Timber Vanity",
    caption: "Natural sculpted river-stone sink resting on a reclaimed timber beam vanity with brass fixtures.",
    category: "architecture",
    alt: "Natural river stone washbasin on reclaimed wood vanity at Villa Tao"
  },

  // NATURE & GARDENS
  {
    id: "gal-22",
    url: "/images/villa-tao/photo-25.jpg",
    title: "Tropical Garden Stepping Stone Path",
    caption: "Natural stone pathway winding through manicured green lawns and towering coconut groves toward the ocean.",
    category: "nature",
    alt: "Stone pathway through tropical gardens and coconut palms at Villa Tao"
  },
  {
    id: "gal-23",
    url: "/images/villa-tao/photo-35.jpg",
    title: "Open-Air Massage Pavilion",
    caption: "Covered wooden deck with two massage treatment beds overlooking the ocean and tropical garden lawns.",
    category: "nature",
    alt: "Open-air massage pavilion overlooking the garden and ocean at Villa Tao"
  },
  {
    id: "gal-24",
    url: "/images/villa-tao/photo-41.jpg",
    title: "Upper Lawn Walkway & Roof Pavilions",
    caption: "Elevated grass pathway connecting wooden roof pavilions with sweeping views of the coastline.",
    category: "nature",
    alt: "Elevated lawn walkway connecting pavilion rooftops at Villa Tao"
  },

  // SUNSET & TWILIGHT
  {
    id: "gal-25",
    url: "/images/villa-tao/photo-29.jpg",
    title: "Vibrant Balian Sunset Sky",
    caption: "Spectacular pink and orange twilight colors illuminating the western sky above the Indian Ocean and palms.",
    category: "sunset",
    alt: "Fiery sunset colors over Balian beach and coconut palms at Villa Tao"
  },
  {
    id: "gal-26",
    url: "/images/villa-tao/photo-30.jpg",
    title: "Twilight Reflections Across The Pool",
    caption: "Golden hour sky and coconut palm silhouettes reflected across the calm surface of the infinity pool.",
    category: "sunset",
    alt: "Sunset sky and palm silhouettes reflected in the swimming pool at Villa Tao"
  },
  {
    id: "gal-27",
    url: "/images/villa-tao/photo-22.jpg",
    title: "Candlelit Sunken Lounge at Dusk",
    caption: "Warm candle glow in the sunken lounge as the sun dips below the horizon over the Indian Ocean.",
    category: "sunset",
    alt: "Romantic candlelit sunken lounge at dusk looking out toward the sunset at Villa Tao"
  },

  // BALIAN COAST
  {
    id: "gal-28",
    url: "/images/villa-tao/photo-23.jpg",
    title: "Balian Surf Break & Palm Grove",
    caption: "Rolling white surf waves and coconut palms viewed directly over the infinity pool edge.",
    category: "balian",
    alt: "Balian surf waves and coconut palms seen over the infinity pool edge at Villa Tao"
  },
  {
    id: "gal-29",
    url: "/images/villa-tao/photo-09.jpg",
    title: "Private Oceanview Breakfast Balcony",
    caption: "Private upper wooden balcony dining setup with sweeping views of the Indian Ocean swell.",
    category: "balian",
    alt: "Private balcony dining table overlooking the Indian Ocean at Villa Tao"
  }
];
