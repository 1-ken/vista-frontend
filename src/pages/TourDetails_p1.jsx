import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import getImageUrl from '../utils/imageUrl';
import {
  MapPin, Clock, Users, ArrowRight, ChevronDown, Hotel, Utensils,
  Compass, Star, Zap, Shield, Award,
} from 'lucide-react';

const fmt = (n) => Number(n || 0).toLocaleString();

function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 120]);
  return { ref, y };
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function ChapterHero({ tour }) {
  const { ref, y } = useParallax(0.25);
  const image = getImageUrl(tour.image);
  const isExperience = tour.travelType === 'experience' || (tour.duration && tour.duration.toLowerCase().includes('hour'));

  const meta = [
    { icon: MapPin,  label: 'Location',       value: tour.location },
    { icon: Clock,   label: 'Duration',       value: tour.duration },
    { icon: Users,   label: 'Travel Style',   value: tour.travelStyle || tour.category || 'Luxury' },
    { icon: Compass, label: 'Starting From',  value: `${tour.currency || 'USD'} ${fmt(tour.price)} pp` },
    { icon: Award,   label: 'Availability',   value: tour.availability !== false ? 'Daily / On Request' : 'On Request' },
  ].filter(m => m.value);

  const worldBadge = tour.travelType === 'experience'
    ? '01 · Curated Day Experience'
    : tour.travelType === 'worldwide'
    ? '03 · Worldwide Luxury Collection'
    : '02 · Bespoke Safari Journey';

  return (
    <section ref={ref} className="relative min-h-[92vh] w-full flex flex-col justify-end pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-16 overflow-hidden">
      {/* Background Image with Deep Dual Gradient Protection */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img src={image} alt={tour.title} className="w-full h-[120%] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/95" />
      </motion.div>

      <div className="relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          {/* World & Tag badges - Bold, High-Contrast & 100% Visible */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="inline-flex items-center bg-[#c8a248] text-black text-[11px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-lg">
              {worldBadge}
            </span>
            {tour.tag && (
              <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/30 shadow-md">
                {tour.tag}
              </span>
            )}
          </div>

          {/* Tour Title - Pure #ffffff, Large, Razor-Sharp Drop Shadow */}
          <h1
            style={{ color: '#ffffff' }}
            className="font-serif text-[#ffffff] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            {tour.title}
          </h1>

          {/* Subtitle / Punchline - Pure #ffffff, Fully Readable */}
          {tour.subtitle && (
            <p
              style={{ color: '#ffffff' }}
              className="font-serif text-[#ffffff] text-xl sm:text-2xl md:text-3xl font-light italic mb-8 max-w-3xl leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
            >
              {tour.subtitle}
            </p>
          )}

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {meta.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-sm">
                <Icon size={12} className="text-[#c8a248] flex-shrink-0" />
                <span className="text-white/70 text-[9px] uppercase tracking-widest font-semibold">{label}</span>
                <span className="text-white text-xs font-bold">{value}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#request"
              className="group bg-[#c8a248] text-black font-black px-8 py-4 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-2xl"
            >
              {isExperience ? 'Request This Experience' : 'Request This Journey'}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#itinerary"
              className="bg-white/15 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.25em] hover:bg-white/25 transition-all duration-300"
            >
              {isExperience ? 'View 12-Hour Journey' : 'Explore Itinerary'}
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span className="text-white/40 text-[9px] uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}

// ─── JOURNEY AT A GLANCE (Clean White Background) ─────────────────────────────
function ChapterGlance({ tour }) {
  const isExperience = tour.travelType === 'experience' || (tour.duration && tour.duration.toLowerCase().includes('hour'));
  const facts = [
    { label: 'Destination',   value: tour.location },
    { label: 'Duration',      value: tour.duration },
    { label: isExperience ? 'Pacing' : 'Nights', value: isExperience ? 'Curated Day' : (tour.nights ? `${tour.nights} Nights` : null) },
    { label: 'Category',      value: tour.category },
    { label: 'Travel Style',  value: tour.travelStyle },
    { label: 'Difficulty',    value: tour.difficulty || 'Easy' },
    { label: 'Season',        value: tour.bestSeason || 'Year-Round' },
    { label: 'Party Size',    value: tour.maxTravelers ? `Up to ${tour.maxTravelers} guests` : 'Private (1-6)' },
    { label: 'Investment',    value: tour.price ? `${tour.currency || 'USD'} ${fmt(tour.price)} pp` : null },
  ].filter(f => f.value);

  return (
    <section id="glance" className="bg-white py-14 px-6 border-b border-neutral-100">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 flex items-center justify-between">
          <span className="text-[#c8a248] text-[10px] uppercase tracking-[0.45em] font-bold">
            {isExperience ? 'Experience at a Glance' : 'Journey at a Glance'}
          </span>
          <span className="text-neutral-400 text-xs font-mono">VistaVoyage Atelier</span>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {facts.map(({ label, value }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
              className="bg-[#faf9f6] border border-neutral-200/80 rounded-2xl p-4 hover:border-[#c8a248]/50 hover:shadow-sm transition-all">
              <p className="text-neutral-400 text-[9px] uppercase tracking-widest font-semibold mb-1">{label}</p>
              <p className="text-neutral-900 text-sm font-semibold leading-snug">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── THE EXPERIENCE / THE JOURNEY (Clean White Background) ────────────────────
function ChapterExperience({ tour }) {
  const isExperience = tour.travelType === 'experience' || (tour.duration && tour.duration.toLowerCase().includes('hour'));
  return (
    <section id="experience" className="bg-white py-20 md:py-28 px-6 border-b border-neutral-100">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="text-[#c8a248] text-[10px] uppercase tracking-[0.45em] font-bold block mb-3">
            {isExperience ? '01 — The Experience' : '01 — The Journey'}
          </span>
          {(tour.fullDescription || tour.description) && (
            <>
              <h2 className="font-serif text-3xl md:text-5xl text-neutral-900 mt-2 mb-4 leading-tight max-w-3xl">
                {tour.title}
              </h2>
              {tour.subtitle && (
                <p className="text-lg md:text-xl font-serif text-[#c8a248] italic mb-6">
                  {tour.subtitle}
                </p>
              )}
              <p className="text-base md:text-lg text-neutral-700 leading-relaxed max-w-3xl font-light">
                {tour.fullDescription || tour.description}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── JOURNEY HIGHLIGHTS (Soft Ivory Background) ──────────────────────────────
function ChapterHighlights({ tour }) {
  const isExperience = tour.travelType === 'experience' || (tour.duration && tour.duration.toLowerCase().includes('hour'));
  const highlights = (tour.highlights || []).map(h => typeof h === 'string' ? { title: h, description: '' } : h);
  if (highlights.length === 0) return null;

  return (
    <section id="highlights" className="bg-[#faf9f6] py-20 md:py-28 px-6 border-b border-neutral-100">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <span className="text-[#c8a248] text-[10px] uppercase tracking-[0.45em] font-bold block mb-2">
            {isExperience ? '02 — Experience Highlights' : '02 — Journey Highlights'}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-900">What Makes This Special</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((h, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-7 border border-neutral-200/80 shadow-sm hover:border-[#c8a248]/40 hover:shadow-md transition-all">
              <div className="w-8 h-8 bg-[#c8a248]/15 rounded-lg flex items-center justify-center mb-4 text-[#c8a248]">
                <Star size={15} />
              </div>
              <p className="font-serif font-bold text-neutral-900 text-base mb-2">{h.title}</p>
              {h.description && <p className="text-xs text-neutral-600 leading-relaxed">{h.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ITINERARY (HOUR-BY-HOUR FOR EXPERIENCES, DAY-BY-DAY FOR JOURNEYS) ─────────
function ChapterItinerary({ tour }) {
  const [open, setOpen] = useState(0);
  const itinerary = tour.itinerary || [];
  if (itinerary.length === 0) return null;

  const isExperience = tour.travelType === 'experience' || (tour.duration && tour.duration.toLowerCase().includes('hour'));

  return (
    <section id="itinerary" className="bg-white py-20 md:py-28 px-6 border-b border-neutral-100">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <span className="text-[#c8a248] text-[10px] uppercase tracking-[0.45em] font-bold block mb-2">
            {isExperience ? '03 — The Day Experience' : '03 — Itinerary'}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-neutral-900 leading-tight">
            {isExperience ? `YOUR ${tour.duration ? tour.duration.toUpperCase() : '12-HOUR'} JOURNEY` : 'Day by Day'}
          </h2>
          {isExperience && (
            <p className="text-neutral-500 text-sm md:text-base mt-2">
              A curated hour-by-hour timeline through the heart of {tour.destination || 'the city'}.
            </p>
          )}
        </motion.div>

        {/* ── HOUR-BY-HOUR EXPERIENCE TIMELINE ── */}
        {isExperience ? (
          <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#c8a248] before:via-neutral-200 before:to-[#c8a248]/20">
            {itinerary.map((stop, i) => {
              const timeDisplay = stop.timings || (stop.activities?.[0]?.time) || `Stop ${i + 1}`;
              const desc = stop.description || [stop.morning, stop.afternoon, stop.evening].filter(Boolean).join(' ');

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="relative group"
                >
                  {/* Timeline node */}
                  <div className="absolute -left-6 md:-left-10 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-neutral-900 border-4 border-white shadow-md flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8a248]" />
                  </div>

                  <div className="bg-[#faf9f6] rounded-2xl p-6 md:p-8 border border-neutral-200/80 shadow-sm hover:border-[#c8a248]/40 hover:shadow-md transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs md:text-sm font-black px-3 py-1 rounded-full bg-[#c8a248]/15 text-[#c8a248] border border-[#c8a248]/30">
                          {timeDisplay}
                        </span>
                        <h3 className="font-serif text-lg md:text-xl font-bold text-neutral-900">
                          {stop.title}
                        </h3>
                      </div>

                      {stop.meals && Array.isArray(stop.meals) && stop.meals.length > 0 && (
                        <span className="text-[11px] font-semibold text-[#c8a248] flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-neutral-100">
                          <Utensils size={11} /> {stop.meals.join(' · ')}
                        </span>
                      )}
                    </div>

                    <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
                      {desc}
                    </p>

                    {/* Sub-activities if present */}
                    {(stop.activities || []).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-neutral-200/60 space-y-1.5">
                        {stop.activities.map((a, ai) => (
                          <div key={ai} className="flex items-center gap-2 text-xs text-neutral-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a248]" />
                            <span>{a.description || a}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Downward indicator between stops */}
                  {i < itinerary.length - 1 && (
                    <div className="text-center my-1 text-neutral-300 text-xs font-mono">
                      ↓
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── CLASSIC DAY-BY-DAY MULTI-DAY ACCORDION ── */
          <div className="space-y-3">
            {itinerary.map((day, i) => {
              const isOpen = open === i;
              const desc = day.description || [day.morning, day.afternoon, day.evening].filter(Boolean).join(' ');
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${isOpen ? 'border-[#c8a248]/50 shadow-md shadow-[#c8a248]/5' : 'border-neutral-200/80 hover:border-neutral-300'}`}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center gap-5 px-6 py-5 text-left">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                      <span className="text-[9px] uppercase tracking-wider opacity-60">Day</span>
                      <span className="font-serif text-lg leading-none">{String(day.day || i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 text-base">{day.title}</p>
                      {day.meals && Array.isArray(day.meals) && day.meals.length > 0 && (
                        <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                          <Utensils size={10} />{day.meals.join(' · ')}
                        </p>
                      )}
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown size={16} className="text-neutral-400 flex-shrink-0" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-6 pb-6 pt-0 border-t border-neutral-100">
                          <p className="text-sm text-neutral-700 leading-relaxed mt-4">{desc}</p>
                          {(day.activities || []).length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {day.activities.map((a, ai) => (
                                <li key={ai} className="flex items-center gap-2 text-xs text-black/60">
                                  {a.time && <span className="font-mono text-[#c8a248] w-12 flex-shrink-0">{a.time}</span>}
                                  <span>{a.description || a}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {day.accommodation && (
                            <p className="flex items-center gap-1.5 text-xs text-black/40 mt-3">
                              <Hotel size={11} className="text-[#c8a248]" />{day.accommodation}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export { ChapterHero, ChapterGlance, ChapterExperience, ChapterHighlights, ChapterItinerary };
