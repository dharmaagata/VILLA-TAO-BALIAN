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
} from 'lucide-react';
import {
  villaTaoLinks,
  getWhatsAppUrl,
  entireVillaUnit,
  bookingAddons,
  officialWhatsAppNumber,
} from '../data/villaData';
import { useBooking } from '../context/BookingContext';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { PaymentMethod, Reservation } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
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
  const [step, setStep] = useState<'dates' | 'payment' | 'confirmed'>('dates');

  // Guest & Payment state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCountry, setGuestCountry] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentSchedule, setPaymentSchedule] = useState<'full' | 'deposit_50'>('full');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedRes, setConfirmedRes] = useState<Reservation | null>(null);

  useEffect(() => {
    const win = getNextAvailableWindow('entire-villa', 3);
    setCheckIn(win.checkIn);
    setCheckOut(win.checkOut);
    setStep('dates');
    setConfirmedRes(null);
    setErrorMsg(null);
  }, [isOpen, getNextAvailableWindow]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const priceBreakdown = calculateStayPrice(checkIn, checkOut, guests, selectedAddons);
  const rangeValidation = isDateRangeAvailable('entire-villa', checkIn, checkOut);
  const amountDueNowUsd =
    paymentSchedule === 'deposit_50' ? priceBreakdown.depositAmountUsd : priceBreakdown.totalDirectUsd;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !guestEmail.trim() || !guestPhone.trim()) {
      setErrorMsg('Please complete your name, email address, and WhatsApp/phone number.');
      return;
    }
    if (!rangeValidation.available) {
      setErrorMsg('Villa Tao is unavailable for the selected dates. Please choose open dates.');
      return;
    }
    if (paymentMethod === 'card' && (cardNumber.replace(/\D/g, '').length < 12 || !cardExpiry || !cardCvc)) {
      setErrorMsg('Please enter valid payment card details.');
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 750));

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
      specialRequests,
    });

    setIsProcessing(false);
    setConfirmedRes(created);
    setStep('confirmed');

    if (paymentMethod === 'whatsapp_concierge') {
      const msg = `*Villa Tao Direct Booking (${created.referenceCode})*\n• Entire Private Villa Rental\n• Dates: ${created.checkIn} to ${created.checkOut} (${created.nights} nights)\n• Guests: ${created.guests}\n• Total Direct Rate: ${formatPrice(created.totalUsd)}\nPlease confirm my reservation.`;
      window.open(getWhatsAppUrl('booking', msg), '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] text-[#2C221E] shadow-2xl p-5 sm:p-8 lg:p-10 border border-[#2C221E]/10 overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Booking Modal"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#2C221E]/70 hover:text-[#2C221E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-[#2C221E]/10 pr-10">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#8C7355] block mb-1">
            VILLA TAO BALIAN • SOLE PRIVATE OCCUPANCY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C221E] font-normal">
            {step === 'confirmed'
              ? 'Reservation Confirmed'
              : step === 'payment'
              ? 'Guest Details & Direct Payment'
              : 'Book the Entire Villa'}
          </h2>
          <p className="text-xs text-[#2C221E]/70 font-light mt-1">
            The entire villa is exclusively yours during your stay • 4 Bedrooms, Private Pool, Ocean View, Max 10 Guests.
          </p>
        </div>

        {step === 'confirmed' && confirmedRes ? (
          <div className="space-y-6 py-2">
            <div className="p-6 bg-[#F5F2EB] border border-[#2C221E]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block">
                  BOOKING REFERENCE
                </span>
                <span className="font-mono text-xl sm:text-2xl text-[#2C221E] tracking-widest">
                  {confirmedRes.referenceCode}
                </span>
                <p className="text-xs text-[#2C221E]/70 font-light mt-1">
                  Villa Tao — Entire Private Villa • {confirmedRes.checkIn} to {confirmedRes.checkOut} ({confirmedRes.nights} nights)
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                  TOTAL DIRECT RATE
                </span>
                <span className="font-serif text-2xl text-[#2C221E]">
                  {formatPrice(confirmedRes.totalUsd)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#2C221E]/60 block">
                  {confirmedRes.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#2C221E]/80 font-light leading-relaxed">
              Your dates have been locked in our master calendar and synchronized across Airbnb and Booking.com. You can manage your reservation at any time using your reference code{' '}
              <strong className="font-mono">{confirmedRes.referenceCode}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#2C221E]/10">
              <a
                href={getWhatsAppUrl(
                  'booking',
                  `Hello Villa Tao, my direct booking reference is ${confirmedRes.referenceCode} (${confirmedRes.checkIn} to ${confirmedRes.checkOut}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.2em]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Connect with WhatsApp Concierge</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 border border-[#2C221E]/25 text-xs uppercase tracking-[0.2em] text-[#2C221E]"
              >
                Return to Website
              </button>
            </div>
          </div>
        ) : step === 'dates' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-5">
              {/* Single Villa Banner */}
              <div className="p-4 bg-[#F5F2EB] border border-[#2C221E]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#8C7355] block">
                    VILLA TAO • ENTIRE PRIVATE VILLA
                  </span>
                  <h4 className="font-serif text-lg text-[#2C221E] leading-snug">
                    Entire Private Villa
                  </h4>
                  <p className="text-xs text-[#2C221E]/75 font-light mt-0.5">
                    The entire villa is exclusively yours during your stay.
                  </p>
                  <p className="text-[11px] text-[#8C7355] font-medium mt-1">
                    4 Bedrooms · Private Pool · Ocean View
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2C221E]/10">
                  <span className="font-serif text-lg text-[#2C221E] block">
                    {formatPrice(entireVillaUnit.baseNightlyRate || 580)}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#2C221E]/55">/ night base rate</span>
                </div>
              </div>

              {/* Date & Guests Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1">
                    Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-2.5 py-2 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-2.5 py-2 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/70 mb-1">
                    Guests (Max 10)
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-2.5 py-2 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
                      <option key={n} value={n}>
                        {n} Guests
                      </option>
                    ))}
                    <option value={1}>1 Guest</option>
                  </select>
                </div>
              </div>

              {/* Compact Availability Calendar for the Entire Villa */}
              <AvailabilityCalendar
                unitId="entire-villa"
                checkIn={checkIn}
                checkOut={checkOut}
                onSelectDates={(inD, outD) => {
                  setCheckIn(inD);
                  setCheckOut(outD);
                  setErrorMsg(null);
                }}
                compact
              />
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/12 space-y-4">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#8C7355] block">
                    YOUR RESERVATION
                  </span>
                  <h3 className="font-serif text-lg text-[#2C221E]">
                    Villa Tao — Entire Private Villa
                  </h3>
                  <p className="text-xs text-[#2C221E]/65 font-light mt-0.5">
                    {priceBreakdown.nights} Nights • {guests} Guest(s) • {priceBreakdown.seasonLabel}
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t border-[#2C221E]/10 pt-3">
                  <div className="flex justify-between text-[#2C221E]/80">
                    <span>Entire Villa Rate ({priceBreakdown.nights} nights)</span>
                    <span>{formatPrice(priceBreakdown.subtotalAfterDiscounts)}</span>
                  </div>
                  <div className="flex justify-between text-[#2C221E]/65">
                    <span>Villa Care &amp; Tax (10%)</span>
                    <span>{formatPrice(priceBreakdown.taxesAndServiceFee)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#2C221E]/10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355]">
                      Total Rate
                    </span>
                    <span className="font-serif text-2xl text-[#2C221E]">
                      {formatPrice(priceBreakdown.totalDirectUsd)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8C7355] font-light">
                    Direct booking saves {formatPrice(priceBreakdown.directSavingsUsd)} vs OTA platforms
                  </p>
                </div>

                {errorMsg && <p className="text-xs text-[#8C7355]">{errorMsg}</p>}

                <button
                  type="button"
                  onClick={() => {
                    if (!rangeValidation.available) {
                      setErrorMsg(rangeValidation.reason || 'Villa Tao is unavailable for these dates.');
                      return;
                    }
                    setStep('payment');
                  }}
                  className="w-full py-3.5 min-h-[44px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.22em] transition-colors"
                >
                  CONTINUE TO GUEST DETAILS
                </button>
              </div>

              {/* Partner Channels Alternative */}
              <div className="p-4 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-2">
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#8C7355] block">
                  OR BOOK VIA OFFICIAL PARTNERS
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href={getWhatsAppUrl(
                      'booking',
                      `Hello Villa Tao, I would like to inquire about reserving the entire private villa from ${checkIn} to ${checkOut} (${guests} guests).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 border border-[#2C221E]/15 hover:border-[#2C221E] text-[11px] uppercase tracking-[0.18em] flex items-center justify-between"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Direct WhatsApp</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={villaTaoLinks.airbnb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 border border-[#2C221E]/15 hover:border-[#2C221E] text-[10px] uppercase tracking-[0.18em] flex items-center justify-between"
                    >
                      <span>Airbnb</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a
                      href={villaTaoLinks.bookingCom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 border border-[#2C221E]/15 hover:border-[#2C221E] text-[10px] uppercase tracking-[0.18em] flex items-center justify-between"
                    >
                      <span>Booking.com</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: GUEST DETAILS & PAYMENT */
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/75 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-3 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/20 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/75 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-3 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/20 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/75 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full px-3 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/20 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/75 mb-1">
                  WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+61 400 000 000"
                  className="w-full px-3 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/20 text-xs"
                />
              </div>
            </div>

            {/* Curated Add-ons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {bookingAddons.map((addon) => {
                const active = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 border text-left transition-colors ${
                      active ? 'bg-[#F5F2EB] border-[#2C221E]' : 'bg-white border-[#2C221E]/12'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-[#2C221E]">
                      <span className="truncate">{addon.name.split('(')[0]}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />}
                    </div>
                    <span className="text-[10px] text-[#8C7355] block mt-0.5">
                      +{formatPrice(addon.priceUsd)} {addon.perNight ? '/guest/night' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Payment Method & Schedule */}
            <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/12 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Direct Payment Settlement</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentSchedule('full')}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider border ${
                      paymentSchedule === 'full'
                        ? 'bg-[#2C221E] text-white border-[#2C221E]'
                        : 'bg-white text-[#2C221E] border-[#2C221E]/20'
                    }`}
                  >
                    100% Full ({formatPrice(priceBreakdown.totalDirectUsd)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSchedule('deposit_50')}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider border ${
                      paymentSchedule === 'deposit_50'
                        ? 'bg-[#2C221E] text-white border-[#2C221E]'
                        : 'bg-white text-[#2C221E] border-[#2C221E]/20'
                    }`}
                  >
                    50% Deposit ({formatPrice(priceBreakdown.depositAmountUsd)})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'bg-white border-[#2C221E] font-medium'
                      : 'border-[#2C221E]/15 text-[#2C221E]/65'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card Checkout</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-white border-[#2C221E] font-medium'
                      : 'border-[#2C221E]/15 text-[#2C221E]/65'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Wise / Bank Wire</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp_concierge')}
                  className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                    paymentMethod === 'whatsapp_concierge'
                      ? 'bg-white border-[#2C221E] font-medium'
                      : 'border-[#2C221E]/15 text-[#2C221E]/65'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Direct</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 16)
                            .replace(/(\d{4})(?=\d)/g, '$1 ')
                        )
                      }
                      placeholder="Card Number (4532 •••• •••• ••••)"
                      className="w-full px-3 py-2.5 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs font-mono"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setCardExpiry(d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                      }}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2.5 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs font-mono"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="CVC"
                      className="w-full px-3 py-2.5 min-h-[40px] bg-white border border-[#2C221E]/20 text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {errorMsg && <p className="text-xs text-[#8C7355]">{errorMsg}</p>}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('dates')}
                className="w-full sm:w-auto px-6 py-3.5 border border-[#2C221E]/25 text-xs uppercase tracking-[0.2em]"
              >
                Back to Dates
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:flex-1 py-3.5 bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] text-xs uppercase tracking-[0.22em] transition-colors"
              >
                {isProcessing
                  ? 'CONFIRMING RESERVATION...'
                  : `RESERVE THE ENTIRE VILLA • ${formatPrice(amountDueNowUsd)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
