import React, { useState } from 'react';
import { Bed, Users, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { roomsData } from '../data/villaData';
import { RoomDetail } from '../types';
import { RoomModal } from './RoomModal';

interface RoomsProps {
  onOpenBooking: () => void;
}

export const Rooms: React.FC<RoomsProps> = ({ onOpenBooking }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);

  return (
    <section id="rooms" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-20">
          <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE ESTATE • 4 BEDROOM SUITES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
            The Four Suites of Villa Tao
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#2C221E]/75 font-light leading-relaxed max-w-2xl">
            Villa Tao is booked exclusively as one private oceanfront estate. When you reserve your stay, all four architectural suites, private infinity lap pool, and panoramic ocean terraces belong entirely to you and your party.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {roomsData.map((room) => (
            <div
              key={room.id}
              className="group bg-[#F5F2EB] border border-[#2C221E]/10 overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-500"
            >
              {/* Room Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE4D6]">
                <img
                  src={room.image}
                  alt={`${room.name} at Villa Tao Balian`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                {/* Code Badge & Inclusion Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="bg-white/90 backdrop-blur-xs px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-[#2C221E]">
                    {room.code}
                  </div>
                  <div className="bg-[#2C221E]/90 backdrop-blur-xs px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#FAF8F5]">
                    INCLUDED IN ENTIRE VILLA STAY
                  </div>
                </div>

                <div className="absolute bottom-4 left-5 sm:left-6 right-5 sm:right-6 text-white">
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                    {room.name}
                  </h3>
                </div>
              </div>

              {/* Room Info */}
              <div className="p-5 sm:p-8 flex flex-col flex-1 justify-between space-y-5 sm:space-y-6">
                <p className="text-xs sm:text-sm text-[#2C221E]/75 font-light leading-relaxed">
                  {room.shortDescription}
                </p>

                {/* Specs Snippet */}
                <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-[#2C221E]/10 text-xs">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Users className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                    <span className="text-[#2C221E]/70 font-light truncate text-[11px] sm:text-xs">{room.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Bed className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                    <span className="text-[#2C221E]/70 font-light truncate text-[11px] sm:text-xs">{room.bedType.split(" ")[1] || "Bed"}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Eye className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                    <span className="text-[#2C221E]/70 font-light truncate text-[11px] sm:text-xs">{room.view.split("&")[0]}</span>
                  </div>
                </div>

                {/* Action Controls - responsive stacking */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#2C221E] font-medium hover:text-[#8C7355] transition-colors py-2 group/btn min-h-[44px]"
                  >
                    <span>VIEW SUITE DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onOpenBooking()}
                    className="w-full sm:w-auto text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 min-h-[44px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#4A3B2C] transition-colors font-medium flex items-center justify-center text-center"
                  >
                    BOOK THE ENTIRE VILLA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Modal */}
      <RoomModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onOpenBooking={onOpenBooking}
      />
    </section>
  );
};
