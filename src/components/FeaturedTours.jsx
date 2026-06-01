import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import Reveal from "./Reveal";
import getImageUrl from '../utils/imageUrl';

import { tours as staticTours } from "../data/toursData";
import api from "../api/axios";

const FeaturedTours = () => {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState(
    staticTours.slice(0, 3)
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get(
          "/tours/featured"
        );

        if (response.data?.length > 0) {
          setFeatured(response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching featured tours:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f6f3ed] py-28 md:py-36 px-6 md:px-16">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-240px] right-[-180px] w-[700px] h-[700px] rounded-full bg-[#c8a248]/10 blur-[180px]" />

        <div className="absolute bottom-[-260px] left-[-180px] w-[700px] h-[700px] rounded-full bg-[#0b3d2e]/10 blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "90px 90px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-16 mb-24">
          {/* LEFT */}
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-black/5 shadow-sm mb-8">
                <Sparkles
                  size={15}
                  className="text-[#c8a248]"
                />

                <p className="uppercase tracking-[0.35em] text-[11px] font-semibold text-[#0b3d2e]">
                  Luxury African Escapes
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-5xl md:text-7xl font-bold leading-[0.92] tracking-[-0.05em] text-[#111]">
                Curated Safari
                <br />

                <span className="text-[#0b3d2e]">
                  Experiences
                </span>
              </h2>
            </Reveal>
          </div>

          {/* RIGHT */}
          <Reveal delay={0.2}>
            <div className="max-w-md">
              <p className="text-[#666] text-lg leading-relaxed mb-10">
                Handcrafted luxury journeys blending
                refined comfort, iconic landscapes,
                and unforgettable wildlife encounters.
              </p>

              <button
                onClick={() => navigate("/tours")}
                className="group inline-flex items-center gap-5"
              >
                <span className="uppercase tracking-[0.25em] text-sm font-semibold text-[#111]">
                  Explore Collection
                </span>

                <div className="w-14 h-14 rounded-full bg-[#0b3d2e] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110">
                  <ArrowRight
                    size={18}
                    className="text-white"
                  />
                </div>
              </button>
            </div>
          </Reveal>
        </div>

        {/* TOURS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {featured.map((tour, i) => (
            <Reveal
              key={tour.id || tour._id}
              delay={i * 0.15}
            >
              <div className="group relative overflow-hidden rounded-[34px] bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_35px_90px_rgba(0,0,0,0.12)] transition-all duration-700">
                {/* IMAGE */}
                <div className="relative h-[420px] overflow-hidden">
                  {(() => {
                    const src = getImageUrl(tour.image || tour.images?.[0]);
                    return (
                      <img
                        src={src}
                        alt={tour.title}
                        onError={(e) => { e.currentTarget.src = getImageUrl(null); }}
                        className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
                      />
                    );
                  })()}

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  {/* BADGE */}
                  <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/20">
                    <p className="text-white uppercase tracking-[0.25em] text-[10px] font-semibold">
                      Featured Journey
                    </p>
                  </div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h3 className="text-white text-3xl font-semibold leading-tight mb-3">
                          {tour.title}
                        </h3>

                        <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                          {tour.description}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/travel/${tour._id || tour.id}`
                          )
                        }
                        className="min-w-[58px] h-[58px] rounded-full bg-white text-[#111] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:bg-[#c8a248] group-hover:text-white"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.5}>
          <div className="mt-32">
            <div className="relative overflow-hidden rounded-[42px] border border-[#e7e2d7] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.08)]">
              {/* GOLD LIGHT */}
              <div className="absolute top-[-100px] right-[-100px] w-[320px] h-[320px] rounded-full bg-[#c8a248]/10 blur-[120px]" />

              {/* CONTENT */}
              <div className="relative z-10 px-10 md:px-20 py-16 md:py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-14">
                {/* TEXT */}
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <ShieldCheck
                      size={18}
                      className="text-[#c8a248]"
                    />

                    <p className="uppercase tracking-[0.35em] text-[11px] font-semibold text-[#0b3d2e]">
                      Private Journeys
                    </p>
                  </div>

                  <h3 className="text-4xl md:text-6xl font-bold leading-[1] tracking-[-0.04em] text-[#111] mb-7">
                    Crafted For
                    <br />
                    Exceptional Travelers
                  </h3>

                  <p className="text-[#666] text-lg leading-relaxed">
                    Discover immersive journeys
                    tailored for travelers seeking
                    elegance, authenticity, and
                    unforgettable moments across
                    Africa.
                  </p>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => navigate("/tours")}
                  className="group inline-flex items-center gap-5 bg-[#0b3d2e] text-white px-10 py-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span className="uppercase tracking-[0.2em] text-sm font-semibold">
                    Discover More
                  </span>

                  <ArrowRight
                    size={18}
                    className="transition duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedTours;