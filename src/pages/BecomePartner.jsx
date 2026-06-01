import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { ArrowRight, Globe, BarChart3, ShieldCheck, Headphones } from 'lucide-react';

const BecomePartner = () => {
  const benefits = [
    {
      icon: <Globe className="text-accent" size={32} />,
      title: "Global Reach",
      description: "Expand your business to new markets and connect with elite travelers worldwide."
    },
    {
      icon: <BarChart3 className="text-accent" size={32} />,
      title: "Growth & Analytics",
      description: "Access powerful tools to track performance and optimize your service offerings."
    },
    {
      icon: <ShieldCheck className="text-accent" size={32} />,
      title: "Trust & Security",
      description: "Join a curated network of reliable partners with secure payment systems."
    },
    {
      icon: <Headphones className="text-accent" size={32} />,
      title: "Dedicated Support",
      description: "Get personalized assistance from our partner success team 24/7."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/hero.jpeg')] bg-cover bg-center opacity-80"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
                Partner with <span className="italic text-accent">VistaVoyage</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 leading-relaxed font-medium">
                Join our global network of elite travel providers and corporate partners. 
                Together, we define the future of luxury travel.
              </p>
              <Link 
                to="/partners/apply" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 group"
              >
                Apply Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <Reveal>
              <h2 className="text-4xl font-serif text-slate-950 mb-6 hover:text-accent transition-colors duration-500 cursor-default">Why partner with us?</h2>
              <p className="text-primary/60 font-medium">
                We provide the platform, technology, and support you need to scale your travel business 
                and reach the world's most discerning clients.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-primary/5 group h-full">
                  <div className="mb-6 p-4 bg-surface rounded-2xl w-fit group-hover:bg-accent/10 transition-colors">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 mb-4 group-hover:text-accent transition-colors duration-500 cursor-default">{benefit.title}</h3>
                  <p className="text-primary/60 leading-relaxed text-sm font-medium">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <Reveal>
                <h2 className="text-4xl font-serif text-slate-950 mb-8 hover:text-accent transition-colors duration-500 cursor-default">Who can apply?</h2>
                <div className="space-y-6">
                  {[
                    { title: "Hotels & Resorts", desc: "Luxury accommodations with exceptional service standards." },
                    { title: "Airlines & Private Jets", desc: "Premium air travel providers and charter services." },
                    { title: "Tour Operators", desc: "Expert local guides and unique experience creators." },
                    { title: "Corporate Travel", desc: "Specialized services for business and MICE travel." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-primary">{item.title}</h4>
                        <p className="text-primary/60 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="md:w-1/2">
              <Reveal>
                <div className="bg-primary p-12 rounded-[3rem] text-white">
                  <h3 className="text-3xl font-serif mb-6">Partner Standards</h3>
                  <p className="text-white/70 mb-8 leading-relaxed">
                    To maintain our commitment to excellence, we carefully review every application. 
                    Partners are expected to maintain high ratings and follow our quality guidelines.
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      Valid business registration and licenses
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      Minimum 2 years of proven operation
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      Exceptional customer service track record
                    </li>
                  </ul>
                  <Link 
                    to="/partners/apply" 
                    className="block text-center py-4 bg-white text-primary rounded-2xl font-bold hover:bg-accent hover:text-white transition-all"
                  >
                    Start Application
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BecomePartner;
