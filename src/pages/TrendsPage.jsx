import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TourCard from '../components/TourCard';
import Reveal from '../components/Reveal';

import api from '../api/axios';

const TrendsPage = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await api.get('/tours?limit=100&page=1');
        const data = response.data;
        const list = Array.isArray(data) ? data : (data.data || []);
        setTrends(list);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <div className="bg-[#f6f5f2] min-h-screen text-black">
      <Navbar />
      
      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
            alt="Active Itineraries" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 px-6 text-center max-w-5xl mx-auto">
          <Reveal>
            <span className="uppercase tracking-[0.6em] text-white/70 text-[11px] font-medium block mb-8">
              Live updates from the field
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1] tracking-tight uppercase">
              Active <span className="italic">Itineraries</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mt-8 leading-relaxed font-light">
              Explore our most recent curated experiences and limited-time itineraries, 
              updated live by our travel experts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Trends Listing */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <Reveal>
              <div>
                <span className="uppercase tracking-[0.5em] text-black/35 text-[11px] font-semibold block mb-5">
                  Latest Trends
                </span>
                <h2 className="text-4xl md:text-6xl font-serif leading-[1] tracking-tight uppercase">
                  Experiences <span className="italic">Trending Now.</span>
                </h2>
              </div>
            </Reveal>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : trends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {trends.map((trend, index) => (
                <Reveal key={trend._id || trend.id} delay={index * 0.1}>
                  <TourCard tour={trend} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-black/30 uppercase tracking-[0.4em] text-sm font-bold">No active itineraries found.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrendsPage;
