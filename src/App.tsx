import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Story } from './components/Story';
import { Rooms } from './components/Rooms';
import { Facilities } from './components/Facilities';
import { Experiences } from './components/Experiences';
import { WhyVillaTao } from './components/WhyVillaTao';
import { Location } from './components/Location';
import { Reviews } from './components/Reviews';
import { Gallery } from './components/Gallery';
import { BookingSection } from './components/BookingSection';
import { BookingCTA } from './components/BookingCTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BookingModal } from './components/BookingModal';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C221E] selection:bg-[#C5A880]/30 selection:text-[#2C221E] relative w-full max-w-[100vw] overflow-x-hidden">
      {/* Sticky Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Sections */}
      <main id="main-content">
        <Hero onOpenBooking={handleOpenBooking} />
        <About />
        <Story />
        <Rooms onOpenBooking={handleOpenBooking} />
        <Facilities />
        <Experiences />
        <WhyVillaTao />
        <Location />
        <Reviews />
        <Gallery />
        <BookingSection />
        <BookingCTA onOpenBooking={handleOpenBooking} />
        <Contact />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Concierge Action */}
      <FloatingWhatsApp />

      {/* Global Booking Channel Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={handleCloseBooking}
      />
    </div>
  );
}
