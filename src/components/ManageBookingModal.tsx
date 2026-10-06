import React, { useState, useEffect } from 'react';
import { X, Search, MessageCircle, CreditCard, Check, Printer } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { getWhatsAppUrl } from '../data/villaData';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  initialReference = '',
}) => {
  const {
    reservations,
    lookupReservation,
    updateReservationStatus,
    updateReservationDetails,
    formatPrice,
  } = useBooking();

  const [query, setQuery] = useState(initialReference);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [arrivalTime, setArrivalTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [payingBalance, setPayingBalance] = useState(false);

  useEffect(() => {
    if (initialReference) {
      setQuery(initialReference);
      const found = lookupReservation(initialReference);
      if (found) {
        setSelectedId(found.id);
        setArrivalTime(found.arrivalTime || '14:00');
        setSpecialRequests(found.specialRequests || '');
      }
    }
  }, [initialReference, isOpen, lookupReservation]);

  if (!isOpen) return null;

  const activeReservation = reservations.find((r) => r.id === selectedId) || null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = lookupReservation(query);
    if (found) {
      setSelectedId(found.id);
      setArrivalTime(found.arrivalTime || '14:00');
      setSpecialRequests(found.specialRequests || '');
    } else {
      setSelectedId(null);
    }
  };

  const handleSavePreferences = () => {
    if (!activeReservation) return;
    updateReservationDetails(activeReservation.id, {
      arrivalTime,
      specialRequests,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handlePayRemainingBalance = async () => {
    if (!activeReservation) return;
    setPayingBalance(true);
    await new Promise((r) => setTimeout(r, 650));
    updateReservationStatus(activeReservation.id, 'confirmed', activeReservation.totalUsd);
    setPayingBalance(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] text-[#2C221E] shadow-2xl p-5 sm:p-8 lg:p-10 border border-[#2C221E]/10 overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close Manage Booking"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#2C221E]/70 hover:text-[#2C221E]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-4 border-b border-[#2C221E]/10 pr-10">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#8C7355] block mb-1">
            GUEST RESERVATION PORTAL
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C221E] font-normal">
            Manage Your Villa Tao Stay
          </h2>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="space-y-3 mb-6">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2C221E]/75">
            Enter Booking Reference Code or Guest Email
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. VT-2026-8419 or sophie.taylor@melbourne.au"
              className="flex-1 px-3.5 py-2.5 min-h-[42px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 min-h-[42px] bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Stay</span>
            </button>
          </div>

          {/* Quick Select Recent Reservations */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] uppercase tracking-wider text-[#2C221E]/50">
              Active References:
            </span>
            {reservations
              .filter((r) => r.channel !== 'owner_block')
              .slice(0, 3)
              .map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setQuery(r.referenceCode);
                    setSelectedId(r.id);
                    setArrivalTime(r.arrivalTime || '14:00');
                    setSpecialRequests(r.specialRequests || '');
                  }}
                  className="text-[10px] font-mono px-2.5 py-1 bg-[#F5F2EB] border border-[#2C221E]/15 text-[#2C221E] hover:border-[#2C221E]"
                >
                  {r.referenceCode} ({r.guestName.split(' ')[0]})
                </button>
              ))}
          </div>
        </form>

        {activeReservation ? (
          <div className="space-y-6 bg-[#F5F2EB] border border-[#2C221E]/12 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2C221E]/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] block">
                  {activeReservation.referenceCode} • {activeReservation.channel.toUpperCase()}
                </span>
                <h3 className="font-serif text-xl text-[#2C221E] font-normal">
                  {activeReservation.unitName}
                </h3>
                <p className="text-xs text-[#2C221E]/70 font-light">
                  Guest: {activeReservation.guestName} ({activeReservation.guestEmail})
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em]">
                  {activeReservation.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Stay & Financial Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7355] block">
                  Stay Schedule
                </span>
                <p>Check-In: <strong>{activeReservation.checkIn}</strong> (from 14:00)</p>
                <p>Check-Out: <strong>{activeReservation.checkOut}</strong> (by 11:00)</p>
                <p className="text-[#2C221E]/65 font-light">
                  {activeReservation.nights} Nights • {activeReservation.guests} Guests
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7355] block">
                  Payment Summary
                </span>
                <p>Total Stay Rate: <strong>{formatPrice(activeReservation.totalUsd)}</strong></p>
                <p>Amount Paid: <strong>{formatPrice(activeReservation.amountPaidUsd)}</strong></p>
                <p className={activeReservation.balanceDueUsd > 0 ? 'text-[#8C7355] font-medium' : 'text-[#2C221E]/65'}>
                  Remaining Balance: {formatPrice(activeReservation.balanceDueUsd)}
                </p>
              </div>
            </div>

            {/* Settle Remaining Balance Button if Deposit Paid / Pending */}
            {activeReservation.balanceDueUsd > 0 && activeReservation.status !== 'cancelled' && (
              <div className="p-4 bg-[#FAF8F5] border border-[#8C7355]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-medium text-[#2C221E] block">
                    Online Balance Settlement Available
                  </span>
                  <span className="text-[#2C221E]/70 font-light">
                    Settle your remaining balance of {formatPrice(activeReservation.balanceDueUsd)} online now.
                  </span>
                </div>
                <button
                  type="button"
                  disabled={payingBalance}
                  onClick={handlePayRemainingBalance}
                  className="px-4 py-2.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 shrink-0"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{payingBalance ? 'Processing...' : `Pay ${formatPrice(activeReservation.balanceDueUsd)} Now`}</span>
                </button>
              </div>
            )}

            {/* Update Arrival & Concierge Preferences */}
            <div className="space-y-3 pt-2 border-t border-[#2C221E]/10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                Pre-Arrival Concierge &amp; Arrival Preferences
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1">
                    Arrival Time / Flight
                  </label>
                  <input
                    type="text"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1">
                    Special Requests &amp; Concierge Notes
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em] inline-flex items-center gap-1.5"
                >
                  {savedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Preferences Updated</span>
                    </>
                  ) : (
                    <span>Save Arrival Preferences</span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 border border-[#2C221E]/20 text-[10px] uppercase tracking-[0.18em] inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <a
                    href={getWhatsAppUrl(
                      'booking',
                      `Hello Villa Tao Concierge, regarding my reservation ${activeReservation.referenceCode} (${activeReservation.checkIn} to ${activeReservation.checkOut}):`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 border border-[#2C221E] text-[10px] uppercase tracking-[0.18em] inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          query && (
            <p className="text-xs text-[#2C221E]/70 font-light py-4 text-center">
              No reservation matched "{query}". Please check your reference code or select one of the active references above.
            </p>
          )
        )}
      </div>
    </div>
  );
};
