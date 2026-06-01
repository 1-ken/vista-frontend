import React, { useState } from "react";
import {
  Instagram,
  Facebook,
  Youtube,
  Send,
  Check,
} from "lucide-react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
      }, 2500);
    }, 1400);
  };

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Gallery", path: "/gallery" },
        { name: "Our Experiences", path: "/tours" },
        { name: "Appointments", path: "/appointments" },
      ],
    },
    {
      title: "Destinations",
      links: [
        { name: "Kenya", path: "/tours" },
        { name: "Tanzania", path: "/tours" },
        { name: "Rwanda", path: "/tours" },
        { name: "Zanzibar", path: "/tours" },
        { name: "South Africa", path: "/tours" },
        { name: "Dubai", path: "/tours" },
      ],
    },
    {
      title: "Safari Styles",
      links: [
        { name: "Luxury Safaris", path: "/tours" },
        { name: "Corporate Travel", path: "/corporate" },
        { name: "Cultural Tours", path: "/tours" },
        { name: "Private Journeys", path: "/tours" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href:
        "https://www.instagram.com/vistavoyagetravelgroup?igsh=MTMwczNqeGhjZnRuag==",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1C8M1KemRX/",
    },
    {
      icon: Youtube,
      href: "#",
    },
  ];

  return (
    <footer className="relative bg-[#061a17] overflow-hidden text-white">
      {/* SOFT LIGHTING */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] right-[-120px] w-[500px] h-[500px] rounded-full bg-[#c8a248]/10 blur-[160px]" />

        <div className="absolute bottom-[-200px] left-[-120px] w-[500px] h-[500px] rounded-full bg-[#0b3d2e]/20 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-16 py-20 border-b border-white/10">
          {/* BRAND */}
          <div>
            <Link to="/" className="inline-block mb-8">
              <Logo height={110} width={350} className="transform -translate-x-2 -translate-y-1" />
            </Link>

            <p className="text-white text-[15px] leading-relaxed max-w-[260px] mb-10">
              VistaVoyage curates refined luxury journeys,
              private safaris, and world-class travel
              experiences across Africa.
            </p>

            <div className="space-y-2 text-white/55 text-[13px] leading-relaxed">
              <p>Applewood Adams 904B</p>

              <p>Nairobi, Kenya</p>

              <p>+254 790 644 745</p>

              <p>travel@vistavoyagetravel.com</p>
            </div>
          </div>

          {/* FOOTER LINKS */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="!text-[#d4af37] uppercase tracking-[0.32em] text-[11px] font-bold mb-7">
                {section.title}
              </h3>

              <div className="space-y-4">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-white/55 hover:text-white transition duration-300 text-[14px]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* NEWSLETTER */}
          <div>
            <h3 className="!text-[#d4af37] uppercase tracking-[0.32em] text-[11px] font-bold mb-7">
              Stay Inspired
            </h3>

            <p className="text-white/55 text-[14px] leading-relaxed mb-8">
              Safari stories, curated escapes, and
              exclusive offers — delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe}>
              <div className="relative mb-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Email Address"
                  className="w-full h-[48px] bg-white/5 border border-white/10 px-4 pr-14 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-[#d4af37]/40 transition-all duration-300"
                />

                <button
                  type="submit"
                  disabled={
                    status === "loading" ||
                    status === "success"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition duration-300"
                >
                  {status === "loading" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Send size={15} />
                    </motion.div>
                  ) : status === "success" ? (
                    <Check
                      size={15}
                      className="text-[#d4af37]"
                    />
                  ) : (
                    <Send size={15} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-[44px] bg-[#d4af37] hover:bg-[#e0bc4a] text-[#061a17] uppercase tracking-[0.24em] text-[10px] font-bold transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-7">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.22em]">
            © {currentYear} VistaVoyage. All rights reserved.
          </p>

          {/* SOCIALS */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="text-white hover:text-[#d4af37] transition duration-300"
              >
                <social.icon
                  size={15}
                  strokeWidth={1.7}
                />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;