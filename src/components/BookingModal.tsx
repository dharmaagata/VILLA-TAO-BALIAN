import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  ArrowUpRight,
  Lock,
  CreditCard,
  Building2,
  Check,
  Users,
  Waves,
  Eye,
  AlertCircle,
  Clock,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Printer,
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
import { PaymentMethod, Reservation, QRIS_MAX_LIMIT_IDR } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const {
    currency,
    formatPrice,
    getNextAvailableWindow,
    isDateRangeAvailable,
    calculateStayPrice,
    createPaymentHold,
    createPaymentIntent,
    verifyServerPayment,
    releasePaymentHold,
  } = useBooking();

  // Modal Step sequence: 'dates' -> 'stay' -> 'guest' -> 'payment' -> 'confirmed'
  const [modalStep, setModalStep] = useState<'dates' | 'stay' | 'guest' | 'payment' | 'confirmed'>('dates');

  // Dates & Guests
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Guest Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCountry, setGuestCountry] = useState('Indonesia');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedVaBank, setSelectedVaBank] = useState('bca');
  const [heldRefCode, setHeldRefCode] = useState<string>('');
  const [heldExpiresAt, setHeldExpiresAt] = useState<number>(0);
  const [holdTimerSeconds, setHoldTimerSeconds] = useState<number>(900);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Confirmed state
  const [confirmedRes, setConfirmedRes] = useState<Reservation | null>(null);

  useEffect(() => {
    if (isOpen) {
      const win = getNextAvailableWindow('entire-villa', 3);
      setCheckIn(win.checkIn);
      setCheckOut(win.checkOut);
      setModalStep('dates');
      setConfirmedRes(null);
      setAvailabilityError(null);
      setPaymentError(null);
    }
  }, [isOpen, getNextAvailableWindow]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Hold timer countdown
  useEffect(() => {
    if (modalStep !== 'payment' || heldExpiresAt <= 0) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((heldExpiresAt - Date.now()) / 1000));
      setHoldTimerSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setPaymentError('Your 15-minute checkout reservation hold has expired. Please recheck availability.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [modalStep, heldExpiresAt]);

  if (!isOpen) return null;

  const priceBreakdown = calculateStayPrice(checkIn, checkOut, guests, selectedAddons);
  const rangeValidation = isDateRangeAvailable('entire-villa', checkIn, checkOut);
  const totalAmountIdr = Math.round(priceBreakdown.totalDirectUsd * 15800);
  const isQrisSupported = totalAmountIdr <= QRIS_MAX_LIMIT_IDR;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleCheckAvailability = () => {
    setAvailabilityError(null);
    if (!checkIn || !checkOut) {
      setAvailabilityError('Please choose both check-in and check-out dates.');
      return;
    }
    if (diffNights(checkIn, checkOut) <= 0) {
      setAvailabilityError('Check-out date must be after check-in date.');
      return;
    }
    if (!rangeValidation.available) {
      setAvailabilityError(
        'VILLA TAO IS UNAVAILABLE FOR THESE DATES. Please select different dates from the calendar.'
      );
      return;
    }
    setModalStep('stay');
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !guestEmail.trim() || !guestPhone.trim()) {
      setPaymentError('Please complete your name, email address, and WhatsApp/phone number.');
      return;
    }

    setIsProcessing(true);
    const holdRes = await createPaymentHold({
      checkIn,
      checkOut,
      guests,
      guestName: fullName,
      guestEmail: guestEmail.trim(),
      totalUsd: priceBreakdown.totalDirectUsd,
    });
    setIsProcessing(false);

    if (!holdRes.ok) {
      setPaymentError(holdRes.error || 'Failed to hold dates. Please try again.');
      return;
    }

    setHeldRefCode(holdRes.referenceCode);
    setHeldExpiresAt(holdRes.expiresAt);
    setModalStep('payment');
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (holdTimerSeconds <= 0) {
      setPaymentError('Your reservation hold has expired. Please recheck availability.');
      return;
    }

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 12 || !cardExpiry || !cardCvc || !cardHolder.trim()) {
        setPaymentError('Please enter valid credit/debit card details.');
        return;
      }
    }

    if (paymentMethod === 'qris' && !isQrisSupported) {
      setPaymentError(
        `QRIS is available up to Rp 10,000,000. Total is Rp ${totalAmountIdr.toLocaleString()}. Please use Card or Bank Transfer.`
      );
      return;
    }

    setIsProcessing(true);
    const verification = await verifyServerPayment({
      referenceCode: heldRefCode,
      paymentMethod,
      paymentId: `pay-${Date.now()}`,
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
        specialRequests,
      },
    });
    setIsProcessing(false);

    if (!verification.ok || !verification.reservation) {
      setPaymentError(verification.message || 'Payment verification failed.');
      return;
    }

    setConfirmedRes(verification.reservation);
    setModalStep('confirmed');
  };

  const timerMin = Math.floor(holdTimerSeconds / 60);
  const timerSec = holdTimerSeconds % 60;
  const formattedTimer = `${String(timerMin).padStart(2, '0')}:${String(timerSec).padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] text-[#2C221E] shadow-2xl overflow-y-auto flex flex-col border border-[#2C221E]/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#2C221E]/10 flex items-center justify-between bg-[#F5F2EB] sticky top-0 z-20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block font-medium">
              VILLA TAO BALIAN • DIRECT RESERVATION
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#2C221E] font-normal">
              {modalStep === 'dates' && 'Step 1: Select Dates & Guests'}
              {modalStep === 'stay' && 'Step 2: Review Your Stay'}
              {modalStep === 'guest' && 'Step 3: Guest Details'}
              {modalStep === 'payment' && 'Step 4: Secure Payment'}
              {modalStep === 'confirmed' && 'Step 5: Booking Confirmed'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Booking Modal"
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#2C221E]/60 hover:text-[#2C221E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 space-y-6 flex-1">
          {/* STEP 1: SELECT DATES & GUESTS */}
          {modalStep === 'dates' && (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
              <div className="p-4 bg-[#F5F2EB] border border-[#2C221E]/10 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-semibold block">
                  ENTIRE PRIVATE VILLA
                </span>
                <p className="text-xs text-[#2C221E]/80 font-light">
                  Select your dates to verify live availability for Villa Tao's entire 4-bedroom oceanfront estate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    Check-In
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    min={formatDateYMD(new Date())}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      setAvailabilityError(null);
                    }}
                    className="w-full px-3 py-2 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs font-mono text-[#2C221E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn || formatDateYMD(new Date())}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      setAvailabilityError(null);
                    }}
                    className="w-full px-3 py-2 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs font-mono text-[#2C221E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    Guests (Max 10)
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'} (Entire Villa)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {availabilityError && (
                <div className="p-3 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#8C7355] shrink-0" />
                  <span>{availabilityError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckAvailability}
                className="w-full py-3.5 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#3E342B] transition-colors flex items-center justify-center space-x-2"
              >
                <span>CHECK AVAILABILITY</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="pt-2">
                <AvailabilityCalendar
                  unitId="entire-villa"
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDates={(newIn, newOut) => {
                    setCheckIn(newIn);
                    setCheckOut(newOut);
                    setAvailabilityError(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 2: YOUR STAY & CALCULATED PRICE */}
          {modalStep === 'stay' && (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
              <div className="p-4 bg-[#F5F2EB] border border-[#2C221E]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#8C7355] block font-medium">
                    CONFIRMED AVAILABLE
                  </span>
                  <h4 className="font-serif text-lg text-[#2C221E]">
                    Villa Tao — Entire Private Villa
                  </h4>
                  <p className="text-xs text-[#2C221E]/70 font-light">
                    {checkIn} → {checkOut} • {priceBreakdown.nights} Nights • {guests} Guests
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="font-serif text-xl text-[#2C221E] block">
                    {formatPrice(priceBreakdown.totalDirectUsd)}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#2C221E]/55">
                    Total Direct Rate
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="p-4 bg-white border border-[#2C221E]/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#2C221E]/80">
                  <span>Nightly Rate ({priceBreakdown.nights} nights)</span>
                  <span className="font-medium text-[#2C221E]">{formatPrice(priceBreakdown.subtotalAfterDiscounts)}</span>
                </div>
                {priceBreakdown.lengthOfStayDiscountAmount > 0 && (
                  <div className="flex justify-between text-[#8C7355]">
                    <span>Long-Stay Privilege ({priceBreakdown.lengthOfStayDiscountPercent}%)</span>
                    <span>-{formatPrice(priceBreakdown.lengthOfStayDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#2C221E]/70">
                  <span>Villa Care &amp; Tax (10%)</span>
                  <span>{formatPrice(priceBreakdown.taxesAndServiceFee)}</span>
                </div>
                <div className="pt-2 border-t border-[#2C221E]/10 flex justify-between font-serif text-base text-[#2C221E]">
                  <span>Total</span>
                  <span>{formatPrice(priceBreakdown.totalDirectUsd)}</span>
                </div>
              </div>

              {/* Add-ons */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8C7355] block font-medium">
                  Curated Enhancements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bookingAddons.map((addon) => {
                    const active = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                          active ? 'bg-[#F5F2EB] border-[#2C221E]' : 'bg-white border-[#2C221E]/15'
                        }`}
                      >
                        <span className="font-medium truncate mr-2">{addon.name}</span>
                        <span className="text-[11px] font-mono shrink-0">+{formatPrice(addon.priceUsd)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalStep('dates')}
                  className="px-5 py-3 border border-[#2C221E]/20 text-xs uppercase tracking-wider"
                >
                  Change Dates
                </button>
                <button
                  type="button"
                  onClick={() => setModalStep('guest')}
                  className="flex-1 py-3 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center space-x-2"
                >
                  <span>CONTINUE TO BOOK</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GUEST DETAILS */}
          {modalStep === 'guest' && (
            <form onSubmit={handleContinueToPayment} className="space-y-5 max-w-2xl mx-auto animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Maya"
                    className="w-full px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sugiarto"
                    className="w-full px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+62 812 3456 7890"
                    className="w-full px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    value={guestCountry}
                    onChange={(e) => setGuestCountry(e.target.value)}
                    placeholder="Indonesia / Australia / etc."
                    className="w-full px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                  />
                </div>
              </div>

              {paymentError && (
                <div className="p-3 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E]">
                  {paymentError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalStep('stay')}
                  className="px-5 py-3 border border-[#2C221E]/20 text-xs uppercase tracking-wider"
                >
                  Back to Stay
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center space-x-2"
                >
                  <span>{isProcessing ? 'HOLDING DATES...' : 'CONTINUE TO PAYMENT'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PAYMENT (CARD, QRIS, VIRTUAL ACCOUNT) */}
          {modalStep === 'payment' && (
            <form onSubmit={handleCompletePayment} className="space-y-5 max-w-2xl mx-auto animate-in fade-in">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#8C7355] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#8C7355] animate-pulse" />
                  <span className="font-semibold text-[#2C221E]">
                    HOLD ACTIVE • {formattedTimer} REMAINING ({heldRefCode})
                  </span>
                </div>
                <span className="font-serif text-sm font-medium">
                  {formatPrice(priceBreakdown.totalDirectUsd)}
                </span>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 border text-center font-medium uppercase transition-colors ${
                    paymentMethod === 'card' ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]' : 'bg-white border-[#2C221E]/20'
                  }`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-3 border text-center font-medium uppercase transition-colors ${
                    paymentMethod === 'qris' ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]' : 'bg-white border-[#2C221E]/20'
                  }`}
                >
                  QRIS
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('virtual_account')}
                  className={`p-3 border text-center font-medium uppercase transition-colors ${
                    paymentMethod === 'virtual_account'
                      ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]'
                      : 'bg-white border-[#2C221E]/20'
                  }`}
                >
                  Virtual Account
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-white border border-[#2C221E]/15 space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#2C221E]/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setCardNumber(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
                      }}
                      placeholder="4532 •••• •••• ••••"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setCardExpiry(digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                        }}
                        placeholder="08/28"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1">CVC</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#2C221E]/20 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* QRIS Inputs with limit check */}
              {paymentMethod === 'qris' && (
                <div className="p-4 bg-white border border-[#2C221E]/15 space-y-3 text-xs text-center">
                  {!isQrisSupported ? (
                    <div className="p-3 bg-[#8C7355]/10 border border-[#8C7355] text-left space-y-2">
                      <p className="font-medium text-[#2C221E]">QRIS Transaction Limit Exceeded</p>
                      <p className="text-[#2C221E]/80 font-light">
                        QRIS is available for payments up to Rp 10,000,000. Total is Rp {totalAmountIdr.toLocaleString()}. Please use Card or Bank Transfer.
                      </p>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className="px-3 py-1.5 bg-[#2C221E] text-white text-[10px] uppercase"
                      >
                        Switch to Card
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <QrCode className="w-32 h-32 text-[#2C221E] mx-auto" />
                      <p className="font-mono text-xs font-semibold">
                        Rp {totalAmountIdr.toLocaleString()} IDR
                      </p>
                      <p className="text-[11px] text-[#2C221E]/70">
                        Scan with BCA, Mandiri, GoPay, OVO, or DANA
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Virtual Account */}
              {paymentMethod === 'virtual_account' && (
                <div className="p-4 bg-white border border-[#2C221E]/15 space-y-3 text-xs">
                  <div className="grid grid-cols-4 gap-1">
                    {['bca', 'mandiri', 'bni', 'bri'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedVaBank(b)}
                        className={`p-2 border text-center uppercase font-medium ${
                          selectedVaBank === b ? 'bg-[#2C221E] text-white' : 'bg-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-1 font-mono text-xs">
                    <span className="block text-[10px] uppercase text-[#8C7355]">Virtual Account Number</span>
                    <span className="font-semibold text-sm">7720-4918-2940-11</span>
                    <p className="text-[11px] font-sans text-[#2C221E]/70">PT VILLA TAO BALIAN RETREAT</p>
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="p-3 bg-[#8C7355]/10 border border-[#8C7355] text-xs text-[#2C221E]">
                  {paymentError}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || (paymentMethod === 'qris' && !isQrisSupported)}
                className="w-full py-3.5 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#3E342B] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>
                  {isProcessing ? 'VERIFYING...' : `PAY NOW • ${formatPrice(priceBreakdown.totalDirectUsd)}`}
                </span>
              </button>
            </form>
          )}

          {/* STEP 5: CONFIRMED */}
          {modalStep === 'confirmed' && confirmedRes && (
            <div className="space-y-5 max-w-2xl mx-auto animate-in fade-in text-center sm:text-left">
              <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/15 space-y-3">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block font-medium">
                  RESERVATION CONFIRMED
                </span>
                <h4 className="font-serif text-2xl text-[#2C221E]">
                  Villa Tao — Entire Private Villa
                </h4>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#2C221E]/10 pt-3">
                  <div>
                    <span className="text-[#2C221E]/60 block text-[10px] uppercase">Reference</span>
                    <span className="font-mono font-semibold">{confirmedRes.referenceCode}</span>
                  </div>
                  <div>
                    <span className="text-[#2C221E]/60 block text-[10px] uppercase">Dates</span>
                    <span>{confirmedRes.checkIn} → {confirmedRes.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-[#2C221E]/60 block text-[10px] uppercase">Payment</span>
                    <span className="text-[#25D366] font-semibold">PAID &amp; CONFIRMED</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={getWhatsAppUrl(
                    'booking',
                    `Hello Villa Tao, my confirmed booking reference is ${confirmedRes.referenceCode}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Connect with WhatsApp Concierge</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-[#2C221E]/20 text-xs uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
