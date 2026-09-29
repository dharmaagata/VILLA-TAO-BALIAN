import React from 'react';
import { Check, ArrowRight, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { villaTaoImages } from '../data/villaData';

export const About: React.FC = () => {
  const highlights = [
    { title: "Traditional Architecture", desc: "Authentic Javanese joglo engineering & hand-hewn timber" },
    { title: "Natural Materials", desc: "Reclaimed ironwood, volcanic stone & polished terrazzo" },
    { title: "Tropical Landscape", desc: "Secluded coconut groves and direct access to green lawns" },
    { title: "Ocean Atmosphere", desc: "Constant ocean breezes and the rhythm of Balian surf breaks" },
    { title: "Eco-Conscious Living", desc: "Passive cross-ventilation and harmonious natural footprint" },
    { title: "Private Villa Experience", desc: "Exclusive seclusion reserved entirely for your party" }
  ];

  return (
    <section id="about" className="py-20 sm:py-32 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Mobile Header (Shown on mobile for strict 1. Heading 2. Photo flow) */}
        <div className="lg:hidden mb-8">
          <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>ABOUT VILLA TAO</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C221E] font-normal leading-tight">
            A Different Kind of Bali
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Visual Composition with Real Villa Tao Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] overflow-hidden shadow-2xl bg-[#EAE4D6]">
              <img
                src={villaTaoImages.aboutImage}
                alt="Villa Tao Balian architecture and private swimming pool surrounded by tropical palm trees"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              
              {/* Subtle architectural badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-4 bg-white/90 backdrop-blur-md border border-[#2C221E]/10">
                <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#2C221E]">
                  "A sanctuary crafted from stone, timber, and the sea."
                </p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8C7355] mt-1">
                  Balian Coast • West Bali
                </p>
              </div>
            </div>

            {/* Inset Secondary Real Photo (Safely contained) */}
            <div className="hidden sm:block absolute -bottom-6 right-2 sm:-bottom-8 sm:right-2 lg:-right-6 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 overflow-hidden shadow-xl border-4 border-[#FAF8F5]">
              <img
                src={villaTaoImages.aboutSecondary}
                alt="Stepping stone pathway through tropical gardens at Villa Tao"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Desktop Header */}
            <div className="hidden lg:block">
              <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>ABOUT VILLA TAO</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C221E] font-normal leading-tight">
                A Different Kind of Bali
              </h2>
            </div>

            <p className="mt-4 lg:mt-6 text-base sm:text-lg text-[#2C221E]/80 leading-relaxed font-light">
              Tucked along the untamed coast of Balian in Tabanan, Villa Tao offers a rare return to the soul of Bali. Far from crowded tourist centers and commercialized resort corridors, this estate is designed for travelers seeking silence, space, and a genuine connection with natural surroundings.
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#2C221E]/75 leading-relaxed font-light">
              Here, life unfolds at the pace of the tides. Crafted using centuries-old Indonesian building traditions, reclaimed ironwood timbers, and volcanic stone, the villa invites the cool ocean breeze through wide-open verandas and sun-drenched garden pavilions.
            </p>

            {/* Highlights Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#2C221E]/10">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="mt-1 w-4 h-4 rounded-full bg-[#8C7355]/15 text-[#8C7355] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#2C221E]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#2C221E]/65 font-light mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="mt-8 sm:mt-10 flex items-center space-x-6">
              <a
                href="#story"
                className="inline-flex items-center space-x-3 text-xs uppercase tracking-[0.25em] text-[#2C221E] font-medium py-2.5 border-b-2 border-[#2C221E] hover:border-[#8C7355] hover:text-[#8C7355] transition-all group"
              >
                <span>DISCOVER OUR STORY</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
