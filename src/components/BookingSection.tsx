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
  AlertCircle,
  Clock,
  QrCode,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import {
  villaTaoLinks,
  getWhatsAppUrl,
  entireVillaUnit,
  bookingAddons,
  officialWhatsAppNumber,
} from '../data/villaData';
import { useBooking, diffNights, formatDateYMD } from '../context/BookingContext';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { CurrencyCode, PaymentMethod, Reservation, QRIS_MAX_LIMIT_IDR } from '../types';

interface BookingSectionProps {
  onOpenManageBooking?: (initialRef?: string) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ onOpenManageBooking }) => {
  const {
    currency,
    setCurrency,
    formatPrice,
    getNextAvailableWindow,
    isDateRangeAvailable,
    calculateStayPrice,
    createPaymentHold,
    createPaymentIntent,
    verifyServerPayment,
    releasePaymentHold,
  } = useBooking();

  // Booking Flow Steps:
  // 1 = Select Dates & Guests (Check Availability)
  // 2 = Your Stay (Available Villa + Calculated Price & Add-ons)
  // 3 = Guest Details
  // 4 = Payment (Card, QRIS, Virtual Account with Server Verification & 15-min Hold)
  // 5 = Booking Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Dates & Guests
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Step 2: Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Step 3: Guest Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCountry, setGuestCountry] = useState('Indonesia');
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 4: Payment State & Reservation Hold
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedVaBank, setSelectedVaBank] = useState('bca');
  const [heldRefCode, setHeldRefCode] = useState<string>('');
  const [heldExpiresAt, setHeldExpiresAt] = useState<number>(0);
  const [holdTimerSeconds, setHoldTimerSeconds] = useState<number>(900); // 15 mins
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // QRIS state
  const [qrisData, setQrisData] = useState<{
    qrString: string;
    amountIdr: number;
    paymentId: string;
  } | null>(null);
  const [qrisStatus, setQrisStatus] = useState<'waiting' | 'paid'>('waiting');

  // Step 5: Confirmed Reservation
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Initialize dates with upcoming open window
  useEffect(() => {
    const nextWin = getNextAvailableWindow('entire-villa', 3);
    setCheckIn(nextWin.checkIn);
    setCheckOut(nextWin.checkOut);
  }, [getNextAvailableWindow]);

  // Hold timer countdown in Step 4
  useEffect(() => {
    if (step !== 4 || heldExpiresAt <= 0) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((heldExpiresAt - Date.now()) / 1000));
      setHoldTimerSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setPaymentError('Your 15-minute checkout reservation hold has expired. Please recheck availability.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, heldExpiresAt]);

  const priceBreakdown = calculateStayPrice(checkIn, checkOut, guests, selectedAddons);
  const rangeValidation = isDateRangeAvailable('entire-villa', checkIn, checkOut);

  // Exact IDR total for QRIS check (rate: 1 USD = Rp 15,800 IDR)
  const totalAmountIdr = Math.round(priceBreakdown.totalDirectUsd * 15800);
  const isQrisSupportedForTotal = totalAmountIdr <= QRIS_MAX_LIMIT_IDR;

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const formatCardInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  // STEP 1 ACTION: CHECK AVAILABILITY
  const handleCheckAvailability = () => {
    setAvailabilityError(null);
    setAvailabilityChecked(true);

    if (!checkIn || !checkOut) {
      setAvailabilityError('Please select both a check-in and check-out date.');
      return;
    }

    const nights = diffNights(checkIn, checkOut);
    if (nights <= 0) {
      setAvailabilityError('Check-out date must be after check-in date.');
      return;
    }

    if (!rangeValidation.available) {
      setAvailabilityError(
        'VILLA TAO IS UNAVAILABLE FOR THESE DATES. Please select different dates from the calendar below.'
      );
      return;
    }

    // Availability confirmed -> advance to Step 2
    setStep(2);
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // STEP 2 ACTION: CONTINUE TO GUEST DETAILS
  const handleContinueToGuestDetails = () => {
    setStep(3);
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // STEP 3 ACTION: CONTINUE TO PAYMENT & CREATE TEMPORARY HOLD
  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !guestEmail.trim() || !guestPhone.trim()) {
      setPaymentError('Please complete your first name, last name, email address, and WhatsApp/phone number.');
      return;
    }

    // Re-verify availability before creating hold
    const recheck = isDateRangeAvailable('entire-villa', checkIn, checkOut);
    if (!recheck.available) {
      setPaymentError('Villa Tao is no longer available for the selected dates. Please choose open dates.');
      return;
    }

    setIsProcessingPayment(true);
    // Request server-side hold (10. Temporary Reservation Hold)
    const holdResult = await createPaymentHold({
      checkIn,
      checkOut,
      guests,
      guestName: fullName,
      guestEmail: guestEmail.trim(),
      totalUsd: priceBreakdown.totalDirectUsd,
    });

    setIsProcessingPayment(false);

    if (!holdResult.ok) {
      setPaymentError(holdResult.error || 'Failed to place a hold on these dates. Please try again.');
      return;
    }

    setHeldRefCode(holdResult.referenceCode);
    setHeldExpiresAt(holdResult.expiresAt);
    setStep(4);

    // If international guest, default to card
    if (guestCountry.toLowerCase() !== 'indonesia') {
      setPaymentMethod('card');
    }

    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // STEP 4: PREPARE QRIS INTENT IF SELECTED
  useEffect(() => {
    if (step === 4 && paymentMethod === 'qris' && heldRefCode && isQrisSupportedForTotal) {
      createPaymentIntent({
        referenceCode: heldRefCode,
        paymentMethod: 'qris',
        amountIdr: totalAmountIdr,
        amountUsd: priceBreakdown.totalDirectUsd,
      }).then((intent) => {
        if (intent.ok) {
          setQrisData({
            qrString: intent.qrString || '',
            amountIdr: intent.amountIdr || totalAmountIdr,
            paymentId: intent.paymentId || `pay-${Date.now()}`,
          });
          setQrisStatus('waiting');
        }
      });
    }
  }, [step, paymentMethod, heldRefCode, isQrisSupportedForTotal, totalAmountIdr, priceBreakdown.totalDirectUsd, createPaymentIntent]);

  // STEP 4 ACTION: COMPLETE PAYMENT WITH SERVER-SIDE VERIFICATION
  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (holdTimerSeconds <= 0) {
      setPaymentError('Your 15-minute checkout reservation hold has expired. Please reselect your dates.');
      return;
    }

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 12 || !cardExpiry || !cardCvc || !cardHolder.trim()) {
        setPaymentError('Please enter valid credit/debit card details (cardholder, 16 digits, MM/YY, CVC).');
        return;
      }
    }

    if (paymentMethod === 'qris' && !isQrisSupportedForTotal) {
      setPaymentError(
        `QRIS is not available for transactions exceeding Rp 10,000,000. For this reservation (${formatPrice(
          priceBreakdown.totalDirectUsd
        )}), please use Credit/Debit Card or Bank Transfer.`
      );
      return;
    }

    setIsProcessingPayment(true);

    // 9. Server-Side Payment Verification
    const verificationResult = await verifyServerPayment({
      referenceCode: heldRefCode,
      paymentMethod,
      paymentId: qrisData?.paymentId || `pay-${Date.now()}`,
      guestData: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        guestCountry: guestCountry.trim() || 'International',
        checkIn,
        checkOut,
        nights: priceBreakdown.nights,
        guests,
        totalUsd: priceBreakdown.totalDirectUsd,
        addons: selectedAddons,
        arrivalTime,
        specialRequests,
      },
    });

    setIsProcessingPayment(false);

    if (!verificationResult.ok || !verificationResult.reservation) {
      setPaymentError(verificationResult.message || 'Payment verification failed. Please try again.');
      return;
    }

    setConfirmedReservation(verificationResult.reservation);
    setStep(5);

    // If WhatsApp concierge chosen, open WhatsApp message
    if (paymentMethod === 'whatsapp_concierge') {
      const msg = `*Villa Tao Direct Reservation (${verificationResult.reservation.referenceCode})*\n• Entire Private Villa Rental\n• Check-in: ${checkIn}\n• Check-out: ${checkOut} (${priceBreakdown.nights} nights)\n• Guests: ${guests}\n• Guest: ${firstName} ${lastName} (${guestEmail})\n• Total Direct Rate: ${formatPrice(priceBreakdown.totalDirectUsd)}\nPlease confirm my direct reservation.`;
      window.open(getWhatsAppUrl('booking', msg), '_blank');
    }

    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelHoldAndReturn = async () => {
    if (heldRefCode) {
      await releasePaymentHold(heldRefCode);
    }
    setStep(1);
    setAvailabilityChecked(false);
  };

  // Format hold timer MM:SS
  const timerMinutes = Math.floor(holdTimerSeconds / 60);
  const timerSecs = holdTimerSeconds % 60;
  const formattedTimer = `${String(timerMinutes).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`;

  return (
    <section id="booking" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#2C221E] relative border-t border-[#2C221E]/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Header & Currency Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8C7355] block mb-2 font-medium">
              DIRECT RESERVATIONS • EXCLUSIVE ESTATE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
              Book Your Stay
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#2C221E]/75 font-light leading-relaxed">
              Villa Tao is reserved exclusively as one private oceanfront estate. Check your dates below to verify real-time availability and receive guaranteed direct rates.
            </p>
          </div>

          {/* Currency Switcher & Manage Booking Link */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <div className="inline-flex items-center border border-[#2C221E]/15 bg-[#F5F2EB] p-1">
              {(['IDR', 'USD', 'EUR', 'AUD'] as CurrencyCode[]).map((c) => (
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
                className="inline-flex items-center space-x-2 px-3.5 py-2 min-h-[36px] border border-[#2C221E]/20 text-[10px] uppercase tracking-[0.2em] text-[#2C221E] hover:bg-[#F5F2EB] transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[#8C7355]" />
                <span>Manage Existing Booking</span>
              </button>
            )}
          </div>
        </div>

        {/* STEP 1: SELECT DATES & GUESTS (PRIMARY CHECKOUT INTERACTION) */}
        {/* Notice: No side price card or misleading totals are shown before availability is checked! */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="bg-[#F5F2EB] border border-[#2C221E]/15 p-6 sm:p-10 space-y-6 shadow-xs">
              <div className="border-b border-[#2C221E]/10 pb-4">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#8C7355] block mb-1 font-medium">
                  STEP 1 — SELECT DATES &amp; GUESTS
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2C221E] font-normal">
                  Select Your Preferred Dates
                </h3>
                <p className="text-xs sm:text-sm text-[#2C221E]/70 font-light mt-1">
                  Choose your check-in and check-out dates to verify live availability for the entire villa.
                </p>
              </div>

              {/* Date & Guests Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1.5 font-medium">
                    Check-In
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    min={formatDateYMD(new Date())}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      setAvailabilityChecked(false);
                      setAvailabilityError(null);
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1.5 font-medium">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn || formatDateYMD(new Date())}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      setAvailabilityChecked(false);
                      setAvailabilityError(null);
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1.5 font-medium">
                    Guests (Entire Villa)
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => {
                      setGuests(Number(e.target.value));
                      setAvailabilityChecked(false);
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'} (Entire Villa)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error Notice if unavailable */}
              {availabilityError && (
                <div className="p-4 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E] flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block uppercase tracking-wider text-[11px] mb-0.5">
                      VILLA TAO IS UNAVAILABLE FOR THESE DATES
                    </span>
                    <p className="font-light">
                      {availabilityError} Please select alternative dates from the open master calendar below.
                    </p>
                  </div>
                </div>
              )}

              {/* PRIMARY STEP 1 CTA */}
              <button
                type="button"
                onClick={handleCheckAvailability}
                className="w-full py-4 min-h-[50px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.24em] font-medium transition-colors flex items-center justify-center space-x-2 shadow-xs"
              >
                <span>CHECK AVAILABILITY</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Helper Interactive Availability Calendar */}
              <div className="pt-4 border-t border-[#2C221E]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] font-medium">
                    Entire Villa Master Calendar
                  </span>
                  <span className="text-[11px] text-[#2C221E]/60 font-light">
                    Select open dates to autofill
                  </span>
                </div>
                <AvailabilityCalendar
                  unitId="entire-villa"
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDates={(newIn, newOut) => {
                    setCheckIn(newIn);
                    setCheckOut(newOut);
                    setAvailabilityChecked(false);
                    setAvailabilityError(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEPS 2, 3, 4: RESPONSIVE TWO-COLUMN LAYOUT (DESKTOP) / VERTICAL SEQUENCE (MOBILE) */}
        {/* Only rendered AFTER dates are selected and availability is validated! */}
        {step >= 2 && step <= 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-in fade-in duration-300">
            {/* LEFT COLUMN (7 Cols): Current Step Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* STEP 2: YOUR STAY (AVAILABLE VILLA & CALCULATED PRICE) */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Single Villa Confirmation Card */}
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/15 overflow-hidden shadow-xs">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EAE4D6]">
                      <img
                        src={entireVillaUnit.image}
                        alt="Villa Tao Balian authentic oceanfront villa"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 bg-[#2C221E]/90 text-[#FAF8F5] px-3.5 py-1 text-[10px] uppercase tracking-[0.24em] font-medium backdrop-blur-xs">
                        CONFIRMED AVAILABLE
                      </div>
                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <span className="text-[10px] uppercase tracking-[0.26em] text-[#C5A880] block mb-1">
                          VILLA TAO
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
                          Entire Private Villa
                        </h3>
                        <p className="text-xs text-white/90 font-light mt-1">
                          The entire villa is exclusively yours during your stay.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Dates & Specs Snippet */}
                      <div className="p-4 bg-[#FAF8F5] border border-[#2C221E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block font-medium">
                            SELECTED DATES
                          </span>
                          <span className="font-serif text-base text-[#2C221E] font-medium">
                            {checkIn} → {checkOut}
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block font-medium">
                            PARTY &amp; DURATION
                          </span>
                          <span className="font-medium text-[#2C221E]">
                            {priceBreakdown.nights} {priceBreakdown.nights === 1 ? 'Night' : 'Nights'} • {guests}{' '}
                            {guests === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#2C221E]/10 text-xs">
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

                      <p className="text-xs text-[#2C221E]/75 font-light leading-relaxed">
                        Reservation grants exclusive, sole private use of all 4 architectural bedrooms, private infinity lap pool, sunken ocean living lounge, ironwood terraces, and caretaking team.
                      </p>
                    </div>
                  </div>

                  {/* Optional Curated Enhancements */}
                  <div className="bg-[#F5F2EB] p-5 sm:p-6 border border-[#2C221E]/12 space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] block font-medium">
                      OPTIONAL CURATED ENHANCEMENTS
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {bookingAddons.map((addon) => {
                        const active = selectedAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className={`p-3.5 sm:p-4 border cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                              active
                                ? 'bg-[#FAF8F5] border-[#2C221E]'
                                : 'bg-white/60 border-[#2C221E]/10 hover:border-[#2C221E]/30'
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
                                <h5 className="font-serif text-sm text-[#2C221E] font-medium">
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
                                {addon.perNight ? '/ night' : 'one-time'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions for Step 2 */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] border border-[#2C221E]/20 text-xs uppercase tracking-[0.2em] text-[#2C221E] hover:bg-[#F5F2EB] transition-colors"
                    >
                      Change Dates
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueToGuestDetails}
                      className="w-full flex-1 py-4 min-h-[48px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.24em] font-medium transition-colors flex items-center justify-center space-x-2 shadow-xs"
                    >
                      <span>CONTINUE TO BOOK</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: GUEST INFORMATION */}
              {step === 3 && (
                <form onSubmit={handleContinueToPayment} className="space-y-6">
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/12 p-6 sm:p-8 space-y-5 shadow-xs">
                    <div className="border-b border-[#2C221E]/10 pb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block mb-1 font-medium">
                          STEP 3 — GUEST DETAILS
                        </span>
                        <h3 className="font-serif text-2xl text-[#2C221E] font-normal">
                          Guest Information
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#2C221E] underline"
                      >
                        Back to Stay
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Maya"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Sugiarto"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="e.g. maya@example.com"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="e.g. +62 812 3456 7890"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                          Country of Residence
                        </label>
                        <input
                          type="text"
                          value={guestCountry}
                          onChange={(e) => setGuestCountry(e.target.value)}
                          placeholder="e.g. Australia / Indonesia / Singapore"
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                          Estimated Check-In Time
                        </label>
                        <select
                          value={arrivalTime}
                          onChange={(e) => setArrivalTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[42px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                        >
                          <option value="14:00">14:00 (Standard Check-in)</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="18:00">18:00 (Evening Arrival)</option>
                          <option value="20:00">20:00 (Late Arrival)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                        Special Requests or Dietary Notes
                      </label>
                      <textarea
                        rows={3}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Please note dietary preferences, surf board storage, or airport flight details..."
                        className="w-full p-3 bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#2C221E]"
                      />
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3.5 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E]">
                      {paymentError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] border border-[#2C221E]/20 text-xs uppercase tracking-[0.2em] text-[#2C221E] hover:bg-[#F5F2EB] transition-colors"
                    >
                      Back to Stay Details
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full flex-1 py-4 min-h-[48px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.24em] font-medium transition-colors flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                    >
                      <span>{isProcessingPayment ? 'HOLDING DATES...' : 'CONTINUE TO PAYMENT'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: DEDICATED PAYMENT WITH 15-MIN RESERVATION HOLD & SERVER VERIFICATION */}
              {step === 4 && (
                <form onSubmit={handleCompletePayment} className="space-y-6">
                  {/* Reservation Hold Active Banner */}
                  <div className="bg-[#FAF8F5] border border-[#8C7355] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2.5">
                      <Clock className="w-4 h-4 text-[#8C7355] shrink-0 animate-pulse" />
                      <div>
                        <span className="font-semibold text-[#2C221E] uppercase tracking-wider text-[11px] block">
                          RESERVATION HELD • {formattedTimer} REMAINING
                        </span>
                        <p className="text-[#2C221E]/75 font-light">
                          Reference <strong className="font-mono">{heldRefCode}</strong>. These dates are temporarily locked exclusively for your checkout.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelHoldAndReturn}
                      className="text-[10px] uppercase tracking-wider text-[#8C7355] hover:text-[#2C221E] underline self-start sm:self-auto"
                    >
                      Release &amp; Change Dates
                    </button>
                  </div>

                  {/* Payment Methods Selection */}
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/12 p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-[#2C221E]/10 pb-4">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block mb-1 font-medium">
                        STEP 4 — PAYMENT
                      </span>
                      <h3 className="font-serif text-2xl text-[#2C221E] font-normal">
                        Select Payment Method
                      </h3>
                      <p className="text-xs text-[#2C221E]/70 font-light mt-1">
                        All transactions are processed through encrypted, server-verified hospitality payment protocols.
                      </p>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* A. Credit / Debit Card */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('card');
                          setPaymentError(null);
                        }}
                        className={`p-4 border text-left transition-colors flex flex-col justify-between min-h-[90px] ${
                          paymentMethod === 'card'
                            ? 'bg-white border-[#2C221E] shadow-xs'
                            : 'bg-white/60 border-[#2C221E]/15 hover:border-[#2C221E]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <CreditCard className="w-4 h-4 text-[#8C7355]" />
                          <span className="text-[9px] uppercase tracking-widest text-[#8C7355] font-semibold">
                            GLOBAL
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#2C221E] block">
                            Credit / Debit Card
                          </span>
                          <span className="text-[10px] text-[#2C221E]/60 block font-light">
                            Visa · Mastercard · Amex · JCB
                          </span>
                        </div>
                      </button>

                      {/* B. QRIS */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('qris');
                          setPaymentError(null);
                        }}
                        className={`p-4 border text-left transition-colors flex flex-col justify-between min-h-[90px] ${
                          paymentMethod === 'qris'
                            ? 'bg-white border-[#2C221E] shadow-xs'
                            : 'bg-white/60 border-[#2C221E]/15 hover:border-[#2C221E]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <QrCode className="w-4 h-4 text-[#8C7355]" />
                          <span className="text-[9px] uppercase tracking-widest text-[#8C7355] font-semibold">
                            INDONESIA
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#2C221E] block">
                            Pay with QRIS
                          </span>
                          <span className="text-[10px] text-[#2C221E]/60 block font-light">
                            BCA · GoPay · OVO · DANA · etc.
                          </span>
                        </div>
                      </button>

                      {/* C. Virtual Account / Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('virtual_account');
                          setPaymentError(null);
                        }}
                        className={`p-4 border text-left transition-colors flex flex-col justify-between min-h-[90px] ${
                          paymentMethod === 'virtual_account'
                            ? 'bg-white border-[#2C221E] shadow-xs'
                            : 'bg-white/60 border-[#2C221E]/15 hover:border-[#2C221E]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Building2 className="w-4 h-4 text-[#8C7355]" />
                          <span className="text-[9px] uppercase tracking-widest text-[#8C7355] font-semibold">
                            TRANSFER
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#2C221E] block">
                            Virtual Account &amp; Wire
                          </span>
                          <span className="text-[10px] text-[#2C221E]/60 block font-light">
                            BCA · Mandiri · BNI · BRI · Wise
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* METHOD DETAILS SECTION */}

                    {/* A. CREDIT CARD DETAILS */}
                    {paymentMethod === 'card' && (
                      <div className="p-5 bg-white border border-[#2C221E]/15 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#2C221E]/10 pb-2.5">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-medium">
                            CREDIT / DEBIT CARD DETAILS
                          </span>
                          <span className="text-[10px] text-[#2C221E]/60 flex items-center gap-1 font-light">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>256-Bit SSL Encrypted</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                          <div className="sm:col-span-6">
                            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              required
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              placeholder="Name on card"
                              className="w-full px-3 py-2 min-h-[40px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs text-[#2C221E]"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                              Card Number (16 Digits)
                            </label>
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                              placeholder="4532 •••• •••• ••••"
                              className="w-full px-3 py-2 min-h-[40px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono text-[#2C221E]"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                              Expiry (MM/YY)
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                              placeholder="08/28"
                              className="w-full px-3 py-2 min-h-[40px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono text-[#2C221E]"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/75 mb-1 font-medium">
                              Security CVC
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full px-3 py-2 min-h-[40px] bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono text-[#2C221E]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* B. QRIS DETAILS WITH LIMIT ENFORCEMENT */}
                    {paymentMethod === 'qris' && (
                      <div className="p-5 bg-white border border-[#2C221E]/15 space-y-4">
                        {/* QRIS Limit Verification check (Rp 10,000,000) */}
                        {!isQrisSupportedForTotal ? (
                          <div className="p-4 bg-[#8C7355]/10 border border-[#8C7355] text-xs space-y-3">
                            <div className="flex items-start space-x-2.5">
                              <AlertCircle className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-semibold uppercase tracking-wider block text-[11px] text-[#2C221E]">
                                  QRIS TRANSACTION LIMIT EXCEEDED
                                </strong>
                                <p className="text-[#2C221E]/80 font-light mt-1 leading-relaxed">
                                  QRIS is available for payments within the supported transaction limit (up to Rp 10,000,000). For this reservation (Total: Rp {totalAmountIdr.toLocaleString()}), please use Credit/Debit Card or Bank Transfer.
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className="px-4 py-2 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em]"
                              >
                                Pay with Card
                              </button>
                              <button
                                type="button"
                                onClick={() => setPaymentMethod('virtual_account')}
                                className="px-4 py-2 border border-[#2C221E]/25 text-[#2C221E] text-[10px] uppercase tracking-[0.2em]"
                              >
                                Pay by Bank Transfer
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Supported QRIS Flow */
                          <div className="space-y-4 text-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C221E]/10 pb-3">
                              <div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-medium block">
                                  DYNAMIC NATIONAL QRIS
                                </span>
                                <span className="font-medium text-[#2C221E]">
                                  Amount: Rp {totalAmountIdr.toLocaleString()} IDR
                                </span>
                              </div>
                              <div className="flex items-center space-x-1.5 text-[#8C7355]">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-mono text-[11px] font-semibold">{formattedTimer}</span>
                              </div>
                            </div>

                            {/* Simulated Authentic QR Code Display */}
                            <div className="flex flex-col items-center justify-center p-6 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-3">
                              <div className="p-3 bg-white border border-[#2C221E]/20 shadow-xs text-center">
                                <QrCode className="w-40 h-40 text-[#2C221E] mx-auto" />
                                <span className="text-[9px] uppercase tracking-widest text-[#2C221E]/60 block mt-1 font-mono">
                                  QRIS • {heldRefCode}
                                </span>
                              </div>
                              <span className="px-3 py-1 bg-[#2C221E]/10 text-[#2C221E] text-[10px] uppercase tracking-wider font-medium">
                                WAITING FOR PAYMENT
                              </span>
                            </div>

                            {/* Clear 5-Step Instructions */}
                            <div className="space-y-2 text-[#2C221E]/80 font-light">
                              <span className="font-medium text-[#2C221E] block text-[11px] uppercase tracking-wider">
                                Instructions:
                              </span>
                              <ol className="list-decimal list-inside space-y-1 text-xs">
                                <li>Open your mobile banking app (BCA, Mandiri, BRI, BNI) or e-wallet (GoPay, OVO, DANA).</li>
                                <li>Select <strong>Scan QR / QRIS</strong>.</li>
                                <li>Scan the QR code shown above.</li>
                                <li>Confirm payment for Rp {totalAmountIdr.toLocaleString()} IDR.</li>
                                <li>Click <strong>Verify &amp; Confirm Booking</strong> below once approved.</li>
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* C. VIRTUAL ACCOUNT / BANK TRANSFER */}
                    {paymentMethod === 'virtual_account' && (
                      <div className="p-5 bg-white border border-[#2C221E]/15 space-y-4 text-xs">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-medium block">
                          SELECT VIRTUAL ACCOUNT PROVIDER
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { code: 'bca', name: 'BCA VA' },
                            { code: 'mandiri', name: 'Mandiri VA' },
                            { code: 'bni', name: 'BNI VA' },
                            { code: 'bri', name: 'BRI VA' },
                          ].map((b) => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={() => setSelectedVaBank(b.code)}
                              className={`p-2.5 border text-center text-xs font-medium uppercase transition-colors ${
                                selectedVaBank === b.code
                                  ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]'
                                  : 'bg-[#FAF8F5] text-[#2C221E] border-[#2C221E]/20 hover:border-[#2C221E]'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>

                        <div className="p-4 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#8C7355] block">
                            VIRTUAL ACCOUNT DETAILS
                          </span>
                          <div className="flex items-center justify-between font-mono text-sm font-semibold text-[#2C221E]">
                            <span>
                              {selectedVaBank === 'bca'
                                ? '7720-4918-2940-11'
                                : selectedVaBank === 'mandiri'
                                ? '8890-1928-4019-33'
                                : selectedVaBank === 'bni'
                                ? '9880-2918-4012-77'
                                : '1280-4918-2049-88'}
                            </span>
                            <span className="text-[11px] uppercase font-sans text-[#8C7355]">
                              {selectedVaBank.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#2C221E]/70 font-light">
                            Beneficiary: <strong>PT VILLA TAO BALIAN RETREAT</strong>
                          </p>
                          <p className="text-[11px] text-[#2C221E]/70 font-light">
                            Amount: <strong>Rp {totalAmountIdr.toLocaleString()} IDR</strong> (Hold expires in {formattedTimer})
                          </p>
                        </div>

                        <div className="p-3 bg-[#FAF8F5] border border-[#2C221E]/10 text-[11px] text-[#2C221E]/70 font-light space-y-1">
                          <span className="font-medium text-[#2C221E] block">International Wise / SWIFT Remittance:</span>
                          <p>
                            For foreign wire transfers: Bank Central Asia (BCA) Bali • SWIFT: CENAIDJA • PT Villa Tao Balian Retreat. Referencing code: <strong className="font-mono">{heldRefCode}</strong>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {paymentError && (
                    <div className="p-3.5 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E]">
                      {paymentError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] border border-[#2C221E]/20 text-xs uppercase tracking-[0.2em] text-[#2C221E] hover:bg-[#F5F2EB] transition-colors"
                    >
                      Back to Guest Details
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingPayment || (paymentMethod === 'qris' && !isQrisSupportedForTotal)}
                      className="w-full flex-1 py-4 min-h-[48px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.24em] font-medium transition-colors flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>
                        {isProcessingPayment
                          ? 'VERIFYING PAYMENT SERVER-SIDE...'
                          : `PAY NOW • ${formatPrice(priceBreakdown.totalDirectUsd)}`}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT COLUMN (5 Cols): COMPACT "YOUR STAY" STICKY SUMMARY CARD */}
            {/* Shows ONLY AFTER dates have been selected and availability checked! */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-[#F5F2EB] border border-[#2C221E]/12 p-6 sm:p-7 space-y-5 shadow-xs">
                <div className="border-b border-[#2C221E]/10 pb-4">
                  <span className="text-[10px] uppercase tracking-[0.26em] text-[#8C7355] block mb-1 font-medium">
                    YOUR STAY
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2C221E] font-normal">
                    Villa Tao — Entire Private Villa
                  </h3>
                  <p className="text-xs text-[#2C221E]/70 font-light mt-1">
                    {checkIn} → {checkOut} • {priceBreakdown.nights} {priceBreakdown.nights === 1 ? 'Night' : 'Nights'} • {guests}{' '}
                    {guests === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>

                {/* Transparent Price Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#2C221E]/80">
                    <span>
                      Entire Villa ({priceBreakdown.nights} {priceBreakdown.nights === 1 ? 'night' : 'nights'})
                    </span>
                    <span className="font-medium text-[#2C221E]">
                      {formatPrice(priceBreakdown.subtotalAfterDiscounts)}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#2C221E]/60 flex items-center justify-between">
                    <span>Average Nightly Rate</span>
                    <span className="font-mono">
                      {formatPrice(priceBreakdown.effectiveNightlyRateUsd)} / night
                    </span>
                  </div>

                  {priceBreakdown.lengthOfStayDiscountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#8C7355] font-medium">
                      <span>Long-Stay Privilege ({priceBreakdown.lengthOfStayDiscountPercent}%)</span>
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

                  <div className="pt-3.5 mt-2 border-t border-[#2C221E]/15 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] block font-medium">
                        TOTAL ENTIRE VILLA RATE
                      </span>
                      <span className="text-[11px] text-[#2C221E]/60 font-light">
                        All 4 Bedrooms Included
                      </span>
                    </div>
                    <span className="font-serif text-2xl text-[#2C221E]">
                      {formatPrice(priceBreakdown.totalDirectUsd)}
                    </span>
                  </div>
                </div>

                {/* 12. DIRECT BOOKING BENEFIT CARD */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-1 text-xs">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7355] font-semibold block">
                    DIRECT BOOKING PRIVILEGE
                  </span>
                  <p className="text-[#2C221E]/80 font-light leading-relaxed">
                    Complimentary chilled welcome young coconuts, fresh tropical fruit basket, and direct Balian concierge priority.
                  </p>
                </div>

                {/* OTA Sync Status Notice */}
                <div className="pt-3 border-t border-[#2C221E]/10 text-[11px] text-[#2C221E]/60 font-light flex items-center justify-between">
                  <span>Calendar synchronized with:</span>
                  <span className="font-medium text-[#2C221E]/80">Airbnb &amp; Booking.com</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: BOOKING CONFIRMED SCREEN */}
        {step === 5 && confirmedReservation && (
          <div className="max-w-4xl mx-auto bg-[#F5F2EB] border border-[#2C221E]/15 p-6 sm:p-10 space-y-6 animate-in fade-in duration-300 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2C221E]/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#8C7355] block mb-1 font-medium">
                  STEP 5 — BOOKING CONFIRMED
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2C221E] font-normal">
                  Your Villa Tao Escape Is Reserved
                </h3>
                <p className="text-xs text-[#2C221E]/70 font-light mt-1">
                  Villa Tao — Entire Private Villa exclusively locked in master inventory.
                </p>
              </div>
              <div className="bg-[#2C221E] text-[#FAF8F5] px-4 py-2.5 text-center shrink-0">
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#C5A880] block">
                  BOOKING REFERENCE
                </span>
                <span className="font-mono text-sm tracking-widest">
                  {confirmedReservation.referenceCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block font-medium">
                  Guest &amp; Estate
                </span>
                <p className="font-medium text-[#2C221E]">{confirmedReservation.guestName}</p>
                <p className="text-[#2C221E]/70 font-light">{confirmedReservation.guestEmail}</p>
                <p className="text-[#2C221E]/70 font-light">{confirmedReservation.guestPhone}</p>
                <p className="text-[#2C221E] font-serif text-base pt-1">
                  Villa Tao — Entire Private Villa (All 4 Suites Included)
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block font-medium">
                  Dates &amp; Server Payment Status
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
                <p className="pt-1 text-xs uppercase tracking-[0.18em] text-[#25D366] font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>PAID &amp; CONFIRMED • {formatPrice(confirmedReservation.totalUsd)}</span>
                </p>
              </div>
            </div>

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
                  setStep(1);
                  setAvailabilityChecked(false);
                }}
                className="text-xs uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#2C221E] underline py-2"
              >
                Book Another Stay
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
