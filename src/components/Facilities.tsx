import React from 'react';
import {
  Waves,
  Compass,
  Sun,
  Trees,
  Armchair,
  UtensilsCrossed,
  Bath,
  Sparkles,
  Wifi,
  Wind,
  Car,
  Leaf
} from 'lucide-react';
import { facilitiesData } from '../data/villaData';

const iconMap: Record<string, React.ReactNode> = {
  Waves: <Waves className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Trees: <Trees className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Bath: <Bath className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />
};

export const Facilities: React.FC = () => {
  // Key facilities that feature photography
  const visualFacilities = facilitiesData.filter((f) => f.image);
  // Practical amenities
  const standardFacilities = facilitiesData.filter((f) => !f.image);

  return (
    <section id="facilities" className="py-20 sm:py-32 bg-[#F5F2EB] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-20">
          <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AMENITIES & SPACES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
            Everything You Need To Slow Down
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#2C221E]/75 font-light leading-relaxed max-w-2xl">
            Thoughtfully planned spaces celebrating the tropical elements, private relaxation, and effortless living in harmony with nature.
          </p>
        </div>

        {/* Visual Spaces Grid — 4 columns desktop, 2 tablet, 1 mobile, aligned rows on tablet/desktop & natural heights on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch mb-12 sm:mb-16">
          {visualFacilities.map((item) => (
            <div
              key={item.id}
              className="group relative h-full flex flex-col bg-[#FAF8F5] border border-[#2C221E]/10 overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full sm:aspect-[3/2] overflow-hidden shrink-0 bg-[#EAE4D6]">
                {item.image && (
                  <img
                    src={item.image}
                    alt={`${item.name} at Villa Tao Balian`}
                    className="w-full h-auto sm:h-full block sm:object-cover sm:object-center"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 pt-12 pb-3.5 px-4 bg-gradient-to-t from-black/70 via-black/25 to-transparent text-white pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5 text-[#C5A880]">
                    {iconMap[item.iconName] || <Sparkles className="w-4 h-4" />}
                  </div>
                  <h3 className="font-serif text-lg font-normal text-white leading-snug">
                    {item.name}
                  </h3>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex items-start sm:min-h-[80px] bg-[#FAF8F5]">
                <p className="text-xs text-[#2C221E]/75 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Practical Amenities Strip */}
        <div className="bg-[#FAF8F5] border border-[#2C221E]/10 p-6 sm:p-10">
          <h3 className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold mb-6">
            Essential Villa Conveniences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {standardFacilities.map((fac) => (
              <div key={fac.id} className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-[#F5F2EB] text-[#8C7355] rounded-none shrink-0 border border-[#2C221E]/5">
                  {iconMap[fac.iconName]}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#2C221E]">
                    {fac.name}
                  </h4>
                  <p className="text-xs text-[#2C221E]/65 font-light mt-1">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
