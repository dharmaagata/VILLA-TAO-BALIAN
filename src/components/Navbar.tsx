import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, ArrowUpRight } from 'lucide-react';
import { villaTaoLinks } from '../data/villaData';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Story', href: '#story' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Location', href: '#location' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md text-[#2C221E] shadow-xs py-3 sm:py-4 border-b border-[#2C221E]/5'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent text-white py-4 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            id="nav-logo"
            href="#hero"
            className="group flex flex-col items-start transition-opacity hover:opacity-80 py-1"
          >
            <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.2em] font-medium uppercase">
              VILLA TAO
            </span>
            <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-light transition-colors ${
              isScrolled ? 'text-[#8C7355]' : 'text-[#FAF8F5]/80'
            }`}>
              Balian • Bali
            </span>
          </a>

          {/* Desktop Navigation Links (Visible on Laptop & Desktop 1024px+) */}
          <nav id="desktop-nav-links" className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[11px] xl:text-xs uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors py-2 px-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled
                    ? 'text-[#2C221E]/80 hover:text-[#2C221E] after:bg-[#2C221E]'
                    : 'text-white/80 hover:text-white after:bg-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions: WhatsApp + Primary CTA (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center space-x-3 md:space-x-4">
            <a
              id="navbar-whatsapp-link"
              href={villaTaoLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Villa Tao on WhatsApp"
              className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'text-[#2C221E]/70 hover:text-[#25D366] hover:bg-[#2C221E]/5'
                  : 'text-white/80 hover:text-[#25D366] hover:bg-white/10'
              }`}
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              id="navbar-book-btn"
              onClick={onOpenBooking}
              className={`text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 md:px-5 py-2.5 min-h-[44px] flex items-center justify-center transition-all duration-300 font-medium ${
                isScrolled
                  ? 'bg-[#2C221E] text-[#FAF8F5] hover:bg-[#4A3B2C]'
                  : 'bg-white text-[#2C221E] hover:bg-[#FAF8F5] hover:shadow-lg'
              }`}
            >
              BOOK YOUR STAY
            </button>
          </div>

          {/* Mobile & Small Tablet Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className={`lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-colors ${
              isScrolled ? 'text-[#2C221E]' : 'text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col justify-between p-6 sm:p-8 text-[#2C221E] animate-in fade-in duration-300 overflow-y-auto max-h-[100dvh] w-full max-w-[100vw]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2C221E]/10 pb-5 shrink-0">
            <div>
              <span className="font-serif text-2xl tracking-[0.2em] font-medium uppercase block">
                VILLA TAO
              </span>
              <p className="text-[10px] tracking-[0.25em] text-[#8C7355] uppercase mt-0.5">
                Balian • Bali • Indonesia
              </p>
            </div>
            <button
              id="mobile-menu-close"
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#2C221E]/80 hover:text-[#2C221E]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col space-y-2.5 sm:space-y-3.5 my-auto py-5 overflow-y-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl text-[#2C221E] hover:text-[#8C7355] transition-colors py-2 px-1 flex items-center min-h-[44px]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Bottom CTAs */}
          <div className="border-t border-[#2C221E]/10 pt-5 space-y-3 shrink-0">
            <button
              id="mobile-book-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full text-center py-3.5 sm:py-4 min-h-[48px] bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#4A3B2C] transition-colors flex items-center justify-center"
            >
              BOOK YOUR STAY
            </button>

            <a
              id="mobile-whatsapp-link"
              href={villaTaoLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full text-center py-3 min-h-[44px] border border-[#2C221E]/20 text-[#2C221E] text-xs uppercase tracking-[0.2em] hover:bg-[#2C221E]/5 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Chat on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
