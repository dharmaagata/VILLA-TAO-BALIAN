import React from 'react';
import { whyVillaTaoPoints } from '../data/villaData';

export const WhyVillaTao: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-[#2C221E] text-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-medium block mb-3">
            DISTINCTION & CHARM
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
            Why Villa Tao?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 font-light leading-relaxed">
            In an era of mass-market commercial tourism, Villa Tao is preserved as a distinctive haven of authenticity, privacy, and architectural character.
          </p>
        </div>

        {/* 4 Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {whyVillaTaoPoints.map((point) => (
            <div
              key={point.number}
              className="flex flex-col border-t border-white/15 pt-6 sm:pt-8 group hover:border-[#C5A880] transition-colors duration-300"
            >
              <span className="font-serif text-3xl sm:text-4xl text-[#C5A880] font-light mb-3 sm:mb-4 block">
                {point.number}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-2 sm:mb-3">
                {point.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
