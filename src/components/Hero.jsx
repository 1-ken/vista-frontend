import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import skuVideo from '../assets/sku.mp4';
import postVideo from '../assets/post.mp4'; // NEW VIDEO

import img2 from '../assets/p9.jpg';

const slides = [
  {
    id: 'corporate',
    title: 'Corporate',
    highlight: 'Travel',
    subtitle: 'Global Precision',
    description:
      'Elite travel logistics crafted for executives who demand seamless movement across continents.',
    path: '/corporate',
    type: 'video',
  },
  {
    id: 'leisure',
    title: 'Luxury',
    highlight: 'Safaris',
    subtitle: 'Untamed Elegance',
    description:
      'Private African journeys designed with precision, exclusivity, and unforgettable wilderness immersion.',
    path: '/tours',
    type: 'video',
  },
];

const Hero = ({ skipBrandIntro = false }) => {
  const [index, setIndex] = useState(0);
  const [intro, setIntro] = useState(!skipBrandIntro);
  const navigate = useNavigate();

  useEffect(() => {
    if (skipBrandIntro) return;

    const t = setTimeout(() => setIntro(false), 2500);

    return () => clearTimeout(t);
  }, [skipBrandIntro]);

  useEffect(() => {
    if (!intro) {
      const i = setInterval(() => {
        setIndex((p) => (p + 1) % slides.length);
      }, 7000);

      return () => clearInterval(i);
    }
  }, [intro]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">

      {/* ===== BACKGROUND ===== */}
      <AnimatePresence mode="wait">
        <motion.video
          key={index}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* First slide uses POST video */}
          <source
            src={index === 0 ? postVideo : skuVideo}
            type="video/mp4"
          />
        </motion.video>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />

      {/* ===== INTRO ===== */}
      <AnimatePresence>
        {intro && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>
              <h1 className="text-6xl md:text-9xl font-serif">
                Beyond
                <span className="italic text-accent"> Ordinary</span>
              </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN ===== */}
      {!intro && (
        <div className="relative z-20 h-full flex items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="max-w-5xl"
          >
            <p className="text-accent tracking-[0.6em] text-xs md:text-sm mb-12 uppercase font-bold">
              Hallmark of Luxury Travel
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
              {index === 0 && (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: '#c8a248',
                    color: '#fff',
                  }}
                  onClick={() => navigate('/corporate')}
                  className="px-10 py-4 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all backdrop-blur-sm bg-white/5"
                >
                  Corporate Travels
                </motion.button>
              )}

              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#c8a248',
                  color: '#fff',
                }}
                onClick={() => navigate('/tours')}
                className="px-10 py-4 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all backdrop-blur-sm bg-white/5"
              >
                Our Experiences
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#c8a248',
                  color: '#fff',
                }}
                onClick={() => navigate('/appointments')}
                className="px-10 py-4 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all backdrop-blur-sm bg-white/5"
              >
                Plan Your Journey
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#c8a248',
                  color: '#fff',
                }}
                onClick={() => navigate('/blogs')}
                className="px-10 py-4 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all backdrop-blur-sm bg-white/5"
              >
                Updates and News
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===== SCROLL INDICATOR ===== */}
      {!intro && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[9px] tracking-[0.5em] uppercase font-bold animate-pulse">
          Scroll
        </div>
      )}
    </div>
  );
};

export default Hero;