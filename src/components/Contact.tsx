import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle2, Phone, Calendar, ArrowUpRight } from 'lucide-react';
import { villaTaoLinks, officialWhatsAppNumber, getWhatsAppUrl } from '../data/villaData';
import { ContactFormData } from '../types';
import { useBooking } from '../context/BookingContext';

export const Contact: React.FC = () => {
  const { addGuestInquiry } = useBooking();
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    whatsappNumber: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    addGuestInquiry(formData);

    // Simulate clean dispatch with polite response as specified in prompt
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleSendViaWhatsApp = () => {
    const formattedMsg = `*Villa Tao Stay Inquiry*
- *Name:* ${formData.fullName || 'Guest'}
- *Email:* ${formData.email || 'N/A'}
- *Phone:* ${formData.whatsappNumber || 'N/A'}
- *Dates:* ${formData.checkIn || 'TBD'} to ${formData.checkOut || 'TBD'}
- *Guests:* ${formData.guests}
- *Message:* ${formData.message || 'No additional message'}`;

    window.open(getWhatsAppUrl('booking', formattedMsg), '_blank');
  };

  return (
    <section id="contact" className="py-20 sm:py-32 bg-[#F5F2EB] text-[#2C221E] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Direct Info & Editorial Voice */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 text-[#8C7355] text-xs uppercase tracking-[0.3em] font-medium mb-3">
                <Mail className="w-3.5 h-3.5" />
                <span>INQUIRIES</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C221E] tracking-tight">
                Let's Plan Your Stay
              </h2>

              <p className="mt-4 sm:mt-6 text-sm sm:text-base text-[#2C221E]/75 font-light leading-relaxed">
                Whether you have questions about our room suites, private events, airport transportation, or seasonal rates, we welcome your direct communication.
              </p>

              {/* Direct Info List */}
              <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
                <div className="flex items-start space-x-3.5 sm:space-x-4">
                  <div className="p-3 bg-[#FAF8F5] text-[#25D366] border border-[#2C221E]/10 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-semibold block">
                      Direct WhatsApp
                    </span>
                    <a
                      href={villaTaoLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#2C221E] font-medium hover:text-[#8C7355] transition-colors inline-flex items-center space-x-1 py-0.5 min-h-[36px]"
                    >
                      <span>{officialWhatsAppNumber}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-xs text-[#2C221E]/60 font-light block mt-0.5">
                      Fastest response for availability & bookings
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 sm:space-x-4">
                  <div className="p-3 bg-[#FAF8F5] text-[#8C7355] border border-[#2C221E]/10 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-semibold block">
                      Villa Location
                    </span>
                    <p className="text-sm text-[#2C221E] font-medium">
                      Villa Tao, Balian Beach
                    </p>
                    <span className="text-xs text-[#2C221E]/60 font-light block">
                      Selemadeg Barat, Tabanan, Bali, Indonesia
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 sm:space-x-4">
                  <div className="p-3 bg-[#FAF8F5] text-[#8C7355] border border-[#2C221E]/10 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-semibold block">
                      Email Inquiries
                    </span>
                    <a
                      href={`mailto:${villaTaoLinks.email}`}
                      className="text-sm text-[#2C221E] font-medium hover:text-[#8C7355] transition-colors inline-flex items-center py-0.5 min-h-[36px]"
                    >
                      {villaTaoLinks.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Helper Pill */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-5 bg-[#FAF8F5] border border-[#2C221E]/10">
              <p className="font-serif italic text-xs sm:text-sm text-[#2C221E]">
                "We pride ourselves on offering quiet luxury, warm hospitality, and genuine privacy."
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] mt-1 font-medium">
                The Villa Tao Caretaking Team
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF8F5] border border-[#2C221E]/10 p-6 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-10 sm:py-12 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#2C221E] font-normal">
                    Inquiry Received
                  </h3>
                  <p className="text-sm sm:text-base text-[#2C221E]/75 font-light max-w-md mx-auto">
                    Thank you for your inquiry. Our team will contact you shortly to confirm details and availability.
                  </p>
                  
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <button
                      onClick={handleSendViaWhatsApp}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 min-h-[44px] bg-[#25D366] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#20ba59] transition-colors text-center"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Also Open in WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto px-6 py-3 min-h-[44px] border border-[#2C221E]/20 text-[#2C221E] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#2C221E]/5 transition-colors text-center"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="border-b border-[#2C221E]/10 pb-4 mb-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#2C221E] font-medium">
                      Direct Stay Inquiry
                    </h3>
                    <p className="text-xs text-[#2C221E]/60 font-light mt-1">
                      Fill out the form below or dispatch your inquiry straight to our WhatsApp line.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/80 mb-1.5 font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs sm:text-sm text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/80 mb-1.5 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. sarah@example.com"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs sm:text-sm text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/80 mb-1.5 font-medium">
                        WhatsApp / Phone
                      </label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs sm:text-sm text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/80 mb-1.5 font-medium">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs sm:text-sm text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/80 mb-1.5 font-medium">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs sm:text-sm text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/80 mb-1.5 font-medium">
                      Number of Guests
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#2C221E]/20 text-xs sm:text-sm text-[#2C221E] focus:outline-hidden focus:border-[#8C7355]"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests (Couple)</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5-8">5 to 8 Guests (Full Villa Rental)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#2C221E]/80 mb-1.5 font-medium">
                      Your Message or Special Inquiries
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your trip, preferred dates, airport transfer requirements, or questions..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#2C221E]/20 text-xs sm:text-sm text-[#2C221E] focus:outline-hidden focus:border-[#8C7355] resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 min-h-[44px] bg-[#2C221E] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#4A3B2C] transition-colors disabled:opacity-50 text-center"
                    >
                      {loading ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 shrink-0" />
                          <span>SEND INQUIRY</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendViaWhatsApp}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 min-h-[44px] bg-[#25D366] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#20ba59] transition-colors text-center"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Send Directly to WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
