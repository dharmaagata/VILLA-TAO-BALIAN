import React from 'react';
import { Star, MessageSquareQuote, ArrowUpRight } from 'lucide-react';
import { reviewsData, villaTaoLinks } from '../data/villaData';

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-20 sm:py-32 bg-[#F5F2EB] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
              What Our Guests Say
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#2C221E]/75 font-light leading-relaxed">
              Genuine feedback from guests who have experienced the silence, architecture, and magic of Villa Tao Balian.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              id="read-airbnb-reviews-btn"
              href={villaTaoLinks.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium px-5 py-3 min-h-[44px] border border-[#2C221E]/20 text-[#2C221E] hover:bg-white transition-colors text-center"
            >
              <span>AIRBNB REVIEWS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              id="read-booking-reviews-btn"
              href={villaTaoLinks.bookingCom}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium px-5 py-3 min-h-[44px] border border-[#2C221E]/20 text-[#2C221E] hover:bg-white transition-colors text-center"
            >
              <span>BOOKING.COM REVIEWS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {reviewsData.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F5] border border-[#2C221E]/10 p-6 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                {/* Rating & Platform Badge */}
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className="flex items-center space-x-1 text-[#C5A880]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                    ))}
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 border ${
                      rev.platform === 'Airbnb'
                        ? 'border-[#FF5A5F]/30 text-[#FF5A5F] bg-[#FF5A5F]/5'
                        : 'border-[#003580]/30 text-[#003580] bg-[#003580]/5'
                    }`}
                  >
                    Verified {rev.platform}
                  </span>
                </div>

                {/* Review Text */}
                <p className="font-serif italic text-base sm:text-lg text-[#2C221E]/85 leading-relaxed font-light mb-6 sm:mb-8">
                  "{rev.text}"
                </p>
              </div>

              {/* Guest Attribution */}
              <div className="pt-5 sm:pt-6 border-t border-[#2C221E]/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#2C221E]">
                    {rev.guestName}
                  </h4>
                  {rev.country && (
                    <span className="text-[11px] text-[#2C221E]/60 font-light">
                      {rev.country}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#8C7355] uppercase tracking-wider font-medium">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
