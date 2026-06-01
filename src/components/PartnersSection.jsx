import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { MessageCircle } from "lucide-react";

import NewsletterModal from "./NewsletterModal";

import sarovaLogo from "../assets/svt.jpeg";
import serenaLogo from "../assets/serena hotel.png";
import kaLogo from "../assets/kenya airways.jfif";
import magicalKenyaLogo from "../assets/Magical kenya.jpeg";
import kataLogo from "../assets/kata.png";
import toskLogo from "../assets/tosk.jfif";
import katoLogo from "../assets/KATO.png";
import saroLogo from "../assets/saro.jpg";
import iataaLogo from "../assets/IATAa.jfif";

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [isNewsletterOpen, setIsNewsletterOpen] =
    useState(false);

  const controls = useAnimation();

  const HEIGHT = "h-[110px]";

  const getDuration = () => {
    if (window.innerWidth < 640) return 26;
    if (window.innerWidth < 1024) return 34;

    return 42;
  };

  useEffect(() => {
    setPartners([
      {
        name: "IATA",
        logo: iataaLogo,
        url: "https://www.iata.org",
      },

      {
        name: "Serena Hotels",
        logo: serenaLogo,
        url: "https://www.serenahotels.com",
      },

      {
        name: "KATA",
        logo: kataLogo,
        url: "https://katakenya.org",
      },

      {
        name: "Kenya Airways",
        logo: kaLogo,
        url: "https://www.kenya-airways.com",
      },

      {
        name: "Magical Kenya",
        logo: magicalKenyaLogo,
        url: "https://magicalkenya.com",
      },

      {
        name: "TOSK",
        logo: toskLogo,
        url: "https://tosk.or.ke",
      },

      // {
      //   name: "KATO",
      //   logo: katoLogo,
      //   url: "https://katokenya.org",
      // },

      {
        name: "Sarova",
        logo: saroLogo,
        url: "https://www.sarovahotels.com",
      },
    ]);
  }, []);

  const duplicated = [...partners, ...partners];

  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],

      transition: {
        duration: getDuration(),
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [partners, controls]);

  return (
    <>
      {/* WHATSAPP TAB */}
      {/*
      <a
        href="https://wa.me/254790644745"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group"
      >
        <div
          className="bg-[#0b3d2e] hover:bg-[#128C7E] text-white flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl"
          style={{
            width: "48px",
            height: "220px",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.32em",
            fontSize: "10px",
          }}
        >
          <MessageCircle size={18} />

          <span className="font-semibold tracking-[0.35em]">
            CHAT WITH US
          </span>
        </div>
      </a>
      */}

      {/* TOP LINE */}
      <div className="w-full border-t border-gray-300"></div>

      {/* NEWSLETTER */}
      <div
        className={`w-full border-b border-gray-300 ${HEIGHT}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
          <p className="inline-block text-sm tracking-[0.25em] uppercase text-black text-center">
            Get the latest from{" "}
            <span className="font-semibold text-[#0b3d2e]">
              VistaVoyage
            </span>
            :{" "}
            <span
              className="relative text-black font-medium cursor-pointer group hover:text-[#0b3d2e] transition-colors duration-300"
              onClick={() =>
                setIsNewsletterOpen(true)
              }
            >
              Sign up to our Newsletter

              <span className="absolute left-0 -bottom-2 w-full h-[1px] bg-black group-hover:bg-[#0b3d2e] transition-colors duration-300"></span>
            </span>
          </p>
        </div>
      </div>

      {/* MODAL */}
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() =>
          setIsNewsletterOpen(false)
        }
      />

      {/* PARTNERS */}
      <section
        className={`border-b border-gray-300 overflow-hidden ${HEIGHT}`}
        style={{
          backgroundColor: "#f7f5f1",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <motion.div
            className="flex items-center gap-20 whitespace-nowrap"
            animate={controls}
            onHoverStart={() => controls.stop()}
            onHoverEnd={() =>
              controls.start({
                x: ["0%", "-50%"],

                transition: {
                  duration: getDuration(),
                  ease: "linear",
                  repeat: Infinity,
                },
              })
            }
          >
            {duplicated.map((partner, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center flex-shrink-0 cursor-pointer opacity-75 hover:opacity-100 transition-all duration-500 gap-3 hover:scale-105"
                onClick={() =>
                  window.open(
                    partner.url,
                    "_blank"
                  )
                }
              >
                {/* LOGO */}
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-black/5 overflow-hidden flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* NAME */}
                <span className="text-[10px] uppercase tracking-[0.25em] text-black font-semibold whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PartnersSection;