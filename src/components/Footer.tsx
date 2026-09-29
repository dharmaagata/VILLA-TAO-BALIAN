import React from 'react';
import { MessageCircle, MapPin, Mail, ArrowUpRight, ArrowUp } from 'lucide-react';
import { villaTaoLinks, officialWhatsAppNumber } from '../data/villaData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#1C1613] text-[#FAF8F5] pt-16 sm:pt-20 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 sm:pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#" className="inline-block py-1">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-medium uppercase text-white block">
                VILLA TAO
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] block mt-0.5">
                Balian • West Bali
              </span>
            </a>

            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-sm pt-1">
              An exclusive tropical villa retreat in Balian, Tabanan, Bali. Preserving traditional Indonesian architecture, reclaimed materials, ocean privacy, and slow living.
            </p>

            <div className="pt-2 text-xs text-white/60 space-y-2">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Balian Beach, Selemadeg Barat, Tabanan, Bali</span>
              </p>
              <p className="flex items-center space-x-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>WhatsApp: {officialWhatsAppNumber}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-4 sm:mb-6">
              Navigation
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-xs tracking-wider uppercase text-white/75 font-light">
              <li>
                <a href="#about" className="inline-flex items-center py-1.5 hover:text-white transition-colors min-h-[36px]">About Villa Tao</a>
              </li>
              <li>
                <a href="#story" className="inline-flex items-center py-1.5 hover:text-white transition-colors min-h-[36px]">Architectural Story</a>
              </li>
              <li>
                <a href="#rooms" className="inline-flex items-center py-1.5 hover:text-white transition-colors min-h-[36px]">Rooms & Suites</a>
              </li>
              <li>
                <a href="#facilities" className="inline-flex items-center py-1.5 hover:text-white transition-colors min-h-[36px]">Villa Facilities</a>
              </li>
              <li>
                <a href="#experiences" className="inline-flex items-center py-1.5 hover:text-white transition-colors min-h-[36px]">Balian Experiences</a>
              </li>
              <li>
                <a href="#gallery" className="inline-flex items-center py-1.5 hover:text-white transition-colors min-h-[36px]">Photo Gallery</a>
              </li>
              <li>
                <a href="#contact" className="inline-flex items-center py-1.5 hover:text-white transition-colors min-h-[36px]">Contact & Inquiries</a>
              </li>
            </ul>
          </div>

          {/* Booking & Platforms */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-4 sm:mb-6">
              Official Platforms
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-xs tracking-wider text-white/75 font-light">
              <li>
                <a
                  href={villaTaoLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 py-1.5 hover:text-[#25D366] transition-colors min-h-[36px]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                  <span>Direct WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href={villaTaoLinks.airbnb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 py-1.5 hover:text-[#FF5A5F] transition-colors min-h-[36px]"
                >
                  <span className="w-3.5 h-3.5 text-center font-bold text-[10px] text-[#FF5A5F] shrink-0">A</span>
                  <span>Airbnb Official Listing</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href={villaTaoLinks.bookingCom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 py-1.5 hover:text-[#3880FF] transition-colors min-h-[36px]"
                >
                  <span className="w-3.5 h-3.5 text-center font-bold text-[10px] text-[#3880FF] shrink-0">B</span>
                  <span>Booking.com Official Listing</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href={villaTaoLinks.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 py-1.5 hover:text-[#C5A880] transition-colors min-h-[36px]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span>Google Maps Location</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* Slower Bali Column */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-4 sm:mb-6">
                Philosophy
              </h4>
              <p className="font-serif italic text-sm text-white/80 leading-relaxed font-light">
                "Disconnect from the noise. Reconnect with the sea, the stone, and the palms."
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 sm:mt-8 self-start inline-flex items-center space-x-2 py-2 px-1 text-xs uppercase tracking-[0.2em] text-[#C5A880] hover:text-white transition-colors min-h-[44px]"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-light gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Villa Tao Balian. All Rights Reserved.</p>
          <p className="tracking-widest uppercase text-[10px] text-white/40">
            Luxury Tropical • Traditional Architecture • Nature & Privacy
          </p>
        </div>
      </div>
    </footer>
  );
};
