import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'The Villa', href: '#about' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Location', href: '#location' },
    { name: 'Gallery', href: '#gallery' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full bg-[#FAF8F5]/95 backdrop-blur-md text-[#2C221E] border-b border-[#2C221E]/8 ${
          isScrolled ? 'py-3 sm:py-3.5' : 'py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            id="nav-logo"
            href="#hero"
            className="font-serif text-xl sm:text-2xl tracking-[0.22em] font-normal uppercase text-[#2C221E] transition-opacity hover:opacity-75 py-1 whitespace-nowrap shrink-0"
          >
            VILLA TAO
          </a>

          {/* Desktop Navigation Links (6 Curated Items) */}
          <nav
            id="desktop-nav-links"
            className="hidden lg:flex items-center space-x-7 xl:space-x-10 text-[11px] uppercase tracking-[0.22em] font-normal"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#2C221E]/75 hover:text-[#2C221E] transition-colors py-1.5 relative whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#2C221E] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Primary CTA (Desktop) */}
          <div className="hidden lg:flex items-center shrink-0">
            <button
              id="navbar-book-btn"
              onClick={onOpenBooking}
              className="text-[11px] uppercase tracking-[0.22em] px-5 py-2.5 min-h-[42px] bg-[#2C221E] text-[#FAF8F5] hover:bg-[#3E342B] transition-colors duration-200 font-normal whitespace-nowrap"
            >
              BOOK YOUR STAY
            </button>
          </div>

          {/* Mobile & Tablet Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#2C221E] transition-opacity hover:opacity-75"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col justify-between p-6 sm:p-8 text-[#2C221E] animate-in fade-in duration-200 overflow-y-auto max-h-[100dvh] w-full max-w-[100vw]"
        >
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between border-b border-[#2C221E]/10 pb-5 shrink-0">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.22em] font-normal uppercase">
              VILLA TAO
            </span>
            <button
              id="mobile-menu-close"
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#2C221E]/80 hover:text-[#2C221E]"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* 6 Simplified Navigation Items */}
          <nav className="flex flex-col space-y-3 my-auto py-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl sm:text-3xl text-[#2C221E] hover:text-[#8C7355] transition-colors py-2 flex items-center min-h-[44px] font-normal tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Primary CTA */}
          <div className="border-t border-[#2C221E]/10 pt-5 shrink-0">
            <button
              id="mobile-book-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full text-center py-3.5 min-h-[48px] bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.24em] font-normal hover:bg-[#3E342B] transition-colors flex items-center justify-center"
            >
              BOOK YOUR STAY
            </button>
          </div>
        </div>
      )}
    </>
  );
};

