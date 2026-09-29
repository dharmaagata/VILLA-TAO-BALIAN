import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, ArrowUpRight, Calendar, Users, Sparkles } from 'lucide-react';
import { villaTaoLinks, getWhatsAppUrl } from '../data/villaData';

export const BookingSection: React.FC = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [roomPreference, setRoomPreference] = useState('Any Room');

  const handleCustomWhatsAppInquiry = () => {
    let msg = `Hello Villa Tao, I would like to inquire about booking Villa Tao Balian.`;
    if (checkIn && checkOut) {
      msg += `\n- Dates: Check-in ${checkIn} to Check-out ${checkOut}`;
    }
    if (guests) {
      msg += `\n- Guests: ${guests} guest(s)`;
    }
    if (roomPreference && roomPreference !== 'Any Room') {
      msg += `\n- Preferred Suite: ${roomPreference}`;
    }
    msg += `\nCould you please confirm availability and provide rates? Thank you!`;

    window.open(getWhatsAppUrl('booking', msg), '_blank');
  };

  return (
    <section id="booking" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESERVATIONS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
            Choose Your Way To Stay
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#2C221E]/75 font-light leading-relaxed">
            Reserve through our official partner platforms or connect directly with our local team for tailored arrangements and prompt assistance.
          </p>
        </div>

        {/* 3 Booking Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          
          {/* 1. Direct Booking via WhatsApp */}
          <div className="relative bg-[#F5F2EB] border-2 border-[#8C7355] p-6 sm:p-10 flex flex-col justify-between shadow-md hover:shadow-xl transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-[#8C7355] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-center whitespace-nowrap max-w-[90%] truncate">
              DIRECT SERVICE & BEST RATES
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5 sm:mb-6 mt-2 sm:mt-0">
                <MessageCircle className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-2xl text-[#2C221E] font-medium mb-1.5 sm:mb-2">
                Book Directly
              </h3>
              <p className="text-xs uppercase tracking-[0.15em] text-[#8C7355] font-semibold mb-3 sm:mb-4">
                WhatsApp Direct Team
              </p>
              <p className="text-xs sm:text-sm text-[#2C221E]/75 font-light leading-relaxed mb-6">
                Speak directly with the Villa Tao team. Best for flexible inquiries, customized stays, transport arrangements, and direct support.
              </p>
            </div>

            <div>
              <a
                id="booking-whatsapp-direct-btn"
                href={getWhatsAppUrl('booking')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 py-3.5 min-h-[44px] bg-[#25D366] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#20ba59] transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>BOOK VIA WHATSAPP</span>
              </a>
              <p className="text-[11px] text-[#2C221E]/60 text-center mt-3 font-light">
                Direct reply • Official line: +62 817-4721-299
              </p>
            </div>
          </div>

          {/* 2. Official Airbnb Listing */}
          <div className="bg-[#FAF8F5] border border-[#2C221E]/15 p-6 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center mb-5 sm:mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-2xl text-[#2C221E] font-medium mb-1.5 sm:mb-2">
                Airbnb
              </h3>
              <p className="text-xs uppercase tracking-[0.15em] text-[#FF5A5F] font-semibold mb-3 sm:mb-4">
                Official Listing
              </p>
              <p className="text-xs sm:text-sm text-[#2C221E]/75 font-light leading-relaxed mb-6">
                Book through our verified Airbnb listing with secure checkout, platform protection, and guest review history.
              </p>
            </div>

            <div>
              <a
                id="booking-airbnb-btn"
                href={villaTaoLinks.airbnb}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 py-3.5 min-h-[44px] border border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                <span>BOOK ON AIRBNB</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
              <p className="text-[11px] text-[#2C221E]/60 text-center mt-3 font-light">
                Tao Villa BeachFront • Verified Host
              </p>
            </div>
          </div>

          {/* 3. Official Booking.com Listing */}
          <div className="bg-[#FAF8F5] border border-[#2C221E]/15 p-6 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#003580]/10 text-[#003580] flex items-center justify-center mb-5 sm:mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-2xl text-[#2C221E] font-medium mb-1.5 sm:mb-2">
                Booking.com
              </h3>
              <p className="text-xs uppercase tracking-[0.15em] text-[#003580] font-semibold mb-3 sm:mb-4">
                Official Listing
              </p>
              <p className="text-xs sm:text-sm text-[#2C221E]/75 font-light leading-relaxed mb-6">
                Reserve via the Booking.com global platform. Convenient for travelers with existing loyalty accounts.
              </p>
            </div>

            <div>
              <a
                id="booking-bookingcom-btn"
                href={villaTaoLinks.bookingCom}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 py-3.5 min-h-[44px] border border-[#003580] text-[#003580] hover:bg-[#003580] hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                <span>BOOK ON BOOKING.COM</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
              <p className="text-[11px] text-[#2C221E]/60 text-center mt-3 font-light">
                Official Villa Tao Balian Listing
              </p>
            </div>
          </div>

        </div>

        {/* Quick Date Inquiry Helper (Direct to WhatsApp) */}
        <div className="bg-[#F5F2EB] border border-[#2C221E]/10 p-6 sm:p-10 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
            <Calendar className="w-4 h-4" />
            <span>Fast Availability Check</span>
          </div>
          
          <h3 className="font-serif text-xl sm:text-2xl text-[#2C221E] font-normal mb-6">
            Check Your Dates With The Team
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5+">5+ Guests (Full Villa)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/70 mb-1 font-medium">
                Preferred Room
              </label>
              <select
                value={roomPreference}
                onChange={(e) => setRoomPreference(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
              >
                <option value="Any Room">Entire Villa / Any Room</option>
                <option value="ROOM 01 Private Tropical Room">ROOM 01: Private Tropical Room</option>
                <option value="ROOM 02 Garden View Room">ROOM 02: Garden View Room</option>
                <option value="ROOM 03 Ocean Atmosphere Room">ROOM 03: Ocean Atmosphere Room</option>
                <option value="ROOM 04 Private Villa Room">ROOM 04: Private Villa Room</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2C221E]/10">
            <span className="text-xs text-[#2C221E]/60 italic font-light text-center sm:text-left">
              Prefills your message directly into WhatsApp with your dates and guest count.
            </span>
            <button
              onClick={handleCustomWhatsAppInquiry}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 min-h-[44px] bg-[#2C221E] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#4A3B2C] transition-colors shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <span>SEND INQUIRY TO WHATSAPP</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
