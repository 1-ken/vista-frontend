import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, ArrowRight, X, Plus, Minus } from 'lucide-react';
import Logo from './Logo';

// ─── Realistic Curated Worlds & Tours for VistaVoyage ───────────────────────
const REAL_WORLDS = [
  {
    number: '01',
    id: 'experience',
    title: 'Experiences',
    tagline: 'Day Escapes · 4–12 Hours',
    explorePath: '/tours?world=experience',
    items: [
      {
        name: 'The Nairobi Experience',
        tag: 'Flagship 12h',
        price: 'From $350',
        path: '/travel/the-nairobi-experience',
        desc: 'Rhino dawn safari, Giraffe Centre, Karen lunch, coffee & culture',
      },
      {
        name: 'Nairobi Wildlife Escape',
        tag: '6 Hours',
        price: 'From $240',
        path: '/travel/nairobi-wildlife-escape-6h',
        desc: 'Morning national park game drive & Giraffe Sanctuary',
      },
      {
        name: 'The Karen Heritage Trail',
        tag: '5 Hours',
        price: 'From $195',
        path: '/travel/the-karen-experience-5h',
        desc: 'Giraffe Centre, Kazuri Beads workshop & Karen Blixen Museum',
      },
    ],
  },
  {
    number: '02',
    id: 'journey',
    title: 'Journeys',
    tagline: 'Signature Safaris & Escapes',
    explorePath: '/tours?world=journey',
    items: [
      {
        name: 'Exclusive Maasai Mara Safari',
        tag: '5 Days / 4 Nights',
        price: 'From $2,850',
        path: '/travel/exclusive-maasai-mara-safari',
        desc: 'Premier luxury tented camp, big cats & Mara conservancies',
      },
      {
        name: 'Amboseli: Land of Giants',
        tag: '3 Days / 2 Nights',
        price: 'From $1,650',
        path: '/travel/amboseli-kilimanjaro-safari',
        desc: 'Elephant herds in the shadow of Mount Kilimanjaro',
      },
      {
        name: 'Kenya Bush & Diani Beach',
        tag: '7 Days / 6 Nights',
        price: 'From $3,400',
        path: '/travel/kenya-bush-and-beach-escape',
        desc: 'Maasai Mara safari paired with Indian Ocean barefoot luxury',
      },
    ],
  },
  {
    number: '03',
    id: 'worldwide',
    title: 'Worldwide',
    tagline: 'International Luxury Collection',
    explorePath: '/tours?world=worldwide',
    items: [
      {
        name: 'South Africa: Cape & Kruger',
        tag: '8 Days / 7 Nights',
        price: 'From $4,950',
        path: '/travel/south-africa-cape-kruger',
        desc: 'Cape Town, Winelands & private Sabi Sands leopard safari',
      },
      {
        name: 'Dubai & Arabian Desert',
        tag: '5 Days / 4 Nights',
        price: 'From $2,200',
        path: '/travel/dubai-and-arabian-desert-retreat',
        desc: 'Private yacht cruise, Burj Khalifa & desert pavilion retreat',
      },
      {
        name: 'Rwanda: Gorilla Sanctuary',
        tag: '4 Days / 3 Nights',
        price: 'From $3,900',
        path: '/travel/rwanda-gorilla-sanctuary-expedition',
        desc: 'Volcanoes National Park mountain gorilla trekking & luxury lodges',
      },
    ],
  },
];

const FEATURED = {
  image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
  label: 'Signature Day Escape',
  title: 'The Nairobi Experience',
  sub: '12 Hours · One City. A thousand impressions.',
  price: 'From $350 pp',
  path: '/travel/the-nairobi-experience',
};

// ─── Mega Menu (Standard Bespoke Luxury - Pristine White) ────────────────────
function ToursMegaMenu({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[1040px] max-w-[96vw]"
      style={{ zIndex: 200 }}
    >
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden flex flex-col">

        {/* 3 Travel Worlds Header in Mega Menu */}
        <div className="bg-neutral-50/90 px-7 py-3.5 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-8">
            <Link
              to="/tours?world=experience"
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <span className="text-[#b88a24] font-mono font-bold">01</span>
              <span>Experiences</span>
              <span className="text-[10px] text-neutral-400 font-normal">(4–12h)</span>
            </Link>
            <Link
              to="/tours?world=journey"
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <span className="text-[#b88a24] font-mono font-bold">02</span>
              <span>Journeys</span>
              <span className="text-[10px] text-neutral-400 font-normal">(Safaris)</span>
            </Link>
            <Link
              to="/tours?world=worldwide"
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <span className="text-[#b88a24] font-mono font-bold">03</span>
              <span>Worldwide</span>
              <span className="text-[10px] text-neutral-400 font-normal">(Global)</span>
            </Link>
          </div>
          <Link
            to="/contact"
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-widest text-[#b88a24] hover:text-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <span>Bespoke Atelier</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* Main Grid: 3 Worlds + Featured Showcase */}
        <div className="grid grid-cols-12 divide-x divide-neutral-100 p-2">
          {REAL_WORLDS.map((world) => (
            <div key={world.id} className="col-span-3 px-5 py-5 flex flex-col justify-between">
              <div>
                {/* World Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#b88a24] text-xs font-mono font-bold tracking-wider">{world.number}</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-900">
                      {world.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-serif italic mt-0.5">
                    {world.tagline}
                  </p>
                </div>

                {/* Tour Items */}
                <div className="space-y-2.5">
                  {world.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={onClose}
                      className="group/item block p-2.5 -mx-2 rounded-xl hover:bg-neutral-50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-0.5">
                        <span className="font-serif text-[13px] font-semibold text-neutral-900 group-hover/item:text-[#b88a24] transition-colors leading-snug">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#b88a24] font-bold whitespace-nowrap pl-1">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 group-hover/item:text-neutral-700 line-clamp-1 leading-normal transition-colors">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* View all in this world */}
              <Link
                to={world.explorePath}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 mt-5 text-[11px] font-bold uppercase tracking-wider text-[#b88a24] hover:text-neutral-900 transition-colors pt-3 border-t border-neutral-100"
              >
                <span>View {world.title}</span>
                <ArrowRight size={10} />
              </Link>
            </div>
          ))}

          {/* Featured panel (Spotlight for The Nairobi Experience) */}
          <div className="col-span-3 p-2">
            <div className="relative h-full min-h-[310px] rounded-xl overflow-hidden flex flex-col justify-end p-5 shadow-sm">
              <img
                src={FEATURED.image}
                alt={FEATURED.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              
              <div className="relative z-10 flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#c8a248] mb-1">
                  {FEATURED.label}
                </span>
                <h4
                  style={{ color: '#ffffff' }}
                  className="font-serif text-[#ffffff] text-base leading-snug font-bold mb-1"
                >
                  {FEATURED.title}
                </h4>
                <p
                  style={{ color: '#ffffff' }}
                  className="text-[#ffffff] text-[10px] mb-1 font-serif italic"
                >
                  {FEATURED.sub}
                </p>
                <p className="text-[#f6d884] text-[11px] font-bold mb-3">
                  {FEATURED.price}
                </p>
                <Link
                  to={FEATURED.path}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#c8a248] text-neutral-950 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-full hover:bg-white hover:text-black transition-all w-full shadow-md font-bold"
                >
                  <span>Explore 12 Hours</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-neutral-50 px-7 py-3 flex items-center justify-between border-t border-neutral-100">
          <span className="text-[11px] text-neutral-400 font-medium">
            9 Signature Packages Across Kenya, South Africa, UAE & Rwanda
          </span>
          <Link
            to="/tours"
            onClick={onClose}
            className="text-[11px] font-bold uppercase tracking-wider text-[#b88a24] hover:text-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <span>Browse Full Portfolio</span>
            <ArrowRight size={10} />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen]               = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);
  const closeTimer = useRef(null);
  const location   = useLocation();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Close mega menu on route change
  useEffect(() => { setActiveDropdown(null); setIsOpen(false); }, [location.pathname]);

  const openMenu  = (name) => { clearTimeout(closeTimer.current); setActiveDropdown(name); };
  const closeMenu = ()     => { closeTimer.current = setTimeout(() => setActiveDropdown(null), 120); };

  const navLinks = [
    { name: 'Home',      path: '/' },
    { name: 'About',     path: '/about' },
    { name: 'Tours',     path: '/tours',               hasMega: true },
    { name: 'EduTravel', path: '/educational-travel',  hasDropdown: true,
      dropdownItems: [
        { name: 'Browse Programs',        path: '/educational-travel/programs' },
        { name: 'Academic Competitions',  path: '/educational-travel?cat=competitions' },
        { name: 'Wildlife Conservation',  path: '/educational-travel?cat=conservation' },
        { name: 'Request School Quote',   path: '/educational-travel/quote' },
      ],
    },
    { name: 'Trends',   path: '/trends' },
    { name: 'Partners', path: '/partners' },
    { name: 'Careers',  path: '/careers' },
    { name: 'Gallery',  path: '/gallery' },
    { name: 'Contact',  path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-[100] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)]">
      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left z-[101]"
        style={{ scaleX }}
      />

      <div className="w-full px-2 sm:px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <Logo height={110} width={350} className="transform -translate-x-2 -translate-y-1" />
        </Link>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center space-x-0.5">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => (link.hasMega || link.hasDropdown) ? openMenu(link.name) : undefined}
              onMouseLeave={() => (link.hasMega || link.hasDropdown) ? closeMenu() : undefined}
            >
              <Link
                to={link.path}
                className={`relative flex items-center gap-1 px-2 lg:px-3 py-1.5 lg:py-2 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.25em] font-bold transition-all duration-500 group ${
                  location.pathname === link.path ? 'text-accent' : 'text-dark/50 hover:text-dark'
                }`}
              >
                {link.name}
                {(link.hasMega || link.hasDropdown) && (
                  <ChevronDown size={11} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                )}
                <span className={`absolute bottom-1 left-4 right-4 h-[1.5px] transition-all duration-500 ${
                  location.pathname === link.path ? 'bg-accent' : 'bg-transparent group-hover:bg-accent/50'
                }`} />
              </Link>

              {/* Tours mega menu */}
              <AnimatePresence>
                {link.hasMega && activeDropdown === link.name && (
                  <ToursMegaMenu onClose={() => setActiveDropdown(null)} />
                )}
              </AnimatePresence>

              {/* Regular dropdown */}
              <AnimatePresence>
                {link.hasDropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 pt-4 z-[200]"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-dark/5 overflow-hidden min-w-[200px]">
                      {link.dropdownItems?.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="flex items-center justify-between px-6 py-3.5 text-xs text-dark/60 hover:text-dark hover:bg-accent/5 transition-all duration-300 border-b border-dark/5 last:border-0"
                        >
                          <span className="font-medium tracking-wide">{item.name}</span>
                          <ArrowRight size={11} className="text-accent/40" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* CTA */}
          <div className="ml-6">
            <Link
              to="/appointments"
              className="inline-flex items-center px-5 py-2.5 text-[9px] uppercase tracking-[0.25em] font-bold rounded-full bg-dark text-white hover:bg-accent hover:shadow-glow transition-all duration-500 whitespace-nowrap"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="xl:hidden flex items-center gap-2">
          <Link
            to="/appointments"
            className="inline-flex items-center px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] font-bold rounded-full bg-accent text-white hover:bg-accent-light transition-all duration-300 whitespace-nowrap"
          >
            Book
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full text-dark hover:bg-dark/5 transition-all"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-dark transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-dark transition-all duration-500 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-dark transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden fixed inset-0 bg-white z-[99] overflow-y-auto"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 text-black/40 hover:text-accent transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col px-8 pt-24 pb-16">
              <Logo height={80} />

              <div className="mt-10 space-y-1">
                {navLinks.map((link, idx) => (
                  <div key={link.name}>
                    {link.hasMega ? (
                      <>
                        <button
                          onClick={() => setMobileToursOpen(v => !v)}
                          className="w-full flex items-center justify-between py-3.5 text-2xl font-serif text-black/70 hover:text-accent transition-colors"
                        >
                          Tours
                          <motion.span animate={{ rotate: mobileToursOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown size={18} className="text-black/30" />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {mobileToursOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-4 space-y-6">
                                {REAL_WORLDS.map((world) => (
                                  <div key={world.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#c8a248]">
                                        {world.number} · {world.title}
                                      </span>
                                      <span className="text-[9px] text-black/40 font-serif italic">
                                        {world.tagline}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5 pl-2 border-l border-black/5">
                                      {world.items.map((item) => (
                                        <Link
                                          key={item.name}
                                          to={item.path}
                                          onClick={() => setIsOpen(false)}
                                          className="flex items-center justify-between py-1 text-sm font-serif text-black/75 hover:text-[#c8a248] transition-colors"
                                        >
                                          <span>{item.name}</span>
                                          <span className="text-[10px] text-[#c8a248] font-sans font-bold">
                                            {item.price}
                                          </span>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                <Link
                                  to="/tours"
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent pt-2"
                                >
                                  Browse All 9 Tours <ArrowRight size={12} />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block py-3.5 text-2xl font-serif transition-colors ${
                          location.pathname === link.path ? 'text-accent italic' : 'text-black/70 hover:text-accent'
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                    {idx < navLinks.length - 1 && <div className="h-px bg-black/5" />}
                  </div>
                ))}
              </div>

              <div className="mt-10 space-y-3">
                <Link
                  to="/appointments"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-accent text-white py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-primary transition-all"
                >
                  Book Appointment
                </Link>
                <div className="flex items-center justify-center gap-3 text-black/30">
                  <Globe size={14} />
                  <span className="text-[10px] tracking-widest">Kenya · UAE · Global</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
