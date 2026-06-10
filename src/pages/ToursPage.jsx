import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TourCard from '../components/TourCard';
import Reveal from '../components/Reveal';
import { tours as staticTours } from '../data/toursData';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useSearchParams } from 'react-router-dom';

const ToursPage = () => {
  const [tours, setTours] = useState(staticTours);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/tours?limit=200');
        const dbTours = response.data?.data || response.data || [];
        // If DB has tours, show only DB tours (admin-managed)
        // Fall back to static only if DB returns nothing
        if (dbTours.length > 0) {
          setTours(dbTours);
        } else {
          setTours(staticTours);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        // Backend unreachable — use static data
        setTours(staticTours);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
    window.scrollTo(0, 0);
  }, []);

  // Initialize search query from URL param on mount
  useEffect(() => {
    const initial = searchParams.get('search') || '';
    if (initial) setSearchQuery(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync searchQuery -> URL with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchQuery && searchQuery.trim()) setSearchParams({ search: searchQuery.trim() });
      else setSearchParams({});
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery, setSearchParams]);

  return (
    <div className="bg-[#f6f5f2] text-black overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[72vh] md:h-[82vh] flex items-center justify-center">
        {/* Background */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
            alt="Luxury Travel"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#f6f5f2]" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 px-6 text-center max-w-6xl mx-auto">
          <Reveal>
            <span className="uppercase tracking-[0.6em] text-white/70 text-[11px] md:text-xs font-medium block mb-8">
              Bespoke Luxury Travel
            </span>

            <h1 className="text-white font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-5xl mx-auto">
              Extraordinary journeys shaped with elegance.
            </h1>

            <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto mt-8 leading-relaxed">
              Discover a refined collection of immersive escapes,
              private expeditions, and unforgettable experiences
              crafted for discerning travelers.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-12 text-white/50 uppercase text-[10px] tracking-[0.35em]">
              <span>Private Experiences</span>

              <div className="hidden md:block w-1 h-1 rounded-full bg-white/30" />

              <span>Luxury Retreats</span>

              <div className="hidden md:block w-1 h-1 rounded-full bg-white/30" />

              <span>Global Destinations</span>
            </div>
          </Reveal>
        </div>

        {/* Scroll Line */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-40">
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* COLLECTION */}
      <section className="relative pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 md:mb-20">
            <Reveal>
              <div>
                <span className="uppercase tracking-[0.5em] text-black/35 text-[11px] font-semibold block mb-5">
                  The Collection
                </span>

                <h2 className="text-4xl md:text-6xl font-serif leading-[1] tracking-tight max-w-2xl">
                  Curated escapes for modern luxury travelers.
                </h2>
              </div>
            </Reveal>

            <Reveal>
              <p className="text-black/50 text-lg leading-relaxed max-w-xl">
                Every journey is intentionally designed to blend
                refined comfort, authentic discovery, and exceptional
                hospitality across the world’s most captivating
                destinations.
              </p>
            </Reveal>
          </div>

          {/* Search input */}
          <div className="mb-8">
            <label className="sr-only" htmlFor="tours-search">Search tours</label>
            <div className="max-w-3xl">
              <input
                id="tours-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { if (searchQuery && searchQuery.trim()) setSearchParams({ search: searchQuery.trim() }); else setSearchParams({}); } }}
                placeholder="Search by title or location"
                className="w-full md:w-1/2 h-12 px-4 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#c8a248]"
              />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            (() => {
              const q = searchQuery.trim().toLowerCase();
              const filtered = q
                ? tours.filter(t => (
                  (t.title || '').toString().toLowerCase().includes(q) ||
                  (t.location || '').toString().toLowerCase().includes(q) ||
                  (t.description || '').toString().toLowerCase().includes(q)
                ))
                : tours;

              if (filtered.length === 0) {
                return (
                  <div className="py-20 text-center text-black/60">
                    No tours found for "{searchQuery}".
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
                  {filtered.map((tour, index) => (
                    <Reveal
                      key={tour._id || tour.id}
                      delay={index * 0.06}
                    >
                      <TourCard tour={tour} />
                    </Reveal>
                  ))}
                </div>
              );
            })()
          )}
        </div>
      </section>

      {/* EXPERIENCE STRIP */}
      <section className="border-y border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              ['Private', 'Tailored Experiences'],
              ['Global', 'Elite Destinations'],
              ['24/7', 'Concierge Service'],
              ['Luxury', 'Premium Hospitality'],
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="text-3xl md:text-4xl font-serif tracking-tight mb-3">
                  {item[0]}
                </h3>

                <p className="text-black/45 uppercase tracking-[0.2em] text-[11px]">
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#f1efea]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <span className="uppercase tracking-[0.5em] text-black/35 text-[11px] font-semibold block mb-6">
              Begin Your Journey
            </span>

            <h3 className="text-4xl md:text-6xl font-serif leading-[1.05] tracking-tight mb-8">
              Travel beyond expectations.
            </h3>

            <p className="text-black/50 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Let us craft a seamless luxury experience designed
              exclusively around your vision of exploration.
            </p>

            <button
              className="
                bg-black
                text-white
                px-10
                md:px-14
                py-4
                md:py-5
                rounded-full
                uppercase
                tracking-[0.3em]
                text-[11px]
                font-semibold
                hover:scale-[1.03]
                hover:shadow-2xl
                transition-all
                duration-500
              "
            >
              Inquire Privately
            </button>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ToursPage;