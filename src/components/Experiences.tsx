import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { experiencesData } from '../data/villaData';

export const Experiences: React.FC = () => {
  return (
    <section id="experiences" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-20">
          <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>ACTIVITIES & SURROUNDINGS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
            Experience Balian
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#2C221E]/75 font-light leading-relaxed max-w-2xl">
            West Bali moves at its own tranquil tempo. Immerse yourself in black volcanic sands, sacred river estuaries, world-renowned surf breaks, and authentic village tranquility.
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {experiencesData.map((exp, idx) => (
            <div
              key={exp.id}
              className="group flex flex-col bg-[#F5F2EB] border border-[#2C221E]/10 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE4D6]">
                <img
                  src={exp.image}
                  alt={`${exp.title} experience at Villa Tao Balian`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2C221E]">
                  0{idx + 1}
                </div>

                <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6 text-white">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#C5A880] block mb-1 font-medium">
                    {exp.subtitle}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-normal">
                    {exp.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
                <p className="text-xs sm:text-sm text-[#2C221E]/80 font-light leading-relaxed">
                  {exp.description}
                </p>

                <div className="pt-4 border-t border-[#2C221E]/10 flex items-center space-x-2 text-xs text-[#8C7355] font-medium">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="italic">{exp.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
