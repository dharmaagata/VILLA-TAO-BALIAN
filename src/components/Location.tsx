import React from 'react';
import { MapPin, Navigation, Compass, Car, Waves, ArrowUpRight } from 'lucide-react';
import { villaTaoLinks } from '../data/villaData';

export const Location: React.FC = () => {
  return (
    <section id="location" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Context & Details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>THE BALIAN REGION</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
              Find Your Way To Villa Tao
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#2C221E]/80 font-light leading-relaxed">
              Situated in the coastal hamlet of Balian within Tabanan Regency, Villa Tao lies approximately two hours northwest of Ngurah Rai International Airport along Bali's scenic coastal route.
            </p>

            <p className="mt-4 text-xs sm:text-sm md:text-base text-[#2C221E]/75 font-light leading-relaxed">
              Unlike the congested resort strips of Seminyak or Canggu, Balian has retained its raw, laid-back charm. Renowned for its volcanic black sand beaches, consistent rivermouth left-hand surf wave, and lush palm-fringed estuaries, it is a haven for travelers who appreciate tranquility.
            </p>

            {/* Travel Times & Key Distances */}
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 py-4 border-y border-[#2C221E]/10 text-center">
              <div className="p-2 sm:p-3 bg-[#F5F2EB]">
                <span className="text-[10px] uppercase text-[#8C7355] tracking-wider block font-semibold">Airport</span>
                <span className="font-serif text-sm sm:text-base text-[#2C221E] font-medium">~2 Hours</span>
                <span className="text-[10px] text-[#2C221E]/60 block font-light">Ngurah Rai (DPS)</span>
              </div>
              <div className="p-2 sm:p-3 bg-[#F5F2EB]">
                <span className="text-[10px] uppercase text-[#8C7355] tracking-wider block font-semibold">Canggu / Seminyak</span>
                <span className="font-serif text-sm sm:text-base text-[#2C221E] font-medium">~1.5 Hours</span>
                <span className="text-[10px] text-[#2C221E]/60 block font-light">West Coast Route</span>
              </div>
              <div className="p-2 sm:p-3 bg-[#F5F2EB]">
                <span className="text-[10px] uppercase text-[#8C7355] tracking-wider block font-semibold">Ubud</span>
                <span className="font-serif text-sm sm:text-base text-[#2C221E] font-medium">~1.5–2 Hours</span>
                <span className="text-[10px] text-[#2C221E]/60 block font-light">Scenic Inland Drive</span>
              </div>
            </div>

            {/* Travel Context Cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 bg-[#F5F2EB] border border-[#2C221E]/5">
                <div className="flex items-center space-x-2 text-[#8C7355] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Car className="w-4 h-4" />
                  <span>Scenic Arrival</span>
                </div>
                <p className="text-xs text-[#2C221E]/75 font-light">
                  Direct private car transfer service can be arranged upon request.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-[#F5F2EB] border border-[#2C221E]/5">
                <div className="flex items-center space-x-2 text-[#8C7355] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Waves className="w-4 h-4" />
                  <span>Coastal Setting</span>
                </div>
                <p className="text-xs text-[#2C221E]/75 font-light">
                  A short gentle stroll leads directly to Balian Beach and surf breaks.
                </p>
              </div>
            </div>

            {/* Direct Google Maps Action Button */}
            <div className="mt-6 sm:mt-8">
              <a
                id="location-directions-btn"
                href={villaTaoLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-6 sm:px-8 py-3.5 min-h-[44px] bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium hover:bg-[#4A3B2C] transition-all shadow-md group text-center"
              >
                <Navigation className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>OPEN IN GOOGLE MAPS</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Stylized Map Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#F5F2EB] border border-[#2C221E]/10 p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[420px]">
              
              {/* Background ambient aesthetic */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#EAE4D6]/50 blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between border-b border-[#2C221E]/10 pb-4 mb-5 sm:mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block">
                      OFFICIAL LOCATION
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#2C221E] font-normal">
                      Villa Tao Balian
                    </h3>
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 bg-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium border border-[#2C221E]/10">
                    Tabanan • Bali
                  </span>
                </div>

                <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm text-[#2C221E]/80">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#2C221E] font-medium">Address</strong>
                      <span className="font-light">Balian Beach, Selemadeg Barat, Tabanan Regency, Bali, Indonesia</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Compass className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#2C221E] font-medium">Coordinates</strong>
                      <span className="font-light font-mono text-xs">8°30'03.2"S 115°01'44.8"E</span>
                    </div>
                  </div>
                </div>

                {/* Visual Location Preview Card */}
                <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 bg-white border border-[#2C221E]/10 flex items-center space-x-3 sm:space-x-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#2C221E] shrink-0 overflow-hidden relative">
                    <img
                      src="/images/villa-tao/photo-01.jpg"
                      alt="Villa Tao Balian map preview"
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#2C221E]">
                      Tao Villa BeachFront
                    </h4>
                    <p className="text-[11px] text-[#2C221E]/65 mt-0.5 font-light">
                      Direct beachfront access, Balian surf breaks & natural privacy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[#2C221E]/10 flex items-center justify-between">
                <span className="text-xs text-[#2C221E]/60 italic">
                  Opens official Google Maps pin
                </span>
                <a
                  href={villaTaoLinks.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C7355] hover:text-[#2C221E] flex items-center space-x-1.5 py-1 min-h-[44px]"
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
