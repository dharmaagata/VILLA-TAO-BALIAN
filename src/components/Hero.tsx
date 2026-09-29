import React, { useState } from 'react';
import { ArrowDown, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { villaTaoImages, villaTaoLinks } from '../data/villaData';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  // Allow toggling between Day, Sunset, and Twilight atmosphere modes for extra cinematic depth
  const [activeMood, setActiveMood] = useState<'day' | 'sunset' | 'night'>('day');

  const moodImages = {
    day: villaTaoImages.heroImage,
    sunset: villaTaoImages.heroSunset,
    night: villaTaoImages.heroNight
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#1E2E24]">
      {/* Background Photography with Crossfade */}
      <div className="absolute inset-0 z-0">
        <img
          src={moodImages[activeMood]}
          alt="Villa Tao Balian authentic tropical architecture and infinity pool facing the sea"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
          fetchPriority="high"
        />
        {/* Cinematic Multi-layered Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
        <div className="absolute inset-0 bg-[#2C221E]/20 mix-blend-multiply" />
      </div>

      {/* Top Spacer for Fixed Navbar */}
      <div className="h-28 sm:h-32" />

      {/* Main Center Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center text-white my-auto py-12 w-full">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-white/25 bg-black/30 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-light text-white/90 mb-5 sm:mb-6">
          <Sparkles className="w-3 h-3 text-[#C5A880] shrink-0" />
          <span>Exclusive Coastal Sanctuary</span>
        </div>

        <h1
          id="hero-main-title"
          className="font-serif text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-[0.12em] sm:tracking-[0.2em] uppercase leading-[1.08] sm:leading-none text-white drop-shadow-md break-words"
        >
          VILLA TAO
        </h1>

        <p
          id="hero-subtitle"
          className="font-serif italic text-lg sm:text-2xl md:text-3xl text-white/90 mt-3 sm:mt-6 font-light tracking-wide max-w-2xl mx-auto px-2"
        >
          A Private Tropical Escape in Balian, Bali
        </p>

        <p
          id="hero-description"
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed tracking-wide px-2"
        >
          Reconnect with nature, experience authentic architecture, and slow down in one of Bali's hidden coastal escapes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-sm sm:max-w-none mx-auto">
          <button
            id="hero-book-btn"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] bg-[#FAF8F5] text-[#2C221E] hover:bg-[#C5A880] hover:text-white text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 shadow-lg flex items-center justify-center text-center"
          >
            BOOK YOUR STAY
          </button>

          <a
            id="hero-explore-btn"
            href="#about"
            className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] border border-white/80 text-white hover:bg-white hover:text-[#2C221E] text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 flex items-center justify-center text-center"
          >
            EXPLORE THE VILLA
          </a>
        </div>

        {/* Quick WhatsApp direct chip */}
        <div className="mt-5 sm:mt-6">
          <a
            href={villaTaoLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-[11px] sm:text-xs text-white/70 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/10"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            <span className="tracking-wider">Inquire directly on WhatsApp (+62 817-4721-299)</span>
          </a>
        </div>
      </div>

      {/* Hero Bottom Bar: Mood selector & Location kicker */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 pt-4 flex flex-col md:flex-row items-center justify-between text-white/80 border-t border-white/10 gap-3 sm:gap-4">
        {/* Location tag */}
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/90 font-light text-center sm:text-left">
          <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
          <span>Balian • West Bali • Indonesia</span>
        </div>

        {/* Atmosphere / Time-of-day switcher */}
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px]">
          <span className="text-white/50 text-[10px] uppercase tracking-wider pr-1">Atmosphere:</span>
          <button
            onClick={() => setActiveMood('day')}
            className={`px-2.5 py-0.5 rounded-full transition-all uppercase tracking-wider text-[10px] ${
              activeMood === 'day' ? 'bg-white text-[#2C221E] font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setActiveMood('sunset')}
            className={`px-2.5 py-0.5 rounded-full transition-all uppercase tracking-wider text-[10px] ${
              activeMood === 'sunset' ? 'bg-[#C5A880] text-white font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            Sunset
          </button>
          <button
            onClick={() => setActiveMood('night')}
            className={`px-2.5 py-0.5 rounded-full transition-all uppercase tracking-wider text-[10px] ${
              activeMood === 'night' ? 'bg-[#4A3B2C] text-white font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            Twilight
          </button>
        </div>

        {/* Scroll prompt */}
        <a
          href="#about"
          className="hidden md:flex items-center space-x-2 text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
