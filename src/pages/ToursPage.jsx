import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TourCard from '../components/TourCard';
import Reveal from '../components/Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, ArrowRight, Compass, Globe, Clock, Shield, ChevronDown, Sparkles, Check } from 'lucide-react';
import { useSEO, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '../utils/seo';
import { tours as defaultTours } from '../data/toursData';
import cappHero from '../assets/capp.jpg';

const DESTINATION_META = {
  kenya: {
    title: 'Kenya Safari Packages | Luxury Kenya Safaris',
    desc: 'Explore bespoke luxury Kenya safari packages — Maasai Mara, Amboseli, Samburu & more.',
    heading: 'Luxury Kenya Safaris',
    intro: 'Kenya is the birthplace of the classic African safari. From the sweeping plains of the Maasai Mara to the elephant herds of Amboseli set against Mount Kilimanjaro, Kenya offers some of the most iconic wildlife encounters on earth.',
    highlights: ['Great Migration in the Maasai Mara (July–October)', 'Elephant herds at Amboseli with Kilimanjaro views', 'Rare wildlife at Samburu National Reserve', 'Pristine beaches at Diani & Lamu'],
    bestTime: 'July to October for the Great Migration; January to March for calving season.',
    cost: 'Luxury Kenya safaris typically start from USD 500 per person per night.',
  },
  tanzania: {
    title: 'Tanzania Luxury Safari Packages | Serengeti & Zanzibar',
    desc: 'Discover Tanzania luxury safari packages including Serengeti, Ngorongoro and Zanzibar.',
    heading: 'Luxury Tanzania Safaris',
    intro: 'Tanzania is home to the Serengeti — arguably the greatest wildlife spectacle on the planet — as well as the Ngorongoro Crater, a UNESCO World Heritage Site teeming with the Big Five.',
    highlights: ['Serengeti wildebeest migration year-round', 'Ngorongoro Crater Big Five game drives', 'Zanzibar luxury beach resorts', 'Tarangire elephant herds'],
    bestTime: 'June to October for dry season; December to March for calving.',
    cost: 'Luxury Tanzania safaris start from USD 600 per person per night.',
  },
  uganda: {
    title: 'Uganda Safari Packages | Gorilla Trekking & Wildlife',
    desc: 'Uganda gorilla trekking and luxury safari packages.',
    heading: 'Uganda Gorilla & Wildlife Safaris',
    intro: "Uganda is Africa's premier destination for mountain gorilla trekking. Bwindi Impenetrable National Park is home to almost half the world's remaining mountain gorillas.",
    highlights: ['Mountain gorilla trekking in Bwindi', 'Tree-climbing lions in Queen Elizabeth NP', 'Chimpanzee tracking in Kibale Forest', "Murchison Falls — Africa's most powerful waterfall"],
    bestTime: 'June to September and December to February.',
    cost: 'Uganda gorilla permits USD 800. Full packages from USD 700 per person per night.',
  },
  rwanda: {
    title: 'Rwanda Gorilla Safari Packages | Volcanoes National Park',
    desc: 'Rwanda luxury gorilla safari packages in Volcanoes National Park.',
    heading: 'Rwanda Luxury Gorilla Safaris',
    intro: "Rwanda's Volcanoes National Park is the most accessible and luxurious destination for mountain gorilla trekking in Africa.",
    highlights: ['Mountain gorilla trekking in Volcanoes NP', 'Golden monkey tracking', 'Luxury lodges with volcano views', 'Kigali city cultural experiences'],
    bestTime: 'June to September and December to February.',
    cost: 'Rwanda gorilla permits USD 1,500. Luxury packages from USD 900 per person per night.',
  },
  'south africa': {
    title: 'South Africa Luxury Tours | Cape Town & Kruger Safari',
    desc: 'South Africa luxury tours — Cape Town, Kruger National Park and private game reserves.',
    heading: 'South Africa Luxury Tours',
    intro: "South Africa offers an unmatched combination of world-class cities, dramatic landscapes and exceptional Big Five safari.",
    highlights: ['Big Five safari in Kruger & private reserves', 'Cape Town, Table Mountain & the Winelands', 'Garden Route scenic drive', 'Luxury private game lodges'],
    bestTime: 'May to September for safari; November to February for Cape Town.',
    cost: 'South Africa luxury packages from USD 500 per person per night.',
  },
  dubai: {
    title: 'Dubai Luxury Travel Packages | UAE Luxury Holidays',
    desc: 'Dubai luxury travel packages and UAE holidays.',
    heading: 'Dubai & UAE Luxury Travel',
    intro: 'Dubai is the ultimate luxury city destination — a dazzling skyline, world-record attractions, Michelin-starred dining and some of the finest hotels on earth.',
    highlights: ['Burj Khalifa & Dubai Mall', 'Private desert safari with luxury camp dinner', 'Palm Jumeirah & Atlantis', 'Old Dubai souks & Abra creek crossing'],
    bestTime: 'November to March for pleasant outdoor temperatures.',
    cost: 'Dubai luxury packages from USD 400 per night.',
    canonical: '/tours/uae',
  },
};

const DestinationIntro = ({ destKey }) => {
  const meta = DESTINATION_META[destKey];
  if (!meta) return null;
  return (
    <section className="bg-white border-b border-black/5 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-5">{meta.heading}</h2>
        <p className="text-neutral-600 text-base leading-relaxed mb-10 max-w-3xl">{meta.intro}</p>
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            { label: 'Highlights', content: <ul className="space-y-2">{meta.highlights.map((h,i) => <li key={i} className="text-sm text-neutral-700 flex items-start gap-2"><Check size={12} className="text-[#c8a248] mt-1 flex-shrink-0" />{h}</li>)}</ul> },
            { label: 'Best Time to Visit', content: <p className="text-sm text-neutral-700 leading-relaxed">{meta.bestTime}</p> },
            { label: 'Investment', content: <p className="text-sm text-neutral-700 leading-relaxed">{meta.cost}</p> },
          ].map(({ label, content }) => (
            <div key={label} className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6">
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-neutral-400 mb-4">{label}</p>
              {content}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#c8a248] transition-all duration-300">
            Request a Personalised Itinerary <ArrowRight size={13} />
          </Link>
          <Link to="/appointments" className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-800 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-neutral-900 transition-all">
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'duration_asc', label: 'Shortest First' },
];

const TRAVEL_WORLDS = [
  { id: 'all',        label: 'All Journeys',     short: 'All',         num: 'ALL', tag: 'Full Portfolio' },
  { id: 'experience', label: '01 · Experiences', short: 'Experiences', num: '01',  tag: '4–12 Hours' },
  { id: 'journey',    label: '02 · Journeys',    short: 'Journeys',    num: '02',  tag: 'Multi-Day Safaris' },
  { id: 'worldwide',  label: '03 · Worldwide',   short: 'Worldwide',   num: '03',  tag: 'Global Collection' },
];

const QUICK_FILTERS = [
  { id: 'all',         label: 'All' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'safaris',     label: 'Safaris' },
  { id: 'beach',       label: 'Beach' },
  { id: 'culture',     label: 'Culture' },
  { id: 'city',        label: 'City' },
  { id: 'multiday',    label: 'Multi-Day' },
];

const WORLD_NARRATIVES = {
  experience: {
    badge: '01 — EXPERIENCES',
    heading: 'A Day. A Place. A Story.',
    desc: 'Short, highly curated experiences lasting roughly 4–12 hours. You don’t need a week to experience somewhere — sometimes, you only need a day. Designed for business travellers, layovers, and discerning guests with limited time.',
    tagline: 'Live the Moment · 4 to 12 Hours',
  },
  journey: {
    badge: '02 — JOURNEYS',
    heading: 'Go Deeper. Stay Longer.',
    desc: 'Our classic collection of handcrafted multi-day safaris, private conservancies, and coastal escapes across Kenya and East Africa’s greatest wildlife theaters.',
    tagline: 'Go Deeper · Ready-to-Depart & Bespoke',
  },
  worldwide: {
    badge: '03 — WORLDWIDE',
    heading: 'Beyond Africa. Beyond Ordinary.',
    desc: 'Handcrafted luxury travel across South Africa, Rwanda, the UAE, India, Australia, and beyond — curated to VistaVoyage’s standard of private concierge travel.',
    tagline: 'The World is Your Horizon · Curated Global Portfolio',
  },
};

const ToursPage = ({ defaultSearch = '' }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [activeWorld, setActiveWorld] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchParams, setSearchParams] = useSearchParams();

  const destKey = defaultSearch.toLowerCase();
  const destMeta = DESTINATION_META[destKey];
  useSEO(
    destMeta?.title  || 'Luxury Safari & Travel Packages | VistaVoyage',
    destMeta?.desc   || "Browse VistaVoyage's curated collection of luxury safari and travel packages.",
    destMeta?.canonical || (destMeta ? `/tours/${destKey.replace(' ', '-')}` : '/tours'),
    undefined,
    [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]
  );

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await api.get('/tours?limit=200&status=published');
        const data = res.data?.data || res.data || [];
        setTours(Array.isArray(data) && data.length > 0 ? data : defaultTours);
      } catch {
        setTours(defaultTours);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
    window.scrollTo(0, 0);
    if (defaultSearch) setSearchQuery(defaultSearch);
  }, [defaultSearch]);

  useEffect(() => {
    const initial = searchParams.get('search') || '';
    if (initial) setSearchQuery(initial);
    const worldParam = searchParams.get('world');
    if (worldParam && ['experience', 'journey', 'worldwide'].includes(worldParam)) {
      setActiveWorld(worldParam);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (activeWorld !== 'all') params.world = activeWorld;
      setSearchParams(params);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery, activeWorld, setSearchParams]);

  const tags = useMemo(() => {
    const all = tours.map(t => t.tag).filter(Boolean);
    return ['All', ...new Set(all)];
  }, [tours]);

  const q = searchQuery.trim().toLowerCase();

  const counts = useMemo(() => ({
    all: tours.length,
    experience: tours.filter(t => t.travelType === 'experience' || t.nights === 0 || (t.duration && t.duration.toLowerCase().includes('hour'))).length,
    journey: tours.filter(t => (!t.travelType || t.travelType === 'journey') && (t.nights > 0 || (t.duration && !t.duration.toLowerCase().includes('hour')))).length,
    worldwide: tours.filter(t => t.travelType === 'worldwide' || ['south africa', 'uae', 'dubai', 'rwanda', 'india', 'australia'].some(c => (t.country || t.location || '').toLowerCase().includes(c))).length,
  }), [tours]);

  const filtered = useMemo(() => {
    let list = tours.filter(t => {
      const matchSearch = !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.destination || t.location || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.country || '').toLowerCase().includes(q) ||
        (t.subtitle || '').toLowerCase().includes(q);

      // Travel World
      const isDay = t.travelType === 'experience' || t.nights === 0 || (t.duration && t.duration.toLowerCase().includes('hour'));
      const isGlobal = t.travelType === 'worldwide' || ['south africa', 'uae', 'dubai', 'rwanda', 'india', 'australia'].some(c => (t.country || t.location || '').toLowerCase().includes(c));
      const tWorld = t.travelType || (isDay ? 'experience' : isGlobal ? 'worldwide' : 'journey');

      const matchWorld = activeWorld === 'all' || tWorld === activeWorld;

      // Quick style filter
      let matchQuick = true;
      if (activeFilter === 'experiences') {
        matchQuick = isDay;
      } else if (activeFilter === 'safaris') {
        matchQuick = (t.category || '').toLowerCase().includes('safari') || (t.travelStyle || '').toLowerCase().includes('safari');
      } else if (activeFilter === 'beach') {
        matchQuick = (t.category || '').toLowerCase().includes('beach') || (t.title || '').toLowerCase().includes('beach') || (t.location || '').toLowerCase().includes('diani') || (t.location || '').toLowerCase().includes('zanzibar');
      } else if (activeFilter === 'culture') {
        matchQuick = (t.category || '').toLowerCase().includes('culture') || (t.travelStyle || '').toLowerCase().includes('culture');
      } else if (activeFilter === 'city') {
        matchQuick = (t.category || '').toLowerCase().includes('city') || (t.destination || '').toLowerCase().includes('nairobi') || (t.destination || '').toLowerCase().includes('dubai') || (t.destination || '').toLowerCase().includes('cape town');
      } else if (activeFilter === 'multiday') {
        matchQuick = !isDay && (t.nights > 0 || (t.duration && !t.duration.toLowerCase().includes('hour')));
      }

      const matchTag = activeTag === 'All' || t.tag === activeTag;
      return matchSearch && matchWorld && matchQuick && matchTag;
    });

    if (sortBy === 'price_asc')    list = [...list].sort((a,b) => (a.price||0) - (b.price||0));
    if (sortBy === 'price_desc')   list = [...list].sort((a,b) => (b.price||0) - (a.price||0));
    if (sortBy === 'duration_asc') list = [...list].sort((a,b) => (a.nights||99) - (b.nights||99));
    if (sortBy === 'default')      list = [...list].sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return list;
  }, [tours, q, activeWorld, activeFilter, activeTag, sortBy]);

  const isFiltering = q || activeTag !== 'All' || activeWorld !== 'all' || activeFilter !== 'all';

  return (
    <div className="bg-white text-black overflow-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={cappHero}
            alt="Cape Town luxury travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/90" />
        </motion.div>

        <div className="relative z-10 px-6 text-center max-w-5xl mx-auto w-full" style={{ color: '#ffffff' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: '#ffffff' }}
          >
            <span
              style={{ color: '#ffffff' }}
              className="uppercase tracking-[0.55em] text-[11px] font-bold block mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              Bespoke Luxury Travel
            </span>
            <h1
              style={{ color: '#ffffff' }}
              className="font-serif text-5xl md:text-7xl lg:text-[90px] leading-[0.93] tracking-tight mb-8 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
            >
              Journeys that<br />
              redefine travel.
            </h1>
            <p
              style={{ color: '#ffffff' }}
              className="text-base md:text-xl max-w-xl mx-auto leading-relaxed mb-12 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] font-normal"
            >
              Private expeditions and immersive escapes crafted for those who seek the extraordinary.
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search destinations, experiences..."
                className="w-full pl-12 pr-12 h-14 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/25 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-white focus:bg-black/45 transition-all shadow-xl"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="text-white/60 text-[9px] uppercase tracking-[0.5em] font-semibold">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Globe,   label: 'Destinations', value: '20+' },
              { icon: Shield,  label: 'Fully Insured', value: 'Every Trip' },
              { icon: Clock,   label: 'Response Time', value: '< 24 hrs' },
              { icon: Compass, label: 'Expert Guides', value: 'Certified' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c8a248]/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-[#c8a248]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">{value}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATION INTRO ── */}
      {defaultSearch && <DestinationIntro destKey={destKey} />}

      {/* ── 3 TRAVEL WORLDS PORTAL TABS ── */}
      <section className="bg-white border-b border-neutral-100 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 flex-shrink-0">
              {TRAVEL_WORLDS.map(w => {
                const active = activeWorld === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      setActiveWorld(w.id);
                      if (w.id === 'experience') setActiveFilter('all');
                    }}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      active
                        ? 'bg-neutral-900 text-white shadow-lg scale-[1.02]'
                        : 'bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200/80'
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-bold ${active ? 'text-[#c8a248]' : 'text-neutral-400'}`}>
                      {w.num}
                    </span>
                    <span>{w.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      active ? 'bg-[#c8a248] text-black' : 'bg-black/5 text-neutral-500'
                    }`}>
                      {counts[w.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick action to bespoke */}
            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b88a24] hover:text-neutral-900 transition-colors flex-shrink-0"
            >
              <span>Customise a Bespoke Route</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC WORLD NARRATIVE BANNER ── */}
      {activeWorld !== 'all' && WORLD_NARRATIVES[activeWorld] && (
        <section className="bg-neutral-50 border-b border-neutral-100 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="max-w-2xl">
                <span className="text-[#c8a248] text-[10px] uppercase tracking-[0.4em] font-bold block mb-2">
                  {WORLD_NARRATIVES[activeWorld].badge}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-3">
                  {WORLD_NARRATIVES[activeWorld].heading}
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {WORLD_NARRATIVES[activeWorld].desc}
                </p>
              </div>

              <div className="flex-shrink-0">
                <span className="inline-block bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm">
                  {WORLD_NARRATIVES[activeWorld].tagline}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── COLLECTION ── */}
      <section className="pt-16 pb-36">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
            <Reveal>
              <span className="uppercase tracking-[0.55em] text-black/20 text-[9px] font-semibold block mb-3">
                {activeWorld === 'all' ? 'The Entire Collection' : `Collection · ${TRAVEL_WORLDS.find(w => w.id === activeWorld)?.short}`}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif leading-[1.05] max-w-xl text-[#111]">
                {isFiltering
                  ? `${filtered.length} journey${filtered.length !== 1 ? 's' : ''} found`
                  : 'Curated escapes for the discerning traveller.'}
              </h2>
            </Reveal>

            {/* Sort & clear */}
            <div className="flex items-center gap-3">
              {isFiltering && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTag('All');
                    setActiveWorld('all');
                    setActiveFilter('all');
                  }}
                  className="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-all flex items-center gap-1.5"
                >
                  <X size={10} /> Reset Filters
                </button>
              )}

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-700 px-4 py-2.5 pr-8 rounded-full focus:outline-none focus:border-neutral-900 cursor-pointer shadow-sm"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── STYLE FILTERS: ALL | EXPERIENCES | SAFARIS | BEACH | CULTURE | CITY | MULTI-DAY ── */}
          <div className="flex flex-wrap items-center gap-2 mb-12 pb-4 border-b border-neutral-100">
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-neutral-400 mr-2">
              Filter by:
            </span>
            {QUICK_FILTERS.map(f => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`bg-black/5 rounded-[28px] animate-pulse ${i === 1 ? 'h-[540px] md:col-span-2' : 'h-[400px]'}`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-40 text-center">
              <div className="w-16 h-16 bg-[#c8a248]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass size={24} className="text-[#c8a248]/50" />
              </div>
              <p className="text-black/35 text-xl font-serif mb-2">No journeys match your search.</p>
              <p className="text-black/20 text-sm mb-8">Try a different destination or category.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveTag('All'); }}
                className="text-[#c8a248] text-sm font-semibold underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTag}-${q}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12"
              >
                {filtered.map((tour, i) => (
                  <TourCard
                    key={tour._id || tour.id}
                    tour={tour}
                    featured={i === 0 && !isFiltering}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span className="uppercase tracking-[0.55em] text-black/20 text-[9px] font-semibold block mb-4 text-center">
              The Process
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-20 text-[#111]">
              From dream to departure.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { step: '01', title: 'Discover', desc: 'Browse our curated collection of luxury journeys.' },
              { step: '02', title: 'Customise', desc: 'Tell us your dates, group size, and preferences.' },
              { step: '03', title: 'Quote', desc: 'Receive a personalised itinerary within 24 hours.' },
              { step: '04', title: 'Depart', desc: 'Travel with confidence. We handle every detail.' },
            ].map(({ step, title, desc }, i) => (
              <Reveal key={step} delay={i * 0.1}>
                <div className="relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-5 left-full w-full h-px bg-gradient-to-r from-neutral-200 to-transparent z-0" />
                  )}
                  <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center mb-5">
                    <span className="font-serif text-[#b88a24] font-bold text-sm">{step}</span>
                  </div>
                  <h3 className="font-serif text-xl text-neutral-900 mb-2">{title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESPOKE CTA ── */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2072&auto=format&fit=crop"
            alt="Bespoke Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <span className="uppercase tracking-[0.55em] text-[#c8a248] text-[9px] font-semibold block mb-7">
              Bespoke Journeys
            </span>
            <h3 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
              Can't find what<br />you're looking for?
            </h3>
            <p className="text-white/70 text-base leading-relaxed max-w-lg mx-auto mb-12">
              We craft journeys tailored entirely around your vision — your dates, your pace, your story.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-[#c8a248] text-neutral-950 font-bold px-10 py-4 rounded-full uppercase tracking-[0.25em] text-[10px] hover:bg-white hover:text-black transition-all duration-300 group shadow-2xl"
            >
              Build Your Journey
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ToursPage;
