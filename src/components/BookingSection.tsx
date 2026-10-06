import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  ArrowUpRight,
  Check,
  Lock,
  CreditCard,
  Building2,
  Calendar,
  Search,
  Printer,
  Sparkles,
  Users,
  Waves,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import {
  villaTaoLinks,
  getWhatsAppUrl,
  entireVillaUnit,
  bookingAddons,
  officialWhatsAppNumber,
} from '../data/villaData';
import { useBooking, diffNights } from '../context/BookingContext';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { CurrencyCode, PaymentMethod, Reservation } from '../types';

interface BookingSectionProps {
  onOpenManageBooking?: (initialRef?: string) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  onOpenManageBooking,
}) => {
  const {
    currency,
    setCurrency,
    formatPrice,
    getNextAvailableWindow,
    isDateRangeAvailable,
    calculateStayPrice,
    createReservation,
  } = useBooking();

  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Booking Flow Steps:
  // 1 = Check Dates & Villa Availability
  // 2 = Guest Information & Direct Payment
  // 3 = Booking Confirmation
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);

  // Guest Information state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCountry, setGuestCountry] = useState('');
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment state
  const [paymentSchedule, setPaymentSchedule] = useState<'full' | 'deposit_50'>('full');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Initialize default available window
  useEffect(() => {
    const windowDates = getNextAvailableWindow('entire-villa', 3);
    setCheckIn(windowDates.checkIn);
    setCheckOut(windowDates.checkOut);
  }, [getNextAvailableWindow]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const priceBreakdown = calculateStayPrice(checkIn, checkOut, guests, selectedAddons);
  const rangeValidation = isDateRangeAvailable('entire-villa', checkIn, checkOut);

  const amountDueNowUsd =
    paymentSchedule === 'deposit_50' ? priceBreakdown.depositAmountUsd : priceBreakdown.totalDirectUsd;

  const formatCardInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleProceedToGuestDetails = () => {
    setFormError(null);
    if (!rangeValidation.available) {
      setFormError(rangeValidation.reason || 'Villa Tao is unavailable for the selected dates. Please choose open dates.');
      return;
    }
    setBookingStep(2);
    // Smooth scroll to step 2 area
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !guestEmail.trim() || !guestPhone.trim()) {
      setFormError('Please provide your first name, last name, email address, and WhatsApp/phone number.');
      return;
    }

    if (!rangeValidation.available) {
      setFormError('Villa Tao is no longer available for the selected dates. Please choose open dates.');
      return;
    }

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 12 || !cardExpiry || !cardCvc) {
        setFormError('Please enter valid credit card details to complete instant confirmation.');
        return;
      }
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 850));

    const status =
      paymentMethod === 'card'
        ? paymentSchedule === 'full'
          ? 'confirmed'
          : 'deposit_paid'
        : 'pending';

    const amountPaid = paymentMethod === 'card' ? amountDueNowUsd : 0;

    const created = await createReservation({
      unitId: 'entire-villa',
      unitName: 'Villa Tao — Entire Private Villa',
      guestName: fullName,
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      guestCountry: guestCountry.trim() || 'International',
      checkIn,
      checkOut,
      nights: priceBreakdown.nights,
      guests,
      channel: paymentMethod === 'whatsapp_concierge' ? 'whatsapp' : 'direct',
      status,
      paymentMethod,
      paymentSchedule,
      totalUsd: priceBreakdown.totalDirectUsd,
      amountPaidUsd: amountPaid,
      balanceDueUsd: priceBreakdown.totalDirectUsd - amountPaid,
      addons: selectedAddons,
      arrivalTime,
      specialRequests,
    });

    setIsProcessing(false);
    setConfirmedReservation(created);
    setBookingStep(3);

    if (paymentMethod === 'whatsapp_concierge') {
      const msg = `*Villa Tao Direct Reservation (${created.referenceCode})*\n• Entire Private Villa Rental\n• Check-in: ${created.checkIn}\n• Check-out: ${created.checkOut} (${created.nights} nights)\n• Guests: ${created.guests}\n• Guest: ${created.guestName} (${created.guestEmail})\n• Total Direct Rate: ${formatPrice(created.totalUsd)}\nPlease confirm my direct reservation.`;
      window.open(getWhatsAppUrl('booking', msg), '_blank');
    }
  };

  return (
    <section id="booking" className="py-24 sm:py-32 bg-[#FAF8F5] text-[#2C221E] relative border-t border-[#2C221E]/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Header & Currency Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8C7355] block mb-3">
              DIRECT RESERVATIONS • SOLE PRIVATE OCCUPANCY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
              Book Your Stay
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#2C221E]/75 font-light leading-relaxed">
              Villa Tao is exclusively yours during your stay. Reserve the entire private oceanfront estate with all 4 bedrooms, private infinity pool, and dedicated staff.
            </p>
          </div>

          {/* Currency Switcher & Manage Booking Link */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <div className="inline-flex items-center border border-[#2C221E]/15 bg-[#F5F2EB] p-1">
              {(['USD', 'IDR', 'EUR', 'AUD'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    currency === c
                      ? 'bg-[#2C221E] text-[#FAF8F5]'
                      : 'text-[#2C221E]/65 hover:text-[#2C221E]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {onOpenManageBooking && (
              <button
                type="button"
                onClick={() => onOpenManageBooking()}
                className="inline-flex items-center space-x-2 px-4 py-2.5 min-h-[38px] border border-[#2C221E]/20 text-[10px] uppercase tracking-[0.2em] text-[#2C221E] hover:bg-[#F5F2EB] transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[#8C7355]" />
                <span>Manage Existing Booking</span>
              </button>
            )}
          </div>
        </div>

        {/* STEP 3: BOOKING CONFIRMATION SCREEN */}
        {bookingStep === 3 && confirmedReservation ? (
          <div className="max-w-4xl mx-auto bg-[#F5F2EB] border border-[#2C221E]/15 p-6 sm:p-10 space-y-6 animate-in fade-in duration-300 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2C221E]/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#8C7355] block mb-1">
                  OFFICIAL RESERVATION ITINERARY
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2C221E] font-normal">
                  Your Villa Tao Escape Is Reserved
                </h3>
                <p className="text-xs text-[#2C221E]/70 font-light mt-1">
                  Villa Tao — Entire Private Villa exclusively reserved for your stay.
                </p>
              </div>
              <div className="bg-[#2C221E] text-[#FAF8F5] px-4 py-2.5 text-center shrink-0">
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#C5A880] block">
                  REFERENCE CODE
                </span>
                <span className="font-mono text-sm tracking-widest">
                  {confirmedReservation.referenceCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                  Guest &amp; Property
                </span>
                <p className="font-medium text-[#2C221E]">{confirmedReservation.guestName}</p>
                <p className="text-[#2C221E]/70 font-light">{confirmedReservation.guestEmail}</p>
                <p className="text-[#2C221E]/70 font-light">{confirmedReservation.guestPhone}</p>
                <p className="text-[#2C221E] font-serif text-base pt-1">
                  Villa Tao — Entire Private Villa (All 4 Bedrooms Included)
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                  Dates &amp; Settlement Status
                </span>
                <p className="text-[#2C221E]">
                  Check-in: <span className="font-medium">{confirmedReservation.checkIn}</span> (from 14:00)
                </p>
                <p className="text-[#2C221E]">
                  Check-out: <span className="font-medium">{confirmedReservation.checkOut}</span> (by 11:00)
                </p>
                <p className="text-[#2C221E]/75 font-light">
                  {confirmedReservation.nights} Nights • {confirmedReservation.guests} Guest(s)
                </p>
                <p className="pt-1 text-xs uppercase tracking-[0.18em] text-[#8C7355] font-medium">
                  Status: {confirmedReservation.status.replace('_', ' ').toUpperCase()} • Paid:{' '}
                  {formatPrice(confirmedReservation.amountPaidUsd)}
                </p>
              </div>
            </div>

            {confirmedReservation.paymentMethod === 'bank_transfer' && (
              <div className="p-4 bg-[#FAF8F5] border border-[#2C221E]/10 text-xs space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-medium block">
                  Bank Transfer &amp; Wise Settlement Instructions
                </span>
                <p className="text-[#2C221E]/80 font-light">
                  Your dates are held for 24 hours. Please remit{' '}
                  <strong className="font-medium">{formatPrice(amountDueNowUsd)}</strong> referencing{' '}
                  <strong className="font-mono">{confirmedReservation.referenceCode}</strong>:
                </p>
                <p className="font-mono text-[11px] text-[#2C221E] pt-1">
                  Bank Central Asia (BCA) Bali • Account: 772-049-8821 • SWIFT: CENAIDJA • Name: PT Villa Tao Balian Retreat
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-[#2C221E]/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={getWhatsAppUrl(
                    'booking',
                    `Hello Villa Tao Concierge, my confirmed booking reference is ${confirmedReservation.referenceCode} (${confirmedReservation.checkIn} to ${confirmedReservation.checkOut}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-[#2C221E] text-[#FAF8F5] text-[11px] uppercase tracking-[0.2em] hover:bg-[#3E342B] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Message Concierge on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-2 px-4 py-3 border border-[#2C221E]/20 text-[11px] uppercase tracking-[0.2em] text-[#2C221E] hover:bg-[#FAF8F5] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Itinerary</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmedReservation(null);
                  setBookingStep(1);
                  const nextWin = getNextAvailableWindow('entire-villa', 3);
                  setCheckIn(nextWin.checkIn);
                  setCheckOut(nextWin.checkOut);
                }}
                className="text-xs uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#2C221E] underline py-2"
              >
                Book Another Stay
              </button>
            </div>
          </div>
        ) : (
          /* MAIN 12-COLUMN BOOKING INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (7 cols): Step 1 Date & Villa Availability OR Step 2 Guest Information */}
            <div className="lg:col-span-7 space-y-8">
              {/* STEP 1: DATE, GUEST & CALENDAR SELECTION */}
              {bookingStep === 1 ? (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* ONE SINGLE ACCOMMODATION CARD: VILLA TAO — ENTIRE PRIVATE VILLA */}
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/15 overflow-hidden">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EAE4D6]">
                      <img
                        src={entireVillaUnit.image}
                        alt="Villa Tao Balian authentic tropical architecture and infinity pool facing the sea"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 bg-[#2C221E]/90 text-[#FAF8F5] px-3.5 py-1 text-[10px] uppercase tracking-[0.24em] font-medium backdrop-blur-xs">
                        SOLE PRIVATE OCCUPANCY
                      </div>
                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <span className="text-[10px] uppercase tracking-[0.26em] text-[#C5A880] block mb-1">
                          VILLA TAO
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
                          Entire Private Villa
                        </h3>
                        <p className="text-xs text-white/90 font-light mt-1">
                          Private tropical villa in Balian, Bali.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Subheading & Core Promise */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2C221E]/10">
                        <div>
                          <p className="text-sm font-medium text-[#2C221E]">
                            The entire villa is exclusively yours during your stay.
                          </p>
                          <p className="text-xs text-[#8C7355] font-normal mt-0.5">
                            4 Bedrooms · Private Pool · Ocean View
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('booking-dates-selection');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-5 py-2.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#4A3B2C] transition-colors self-start sm:self-auto"
                        >
                          BOOK THE ENTIRE VILLA
                        </button>
                      </div>

                      {/* Villa Highlights Bar */}
                      <div className="grid grid-cols-3 gap-3 py-3 border-b border-[#2C221E]/10 text-xs">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-[#8C7355] shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#2C221E]/60 block">Capacity</span>
                            <span className="font-medium text-[#2C221E]">Up to 10 Guests</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Waves className="w-4 h-4 text-[#8C7355] shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#2C221E]/60 block">Bedrooms</span>
                            <span className="font-medium text-[#2C221E]">All 4 Suites</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-[#8C7355] shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#2C221E]/60 block">Setting</span>
                            <span className="font-medium text-[#2C221E]">Ocean &amp; Pool</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#2C221E]/75 font-light leading-relaxed">
                        Your reservation includes exclusive private access to the four architectural bedroom suites, private infinity lap pool, sunken living pavilion, ocean sun decks, rooftop lawn, and dedicated daily housekeeping and concierge team.
                      </p>
                    </div>
                  </div>

                  {/* STEP 1: CHECK-IN, CHECK-OUT, GUEST COUNT */}
                  <div id="booking-dates-selection" className="bg-[#F5F2EB] p-5 sm:p-6 border border-[#2C221E]/12 space-y-4 scroll-mt-28">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block">
                      STEP 1 • SELECT DATES &amp; GUESTS
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/70 mb-1.5 font-medium">
                          Check-In Date
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/70 mb-1.5 font-medium">
                          Check-Out Date
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/70 mb-1.5 font-medium">
                          Guests (Max 10)
                        </label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        >
                          {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                            <option key={num} value={num}>
                              {num} Guests (Entire Villa)
                            </option>
                          ))}
                          <option value={1}>1 Guest (Entire Villa)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: AVAILABILITY CALENDAR FOR THE ENTIRE VILLA */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block">
                        STEP 2 • ENTIRE VILLA AVAILABILITY CALENDAR
                      </span>
                      <span className="text-[10px] text-[#2C221E]/60 font-light">
                        1 Booking = Entire Villa Reserved
                      </span>
                    </div>

                    <AvailabilityCalendar
                      unitId="entire-villa"
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onSelectDates={(newIn, newOut) => {
                        setCheckIn(newIn);
                        setCheckOut(newOut);
                        setFormError(null);
                      }}
                    />
                  </div>

                  {/* Optional Curated Enhancements */}
                  <div className="space-y-3">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-[#8C7355] block">
                      Optional Curated Enhancements
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {bookingAddons.map((addon) => {
                        const active = selectedAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className={`p-4 border cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                              active
                                ? 'bg-[#F5F2EB] border-[#2C221E]'
                                : 'bg-[#FAF8F5] border-[#2C221E]/10 hover:border-[#2C221E]/30'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${
                                  active
                                    ? 'bg-[#2C221E] border-[#2C221E] text-[#FAF8F5]'
                                    : 'border-[#2C221E]/30'
                                }`}
                              >
                                {active && <Check className="w-3 h-3" />}
                              </div>
                              <div>
                                <h5 className="font-serif text-sm sm:text-base text-[#2C221E] font-normal">
                                  {addon.name}
                                </h5>
                                <p className="text-xs text-[#2C221E]/65 font-light mt-0.5">
                                  {addon.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-medium text-[#2C221E] block">
                                +{formatPrice(addon.priceUsd)}
                              </span>
                              <span className="text-[10px] text-[#2C221E]/55 font-light">
                                {addon.perNight ? '/ guest / night' : 'one-time'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {formError && (
                    <div className="p-3.5 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E]">
                      {formError}
                    </div>
                  )}

                  {/* CHECK AVAILABILITY & CONTINUE BUTTON */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleProceedToGuestDetails}
                      className="w-full py-4 min-h-[48px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.24em] transition-colors"
                    >
                      {rangeValidation.available
                        ? 'CONFIRM AVAILABILITY & CONTINUE TO BOOK'
                        : 'CHECK AVAILABILITY FOR THESE DATES'}
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2: GUEST INFORMATION & DIRECT PAYMENT */
                <form onSubmit={handleCompleteBooking} className="space-y-8 animate-in fade-in duration-200">
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/10 p-5 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2C221E]/10 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] block">
                          STEP 5 • GUEST INFORMATION
                        </span>
                        <h3 className="font-serif text-xl text-[#2C221E] font-normal">
                          Guest Details
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#2C221E] underline"
                      >
                        Change Dates
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Alexander"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Sterling"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="e.g. alexander@domain.com"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+61 400 000 000"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1">
                          Country of Residence
                        </label>
                        <input
                          type="text"
                          value={guestCountry}
                          onChange={(e) => setGuestCountry(e.target.value)}
                          placeholder="e.g. Australia, Singapore, UK"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1">
                          Estimated Arrival Time
                        </label>
                        <select
                          value={arrivalTime}
                          onChange={(e) => setArrivalTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E]"
                        >
                          <option value="14:00">14:00 (Standard Check-in)</option>
                          <option value="15:00">15:00 - 17:00</option>
                          <option value="18:00">18:00 - 20:00 (Sunset / Evening)</option>
                          <option value="21:00+">Late Evening Arrival (21:00+)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1">
                        Special Requests / Concierge Notes
                      </label>
                      <input
                        type="text"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Dietary requests, airport transfer flight number, celebration setup..."
                        className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/15 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                      />
                    </div>
                  </div>

                  {/* STEP 6: PAYMENT */}
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/10 p-5 sm:p-7 space-y-5">
                    <div className="flex items-center justify-between border-b border-[#2C221E]/10 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] block">
                          STEP 6 • PAYMENT SETTLEMENT
                        </span>
                        <h3 className="font-serif text-xl text-[#2C221E] font-normal">
                          Payment Option
                        </h3>
                      </div>
                      <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-[0.18em] text-[#8C7355]">
                        <Lock className="w-3 h-3" />
                        <span>256-Bit Encrypted</span>
                      </span>
                    </div>

                    {/* Schedule Choice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentSchedule('full')}
                        className={`p-3.5 border text-left transition-colors ${
                          paymentSchedule === 'full'
                            ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]'
                            : 'bg-[#FAF8F5] text-[#2C221E] border-[#2C221E]/15'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] block opacity-75">
                          100% Full Settlement
                        </span>
                        <span className="font-serif text-base block mt-0.5">
                          Pay {formatPrice(priceBreakdown.totalDirectUsd)} Now
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentSchedule('deposit_50')}
                        className={`p-3.5 border text-left transition-colors ${
                          paymentSchedule === 'deposit_50'
                            ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]'
                            : 'bg-[#FAF8F5] text-[#2C221E] border-[#2C221E]/15'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] block opacity-75">
                          50% Reservation Deposit
                        </span>
                        <span className="font-serif text-base block mt-0.5">
                          Pay {formatPrice(priceBreakdown.depositAmountUsd)} Now
                        </span>
                      </button>
                    </div>

                    {/* Method Choice */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`py-3 px-3 border text-xs uppercase tracking-[0.16em] flex items-center justify-center space-x-2 transition-colors ${
                          paymentMethod === 'card'
                            ? 'bg-[#FAF8F5] border-[#2C221E] text-[#2C221E] font-medium'
                            : 'bg-transparent border-[#2C221E]/15 text-[#2C221E]/65'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Credit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className={`py-3 px-3 border text-xs uppercase tracking-[0.16em] flex items-center justify-center space-x-2 transition-colors ${
                          paymentMethod === 'bank_transfer'
                            ? 'bg-[#FAF8F5] border-[#2C221E] text-[#2C221E] font-medium'
                            : 'bg-transparent border-[#2C221E]/15 text-[#2C221E]/65'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Wise / Bank Wire</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('whatsapp_concierge')}
                        className={`py-3 px-3 border text-xs uppercase tracking-[0.16em] flex items-center justify-center space-x-2 transition-colors ${
                          paymentMethod === 'whatsapp_concierge'
                            ? 'bg-[#FAF8F5] border-[#2C221E] text-[#2C221E] font-medium'
                            : 'bg-transparent border-[#2C221E]/15 text-[#2C221E]/65'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>WhatsApp Concierge</span>
                      </button>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/70 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            required
                            value={cardHolder || `${firstName} ${lastName}`.trim()}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Name on card"
                            className="w-full px-3.5 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/15 text-xs text-[#2C221E]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-6">
                            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/70 mb-1">
                              Card Number (Visa / Mastercard / Amex)
                            </label>
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                              placeholder="4532 •••• •••• ••••"
                              className="w-full px-3.5 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/15 text-xs font-mono text-[#2C221E]"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/70 mb-1">
                              Expiry (MM/YY)
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                              placeholder="08/28"
                              className="w-full px-3.5 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/20 text-xs font-mono text-[#2C221E]"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/70 mb-1">
                              Security CVC
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full px-3.5 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/20 text-xs font-mono text-[#2C221E]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank_transfer' && (
                      <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#2C221E]/10 text-xs text-[#2C221E]/80 font-light space-y-1.5">
                        <p className="font-medium text-[#2C221E]">
                          Direct International Wise / SWIFT &amp; Local Indonesian BCA Transfer
                        </p>
                        <p>
                          Completing this step places an immediate 24-hour hold on Villa Tao for your dates and issues your official reservation reference and wire instructions.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'whatsapp_concierge' && (
                      <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#2C221E]/10 text-xs text-[#2C221E]/80 font-light space-y-1.5">
                        <p className="font-medium text-[#2C221E]">
                          Villa Tao Concierge Assisted Booking
                        </p>
                        <p>
                          Registers your entire villa reservation in our master calendar and connects you directly with our Balian concierge on WhatsApp ({officialWhatsAppNumber}) to finalize payment or tailored arrangements.
                        </p>
                      </div>
                    )}
                  </div>

                  {formError && (
                    <div className="p-3.5 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E]">
                      {formError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="w-full sm:w-auto px-6 py-4 min-h-[48px] border border-[#2C221E]/25 text-xs uppercase tracking-[0.2em] text-[#2C221E] hover:bg-[#F5F2EB] transition-colors"
                    >
                      Back to Dates
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full flex-1 py-4 min-h-[48px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.24em] transition-colors disabled:opacity-50"
                    >
                      {isProcessing
                        ? 'PROCESSING RESERVATION...'
                        : paymentMethod === 'card'
                        ? `CONFIRM & PAY • ${formatPrice(amountDueNowUsd)}`
                        : paymentMethod === 'bank_transfer'
                        ? `RESERVE VILLA & ISSUE WIRE DETAILS • ${formatPrice(amountDueNowUsd)}`
                        : 'REGISTER RESERVATION & OPEN WHATSAPP'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column (5 cols): STEP 3 & STEP 4 DYNAMIC TOTAL PRICE CARD */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              {/* STEP 3 & 4: YOUR STAY & DYNAMIC TOTAL PRICE */}
              <div className="bg-[#F5F2EB] border border-[#2C221E]/12 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-[#8C7355] block mb-1">
                    YOUR STAY
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2C221E] font-normal leading-snug">
                    Villa Tao — Entire Private Villa
                  </h3>
                  <p className="text-xs text-[#2C221E]/70 font-light mt-1">
                    {checkIn && checkOut
                      ? `${checkIn} → ${checkOut} (${priceBreakdown.nights} ${
                          priceBreakdown.nights === 1 ? 'Night' : 'Nights'
                        })`
                      : 'Select dates'} • {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="py-2.5 px-3 bg-[#FAF8F5] border border-[#2C221E]/10 flex items-center justify-between text-xs">
                  <span className="text-[#2C221E]/70">Property Status</span>
                  {rangeValidation.available ? (
                    <span className="text-[#8C7355] font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Available for Selected Dates</span>
                    </span>
                  ) : (
                    <span className="text-[#8C7355] font-medium">
                      Reserved for Selected Dates
                    </span>
                  )}
                </div>

                {/* Rate Breakdown */}
                <div className="space-y-2.5 text-xs border-t border-[#2C221E]/10 pt-4">
                  <div className="flex items-center justify-between text-[#2C221E]/80">
                    <span>
                      Entire Villa Nightly Rate ({priceBreakdown.nights}{' '}
                      {priceBreakdown.nights === 1 ? 'night' : 'nights'})
                    </span>
                    <span>{formatPrice(priceBreakdown.subtotalAfterDiscounts)}</span>
                  </div>

                  <div className="text-[11px] text-[#2C221E]/60 flex items-center justify-between">
                    <span>Effective Rate</span>
                    <span className="font-mono">
                      {formatPrice(priceBreakdown.effectiveNightlyRateUsd)} / night
                    </span>
                  </div>

                  {priceBreakdown.lengthOfStayDiscountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#8C7355] font-medium">
                      <span>
                        Slow-Living {priceBreakdown.lengthOfStayDiscountPercent}% Privilege
                      </span>
                      <span>-{formatPrice(priceBreakdown.lengthOfStayDiscountAmount)}</span>
                    </div>
                  )}

                  {priceBreakdown.addonsTotal > 0 && (
                    <div className="flex items-center justify-between text-[#2C221E]/80">
                      <span>Curated Enhancements</span>
                      <span>+{formatPrice(priceBreakdown.addonsTotal)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#2C221E]/65 pt-1">
                    <span>Villa Care &amp; Tax (10%)</span>
                    <span>{formatPrice(priceBreakdown.taxesAndServiceFee)}</span>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#2C221E]/15 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] block">
                        TOTAL ENTIRE VILLA RATE
                      </span>
                      <span className="text-[11px] text-[#2C221E]/60 font-light">
                        {priceBreakdown.nights} nights • {guests} guests
                      </span>
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl text-[#2C221E]">
                      {formatPrice(priceBreakdown.totalDirectUsd)}
                    </span>
                  </div>
                </div>

                {/* Direct Booking Privilege vs OTA */}
                <div className="p-4 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-[0.18em] text-[10px] text-[#8C7355] font-medium">
                      DIRECT WEBSITE PRIVILEGE
                    </span>
                    <span className="text-[11px] text-[#2C221E]/50 line-through">
                      OTA Est. {formatPrice(priceBreakdown.estimatedOtaUsd)}
                    </span>
                  </div>
                  <p className="text-[#2C221E]/80 font-light leading-relaxed">
                    Save <strong className="font-medium text-[#2C221E]">{formatPrice(priceBreakdown.directSavingsUsd)}</strong>{' '}
                    compared to Airbnb and Booking.com platform fees, plus receive complimentary chilled welcome coconuts, tropical fruit basket, and direct concierge priority.
                  </p>
                </div>
              </div>

              {/* Official Partner Channels */}
              <div className="bg-[#FAF8F5] border border-[#2C221E]/12 p-6 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block">
                  OFFICIAL PARTNER PLATFORMS
                </span>
                <p className="text-xs text-[#2C221E]/70 font-light leading-relaxed">
                  Villa Tao is also listed on official partner platforms with real-time calendar synchronization:
                </p>

                <div className="space-y-2.5 pt-1">
                  <a
                    id="booking-whatsapp-direct-btn"
                    href={getWhatsAppUrl(
                      'booking',
                      `Hello Villa Tao, I would like to inquire about reserving the entire private villa from ${checkIn} to ${checkOut} (${guests} guests).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 border border-[#2C221E]/20 hover:border-[#2C221E] text-xs uppercase tracking-[0.2em] text-[#2C221E] flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Direct WhatsApp Concierge</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    id="booking-airbnb-btn"
                    href={villaTaoLinks.airbnb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 border border-[#2C221E]/15 hover:border-[#2C221E] text-xs uppercase tracking-[0.2em] text-[#2C221E]/80 hover:text-[#2C221E] flex items-center justify-between transition-colors"
                  >
                    <span>Airbnb Official Listing</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    id="booking-bookingcom-btn"
                    href={villaTaoLinks.bookingCom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 border border-[#2C221E]/15 hover:border-[#2C221E] text-xs uppercase tracking-[0.2em] text-[#2C221E]/80 hover:text-[#2C221E] flex items-center justify-between transition-colors"
                  >
                    <span>Booking.com Official Listing</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
