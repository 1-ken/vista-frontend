import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import getImageUrl from '../utils/imageUrl';
import api from '../api/axios';

const getTourId = tour => tour?._id ? String(tour._id) : tour?.id ? String(tour.id) : '';

const FeaturedTours = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        let res = await api.get('/tours/featured').catch(() => null);
        let data = res?.data?.data || res?.data || [];
        if (!Array.isArray(data) || data.length === 0) {
          res = await api.get('/tours?limit=6&status=published&featured=true');
          data = res.data?.data || res.data || [];
        }
        if (!Array.isArray(data) || data.length === 0) {
          res = await api.get('/tours?limit=6&status=published');
          data = res.data?.data || res.data || [];
        }
        setFeatured(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#f6f3ed] py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-[420px] bg-black/5 rounded-[34px] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32 px-6 md:px-16 border-t border-neutral-100">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-240px] right-[-180px] w-[700px] h-[700px] rounded-full bg-[#c8a248]/5 blur-[180px]" />
        <div className="absolute bottom-[-260px] left-[-180px] w-[700px] h-[700px] rounded-full bg-neutral-100/50 blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-16 md:mb-20">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-neutral-50 border border-neutral-200/80 shadow-sm mb-6">
                <Sparkles size={14} className="text-[#c8a248]" />
                <p className="uppercase tracking-[0.35em] text-[11px] font-semibold text-neutral-800">
                  Luxury African Escapes
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-[0.95] tracking-tight text-neutral-900">
                Curated Safari<br />
                <span className="text-[#c8a248]">Experiences</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="max-w-md">
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-8">
                Handcrafted luxury journeys blending refined comfort, iconic landscapes, and unforgettable wildlife encounters.
              </p>
              <button onClick={() => navigate('/tours')} className="group inline-flex items-center gap-5">
                <span className="uppercase tracking-[0.25em] text-xs font-bold text-neutral-900">
                  Explore Collection
                </span>
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-[#c8a248] group-hover:translate-x-2">
                  <ArrowRight size={16} className="text-white" />
                </div>
              </button>
            </div>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {featured.map((tour, i) => {
            const id = getTourId(tour);
            const price = Number(tour.price || 0).toLocaleString();
            const location = tour.destination || tour.location || '';

            return (
              <Reveal key={id || i} delay={i * 0.15}>
                <div
                  onClick={() => navigate(`/travel/${id}`)}
                  className="group relative overflow-hidden rounded-[34px] bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_35px_90px_rgba(0,0,0,0.12)] transition-all duration-700 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-[420px] overflow-hidden">
                    <img
                      src={getImageUrl(tour.image)}
                      alt={tour.title}
                      onError={e => { e.currentTarget.src = getImageUrl(null); }}
                      className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                      <div className="px-4 py-2 rounded-full bg-white/12 backdrop-blur-xl border border-white/15">
                        <p className="text-white uppercase tracking-[0.25em] text-[10px] font-semibold">
                          {tour.tag || 'Featured Journey'}
                        </p>
                      </div>
                      {tour.price > 0 && (
                        <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                          <span className="text-white text-xs font-bold">{tour.currency || 'USD'} {price}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 w-full p-7">
                      {location && (
                        <div className="flex items-center gap-1.5 text-white/50 text-[11px] mb-2">
                          <MapPin size={9} className="text-[#c8a248]" />
                          {location}
                          {tour.duration && (
                            <><span className="mx-1.5 opacity-30">·</span><Clock size={9} />{tour.duration}</>
                          )}
                        </div>
                      )}
                      <div className="flex items-end justify-between gap-4">
                        <h3 className="text-white text-2xl font-serif leading-tight">
                          {tour.title}
                        </h3>
                        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-xl transition-all duration-500 group-hover:bg-[#c8a248]">
                          <ArrowRight size={16} className="text-[#111] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4">
                    <p className="text-black/40 text-sm leading-relaxed line-clamp-2">
                      {tour.description || ''}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* CTA Banner */}
        <Reveal delay={0.5}>
          <div className="mt-28">
            <div className="relative overflow-hidden rounded-[42px] border border-[#e7e2d7] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.07)]">
              <div className="absolute top-[-100px] right-[-100px] w-[320px] h-[320px] rounded-full bg-[#c8a248]/8 blur-[120px]" />
              <div className="relative z-10 px-10 md:px-20 py-16 md:py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-14">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <ShieldCheck size={18} className="text-[#c8a248]" />
                    <p className="uppercase tracking-[0.35em] text-[11px] font-semibold text-[#0b3d2e]">
                      Private Journeys
                    </p>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-bold leading-[1] tracking-[-0.04em] text-[#111] mb-7">
                    Crafted For<br />Exceptional Travelers
                  </h3>
                  <p className="text-[#666] text-lg leading-relaxed">
                    Discover immersive journeys tailored for travellers seeking elegance, authenticity, and unforgettable moments across Africa.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/tours')}
                  className="group inline-flex items-center gap-5 bg-[#0b3d2e] text-white px-10 py-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  <span className="uppercase tracking-[0.2em] text-sm font-semibold">Discover More</span>
                  <ArrowRight size={18} className="transition duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedTours;
