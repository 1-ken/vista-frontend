import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Globe,
} from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const location = useLocation();

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const navLinks = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'About',
      path: '/about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Our Story', path: '/about' },
        { name: 'Blogs', path: '/about#stories' },
      ],
    },
    {
      name: 'Tours',
      path: '/tours',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Luxury Safaris', path: '/tours?category=safari' },
        { name: 'Cultural Tours', path: '/tours?category=cultural' },
        { name: 'Beach Holidays', path: '/tours?category=beach' },
        { name: 'WRC Safari Rally', path: '/tours?category=rally' },
      ],
    },
    {
      name: 'Trends',
      path: '/trends',
    },
    // {
    //   name: 'Stories',
    //   path: '/blogs',
    // },
    {
      name: 'Partners',
      path: '/partners',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Become a Partner', path: '/partners' },
        { name: 'Partner Dashboard', path: '/partner/dashboard' },
      ],
    },
    {
      name: 'Gallery',
      path: '/gallery',
    },
    {
      name: 'Contact',
      path: '/contact',
    },
  ];

  return (
    <nav className="fixed w-full z-[100] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)]">
      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left z-[101]"
        style={{ scaleX }}
      />

      <div className="w-full px-2 sm:px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <Logo height={110} width={350} className="transform -translate-x-2 -translate-y-1" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center space-x-0.5 xl:space-x-1">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() =>
                link.hasDropdown && setActiveDropdown(link.name)
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={link.path}
                className={`relative flex items-center gap-1 px-2 lg:px-3 py-1.5 lg:py-2 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.25em] font-bold transition-all duration-500 group ${
                  location.pathname === link.path
                    ? 'text-accent'
                    : 'text-dark/50 hover:text-dark'
                }`}
              >
                {link.name}

                {link.hasDropdown && (
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`}
                  />
                )}

                <span
                  className={`absolute bottom-1 left-4 right-4 h-[1.5px] transition-all duration-500 ${
                    location.pathname === link.path
                      ? 'bg-accent'
                      : 'bg-transparent group-hover:bg-accent/50'
                  }`}
                ></span>
              </Link>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {link.hasDropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 pt-4"
                  >
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-dark/5 overflow-hidden min-w-[180px] sm:min-w-[200px]">
                      {link.dropdownItems?.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-dark/60 hover:text-dark hover:bg-accent/5 transition-all duration-300 border-b border-dark/5 last:border-0"
                        >
                          <span className="font-medium tracking-wide">
                            {item.name}
                          </span>

                          <span className="opacity-0 group-hover:opacity-100 text-accent">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* CTA Button */}
          <div className="flex items-center gap-4 ml-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/appointments"
                className="hidden xl:inline-flex items-center px-4 xl:px-6 py-2 xl:py-2.5 text-[9px] xl:text-[10px] uppercase tracking-[0.18em] xl:tracking-[0.25em] font-bold transition-all duration-500 rounded-full bg-dark text-white hover:bg-accent hover:shadow-glow whitespace-nowrap"
              >
                Book Now
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="xl:hidden flex items-center gap-2 sm:gap-3">
          {/* Mobile CTA */}
          <Link
            to="/appointments"
            className="inline-flex items-center px-2.5 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.18em] font-bold rounded-full bg-accent text-white hover:bg-accent-light transition-all duration-300 whitespace-nowrap"
          >
            Book
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none transition-all duration-500 p-1.5 sm:p-2 rounded-full text-dark hover:bg-dark/5"
          >
            <div className="w-5 sm:w-6 h-4 sm:h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 transition-all duration-500 ${
                  isOpen ? 'rotate-45 translate-y-2' : ''
                } bg-dark`}
              ></span>

              <span
                className={`w-full h-0.5 transition-all duration-500 ${
                  isOpen ? 'opacity-0' : ''
                } bg-dark`}
              ></span>

              <span
                className={`w-full h-0.5 transition-all duration-500 ${
                  isOpen ? '-rotate-45 -translate-y-2' : ''
                } bg-dark`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden fixed inset-0 bg-white z-[99]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 text-black/60 hover:text-accent transition-colors p-1.5 sm:p-2"
            >
              ✕
            </button>

            <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 text-center relative z-10">
              {/* Logo in Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 sm:mb-16"
              >
                <Logo height={100} />
              </motion.div>

              <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx + 0.3 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight transition-all duration-500 ${
                        location.pathname === link.path
                          ? 'text-accent italic'
                          : 'text-black/70 hover:text-accent'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * navLinks.length + 0.3 }}
                className="mt-10 sm:mt-12 md:mt-16 flex flex-col gap-4 w-full px-4"
              >
                <Link
                  to="/appointments"
                  onClick={() => setIsOpen(false)}
                  className="bg-accent text-white px-8 sm:px-12 py-3 sm:py-5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold shadow-glow hover:bg-accent-light transition-all duration-500"
                >
                  Book Appointment
                </Link>

                <div className="flex items-center justify-center gap-4 sm:gap-6 text-black/40">
                  <Globe size={16} />

                  <span className="text-[10px] sm:text-xs tracking-widest">
                    Kenya • UAE • Global
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Branding */}
            <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 opacity-20">
              <span className="text-sm sm:text-lg font-serif font-bold tracking-[1.2em] sm:tracking-[1.5em] text-black/20">
                VISTAVOYAGE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;