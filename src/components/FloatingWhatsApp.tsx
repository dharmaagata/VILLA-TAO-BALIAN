import React, { useState } from 'react';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl, officialWhatsAppNumber } from '../data/villaData';

export const FloatingWhatsApp: React.FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Inquiry Popover */}
      {popoverOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-[#FAF8F5] border border-[#2C221E]/15 shadow-2xl p-4 sm:p-5 text-[#2C221E] animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#2C221E]/10 mb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-semibold block">
                VILLA TAO CONCIERGE
              </span>
              <p className="text-xs font-serif text-[#2C221E] font-medium">
                Official WhatsApp Assistance
              </p>
            </div>
            <button
              onClick={() => setPopoverOpen(false)}
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#2C221E]/50 hover:text-[#2C221E] transition-colors"
              aria-label="Close WhatsApp Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#2C221E]/75 font-light mb-3">
            Message directly with the Villa Tao team ({officialWhatsAppNumber}):
          </p>

          <div className="space-y-2">
            <a
              href={getWhatsAppUrl('availability')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 min-h-[44px] bg-[#F5F2EB] hover:bg-[#EAE4D6] text-xs text-[#2C221E] transition-colors border border-[#2C221E]/5"
            >
              <span>Check Stay Availability</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            </a>

            <a
              href={getWhatsAppUrl('booking')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 min-h-[44px] bg-[#F5F2EB] hover:bg-[#EAE4D6] text-xs text-[#2C221E] transition-colors border border-[#2C221E]/5"
            >
              <span>Make a Booking Inquiry</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            </a>

            <a
              href={getWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 min-h-[44px] bg-[#F5F2EB] hover:bg-[#EAE4D6] text-xs text-[#2C221E] transition-colors border border-[#2C221E]/5"
            >
              <span>General Question</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setPopoverOpen(!popoverOpen)}
        aria-label="Contact Villa Tao on WhatsApp"
        className="group flex items-center justify-center space-x-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20ba59] hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[48px] min-h-[48px]"
      >
        <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 fill-white text-[#25D366] shrink-0" />
        <span className="hidden sm:inline text-xs uppercase tracking-wider font-semibold">
          Chat With Us
        </span>
      </button>
    </div>
  );
};
