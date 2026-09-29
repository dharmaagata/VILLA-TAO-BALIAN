import React from 'react';
import { Feather } from 'lucide-react';
import { storyCards } from '../data/villaData';

export const Story: React.FC = () => {
  return (
    <section id="story" className="py-20 sm:py-32 bg-[#F5F2EB] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
            <Feather className="w-3.5 h-3.5" />
            <span>ARCHITECTURE & ESSENCE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
            A House With A Story
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-[#2C221E]/75 font-light leading-relaxed">
            Villa Tao was conceived not as an anonymous resort, but as a living sanctuary rooted in regional heritage. Every timber joint, stone pathway, and open-air frame was created to celebrate harmony between human craftsmanship and the coastal environment.
          </p>
        </div>

        {/* 4 Story Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {storyCards.map((card, index) => (
            <div
              key={index}
              className="group flex flex-col bg-[#FAF8F5] border border-[#2C221E]/10 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE4D6]">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-[#2C221E]">
                  0{index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-7 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-semibold block mb-1">
                    {card.tagline}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2C221E] font-normal leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[#2C221E]/75 font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
