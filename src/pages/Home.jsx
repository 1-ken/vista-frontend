import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Loader from '../components/Loader';
import SafariRallySection from '../components/SafariRallySection';
import FeaturedTours from '../components/FeaturedTours';
import ThreeWorldsSection from '../components/ThreeWorldsSection';
import AboutSection from '../components/AboutSection';
import CSRSection from '../components/CSRSection';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';
import DestinationsGrid from '../components/DestinationsGrid';
import FAQSection from '../components/FAQSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Reveal from '../components/Reveal';
import ScrollToTop from '../components/ScrollToTop';
import { useSEO, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, LOCAL_BUSINESS_SCHEMA } from '../utils/seo';

const HOME_LOADER_MS = 2500;

const Home = () => {
  const [splash, setSplash] = useState(true);

  useSEO(
    'Luxury African Safaris & Bespoke Travel',
    'VistaVoyage Travel Group crafts bespoke luxury safaris across Kenya, Tanzania, Uganda, Rwanda, South Africa and UAE. Private itineraries, expert guides, 5-star lodges.',
    '/',
    undefined,
    [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, LOCAL_BUSINESS_SCHEMA]
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setSplash(false);
      document.body.style.overflow = 'auto';
    }, HOME_LOADER_MS);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className={splash ? 'min-h-screen bg-dark' : 'min-h-screen bg-white'}
    >
      {splash && <Loader />}
      <ScrollToTop />
      <Navbar />
      <Hero skipBrandIntro />
      
      <main className="relative z-10">
        <Reveal>
          <AboutSection />
        </Reveal>
        
        <ThreeWorldsSection />
        
        <DestinationsGrid />

         <Reveal>
          <SafariRallySection />
        </Reveal>
        
        <Reveal>
          <FeaturedTours />
        </Reveal>
        
        {/* <Reveal>
          <TestimonialsSection />
        </Reveal> */}
        
        <Reveal>
          <CSRSection />
        </Reveal>
        
        <Reveal>
          <FAQSection />
        </Reveal>
        
        <Reveal>
          <PartnersSection />
        </Reveal>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
