import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ShieldCheck, ArrowUpRight, Calendar, Users } from 'lucide-react';
import { villaTaoLinks, getWhatsAppUrl, officialWhatsAppNumber } from '../data/villaData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [room, setRoom] = useState('Entire Villa / Any Room');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleWhatsAppBooking = () => {
    let msg = `Hello Villa Tao, I would like to inquire about booking a stay at Villa Tao Balian.`;
    if (checkIn && checkOut) {
      msg += `\n• Dates: ${checkIn} to ${checkOut}`;
    }
    if (guests) {
      msg += `\n• Guests: ${guests}`;
    }
    if (room && room !== 'Entire Villa / Any Room') {
      msg += `\n• Suite: ${room}`;
    }
    msg += `\nPlease let me know your availability and rates. Thank you!`;

    window.open(getWhatsAppUrl('booking', msg), '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] text-[#2C221E] shadow-2xl p-5 sm:p-10 border border-[#2C221E]/10 overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Booking Options"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#2C221E]/70 hover:text-[#2C221E] rounded-full hover:bg-[#2C221E]/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 mt-2 sm:mt-0">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C7355] font-semibold block mb-1">
            RESERVATION CHANNELS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#2C221E] font-normal">
            Book Your Stay at Villa Tao
          </h2>
          <p className="text-xs sm:text-sm text-[#2C221E]/70 font-light mt-2 max-w-md mx-auto">
            Choose your preferred reservation option. We recommend booking directly via WhatsApp for personalized communication and flexibility.
          </p>
        </div>

        {/* 3 Channels */}
        <div className="space-y-3.5 sm:space-y-4 mb-6 sm:mb-8">
          {/* Option 1: WhatsApp Direct */}
          <div className="p-4 sm:p-5 bg-[#F5F2EB] border-2 border-[#8C7355] relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5 sm:space-x-4 w-full sm:w-auto">
              <div className="p-3 bg-[#25D366] text-white rounded-full shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#2C221E]">
                    Direct WhatsApp
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider bg-[#8C7355] text-white px-2 py-0.5 font-medium">
                    Best Support
                  </span>
                </div>
                <p className="text-xs text-[#2C221E]/75 font-light mt-0.5">
                  Direct communication with Villa Tao team • {officialWhatsAppNumber}
                </p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppBooking}
              className="w-full sm:w-auto px-5 py-3 min-h-[44px] bg-[#25D366] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#20ba59] transition-colors shrink-0 flex items-center justify-center text-center"
            >
              CHAT & BOOK
            </button>
          </div>

          {/* Option 2: Airbnb */}
          <div className="p-4 sm:p-5 bg-white border border-[#2C221E]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5 sm:space-x-4 w-full sm:w-auto">
              <div className="p-3 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-full shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#2C221E]">
                  Airbnb Official Listing
                </h3>
                <p className="text-xs text-[#2C221E]/75 font-light mt-0.5">
                  Instant booking with Airbnb guest guarantees & payment protection
                </p>
              </div>
            </div>

            <a
              href={villaTaoLinks.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3 min-h-[44px] border border-[#FF5A5F] text-[#FF5A5F] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FF5A5F] hover:text-white transition-colors shrink-0 text-center"
            >
              <span>AIRBNB</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Option 3: Booking.com */}
          <div className="p-4 sm:p-5 bg-white border border-[#2C221E]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5 sm:space-x-4 w-full sm:w-auto">
              <div className="p-3 bg-[#003580]/10 text-[#003580] rounded-full shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#2C221E]">
                  Booking.com Official Listing
                </h3>
                <p className="text-xs text-[#2C221E]/75 font-light mt-0.5">
                  Convenient booking through your Booking.com account
                </p>
              </div>
            </div>

            <a
              href={villaTaoLinks.bookingCom}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3 min-h-[44px] border border-[#003580] text-[#003580] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#003580] hover:text-white transition-colors shrink-0 text-center"
            >
              <span>BOOKING.COM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Date / Custom Trip Planner Pre-fill */}
        <div className="p-4 sm:p-5 bg-[#F5F2EB] border border-[#2C221E]/10">
          <span className="text-[11px] uppercase tracking-wider text-[#8C7355] font-semibold block mb-3">
            Prefill Dates for WhatsApp Inquiry
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1 font-medium">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1 font-medium">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#2C221E]/70 mb-1 font-medium">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E]"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="Full Villa">Entire Villa</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleWhatsAppBooking}
            className="w-full py-3 min-h-[44px] bg-[#2C221E] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#4A3B2C] transition-colors flex items-center justify-center space-x-2 text-center"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
            <span>CONTINUE WITH THESE DATES ON WHATSAPP</span>
          </button>
        </div>

      </div>
    </div>
  );
};
