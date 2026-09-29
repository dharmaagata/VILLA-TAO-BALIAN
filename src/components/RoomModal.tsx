import React, { useState } from 'react';
import { X, Check, Users, Bed, Bath, Eye, MessageCircle, ArrowUpRight } from 'lucide-react';
import { RoomDetail } from '../types';
import { getWhatsAppUrl, villaTaoLinks } from '../data/villaData';

interface RoomModalProps {
  room: RoomDetail | null;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ room, onClose, onOpenBooking }) => {
  if (!room) return null;

  const allImages = [room.image, ...(room.additionalImages || [])];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const roomWhatsAppMessage = `Hello Villa Tao, I am interested in inquiring about ${room.code}: ${room.name} at Villa Tao Balian.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] text-[#2C221E] shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Room Details"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/60 hover:bg-black text-white rounded-full transition-colors backdrop-blur-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Carousel Header */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#2C221E] overflow-hidden shrink-0">
          <img
            src={allImages[activeImageIndex]}
            alt={`${room.name} view at Villa Tao`}
            className="w-full h-full object-cover transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          
          <div className="absolute bottom-4 left-5 sm:left-6 right-5 sm:right-6 flex items-end justify-between text-white">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium block">
                {room.code}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                {room.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {allImages.length > 1 && (
          <div className="flex gap-2 p-2.5 sm:p-3 bg-[#EAE4D6] overflow-x-auto no-scrollbar shrink-0">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 overflow-hidden border-2 transition-all min-h-[44px] ${
                  activeImageIndex === idx ? 'border-[#2C221E] opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}

        {/* Details Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 bg-[#F5F2EB] border border-[#2C221E]/10 text-xs">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#8C7355] shrink-0" />
              <div>
                <span className="text-[#2C221E]/60 text-[10px] uppercase block">Capacity</span>
                <span className="font-medium text-[#2C221E] text-xs sm:text-sm">{room.capacity}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bed className="w-4 h-4 text-[#8C7355] shrink-0" />
              <div>
                <span className="text-[#2C221E]/60 text-[10px] uppercase block">Bedding</span>
                <span className="font-medium text-[#2C221E] text-xs sm:text-sm">{room.bedType}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bath className="w-4 h-4 text-[#8C7355] shrink-0" />
              <div>
                <span className="text-[#2C221E]/60 text-[10px] uppercase block">Bath</span>
                <span className="font-medium text-[#2C221E] text-xs sm:text-sm">{room.bathroom}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#8C7355] shrink-0" />
              <div>
                <span className="text-[#2C221E]/60 text-[10px] uppercase block">Outlook</span>
                <span className="font-medium text-[#2C221E] text-xs sm:text-sm">{room.view}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl text-[#2C221E] font-medium mb-2">Room Overview</h3>
            <p className="text-xs sm:text-base text-[#2C221E]/80 font-light leading-relaxed">
              {room.fullDescription}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#8C7355] font-semibold mb-3">
              Room Amenities & Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.features.map((feature, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-[#2C221E]/80">
                  <Check className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#2C221E]/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <a
              href={getWhatsAppUrl('booking', roomWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 min-h-[44px] bg-[#25D366] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Inquire via WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] bg-[#2C221E] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#4A3B2C] transition-colors text-center"
            >
              Booking Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
