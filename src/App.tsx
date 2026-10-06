import React, { useState, useEffect } from 'react';
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
import { ManageBookingModal } from './components/ManageBookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingProvider } from './context/BookingContext';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [manageBookingOpen, setManageBookingOpen] = useState(false);
  const [manageBookingInitialRef, setManageBookingInitialRef] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
  };

  const handleOpenManageBooking = (initialRef = '') => {
    setManageBookingInitialRef(initialRef);
    setManageBookingOpen(true);
  };

  return (
    <BookingProvider>
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
          <BookingSection
            onOpenManageBooking={handleOpenManageBooking}
          />
          <BookingCTA onOpenBooking={handleOpenBooking} />
          <Contact />
        </main>

        {/* Global Footer */}
        <Footer
          onOpenManageBooking={handleOpenManageBooking}
          onOpenAdmin={() => setAdminOpen(true)}
        />

        {/* Floating Concierge Action */}
        <FloatingWhatsApp />

        {/* Global Direct Booking & Availability Modal */}
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={handleCloseBooking}
        />

        {/* Guest Booking Lookup & Management Modal */}
        <ManageBookingModal
          isOpen={manageBookingOpen}
          onClose={() => setManageBookingOpen(false)}
          initialReference={manageBookingInitialRef}
        />

        {/* Executive Owner & Admin Dashboard */}
        <AdminDashboard
          isOpen={adminOpen}
          onClose={() => {
            setAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      </div>
    </BookingProvider>
  );
}
