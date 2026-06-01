import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import tanzaniaVideo from '../assets/Tanzania.mp4';

const AboutSection = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

        {/* 🔥 LEFT: 3 VIDEO GRID (YACHT STYLE) */}
        <div className="grid grid-cols-2 gap-4">

          {/* SMALL TOP */}
          <Reveal>
            <video
              src={tanzaniaVideo}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl h-40 w-full object-cover"
            />
          </Reveal>

          {/* BIG RIGHT */}
          <Reveal>
            <video
              src={tanzaniaVideo}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl h-full w-full object-cover row-span-2 min-h-[360px]"
            />
          </Reveal>

          {/* SMALL BOTTOM */}
          <Reveal>
            <video
              src={tanzaniaVideo}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl h-40 w-full object-cover"
            />
          </Reveal>

        </div>

        {/* 🔥 RIGHT: YOUR ORIGINAL TEXT (UNCHANGED) */}
        <div className="space-y-10">

          <Reveal>
            <p className="text-accent uppercase tracking-[0.4em] text-xs font-semibold">
              The VistaVoyage Legacy
            </p>

            <h2 className="text-5xl md:text-6xl font-serif text-black leading-tight">
              Redefining the <br />
              <span className="italic text-accent">Art of Travel</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-black text-lg leading-relaxed max-w-lg">
              VistaVoyage is not a travel agency — it is a private gateway into
              Africa’s most extraordinary experiences. Every journey is engineered
              with precision, elegance, and a deep respect for culture, nature,
              and exclusivity.
            </p>
          </Reveal>

          {/* 💬 QUOTE */}
          <Reveal delay={0.3}>
            <div className="pl-6 border-l-2 border-accent">
              <p className="text-xl font-serif italic text-black">
                “Luxury is no longer where you go — it’s how deeply you experience it.”
              </p>
            </div>
          </Reveal>

          {/* 🔥 FEATURES */}
          <div className="grid grid-cols-2 gap-8 pt-6">
            {[
              'Bespoke Safaris',
              'Global Mobility',
              'Eco Luxury',
              'VIP Concierge'
            ].map((item, i) => (
              <Reveal key={i} delay={0.4 + i * 0.1}>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <p className="text-sm uppercase tracking-widest text-black">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 🔴 CTA */}
          <Reveal delay={0.6}>
            <Link 
              to="/about"
              className="inline-flex items-center gap-3 mt-4 bg-black text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent transition-all duration-500"
            >
              Discover More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;