import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Corporate Executive",
    content: "VistaVoyage redefined our executive travel standards. Their attention to detail and seamless management has been unparalleled.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "David Chen",
    role: "Luxury Traveler",
    content: "The Maasai Mara experience was unforgettable. From the lodges to the guides—everything felt curated to perfection.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "Elena Rodriguez",
    role: "Philanthropist",
    content: "Traveling with VistaVoyage is more than luxury—it's meaningful, impactful, and deeply enriching.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
  }
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 px-6 md:px-16 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900">
              What Our Clients Say
            </h2>
          </div>
        </Reveal>

        {/* CARD */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">

                {/* IMAGE */}
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                />

                {/* TEXT */}
                <div className="text-center md:text-left flex-1">
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                    "{testimonials[current].content}"
                  </p>

                  <div>
                    <h4 className="text-gray-900 font-semibold">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* CONTROLS */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;