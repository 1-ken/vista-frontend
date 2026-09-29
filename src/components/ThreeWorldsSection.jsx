import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Clock, Compass, Globe, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';
import cappImg from '../assets/capp.jpg';

const WORLDS = [
  {
    number: '01',
    category: 'EXPERIENCES',
    title: '12 Hours Can Change the Way You See a City.',
    tagline: 'Live the Moment · 4–12 Hours',
    description: 'A collection of carefully designed day experiences for travellers who want to discover more without committing to a multi-day itinerary. Perfect for airport layovers, conference visitors, couples, and day escapes.',
    features: [
      'The Nairobi Experience — 12 Hours ($350)',
      'Nairobi Wildlife Escape — 6 Hours',
      'The Karen Heritage & Artisan Trail — 5 Hours',
    ],
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop',
    link: '/tours?world=experience',
    accentColor: '#c8a248',
  },
  {
    number: '02',
    category: 'JOURNEYS',
    title: 'Go Beyond the Ordinary.',
    tagline: 'Go Deeper · Ready-to-Depart & Bespoke',
    description: 'From the sweeping plains of the Maasai Mara to the turquoise shores of Diani and the elephant herds of Amboseli, discover thoughtfully crafted multi-day journeys across Africa.',
    features: [
      'Exclusive Maasai Mara Luxury Safari (5 Days)',
      'Amboseli: Land of Giants & Kilimanjaro (3 Days)',
      'Kenya Bush & Diani Beach Escape (7 Days)',
    ],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop',
    link: '/tours?world=journey',
    accentColor: '#c8a248',
  },
  {
    number: '03',
    category: 'WORLDWIDE',
    title: 'The World is Your Horizon.',
    tagline: 'Beyond Africa · Curated Global Portfolio',
    description: 'From Cape Town to Dubai, Rwanda to Australia, we connect you with remarkable destinations around the world through our high-touch private travel concierge.',
    features: [
      'South Africa: Cape Town & Kruger Grand Expedition',
      'Dubai & Arabian Desert Luxury Retreat',
      'Rwanda: Mountain Gorilla Sanctuary Expedition',
    ],
    image: cappImg,
    link: '/tours?world=worldwide',
    accentColor: '#c8a248',
  },
];

export default function ThreeWorldsSection() {
  return (
    <section className="relative bg-white py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle warm luxury backdrop elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#c8a248]/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-neutral-100/60 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-200/80 px-4 py-1.5 rounded-full mb-5">
              <Sparkles size={12} className="text-[#c8a248]" />
              <span className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-800">
                The VistaVoyage Travel Architecture
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-neutral-900 leading-tight mb-5">
              Where will your journey <em className="not-italic text-[#c8a248]">take you</em>?
            </h2>
            <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Choose how you want to travel. Three distinct worlds crafted for every pace, duration, and aspiration.
            </p>
          </Reveal>
        </div>

        {/* 3 Travel Worlds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {WORLDS.map((world, idx) => (
            <Reveal key={world.category} delay={idx * 0.12}>
              <div className="group relative bg-[#faf9f6] rounded-[28px] overflow-hidden border border-neutral-200/80 hover:border-[#c8a248]/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full">

                {/* Image Cover */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={world.image}
                    alt={world.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {/* World Number & Badge */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="bg-white/95 backdrop-blur-md text-[#b88a24] border border-[#c8a248]/30 text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full shadow-sm">
                      {world.number} · {world.category}
                    </span>
                    <span className="text-white text-xs font-mono font-bold bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      {world.tagline.split('·')[1]?.trim() || 'Curated'}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-serif text-white text-2xl leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {world.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body (Clean Luxury White / Soft Ivory) */}
                <div className="p-7 md:p-8 bg-[#faf9f6] flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {world.description}
                  </p>

                  {/* Featured products preview with clear readable dark titles */}
                  <div className="space-y-2.5 pt-4 border-t border-neutral-200/70">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#b88a24] block mb-2">
                      Featured Itineraries
                    </span>
                    {world.features.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8a248] flex-shrink-0" />
                        <span className="font-serif text-neutral-900 font-semibold tracking-wide">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link
                      to={world.link}
                      className="inline-flex items-center justify-between w-full bg-neutral-900 hover:bg-[#c8a248] text-white hover:text-neutral-950 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm group/btn"
                    >
                      <span>Explore {world.category.toLowerCase()}</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── 4TH PILLAR: VISTAVOYAGE BESPOKE CANVAS ── */}
        <Reveal delay={0.3}>
          <div className="relative rounded-[28px] overflow-hidden border border-neutral-200/80 shadow-lg">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2000&auto=format&fit=crop"
                alt="Bespoke Safari"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 px-8 py-14 md:py-16 md:px-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-center lg:text-left">
              <div className="max-w-2xl">
                <span className="text-[#c8a248] text-[10px] uppercase tracking-[0.45em] font-black block mb-3">
                  VistaVoyage Bespoke
                </span>
                <h3 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-4">
                  Can't find the journey you're imagining?
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  Tell us where you want to go, how you want to travel, and what you want to experience. Our private travel atelier will design the journey entirely around you.
                </p>
              </div>

              <div className="flex-shrink-0 flex justify-center lg:justify-end">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 bg-[#c8a248] text-neutral-950 font-bold px-8 py-4 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300 shadow-xl group"
                >
                  <span>Design My Journey</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
