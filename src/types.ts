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
  maxGuests?: number;
  baseNightlyRate?: number;
  bedType: string;
  bathroom: string;
  view: string;
  features: string[];
}

export type BookingChannel = 'direct' | 'airbnb' | 'booking_com' | 'whatsapp' | 'owner_block';

export type BookingStatus = 'held' | 'confirmed' | 'deposit_paid' | 'pending' | 'cancelled' | 'expired';

export type PaymentMethod = 'card' | 'qris' | 'virtual_account' | 'bank_transfer' | 'whatsapp_concierge' | 'ota_prepaid';

export const QRIS_MAX_LIMIT_IDR = 10_000_000; // Rp 10,000,000 max transaction limit for QRIS

export type CurrencyCode = 'USD' | 'IDR' | 'EUR' | 'AUD';

export interface BookingAddon {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  perNight?: boolean;
  perGuest?: boolean;
}

export interface PriceBreakdown {
  unitId: string; // 'entire-villa' (VILLA_TAO)
  unitName: string; // 'Villa Tao — Entire Private Villa'
  nights: number;
  baseRatePerNight: number;
  baseSubtotal: number;
  seasonalAdjustmentTotal: number;
  weekendAdjustmentTotal: number;
  demandAdjustmentTotal: number;
  lengthOfStayDiscountPercent: number;
  lengthOfStayDiscountAmount: number;
  addonsTotal: number;
  subtotalAfterDiscounts: number;
  taxesAndServiceFee: number;
  totalDirectUsd: number;
  estimatedOtaUsd: number;
  directSavingsUsd: number;
  effectiveNightlyRateUsd: number;
  seasonLabel: string;
  appliedRules: string[];
  depositAmountUsd: number;
  balanceDueUsd: number;
}

export interface Reservation {
  id: string;
  referenceCode: string;
  unitId: string; // 'entire-villa' (VILLA_TAO)
  unitName: string; // 'Villa Tao — Entire Private Villa'
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guests: number; // 2 to 10 guests
  channel: BookingChannel;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentSchedule: 'full' | 'deposit_50';
  totalUsd: number;
  amountPaidUsd: number;
  balanceDueUsd: number;
  addons: string[];
  arrivalTime?: string;
  specialRequests?: string;
  createdAt: string;
  externalUid?: string;
  heldExpiresAt?: number;
  paymentId?: string;
}

export interface ChannelConnection {
  id: string;
  platform: 'airbnb' | 'booking_com';
  name: string;
  listingUrl: string;
  unitId: string;
  importIcalUrl: string;
  exportIcalPath: string;
  lastSyncedAt: string;
  status: 'connected' | 'syncing' | 'error';
  syncedBookingsCount: number;
  autoSyncMinutes: number;
}

export interface DynamicPricingConfig {
  aiDynamicPricingEnabled: boolean;
  villaBaseNightlyRate: number; // Base rate for the entire Villa Tao (e.g. 580 USD / ~Rp 9,000,000)
  unitBaseRates?: Record<string, number>;
  peakSeasonMultiplier: number; // e.g. 1.35
  highSeasonMultiplier: number; // e.g. 1.20
  shoulderSeasonMultiplier: number; // e.g. 1.00
  lowSeasonMultiplier: number; // e.g. 0.90
  weekendSurgePercent: number; // e.g. 8
  lastMinuteDiscountPercent: number; // e.g. 10 (within 7 days)
  earlyBirdDiscountPercent: number; // e.g. 5 (60+ days out)
  highOccupancySurgePercent: number; // e.g. 10
  weeklyDiscountPercent: number; // e.g. 10 (7+ nights)
  monthlyDiscountPercent: number; // e.g. 25 (28+ nights)
  minNightsStandard: number; // e.g. 2
  minNightsPeak: number; // e.g. 3
  taxAndServicePercent: number; // e.g. 10
  otaMarkupComparisonPercent: number; // e.g. 14
}

export interface GuestInquiry {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied' | 'archived';
}

export interface AIPricingRecommendation {
  summary: string;
  marketDemandScore: number;
  occupancyAnalysis: string;
  recommendations: {
    title: string;
    impact: string;
    suggestedAction: string;
  }[];
  suggestedMultipliers?: {
    highSeasonMultiplier: number;
    weekendSurgePercent: number;
    lastMinuteDiscountPercent: number;
  };
  generatedAt: string;
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
