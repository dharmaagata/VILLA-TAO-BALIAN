import React, { useState } from 'react';
import { villaTaoImages } from '../data/villaData';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [activeMood, setActiveMood] = useState<'day' | 'sunset' | 'night'>('day');

  const moodImages = {
    day: villaTaoImages.heroImage,
    sunset: villaTaoImages.heroSunset,
    night: villaTaoImages.heroNight
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#1E2E24]"
    >
      {/* Background Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src={moodImages[activeMood]}
          alt="Villa Tao Balian authentic tropical architecture and infinity pool facing the sea"
          className="w-full h-full object-cover object-center transition-opacity duration-700"
          referrerPolicy="no-referrer"
          fetchPriority="high"
        />
        {/* Subtle Cinematic Contrast Scrim — Preserves Photograph Clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/65" />
      </div>

      {/* Top Spacer for Fixed Header */}
      <div className="h-20 sm:h-24 shrink-0" />

      {/* Main Centered Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center text-white my-auto py-10 w-full">
        <h1
          id="hero-main-title"
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.2em] sm:tracking-[0.24em] uppercase leading-tight text-white"
        >
          VILLA TAO
        </h1>

        <p
          id="hero-subtitle"
          className="font-serif italic text-lg sm:text-xl md:text-2xl text-white/95 mt-3 sm:mt-4 font-light tracking-wide"
        >
          A Private Tropical Escape in Balian, Bali
        </p>

        <p
          id="hero-description"
          className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-white/85 max-w-xl mx-auto font-light leading-relaxed tracking-wide"
        >
          Reconnect with nature and slow down on Bali's hidden west coast.
        </p>

        {/* Two Understated Luxury CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <button
            id="hero-book-btn"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-7 py-3.5 min-h-[46px] bg-[#2C221E] text-white border border-[#2C221E] hover:bg-[#3E342B] hover:border-[#3E342B] text-[11px] uppercase tracking-[0.24em] font-normal transition-colors duration-200 flex items-center justify-center whitespace-nowrap"
          >
            BOOK YOUR STAY
          </button>

          <a
            id="hero-explore-btn"
            href="#about"
            className="w-full sm:w-auto px-7 py-3.5 min-h-[46px] bg-transparent border border-white/75 text-white hover:bg-white/10 hover:border-white text-[11px] uppercase tracking-[0.24em] font-normal transition-colors duration-200 flex items-center justify-center whitespace-nowrap"
          >
            EXPLORE THE VILLA
          </a>
        </div>
      </div>

      {/* Unified Bottom Information Bar — Positioned 40–60px Above the Bottom Edge */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-5 sm:px-8 mb-10 sm:mb-12 lg:mb-14 shrink-0">
        <div className="border-t border-white/25 pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-white">
          {/* Location Text */}
          <div className="text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-white/85 font-light text-center sm:text-left">
            BALIAN • WEST BALI • INDONESIA
          </div>

          {/* Atmosphere Controls (Unified into the same bar) */}
          <div className="flex flex-col xs:flex-row sm:flex-col md:flex-row items-center sm:items-end md:items-center gap-1.5 md:gap-4 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
            <span className="text-white/55 font-light">ATMOSPHERE</span>
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <button
                type="button"
                onClick={() => setActiveMood('day')}
                className={`py-1 transition-colors uppercase tracking-[0.22em] ${
                  activeMood === 'day'
                    ? 'text-white font-medium border-b border-white'
                    : 'text-white/60 hover:text-white/90 font-light'
                }`}
              >
                DAY
              </button>
              <span className="text-white/35" aria-hidden="true">•</span>
              <button
                type="button"
                onClick={() => setActiveMood('sunset')}
                className={`py-1 transition-colors uppercase tracking-[0.22em] ${
                  activeMood === 'sunset'
                    ? 'text-white font-medium border-b border-white'
                    : 'text-white/60 hover:text-white/90 font-light'
                }`}
              >
                SUNSET
              </button>
              <span className="text-white/35" aria-hidden="true">•</span>
              <button
                type="button"
                onClick={() => setActiveMood('night')}
                className={`py-1 transition-colors uppercase tracking-[0.22em] ${
                  activeMood === 'night'
                    ? 'text-white font-medium border-b border-white'
                    : 'text-white/60 hover:text-white/90 font-light'
                }`}
              >
                TWILIGHT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

