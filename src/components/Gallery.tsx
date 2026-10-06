import React, { useState, useEffect, useCallback } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { galleryPhotos } from '../data/villaData';

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'villa', label: 'Villa' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'pool', label: 'Pool' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'nature', label: 'Nature' },
    { id: 'sunset', label: 'Sunset' },
    { id: 'balian', label: 'Balian' }
  ];

  const filteredPhotos = activeCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter((p) => p.category === activeCategory);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextPhoto = useCallback(() => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => ((prev! + 1) % filteredPhotos.length));
    }
  }, [activeLightboxIndex, filteredPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => ((prev! - 1 + filteredPhotos.length) % filteredPhotos.length));
    }
  }, [activeLightboxIndex, filteredPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, nextPhoto, prevPhoto]);

  return (
    <section id="gallery" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-16">
          <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>VISUAL CHRONICLE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
            Moments &amp; Perspectives
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#2C221E]/75 font-light leading-relaxed max-w-2xl">
            Authentic glimpses of life, light, and natural textures at Villa Tao Balian.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveLightboxIndex(null);
              }}
              className={`shrink-0 px-4 py-2.5 min-h-[44px] text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center justify-center whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#2C221E] text-[#FAF8F5]'
                  : 'bg-[#F5F2EB] text-[#2C221E]/70 hover:bg-[#EAE4D6] hover:text-[#2C221E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Structured 4-Column Grid — Perfectly Aligned Rows on Tablet/Desktop, Natural Heights on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="group relative h-full flex flex-col bg-[#FAF8F5] border border-[#2C221E]/10 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Area: Natural height on 1-col mobile, consistent 3:2 frame across rows on 2-col tablet & 4-col desktop */}
              <div className="relative w-full sm:aspect-[3/2] overflow-hidden shrink-0 bg-[#EAE4D6]">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-auto sm:h-full block sm:object-cover sm:object-center"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                {/* Subtle top-right expand affordance on hover */}
                <div className="absolute top-3 right-3 p-2 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Subtle dark translucent gradient with small elegant white title directly over the bottom of the photograph */}
                <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-4 bg-gradient-to-t from-black/70 via-black/25 to-transparent text-white pointer-events-none">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] block mb-0.5">
                    {photo.category}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-normal text-white leading-snug">
                    {photo.title}
                  </h3>
                </div>
              </div>

              {/* Description Area: Consistent padding and minimum height, top-aligned text, stretches to align bottom card edge */}
              <div className="p-4 sm:p-5 flex-1 flex items-start sm:min-h-[80px] bg-[#FAF8F5]">
                <p className="text-xs text-[#2C221E]/75 font-light leading-relaxed">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredPhotos[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div
            className="w-full flex items-center justify-between text-white z-10 max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pr-4">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
                {filteredPhotos[activeLightboxIndex].category}
              </span>
              <h3 className="font-serif text-base sm:text-xl text-white truncate max-w-xs sm:max-w-md">
                {filteredPhotos[activeLightboxIndex].title}
              </h3>
            </div>
            <button
              onClick={closeLightbox}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image with floating navigation buttons — Full Uncropped Original Photograph */}
          <div
            className="relative max-w-6xl max-h-[78vh] my-auto flex items-center justify-center w-full px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-xs"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={filteredPhotos[activeLightboxIndex].url}
              alt={filteredPhotos[activeLightboxIndex].alt}
              className="max-h-[72vh] sm:max-h-[78vh] max-w-full w-auto h-auto object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />

            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-xs"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Caption and Counter */}
          <div
            className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-white/80 text-xs sm:text-sm pt-3 sm:pt-4 border-t border-white/15 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-light text-white/70 max-w-xl text-center sm:text-left text-xs sm:text-sm">
              {filteredPhotos[activeLightboxIndex].caption}
            </p>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-mono text-white/60 tabular-nums">
                {activeLightboxIndex + 1} / {filteredPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


