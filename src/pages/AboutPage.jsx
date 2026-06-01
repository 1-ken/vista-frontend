import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Check,
  Compass,
  Shield,
  Sparkles,
  Globe2,
  HeartHandshake,
  Crown,
} from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      title: "Curated Excellence",
      desc: "Every journey is intentionally designed with detail, elegance, and emotional depth.",
      icon: <Sparkles size={20} />,
    },
    {
      title: "Luxury With Purpose",
      desc: "We blend refined travel with sustainability and authentic cultural connection.",
      icon: <HeartHandshake size={20} />,
    },
    {
      title: "Global Expertise",
      desc: "International standards delivered with local African mastery and insight.",
      icon: <Globe2 size={20} />,
    },
    {
      title: "White-Glove Service",
      desc: "Highly personalized planning with seamless concierge-level execution.",
      icon: <Crown size={20} />,
    },
  ];

  const highlights = [
    "Ultra-tailored luxury safaris and executive travel.",
    "Private concierge support before, during, and after travel.",
    "Elegant experiences designed with authenticity and comfort.",
    "Trusted partnerships with premium lodges and global suppliers.",
  ];

  return (
    <div className="bg-[#f8f6f2] text-[#111] overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* IMAGE */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Safari"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        </motion.div>

        {/* GOLD BLUR */}
        <div className="absolute top-[-200px] right-[-120px] w-[500px] h-[500px] bg-[#d4af37]/20 blur-[140px] rounded-full" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl px-6 text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-14 h-[1px] bg-[#d4af37]" />

              <span className="uppercase tracking-[0.45em] text-[#d4af37] text-[11px] font-semibold">
                Redefining African Luxury Travel
              </span>

              <div className="w-14 h-[1px] bg-[#d4af37]" />
            </div>

            <h1 className="text-white text-6xl md:text-[8rem] leading-[0.9] tracking-[-0.08em] font-light">
              Beyond
              <br />

              <span className="italic text-[#d4af37]">
                The Journey
              </span>
            </h1>

            <p className="max-w-2xl mx-auto mt-10 text-white/70 text-lg leading-relaxed font-light">
              VistaVoyage crafts transformative luxury experiences across Africa
              — where bespoke adventure, executive travel, and timeless elegance
              meet in perfect harmony.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-14">
              <Link
                to="/tours"
                className="bg-[#d4af37] hover:bg-[#e5c04b] text-[#07110d] px-10 py-5 rounded-full uppercase tracking-[0.25em] text-[11px] font-semibold transition-all duration-500 shadow-2xl"
              >
                Explore Journeys
              </Link>

              <Link
                to="/contact"
                className="border border-white/20 hover:border-[#d4af37] hover:text-[#d4af37] text-white px-10 py-5 rounded-full uppercase tracking-[0.25em] text-[11px] font-semibold transition-all duration-500 backdrop-blur-xl"
              >
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>

        {/* SCROLL */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="uppercase tracking-[0.35em] text-[10px] text-white/40">
            Scroll
          </span>

          <div className="w-[1px] h-14 bg-gradient-to-b from-[#d4af37] to-transparent" />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* IMAGES */}
            <Reveal>
              <div className="relative">
                <div className="grid grid-cols-2 gap-5">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2060&auto=format&fit=crop"
                    alt=""
                    className="rounded-[2rem] h-[500px] object-cover"
                  />

                  <div className="space-y-5 pt-16">
                    <img
                      src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop"
                      alt=""
                      className="rounded-[2rem] h-[220px] w-full object-cover"
                    />

                    <div className="bg-[#07110d] text-white rounded-[2rem] p-8">
                      <p className="text-[#d4af37] text-5xl font-light">
                        10+
                      </p>

                      <p className="uppercase tracking-[0.25em] text-[10px] mt-3 text-white/60">
                        Years Curating Luxury Experiences
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-[#d4af37]/20 rounded-full hidden lg:block" />
              </div>
            </Reveal>

            {/* TEXT */}
            <Reveal delay={0.2}>
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-[#d4af37]" />

                  <span className="uppercase tracking-[0.4em] text-[#d4af37] text-[11px] font-semibold">
                    About VistaVoyage
                  </span>
                </div>

                <h2 className="text-5xl md:text-6xl leading-[1] tracking-[-0.06em] mb-10">
                  Crafted with
                  <br />

                  precision.
                  <br />

                  Designed for
                  <br />

                  wonder.
                </h2>

                <div className="space-y-6 text-[#555] leading-relaxed text-[15px]">
                  <p>
                    VistaVoyage is a Kenya-based luxury travel company creating
                    elevated safari experiences, executive travel solutions,
                    and immersive African adventures for discerning travelers.
                  </p>

                  <p>
                    We combine modern sophistication with authentic destination
                    storytelling — delivering journeys that feel seamless,
                    personal, and unforgettable from beginning to end.
                  </p>
                </div>

                <div className="mt-10 space-y-5">
                  {highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center flex-shrink-0">
                        <Check size={16} />
                      </div>

                      <p className="text-[#444] leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-32 bg-[#07110d] relative overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[450px] h-[450px] bg-[#d4af37]/10 blur-[140px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 lg:px-14 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* MISSION */}
            <Reveal>
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl h-full">
                <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center mb-8">
                  <Compass size={26} />
                </div>

                <h3 className="text-white text-4xl font-light mb-6">
                  Our Mission
                </h3>

                <p className="text-white/65 leading-relaxed text-[15px]">
                  To create meaningful luxury journeys that inspire connection,
                  celebrate Africa’s beauty, and redefine travel through
                  elegance, precision, and purpose.
                </p>
              </div>
            </Reveal>

            {/* VISION */}
            <Reveal delay={0.2}>
              <div className="bg-[#d4af37] rounded-[2.5rem] p-12 h-full text-[#07110d]">
                <div className="w-16 h-16 rounded-2xl bg-black/10 flex items-center justify-center mb-8">
                  <Shield size={26} />
                </div>

                <h3 className="text-4xl font-light mb-6">
                  Our Vision
                </h3>

                <p className="leading-relaxed text-[15px]">
                  To become Africa’s most iconic luxury travel brand —
                  recognized globally for unforgettable experiences,
                  exceptional service, and transformative impact.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#d4af37]" />

              <span className="uppercase tracking-[0.35em] text-[#d4af37] text-[11px] font-semibold">
                Our Philosophy
              </span>

              <div className="w-12 h-[1px] bg-[#d4af37]" />
            </div>

            <h2 className="text-5xl md:text-6xl tracking-[-0.05em]">
              Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#faf8f4] border border-black/5 rounded-[2rem] p-8 hover:shadow-2xl hover:border-[#d4af37]/20 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center mb-6">
                    {value.icon}
                  </div>

                  <h4 className="text-2xl mb-4">
                    {value.title}
                  </h4>

                  <p className="text-[#666] text-[15px] leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="py-32 bg-[#f8f6f2] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-[#d4af37]/10 blur-[140px] rounded-full" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-3 border border-black/10 rounded-full px-6 py-3 bg-white mb-8">
              <HeartHandshake
                size={15}
                className="text-[#d4af37]"
              />

              <span className="uppercase tracking-[0.3em] text-[10px] font-semibold text-[#666]">
                Kovu Afrika Foundation
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl tracking-[-0.06em] leading-[1] mb-8">
              Luxury travel
              <br />

              with
              <span className="italic text-[#d4af37] font-light">
                {" "}purpose.
              </span>
            </h2>

            <p className="text-[#666] text-lg leading-relaxed max-w-3xl mx-auto mb-14">
              Every VistaVoyage experience contributes toward sustainability,
              conservation, and empowering communities across Africa through
              meaningful impact initiatives.
            </p>

            <Link
              to="/csr"
              className="inline-flex items-center gap-4 bg-[#07110d] hover:bg-[#d4af37] hover:text-[#07110d] text-white px-10 py-5 rounded-full uppercase tracking-[0.25em] text-[11px] font-semibold transition-all duration-500"
            >
              Explore Our Impact

              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;