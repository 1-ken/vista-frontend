import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Loader from '../components/Loader';
import SafariRallySection from '../components/SafariRallySection';
import FeaturedTours from '../components/FeaturedTours';
import AboutSection from '../components/AboutSection';
import CSRSection from '../components/CSRSection';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';
import DestinationsGrid from '../components/DestinationsGrid';
import FAQSection from '../components/FAQSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Reveal from '../components/Reveal';
import ScrollToTop from '../components/ScrollToTop';

const HOME_LOADER_MS = 2500;

const Home = () => {
  const [splash, setSplash] = useState(true);

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
