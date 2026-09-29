export interface ExternalLinks {
  whatsapp: string;
  googleMaps: string;
  airbnb: string;
  bookingCom: string;
  instagram?: string;
  email?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  category: 'all' | 'villa' | 'rooms' | 'pool' | 'architecture' | 'nature' | 'sunset' | 'balian';
  alt: string;
}

export interface RoomDetail {
  id: string;
  code: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  additionalImages?: string[];
  capacity: string;
  bedType: string;
  bathroom: string;
  view: string;
  features: string[];
}

export interface FacilityItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  image?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlight: string;
}

export interface ReviewItem {
  id: string;
  rating: number;
  text: string;
  guestName: string;
  country?: string;
  platform: 'Airbnb' | 'Booking.com' | 'Direct Guest';
  date?: string;
  isPlaceholder?: boolean;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  whatsappNumber: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
}
