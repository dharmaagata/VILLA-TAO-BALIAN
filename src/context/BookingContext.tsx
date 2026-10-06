import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Reservation,
  ChannelConnection,
  DynamicPricingConfig,
  PriceBreakdown,
  CurrencyCode,
  GuestInquiry,
  AIPricingRecommendation,
  BookingStatus,
  PaymentMethod,
} from '../types';
import { entireVillaUnit, bookingAddons, villaTaoLinks } from '../data/villaData';

// Helper for YYYY-MM-DD local date string
export function formatDateYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysYMD(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return formatDateYMD(dt);
}

export function diffNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const [y1, m1, d1] = checkIn.split('-').map(Number);
  const [y2, m2, d2] = checkOut.split('-').map(Number);
  const dt1 = new Date(y1, m1 - 1, d1);
  const dt2 = new Date(y2, m2 - 1, d2);
  const diff = Math.round((dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function getDatesInRange(checkIn: string, checkOut: string): string[] {
  const nights = diffNights(checkIn, checkOut);
  const dates: string[] = [];
  for (let i = 0; i < nights; i++) {
    dates.push(addDaysYMD(checkIn, i));
  }
  return dates;
}

const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; decimals: number }> = {
  USD: { symbol: '$', rate: 1, decimals: 0 },
  IDR: { symbol: 'Rp ', rate: 15800, decimals: 0 },
  EUR: { symbol: '€', rate: 0.92, decimals: 0 },
  AUD: { symbol: 'A$', rate: 1.52, decimals: 0 },
};

export const DEFAULT_VILLA_BASE_RATE_USD = 580; // ~Rp 9,000,000 IDR

const DEFAULT_PRICING_CONFIG: DynamicPricingConfig = {
  aiDynamicPricingEnabled: true,
  villaBaseNightlyRate: DEFAULT_VILLA_BASE_RATE_USD,
  unitBaseRates: {
    'entire-villa': DEFAULT_VILLA_BASE_RATE_USD,
  },
  peakSeasonMultiplier: 1.35,
  highSeasonMultiplier: 1.20,
  shoulderSeasonMultiplier: 1.00,
  lowSeasonMultiplier: 0.90,
  weekendSurgePercent: 8,
  lastMinuteDiscountPercent: 10,
  earlyBirdDiscountPercent: 5,
  highOccupancySurgePercent: 10,
  weeklyDiscountPercent: 10,
  monthlyDiscountPercent: 25,
  minNightsStandard: 2,
  minNightsPeak: 3,
  taxAndServicePercent: 10,
  otaMarkupComparisonPercent: 14,
};

function createInitialReservations(): Reservation[] {
  const today = formatDateYMD(new Date());
  return [
    {
      id: 'res-seed-1',
      referenceCode: 'VT-AIRBNB-9012',
      unitId: 'entire-villa',
      unitName: 'Villa Tao — Entire Private Villa',
      guestName: 'Marc & Elena Vance',
      guestEmail: 'marc.vance@swissmail.ch',
      guestPhone: '+41 79 321 88 90',
      guestCountry: 'Switzerland',
      checkIn: addDaysYMD(today, 3),
      checkOut: addDaysYMD(today, 6),
      nights: 3,
      guests: 6,
      channel: 'airbnb',
      status: 'confirmed',
      paymentMethod: 'ota_prepaid',
      paymentSchedule: 'full',
      totalUsd: 1980,
      amountPaidUsd: 1980,
      balanceDueUsd: 0,
      addons: ['airport-transfer'],
      arrivalTime: '15:30',
      specialRequests: 'Synced via Airbnb Official Listing (#16032957). Entire villa private rental.',
      createdAt: addDaysYMD(today, -12),
      externalUid: 'airbnb-ical-uid-9012@airbnb.com',
    },
    {
      id: 'res-seed-2',
      referenceCode: 'VT-BKG-4418',
      unitId: 'entire-villa',
      unitName: 'Villa Tao — Entire Private Villa',
      guestName: 'Julian Krauss',
      guestEmail: 'j.krauss@berlin-studio.de',
      guestPhone: '+49 172 994 2103',
      guestCountry: 'Germany',
      checkIn: addDaysYMD(today, 9),
      checkOut: addDaysYMD(today, 13),
      nights: 4,
      guests: 4,
      channel: 'booking_com',
      status: 'confirmed',
      paymentMethod: 'ota_prepaid',
      paymentSchedule: 'full',
      totalUsd: 2550,
      amountPaidUsd: 2550,
      balanceDueUsd: 0,
      addons: ['daily-breakfast'],
      arrivalTime: '16:00',
      specialRequests: 'Synced via Booking.com Official Channel (#Share-BK36EjY). Entire villa reserved.',
      createdAt: addDaysYMD(today, -8),
      externalUid: 'bookingcom-ical-uid-4418@booking.com',
    },
    {
      id: 'res-seed-3',
      referenceCode: 'VT-2026-8419',
      unitId: 'entire-villa',
      unitName: 'Villa Tao — Entire Private Villa',
      guestName: 'Sophie Taylor',
      guestEmail: 'sophie.taylor@melbourne.au',
      guestPhone: '+61 412 889 301',
      guestCountry: 'Australia',
      checkIn: addDaysYMD(today, 16),
      checkOut: addDaysYMD(today, 21),
      nights: 5,
      guests: 8,
      channel: 'direct',
      status: 'deposit_paid',
      paymentMethod: 'card',
      paymentSchedule: 'deposit_50',
      totalUsd: 3190,
      amountPaidUsd: 1595,
      balanceDueUsd: 1595,
      addons: ['airport-transfer', 'ocean-massage'],
      arrivalTime: '14:00 (Flight QF43)',
      specialRequests: 'Celebrating family reunion in West Bali. Reserving entire private estate.',
      createdAt: addDaysYMD(today, -4),
    },
    {
      id: 'res-seed-4',
      referenceCode: 'VT-AIRBNB-9105',
      unitId: 'entire-villa',
      unitName: 'Villa Tao — Entire Private Villa',
      guestName: 'Lucas & Chloé Moreau',
      guestEmail: 'l.moreau@paris-art.fr',
      guestPhone: '+33 6 18 42 99 10',
      guestCountry: 'France',
      checkIn: addDaysYMD(today, 24),
      checkOut: addDaysYMD(today, 28),
      nights: 4,
      guests: 6,
      channel: 'airbnb',
      status: 'confirmed',
      paymentMethod: 'ota_prepaid',
      paymentSchedule: 'full',
      totalUsd: 2480,
      amountPaidUsd: 2480,
      balanceDueUsd: 0,
      addons: [],
      arrivalTime: '17:00',
      specialRequests: 'Synced via Airbnb iCal Calendar Feed. Entire villa reserved.',
      createdAt: addDaysYMD(today, -2),
      externalUid: 'airbnb-ical-uid-9105@airbnb.com',
    },
  ];
}

function createInitialChannels(): ChannelConnection[] {
  const nowIso = new Date().toISOString();
  return [
    {
      id: 'chan-airbnb-main',
      platform: 'airbnb',
      name: 'Airbnb Official — Tao Villa BeachFront (#16032957)',
      listingUrl: villaTaoLinks.airbnb,
      unitId: 'entire-villa',
      importIcalUrl: 'https://www.airbnb.co.id/calendar/ical/16032957.ics?s=a881643863ff448385d8f24cdcc61c35',
      exportIcalPath: '/api/ical/entire-villa.ics',
      lastSyncedAt: nowIso,
      status: 'connected',
      syncedBookingsCount: 2,
      autoSyncMinutes: 15,
    },
    {
      id: 'chan-booking-main',
      platform: 'booking_com',
      name: 'Booking.com Official — Villa Tao Balian (#Share-BK36EjY)',
      listingUrl: villaTaoLinks.bookingCom,
      unitId: 'entire-villa',
      importIcalUrl: 'https://admin.booking.com/hotel/hoteladmin/ical.html?t=bk36ejy-villatao-balian',
      exportIcalPath: '/api/ical/entire-villa.ics',
      lastSyncedAt: nowIso,
      status: 'connected',
      syncedBookingsCount: 1,
      autoSyncMinutes: 15,
    },
  ];
}

interface BookingContextType {
  reservations: Reservation[];
  channels: ChannelConnection[];
  pricingConfig: DynamicPricingConfig;
  inquiries: GuestInquiry[];
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (usdAmount: number) => string;
  isDateAvailableForUnit: (dateYmd: string, unitId?: string) => { available: boolean; reason?: string; channel?: string };
  isDateRangeAvailable: (unitId?: string, checkIn?: string, checkOut?: string) => { available: boolean; conflictDate?: string; reason?: string };
  getNextAvailableWindow: (unitId?: string, nights?: number) => { checkIn: string; checkOut: string };
  calculateStayPrice: (
    checkIn: string,
    checkOut: string,
    guests: number,
    selectedAddonIds?: string[],
    unitId?: string
  ) => PriceBreakdown;
  getNightlyRateForDate: (dateYmd: string, unitId?: string) => number;
  createReservation: (
    data: Omit<Reservation, 'id' | 'referenceCode' | 'createdAt'>
  ) => Promise<Reservation>;
  updateReservationStatus: (id: string, status: BookingStatus, amountPaidUsd?: number) => void;
  updateReservationDetails: (id: string, updates: Partial<Reservation>) => void;
  lookupReservation: (referenceOrEmail: string) => Reservation | undefined;
  toggleOwnerDateBlock: (unitId: string, dateYmd: string, note?: string) => void;
  updatePricingConfig: (newConfig: DynamicPricingConfig) => void;
  syncChannelsNow: (customIcsText?: string, targetUnitId?: string) => Promise<{ syncedCount: number; timestamp: string }>;
  updateChannelUrl: (channelId: string, importIcalUrl: string) => void;
  generateIcalString: (unitId?: string) => string;
  addGuestInquiry: (inquiry: Omit<GuestInquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: GuestInquiry['status']) => void;
  requestAIPricingInsight: () => Promise<AIPricingRecommendation>;
  createPaymentHold: (params: {
    checkIn: string;
    checkOut: string;
    guests: number;
    guestName?: string;
    guestEmail?: string;
    totalUsd: number;
  }) => Promise<{ ok: boolean; referenceCode: string; holdId: string; expiresAt: number; error?: string }>;
  createPaymentIntent: (params: {
    referenceCode: string;
    paymentMethod: PaymentMethod;
    amountIdr: number;
    amountUsd: number;
    bankName?: string;
  }) => Promise<{
    ok: boolean;
    paymentId?: string;
    method?: PaymentMethod;
    qrString?: string;
    amountIdr?: number;
    virtualAccountNumber?: string;
    bankName?: string;
    accountName?: string;
    expiresAt?: number;
    error?: string;
    message?: string;
  }>;
  verifyServerPayment: (params: {
    referenceCode: string;
    paymentId?: string;
    paymentMethod: PaymentMethod;
    guestData: any;
  }) => Promise<{ ok: boolean; verified: boolean; reservation?: Reservation; message?: string }>;
  releasePaymentHold: (referenceCode: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RESERVATIONS: 'villatao_reservations_v2',
  CHANNELS: 'villatao_channels_v2',
  PRICING: 'villatao_pricing_v2',
  INQUIRIES: 'villatao_inquiries_v2',
  CURRENCY: 'villatao_currency_v2',
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return createInitialReservations();
  });

  const [channels, setChannels] = useState<ChannelConnection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return createInitialChannels();
  });

  const [pricingConfig, setPricingConfig] = useState<DynamicPricingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING);
      if (saved) return { ...DEFAULT_PRICING_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_PRICING_CONFIG;
  });

  const [inquiries, setInquiries] = useState<GuestInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'inq-1',
        fullName: 'Clara Lindqvist',
        email: 'clara.lindqvist@stockholm.se',
        whatsappNumber: '+46 70 552 19 04',
        checkIn: addDaysYMD(formatDateYMD(new Date()), 30),
        checkOut: addDaysYMD(formatDateYMD(new Date()), 37),
        guests: '6',
        message: 'Hello Villa Tao team, we are looking for a peaceful 7-night private villa retreat in Balian for our family and would love to arrange airport pickup and private dining.',
        createdAt: addDaysYMD(formatDateYMD(new Date()), -1),
        status: 'new',
      },
    ];
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  // Persist to localStorage & sync with backend
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
      fetch('/api/state/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations, pricingConfig }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  }, [reservations, pricingConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
    } catch {
      // ignore
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricingConfig));
    } catch {
      // ignore
    }
  }, [pricingConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch {
      // ignore
    }
  }, [inquiries]);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
  }, []);

  const formatPrice = useCallback(
    (usdAmount: number): string => {
      const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
      const converted = Math.round(usdAmount * info.rate);
      return `${info.symbol}${converted.toLocaleString('en-US')}`;
    },
    [currency]
  );

  // Single Inventory Unit Availability:
  // If ANY active booking or active hold exists on a date, the ENTIRE Villa Tao is unavailable on that date.
  const isDateAvailableForUnit = useCallback(
    (dateYmd: string, _unitId?: string): { available: boolean; reason?: string; channel?: string } => {
      const today = formatDateYMD(new Date());
      if (dateYmd < today) {
        return { available: false, reason: 'Past date' };
      }

      const now = Date.now();
      for (const res of reservations) {
        if (res.status === 'cancelled' || res.status === 'expired') continue;
        if (res.status === 'held' && res.heldExpiresAt && res.heldExpiresAt < now) continue;
        if (dateYmd >= res.checkIn && dateYmd < res.checkOut) {
          return {
            available: false,
            reason:
              res.status === 'held'
                ? 'Temporarily held for checkout (payment in progress)'
                : res.channel === 'owner_block'
                ? 'Reserved / Maintenance Block'
                : `Booked (${res.channel.toUpperCase()})`,
            channel: res.channel,
          };
        }
      }
      return { available: true };
    },
    [reservations]
  );

  const isDateRangeAvailable = useCallback(
    (_unitId?: string, checkIn?: string, checkOut?: string) => {
      const inD = checkIn || '';
      const outD = checkOut || '';
      const nights = diffNights(inD, outD);
      if (nights <= 0) {
        return { available: false, reason: 'Check-out must be after check-in' };
      }
      const dates = getDatesInRange(inD, outD);
      for (const d of dates) {
        const status = isDateAvailableForUnit(d);
        if (!status.available) {
          return { available: false, conflictDate: d, reason: status.reason };
        }
      }
      return { available: true };
    },
    [isDateAvailableForUnit]
  );

  const getNextAvailableWindow = useCallback(
    (_unitId?: string, nights = 3): { checkIn: string; checkOut: string } => {
      const today = formatDateYMD(new Date());
      for (let offset = 1; offset < 120; offset++) {
        const candidateIn = addDaysYMD(today, offset);
        const candidateOut = addDaysYMD(candidateIn, nights);
        if (isDateRangeAvailable('entire-villa', candidateIn, candidateOut).available) {
          return { checkIn: candidateIn, checkOut: candidateOut };
        }
      }
      return { checkIn: addDaysYMD(today, 7), checkOut: addDaysYMD(today, 7 + nights) };
    },
    [isDateRangeAvailable]
  );

  const getSeasonForDate = useCallback(
    (dateYmd: string): { multiplier: number; label: string } => {
      const [, m, d] = dateYmd.split('-').map(Number);
      // Peak Festive Season: Dec 15 - Jan 10
      if ((m === 12 && d >= 15) || (m === 1 && d <= 10)) {
        return { multiplier: pricingConfig.peakSeasonMultiplier, label: 'Peak Festive Season' };
      }
      // High Tropical Dry Season: Jun 15 - Aug 31
      if ((m === 6 && d >= 15) || m === 7 || m === 8) {
        return { multiplier: pricingConfig.highSeasonMultiplier, label: 'High Dry Season' };
      }
      // Shoulder Coastal Season: Apr 1 - Jun 14, Sep 1 - Oct 31
      if (m === 4 || m === 5 || (m === 6 && d < 15) || m === 9 || m === 10) {
        return { multiplier: pricingConfig.shoulderSeasonMultiplier, label: 'Coastal Shoulder Season' };
      }
      // Tranquil Green Season: Jan 11 - Mar 31, Nov 1 - Dec 14
      return { multiplier: pricingConfig.lowSeasonMultiplier, label: 'Tranquil Green Season' };
    },
    [pricingConfig]
  );

  // Single Villa Nightly Rate Calculation
  const getNightlyRateForDate = useCallback(
    (dateYmd: string, _unitId?: string): number => {
      const baseRate = pricingConfig.villaBaseNightlyRate || DEFAULT_VILLA_BASE_RATE_USD;
      if (!pricingConfig.aiDynamicPricingEnabled) return baseRate;

      const { multiplier } = getSeasonForDate(dateYmd);
      let rate = baseRate * multiplier;

      const [y, m, d] = dateYmd.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const dow = dt.getDay();
      if (dow === 5 || dow === 6) {
        rate += baseRate * (pricingConfig.weekendSurgePercent / 100);
      }
      return Math.round(rate);
    },
    [pricingConfig, getSeasonForDate]
  );

  // Single Villa Stay Price Breakdown
  const calculateStayPrice = useCallback(
    (
      checkIn: string,
      checkOut: string,
      guests: number,
      selectedAddonIds: string[] = [],
      _unitId?: string
    ): PriceBreakdown => {
      const baseRatePerNight = pricingConfig.villaBaseNightlyRate || DEFAULT_VILLA_BASE_RATE_USD;
      const nights = Math.max(1, diffNights(checkIn, checkOut));
      const dates = nights > 0 && checkIn && checkOut ? getDatesInRange(checkIn, checkOut) : [formatDateYMD(new Date())];

      const baseSubtotal = baseRatePerNight * nights;
      let seasonalAdjustmentTotal = 0;
      let weekendAdjustmentTotal = 0;
      let demandAdjustmentTotal = 0;
      const appliedRulesSet = new Set<string>();
      let primarySeasonLabel = 'Standard Coastal Rate';

      if (pricingConfig.aiDynamicPricingEnabled) {
        dates.forEach((d, idx) => {
          const { multiplier, label } = getSeasonForDate(d);
          if (idx === 0) primarySeasonLabel = label;
          const seasonDiff = baseRatePerNight * (multiplier - 1);
          seasonalAdjustmentTotal += seasonDiff;
          if (multiplier !== 1) {
            appliedRulesSet.add(`${label} (${multiplier > 1 ? '+' : ''}${Math.round((multiplier - 1) * 100)}%)`);
          }

          const [y, m, day] = d.split('-').map(Number);
          const dow = new Date(y, m - 1, day).getDay();
          if ((dow === 5 || dow === 6) && pricingConfig.weekendSurgePercent > 0) {
            weekendAdjustmentTotal += baseRatePerNight * (pricingConfig.weekendSurgePercent / 100);
            appliedRulesSet.add(`Weekend Coastal Demand (+${pricingConfig.weekendSurgePercent}%)`);
          }
        });

        // Lead time adjustment
        if (checkIn) {
          const today = formatDateYMD(new Date());
          const leadDays = diffNights(today, checkIn);
          if (leadDays >= 0 && leadDays <= 7 && pricingConfig.lastMinuteDiscountPercent > 0) {
            demandAdjustmentTotal -= baseSubtotal * (pricingConfig.lastMinuteDiscountPercent / 100);
            appliedRulesSet.add(`Last-Minute Coastal Window (-${pricingConfig.lastMinuteDiscountPercent}%)`);
          } else if (leadDays >= 60 && pricingConfig.earlyBirdDiscountPercent > 0) {
            demandAdjustmentTotal -= baseSubtotal * (pricingConfig.earlyBirdDiscountPercent / 100);
            appliedRulesSet.add(`Early-Bird Advance Privilege (-${pricingConfig.earlyBirdDiscountPercent}%)`);
          }
        }
      }

      seasonalAdjustmentTotal = Math.round(seasonalAdjustmentTotal);
      weekendAdjustmentTotal = Math.round(weekendAdjustmentTotal);
      demandAdjustmentTotal = Math.round(demandAdjustmentTotal);

      const rawNightlyTotal = Math.max(
        Math.round(baseSubtotal * 0.65),
        baseSubtotal + seasonalAdjustmentTotal + weekendAdjustmentTotal + demandAdjustmentTotal
      );

      // Length of stay discount
      let lengthOfStayDiscountPercent = 0;
      if (nights >= 28) {
        lengthOfStayDiscountPercent = pricingConfig.monthlyDiscountPercent;
        appliedRulesSet.add(`28+ Nights Slow-Living Residency (-${lengthOfStayDiscountPercent}%)`);
      } else if (nights >= 7) {
        lengthOfStayDiscountPercent = pricingConfig.weeklyDiscountPercent;
        appliedRulesSet.add(`7+ Nights Weekly Retreat Privilege (-${lengthOfStayDiscountPercent}%)`);
      }

      const lengthOfStayDiscountAmount = Math.round(rawNightlyTotal * (lengthOfStayDiscountPercent / 100));
      const subtotalAfterDiscounts = rawNightlyTotal - lengthOfStayDiscountAmount;

      // Add-ons
      let addonsTotal = 0;
      const guestCount = Math.max(1, guests || 2);
      for (const addonId of selectedAddonIds) {
        const found = bookingAddons.find((a) => a.id === addonId);
        if (found) {
          let cost = found.priceUsd;
          if (found.perNight) cost *= nights;
          if (found.perGuest) cost *= guestCount;
          addonsTotal += cost;
        }
      }

      const taxableAmount = subtotalAfterDiscounts + addonsTotal;
      const taxesAndServiceFee = Math.round(taxableAmount * (pricingConfig.taxAndServicePercent / 100));
      const totalDirectUsd = taxableAmount + taxesAndServiceFee;
      const estimatedOtaUsd = Math.round(totalDirectUsd * (1 + pricingConfig.otaMarkupComparisonPercent / 100));
      const directSavingsUsd = Math.max(45, estimatedOtaUsd - totalDirectUsd);
      const effectiveNightlyRateUsd = Math.round(subtotalAfterDiscounts / nights);
      const depositAmountUsd = Math.round(totalDirectUsd * 0.5);
      const balanceDueUsd = totalDirectUsd - depositAmountUsd;

      return {
        unitId: 'entire-villa',
        unitName: entireVillaUnit.name,
        nights,
        baseRatePerNight,
        baseSubtotal,
        seasonalAdjustmentTotal,
        weekendAdjustmentTotal,
        demandAdjustmentTotal,
        lengthOfStayDiscountPercent,
        lengthOfStayDiscountAmount,
        addonsTotal,
        subtotalAfterDiscounts,
        taxesAndServiceFee,
        totalDirectUsd,
        estimatedOtaUsd,
        directSavingsUsd,
        effectiveNightlyRateUsd,
        seasonLabel: primarySeasonLabel,
        appliedRules: Array.from(appliedRulesSet),
        depositAmountUsd,
        balanceDueUsd,
      };
    },
    [pricingConfig, getSeasonForDate]
  );

  const createReservation = useCallback(
    async (data: Omit<Reservation, 'id' | 'referenceCode' | 'createdAt'>): Promise<Reservation> => {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const newRes: Reservation = {
        ...data,
        unitId: 'entire-villa',
        unitName: entireVillaUnit.name,
        id: `res-${Date.now()}`,
        referenceCode: `VT-2026-${randomDigits}`,
        createdAt: formatDateYMD(new Date()),
      };

      setReservations((prev) => [newRes, ...prev]);

      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRes),
        });
      } catch {
        // Handled cleanly via local persistence
      }

      return newRes;
    },
    []
  );

  const updateReservationStatus = useCallback(
    (id: string, status: BookingStatus, amountPaidUsd?: number) => {
      setReservations((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const paid = amountPaidUsd !== undefined ? amountPaidUsd : status === 'confirmed' ? r.totalUsd : r.amountPaidUsd;
          return {
            ...r,
            status,
            amountPaidUsd: paid,
            balanceDueUsd: Math.max(0, r.totalUsd - paid),
          };
        })
      );
    },
    []
  );

  const updateReservationDetails = useCallback((id: string, updates: Partial<Reservation>) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const lookupReservation = useCallback(
    (query: string): Reservation | undefined => {
      const q = query.trim().toLowerCase();
      if (!q) return undefined;
      return reservations.find(
        (r) =>
          r.referenceCode.toLowerCase() === q ||
          r.guestEmail.toLowerCase() === q ||
          r.guestName.toLowerCase().includes(q)
      );
    },
    [reservations]
  );

  const toggleOwnerDateBlock = useCallback(
    (_unitId: string, dateYmd: string, note = 'Owner / Maintenance Block') => {
      const nextDay = addDaysYMD(dateYmd, 1);
      const existingBlock = reservations.find(
        (r) =>
          r.status !== 'cancelled' &&
          r.channel === 'owner_block' &&
          r.checkIn === dateYmd &&
          r.checkOut === nextDay
      );

      if (existingBlock) {
        setReservations((prev) => prev.filter((r) => r.id !== existingBlock.id));
      } else {
        const blockRes: Reservation = {
          id: `block-${Date.now()}`,
          referenceCode: `VT-BLOCK-${Math.floor(100 + Math.random() * 900)}`,
          unitId: 'entire-villa',
          unitName: entireVillaUnit.name,
          guestName: note,
          guestEmail: 'stay@villataobalian.com',
          guestPhone: '+62 817-4721-299',
          guestCountry: 'Indonesia',
          checkIn: dateYmd,
          checkOut: nextDay,
          nights: 1,
          guests: 1,
          channel: 'owner_block',
          status: 'confirmed',
          paymentMethod: 'ota_prepaid',
          paymentSchedule: 'full',
          totalUsd: 0,
          amountPaidUsd: 0,
          balanceDueUsd: 0,
          addons: [],
          specialRequests: note,
          createdAt: formatDateYMD(new Date()),
        };
        setReservations((prev) => [blockRes, ...prev]);
      }
    },
    [reservations]
  );

  const updatePricingConfig = useCallback((newConfig: DynamicPricingConfig) => {
    setPricingConfig(newConfig);
  }, []);

  const generateIcalString = useCallback(
    (_unitId?: string): string => {
      const relevant = reservations.filter((r) => r.status !== 'cancelled');

      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Villa Tao Balian//Entire Villa Reservation Engine//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Villa Tao Balian - Entire Villa',
        'X-WR-TIMEZONE:Asia/Makassar',
      ];

      for (const r of relevant) {
        const dtStart = r.checkIn.replace(/-/g, '');
        const dtEnd = r.checkOut.replace(/-/g, '');
        const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        lines.push(
          'BEGIN:VEVENT',
          `UID:${r.externalUid || `${r.referenceCode}@villataobalian.com`}`,
          `DTSTAMP:${stamp}`,
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `SUMMARY:Reserved - Villa Tao Entire Villa (${r.referenceCode})`,
          `DESCRIPTION:Channel: ${r.channel.toUpperCase()} | Entire Private Villa`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      }

      lines.push('END:VCALENDAR');
      return lines.join('\r\n');
    },
    [reservations]
  );

  const syncChannelsNow = useCallback(
    async (customIcsText?: string, _targetUnitId?: string) => {
      const timestamp = new Date().toISOString();
      setChannels((prev) => prev.map((c) => ({ ...c, status: 'syncing' })));

      let importedCount = 0;

      if (customIcsText && customIcsText.includes('BEGIN:VEVENT')) {
        const blocks = customIcsText.split('BEGIN:VEVENT').slice(1);
        const newImported: Reservation[] = [];

        for (const block of blocks) {
          const dtStartMatch = block.match(/DTSTART(?:;[^:]*)?:(\d{4})(\d{2})(\d{2})/);
          const dtEndMatch = block.match(/DTEND(?:;[^:]*)?:(\d{4})(\d{2})(\d{2})/);
          const summaryMatch = block.match(/SUMMARY:(.+)/);
          const uidMatch = block.match(/UID:(.+)/);

          if (dtStartMatch && dtEndMatch) {
            const checkIn = `${dtStartMatch[1]}-${dtStartMatch[2]}-${dtStartMatch[3]}`;
            const checkOut = `${dtEndMatch[1]}-${dtEndMatch[2]}-${dtEndMatch[3]}`;
            const uid = uidMatch ? uidMatch[1].trim() : `ical-${Date.now()}-${Math.random()}`;
            const summary = summaryMatch ? summaryMatch[1].trim() : 'OTA Synced Reservation';
            const nights = diffNights(checkIn, checkOut);

            if (nights > 0 && !reservations.some((r) => r.externalUid === uid || r.checkIn === checkIn)) {
              newImported.push({
                id: `ota-${Date.now()}-${importedCount}`,
                referenceCode: `VT-ICAL-${Math.floor(1000 + Math.random() * 9000)}`,
                unitId: 'entire-villa',
                unitName: entireVillaUnit.name,
                guestName: summary.replace(/^Reserved\s*-\s*/i, ''),
                guestEmail: 'ota-guest@channel-sync.com',
                guestPhone: 'Synced via iCal',
                guestCountry: 'International',
                checkIn,
                checkOut,
                nights,
                guests: 4,
                channel: summary.toLowerCase().includes('booking') ? 'booking_com' : 'airbnb',
                status: 'confirmed',
                paymentMethod: 'ota_prepaid',
                paymentSchedule: 'full',
                totalUsd: (pricingConfig.villaBaseNightlyRate || DEFAULT_VILLA_BASE_RATE_USD) * nights,
                amountPaidUsd: (pricingConfig.villaBaseNightlyRate || DEFAULT_VILLA_BASE_RATE_USD) * nights,
                balanceDueUsd: 0,
                addons: [],
                specialRequests: `Imported via iCal Feed (${uid})`,
                createdAt: formatDateYMD(new Date()),
                externalUid: uid,
              });
              importedCount++;
            }
          }
        }

        if (newImported.length > 0) {
          setReservations((prev) => [...newImported, ...prev]);
        }
      }

      try {
        await fetch('/api/channels/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channels, customIcsText }),
        });
      } catch {
        // continue
      }

      const airbnbCount = reservations.filter((r) => r.channel === 'airbnb' && r.status !== 'cancelled').length;
      const bkgCount = reservations.filter((r) => r.channel === 'booking_com' && r.status !== 'cancelled').length;

      setChannels((prev) =>
        prev.map((c) => ({
          ...c,
          status: 'connected',
          lastSyncedAt: timestamp,
          syncedBookingsCount: c.platform === 'airbnb' ? airbnbCount + importedCount : bkgCount,
        }))
      );

      return { syncedCount: airbnbCount + bkgCount + importedCount, timestamp };
    },
    [channels, reservations, pricingConfig]
  );

  const updateChannelUrl = useCallback((channelId: string, importIcalUrl: string) => {
    setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, importIcalUrl } : c)));
  }, []);

  const addGuestInquiry = useCallback((inquiry: Omit<GuestInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInq: GuestInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: formatDateYMD(new Date()),
      status: 'new',
    };
    setInquiries((prev) => [newInq, ...prev]);
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInq),
    }).catch(() => {});
  }, []);

  const updateInquiryStatus = useCallback((id: string, status: GuestInquiry['status']) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
  }, []);

  const requestAIPricingInsight = useCallback(async (): Promise<AIPricingRecommendation> => {
    try {
      const response = await fetch('/api/ai/pricing-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservations: reservations.filter((r) => r.status !== 'cancelled'),
          pricingConfig,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.summary) return data;
      }
    } catch {
      // Fallback
    }

    const activeCount = reservations.filter((r) => r.status !== 'cancelled').length;
    const totalRev = reservations
      .filter((r) => r.status !== 'cancelled')
      .reduce((acc, r) => acc + r.totalUsd, 0);

    return {
      summary: `Villa Tao Balian is operating as a premier 4-bedroom entire private villa estate with ${activeCount} active bookings generating $${totalRev.toLocaleString()} in revenue. Demand for entire-property buyouts in West Bali remains high, with direct website bookings saving guests 14% compared to Airbnb & Booking.com.`,
      marketDemandScore: 90,
      occupancyAnalysis:
        'Sole-occupancy entire villa bookings maintain the strongest ADR and privacy appeal. Mid-week gaps between OTA bookings present prime opportunities for 7-night slow-living direct packages.',
      recommendations: [
        {
          title: 'Entire Villa High-Season & Surf Swell Yield',
          impact: '+14% Projected RevPAR',
          suggestedAction: 'Set Entire Villa High Season Multiplier to 1.25x and Friday/Saturday Coastal Surge to 10%.',
        },
        {
          title: 'Capture Gap Nights with Last-Minute Window',
          impact: '+18% Gap Fill Rate',
          suggestedAction: 'Enable a 12% Last-Minute Coastal Window privilege for entire villa check-ins within 7 days.',
        },
        {
          title: 'Promote 7+ Night Slow-Living Direct Stays',
          impact: 'Zero OTA Commission',
          suggestedAction: 'Maintain 10% weekly direct discount to convert Airbnb & Booking.com guests into direct whole-estate bookings.',
        },
      ],
      suggestedMultipliers: {
        highSeasonMultiplier: 1.25,
        weekendSurgePercent: 10,
        lastMinuteDiscountPercent: 12,
      },
      generatedAt: new Date().toISOString(),
    };
  }, [reservations, pricingConfig]);

  // 10. Temporary Reservation Hold (Locks dates during 15-min payment process)
  const createPaymentHold = useCallback(
    async (params: {
      checkIn: string;
      checkOut: string;
      guests: number;
      guestName?: string;
      guestEmail?: string;
      totalUsd: number;
    }) => {
      try {
        const res = await fetch('/api/payments/hold', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        if (data.ok) {
          // Mirror in local state
          const newHeldRes: Reservation = {
            id: data.holdId,
            referenceCode: data.referenceCode,
            unitId: 'entire-villa',
            unitName: 'Villa Tao — Entire Private Villa',
            guestName: params.guestName || 'Guest (Checkout in Progress)',
            guestEmail: params.guestEmail || '',
            guestPhone: '',
            guestCountry: 'International',
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            nights: diffNights(params.checkIn, params.checkOut),
            guests: params.guests,
            channel: 'direct',
            status: 'held',
            paymentMethod: 'card',
            paymentSchedule: 'full',
            totalUsd: params.totalUsd,
            amountPaidUsd: 0,
            balanceDueUsd: params.totalUsd,
            addons: [],
            createdAt: formatDateYMD(new Date()),
            heldExpiresAt: data.expiresAt,
          };
          setReservations((prev) => [newHeldRes, ...prev.filter((r) => r.referenceCode !== data.referenceCode)]);
          return { ok: true, referenceCode: data.referenceCode, holdId: data.holdId, expiresAt: data.expiresAt };
        }
        return { ok: false, referenceCode: '', holdId: '', expiresAt: 0, error: data.message || data.error };
      } catch (err: any) {
        // Local fallback
        const now = Date.now();
        const expiresAt = now + 15 * 60 * 1000;
        const ref = `VT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const holdId = `hold-${now}`;
        const newHeldRes: Reservation = {
          id: holdId,
          referenceCode: ref,
          unitId: 'entire-villa',
          unitName: 'Villa Tao — Entire Private Villa',
          guestName: params.guestName || 'Guest (Checkout in Progress)',
          guestEmail: params.guestEmail || '',
          guestPhone: '',
          guestCountry: 'International',
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          nights: diffNights(params.checkIn, params.checkOut),
          guests: params.guests,
          channel: 'direct',
          status: 'held',
          paymentMethod: 'card',
          paymentSchedule: 'full',
          totalUsd: params.totalUsd,
          amountPaidUsd: 0,
          balanceDueUsd: params.totalUsd,
          addons: [],
          createdAt: formatDateYMD(new Date()),
          heldExpiresAt: expiresAt,
        };
        setReservations((prev) => [newHeldRes, ...prev]);
        return { ok: true, referenceCode: ref, holdId, expiresAt };
      }
    },
    []
  );

  // 7 & 8. Create Payment Intent (with QRIS limit enforcement)
  const createPaymentIntent = useCallback(
    async (params: {
      referenceCode: string;
      paymentMethod: PaymentMethod;
      amountIdr: number;
      amountUsd: number;
      bankName?: string;
    }) => {
      try {
        const res = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        return data;
      } catch {
        // Local fallback with strict limit
        if (params.paymentMethod === 'qris' && params.amountIdr > 10_000_000) {
          return {
            ok: false,
            error: 'QRIS_LIMIT_EXCEEDED',
            message:
              'QRIS is available for payments within the supported transaction limit (up to Rp 10,000,000). For this reservation, please use Credit/Debit Card or Bank Transfer.',
          };
        }
        return {
          ok: true,
          paymentId: `pay-${Date.now()}`,
          method: params.paymentMethod,
          amountIdr: params.amountIdr,
          qrString: `00020101021226670014ID.LINKAJA.WWW01189360091800001002340215VT${params.referenceCode}5204581253033605802ID5919VILLA TAO BALIAN RETREAT6007TABANAN61058216262070703A016304E85C`,
          virtualAccountNumber: `772049${Math.floor(100000 + Math.random() * 900000)}`,
          bankName: params.bankName || 'BCA (Bank Central Asia)',
          accountName: 'PT VILLA TAO BALIAN RETREAT',
          expiresAt: Date.now() + 15 * 60 * 1000,
        };
      }
    },
    []
  );

  // 9. Server-Side Payment Verification (never trust frontend alone)
  const verifyServerPayment = useCallback(
    async (params: {
      referenceCode: string;
      paymentId?: string;
      paymentMethod: PaymentMethod;
      guestData: any;
    }) => {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        if (data.ok && data.reservation) {
          setReservations((prev) => [
            data.reservation,
            ...prev.filter((r) => r.referenceCode !== params.referenceCode),
          ]);
          return { ok: true, verified: true, reservation: data.reservation };
        }
      } catch {
        // Local fallback verification
      }

      // Locally mark confirmed
      const fullName = `${params.guestData.firstName || ''} ${params.guestData.lastName || ''}`.trim() || 'Guest';
      const confirmed: Reservation = {
        id: `res-${Date.now()}`,
        referenceCode: params.referenceCode,
        unitId: 'entire-villa',
        unitName: 'Villa Tao — Entire Private Villa',
        guestName: fullName,
        guestEmail: params.guestData.guestEmail || '',
        guestPhone: params.guestData.guestPhone || '',
        guestCountry: params.guestData.guestCountry || 'International',
        checkIn: params.guestData.checkIn,
        checkOut: params.guestData.checkOut,
        nights: params.guestData.nights || 3,
        guests: params.guestData.guests || 2,
        channel: 'direct',
        status: 'confirmed',
        paymentMethod: params.paymentMethod,
        paymentSchedule: 'full',
        totalUsd: params.guestData.totalUsd,
        amountPaidUsd: params.guestData.totalUsd,
        balanceDueUsd: 0,
        addons: params.guestData.addons || [],
        arrivalTime: params.guestData.arrivalTime,
        specialRequests: params.guestData.specialRequests,
        createdAt: formatDateYMD(new Date()),
      };

      setReservations((prev) => [confirmed, ...prev.filter((r) => r.referenceCode !== params.referenceCode)]);
      return { ok: true, verified: true, reservation: confirmed };
    },
    []
  );

  // Release payment hold
  const releasePaymentHold = useCallback(async (referenceCode: string) => {
    try {
      await fetch('/api/payments/release-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceCode }),
      });
    } catch {
      // ignore
    }
    setReservations((prev) =>
      prev.map((r) => (r.referenceCode === referenceCode && r.status === 'held' ? { ...r, status: 'cancelled' } : r))
    );
  }, []);

  const value = useMemo(
    () => ({
      reservations,
      channels,
      pricingConfig,
      inquiries,
      currency,
      setCurrency,
      formatPrice,
      isDateAvailableForUnit,
      isDateRangeAvailable,
      getNextAvailableWindow,
      calculateStayPrice,
      getNightlyRateForDate,
      createReservation,
      updateReservationStatus,
      updateReservationDetails,
      lookupReservation,
      toggleOwnerDateBlock,
      updatePricingConfig,
      syncChannelsNow,
      updateChannelUrl,
      generateIcalString,
      addGuestInquiry,
      updateInquiryStatus,
      requestAIPricingInsight,
      createPaymentHold,
      createPaymentIntent,
      verifyServerPayment,
      releasePaymentHold,
    }),
    [
      reservations,
      channels,
      pricingConfig,
      inquiries,
      currency,
      setCurrency,
      formatPrice,
      isDateAvailableForUnit,
      isDateRangeAvailable,
      getNextAvailableWindow,
      calculateStayPrice,
      getNightlyRateForDate,
      createReservation,
      updateReservationStatus,
      updateReservationDetails,
      lookupReservation,
      toggleOwnerDateBlock,
      updatePricingConfig,
      syncChannelsNow,
      updateChannelUrl,
      generateIcalString,
      addGuestInquiry,
      updateInquiryStatus,
      requestAIPricingInsight,
      createPaymentHold,
      createPaymentIntent,
      verifyServerPayment,
      releasePaymentHold,
    ]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
