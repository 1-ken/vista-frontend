import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import wrcSafariRallyImage from '../assets/WRC - Safari 2023.jpeg';
import maasaiMaraImage from '../assets/Maasai.jpeg';
import dubaiLuxuryImage from '../assets/Dubai p.jpeg';
import lamuFestivalImage from '../assets/Lamu Cultural Festival.jpeg';
import seychellesIslandImage from '../assets/Seychelles.jpg';

const destinations = [
  { id: 1, name: 'Maasai Mara',    tours: '12 Premium Tours',    image: maasaiMaraImage,     path: '/tours/kenya' },
  { id: 2, name: 'WRC Safari Rally', tours: 'Naivasha Experience', image: wrcSafariRallyImage, path: '/tours/kenya' },
  { id: 3, name: 'South Africa',   tours: 'Cape Town & Beyond',  image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071&auto=format&fit=crop', path: '/tours/south-africa' },
  { id: 4, name: 'Dubai',          tours: 'Skyline & Desert',    image: dubaiLuxuryImage,    path: '/tours/uae' },
  { id: 5, name: 'Seychelles',     tours: 'Island Paradise',     image: seychellesIslandImage, path: '/tours' },
  { id: 6, name: 'Lamu Festival',  tours: 'Cultural Heritage',   image: lamuFestivalImage,   path: '/tours/kenya' },
];

const DestinationsGrid = () => {
  const duplicatedDestinations = [...destinations, ...destinations];

  return (
    <section className="section-padding bg-surface relative overflow-hidden">
      <div className="container mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Reveal>
            <span className="text-black/40 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
              Our Curated Destinations
            </span>
            <h2 className="text-[28px] md:text-[42px] font-serif text-black mb-6 leading-tight tracking-tight uppercase">
              Tailor Made <span className="italic">Journeys</span>
            </h2>
            <p className="text-black/50 text-base tracking-wide font-light leading-relaxed">
              Discovering exclusivity and grace across the globe.
            </p>
          </Reveal>
        </div>

        {/* SCROLLING DESTINATIONS */}
        <div className="relative -mx-6 md:-mx-12 overflow-hidden">
          <motion.div
            className="flex gap-8 lg:gap-12 py-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          >
            {duplicatedDestinations.map((dest, i) => (
              <div key={`${dest.id}-${i}`} className="w-[220px] md:w-[320px] lg:w-[400px] flex-shrink-0">
                <Reveal delay={(i % destinations.length) * 0.1}>
                  <motion.div whileHover={{ y: -10 }} className="group cursor-pointer">
                    <Link to={dest.path}>
                    <div className="relative h-[320px] md:h-[450px] overflow-hidden rounded-[2rem] shadow-lg">
                      
                      <motion.img
                        src={dest.image}
                        alt={`${dest.name} luxury safari and travel`}
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        className="w-full h-full object-cover transition duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div>
                          <p className="text-white text-xs tracking-widest mb-1">{dest.tours}</p>
                          <h4 className="text-xl text-white font-serif">{dest.name}</h4>
                        </div>
                      </div>

                    </div>
                    </Link>
                  </motion.div>
                </Reveal>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ================= LUXURY DESTINATIONS SECTION ================= */}

        <Reveal>
          <div className="mt-32 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-dark mb-6">
              Luxury Destinations
            </h2>

            <p className="text-dark text-[15px] leading-relaxed font-dark">
              At VistaVoyage, we invite you to explore a world defined by elegance, exclusivity, and unforgettable experiences.
              Every journey we design is thoughtfully curated to reflect your unique travel desires — whether it’s an immersive
              cultural escape, a refined family retreat, boundless adventure, or a romantic getaway.
              <br /><br />
              From the moment you begin planning to the memories you carry home, we ensure every detail is seamless, personal,
              and extraordinary — crafting bespoke journeys that linger far beyond the destination.
            </p>
          </div>
        </Reveal>

        {/* GRID */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            { name: "Kenya",        image: maasaiMaraImage,      path: '/tours/kenya',        alt: 'Kenya luxury safari — Maasai Mara' },
            { name: "Dubai",        image: dubaiLuxuryImage,     path: '/tours/uae',          alt: 'Dubai luxury travel and city skyline' },
            { name: "South Africa", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071&auto=format&fit=crop", path: '/tours/south-africa', alt: 'South Africa luxury safari and Cape Town' },
            { name: "Seychelles",   image: seychellesIslandImage, path: '/tours',             alt: 'Seychelles island luxury holiday' },
            { name: "Lamu",         image: lamuFestivalImage,    path: '/tours/kenya',        alt: 'Lamu Cultural Festival Kenya' },
            { name: "Safari",       image: wrcSafariRallyImage,  path: '/tours/kenya',        alt: 'WRC Safari Rally Kenya experience' },
            { name: "Europe",       image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", path: '/tours', alt: 'Europe luxury travel' },
            { name: "Oceania",      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", path: '/tours', alt: 'Oceania beach holiday' },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <Link to={item.path}>
              <div className="relative group h-[140px] md:h-[180px] overflow-hidden rounded-xl cursor-pointer">
                
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                <div className="absolute bottom-3 left-3">
                  <p className="dark-black font-serif">{item.name}</p>
                </div>

              </div>
              </Link>
            </Reveal>
          ))}

        </div>

        {/* CTA */}
        <Reveal delay={0.5}>
          <div className="mt-24 text-center">
            <button className="bg-black text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent transition-all duration-500">
              Explore Our Full Portfolio
            </button>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default DestinationsGrid;