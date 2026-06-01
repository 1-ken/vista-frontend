import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import FlightBooking from '../components/FlightBooking';
import CSRSection from '../components/CSRSection';
import { ArrowRight } from 'lucide-react';

const CorporateServices = () => {
  const navigate = useNavigate();
  const [isFlightBookingOpen, setIsFlightBookingOpen] = useState(false);
  const services = [
    {
      title: "Global Flight & Logistics",
      description: "Seamless IATA-certified ticketing for inbound and outbound international travel, ensuring global logistical precision.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
      )
    },
    {
      title: "Account Management",
      description: "Dedicated corporate travel consultants, strategic supplier partnerships, and optimized travel spend for your organization.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
      )
    },
    {
      title: "Comprehensive Visa Assistance",
      description: "Navigating the complexities of global visa applications for hassle-free corporate movement across borders.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
      )
    },
    {
      title: "24/7 Executive Support",
      description: "VIP priority handling, travel risk management, and round-the-clock emergency support whenever you need it.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
      )
    }
  ];

  return (
    <div className="bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="Corporate Solutions" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Reveal>
            <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-6 block">
              Business Excellence
            </span>
            <h1 className="text-4xl md:text-8xl font-serif text-white mb-8">
              Corporate <span className="italic text-accent">Solutions</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div 
                  onClick={() => {
                    if (service.title === "Global Flight & Logistics") setIsFlightBookingOpen(true);
                  }}
                  className={`card-luxury p-12 md:p-20 group h-full flex flex-col justify-between border border-transparent hover:border-dark-red transition-all duration-500 ${(service.title === "Global Flight & Logistics") ? "cursor-pointer" : ""}`}
                >
                  <div>
                    <div className="text-accent mb-12 group-hover:scale-110 transition-transform duration-700 origin-left">
                      {service.icon}
                    </div>
                    <h3 className="text-4xl font-serif mb-8 text-primary leading-tight">{service.title}</h3>
                    <p className="text-primary/80 text-lg font-medium leading-relaxed mb-10">
                      {service.description}
                    </p>
                    {(service.title === "Global Flight & Logistics") && (
                      <button className="text-accent font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                        Book Now
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                  <div className="w-12 h-px bg-accent/30 group-hover:w-full transition-all duration-700"></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FlightBooking 
        isOpen={isFlightBookingOpen} 
        onClose={() => setIsFlightBookingOpen(false)} 
      />

      <CSRSection />

      {/* Contact Section */}
      <section className="py-32 bg-white text-white text-center">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-serif mb-12">Elevate Your Corporate <br />Travel Standard</h2>
            <button className="btn-primary !bg-white !text-primary hover:!bg-accent hover:!text-white">
              Inquire Now
            </button>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorporateServices;
