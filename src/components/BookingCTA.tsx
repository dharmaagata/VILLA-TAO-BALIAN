import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { villaTaoImages, villaTaoLinks } from '../data/villaData';

interface BookingCTAProps {
  onOpenBooking: () => void;
}

export const BookingCTA: React.FC<BookingCTAProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative py-28 sm:py-36 bg-[#132018] overflow-hidden text-white">
      {/* Background Photography with Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={villaTaoImages.ctaImage}
          alt="Villa Tao Balian twilight atmosphere with candles by the pool overlooking the ocean"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[#2C221E]/30 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-white/25 bg-black/40 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-light text-white/90 mb-5 sm:mb-6">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>RESERVE YOUR RETREAT</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-normal text-white tracking-tight leading-tight">
          Your Bali Escape Starts Here
        </h2>

        <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
          Take a break from the ordinary and experience a slower side of Bali. Unwind to the sound of the ocean, authentic architectural warmth, and total coastal seclusion.
        </p>

        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6">
          <button
            id="cta-book-stay-btn"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 sm:px-9 py-4 min-h-[44px] bg-[#FAF8F5] text-[#2C221E] hover:bg-[#C5A880] hover:text-white text-xs uppercase tracking-[0.25em] font-medium transition-all shadow-xl text-center"
          >
            BOOK YOUR STAY
          </button>

          <a
            id="cta-contact-us-btn"
            href="#contact"
            className="w-full sm:w-auto px-8 sm:px-9 py-4 min-h-[44px] inline-flex items-center justify-center border border-white/80 text-white hover:bg-white hover:text-[#2C221E] text-xs uppercase tracking-[0.25em] font-medium transition-all text-center"
          >
            CONTACT US
          </a>
        </div>

        <div className="mt-6 sm:mt-8">
          <a
            href={villaTaoLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 text-xs text-white/70 hover:text-white transition-colors py-2 min-h-[44px] text-center"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            <span>Prefer a quick conversation? Message us directly on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
