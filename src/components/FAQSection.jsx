import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

import Reveal from "./Reveal";

const faqs = [
  {
    question: "What travel documents do I need for my trip?",
    answer:
      "Generally, you will need a valid passport with at least 6 months validity from your return date. Visa requirements vary by destination and nationality. Our team provides comprehensive visa support and guidance for all our travel packages.",
  },
  {
    question: "How do I book a luxury tour with VistaVoyage?",
    answer:
      "You can book directly through our website by selecting your preferred package and filling the booking request form. Alternatively, you can schedule a private consultation for a tailored itinerary planning experience.",
  },
  {
    question: "What is included in the tour packages?",
    answer:
      "Our luxury experiences include premium accommodations, curated transfers, exclusive experiences, destination management, gourmet dining, and dedicated concierge support throughout your journey.",
  },
  {
    question: "Do you offer corporate travel management?",
    answer:
      "Yes. We provide elevated corporate travel solutions including executive itineraries, priority booking systems, strategic hotel partnerships, and seamless global mobility management.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellation policies vary depending on the experience and destination. Full details are shared transparently before confirmation, and we strongly recommend comprehensive travel insurance coverage.",
  },
];

const FAQItem = ({ question, answer, isOpen, toggle }) => (
  <motion.div
    layout
    transition={{
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="group border-b border-black/10 py-8"
  >

    <button
      onClick={toggle}
      className="w-full flex items-start justify-between gap-10 text-left"
    >

      {/* QUESTION */}
      <div className="max-w-3xl">

        <h3
          className={`text-2xl md:text-[2rem] leading-[1.2] tracking-[-0.03em] font-semibold transition-all duration-500 ${
            isOpen
              ? "text-[#0b3d2e]"
              : "text-[#111] group-hover:text-[#0b3d2e]"
          }`}
        >
          {question}
        </h3>

      </div>

      {/* ICON */}
      <motion.div
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-2"
      >

        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
            isOpen
              ? "bg-[#0b3d2e] text-white"
              : "bg-black/[0.04] text-[#666] group-hover:bg-[#0b3d2e] group-hover:text-white"
          }`}
        >

          <ChevronDown
            size={20}
            strokeWidth={1.8}
          />

        </div>

      </motion.div>

    </button>

    {/* ANSWER */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            height: "auto",
            y: 0,
          }}
          exit={{
            opacity: 0,
            height: 0,
            y: -10,
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="overflow-hidden"
        >

          <div className="pt-6 max-w-2xl">

            <p className="text-lg leading-relaxed text-[#666]">
              {answer}
            </p>

          </div>

        </motion.div>
      )}
    </AnimatePresence>

  </motion.div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative bg-[#f8f6f1] overflow-hidden py-32 md:py-40 px-6 md:px-16">

      {/* LIGHTING */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* GOLD */}
        <div className="absolute top-[-250px] right-[-180px] w-[700px] h-[700px] rounded-full bg-[#c8a248]/10 blur-[160px]" />

        {/* GREEN */}
        <div className="absolute bottom-[-250px] left-[-180px] w-[700px] h-[700px] rounded-full bg-[#0b3d2e]/10 blur-[160px]" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-24">

          {/* LEFT SIDE */}
          <div>

            <Reveal>

              {/* MINI LABEL */}
              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-px bg-[#c8a248]" />

                <p className="uppercase tracking-[0.4em] text-[11px] font-semibold text-[#0b3d2e]">
                  FAQ
                </p>

              </div>

              {/* TITLE */}
              <h2 className="text-5xl md:text-7xl leading-[0.95] tracking-[-0.05em] font-bold text-[#111] mb-10">

                Refined Travel,
                <br />

                Clearly Explained.

              </h2>

              {/* TEXT */}
              <p className="text-[#666] text-xl leading-relaxed max-w-lg mb-14">
                Everything you need to know about our curated luxury
                experiences, private safari journeys, and premium travel
                services.
              </p>

              {/* MODERN CTA */}
              <button className="group inline-flex items-center gap-5">

                <span className="uppercase tracking-[0.28em] text-sm font-semibold text-[#111]">
                  Contact Concierge
                </span>

                <div className="w-14 h-14 rounded-full bg-[#0b3d2e] flex items-center justify-center transition-all duration-500 group-hover:translate-x-2 group-hover:scale-105">

                  <ArrowUpRight
                    size={18}
                    className="text-white"
                  />

                </div>

              </button>

            </Reveal>

          </div>

          {/* RIGHT SIDE */}
          <div>

            {faqs.map((faq, index) => (
              <Reveal
                key={index}
                delay={index * 0.08}
              >

                <FAQItem
                  {...faq}
                  isOpen={openIndex === index}
                  toggle={() =>
                    setOpenIndex(
                      openIndex === index ? -1 : index
                    )
                  }
                />

              </Reveal>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default FAQSection;