import React from "react";
import { Link } from "react-router-dom";
import { Hotel, MapPin } from "lucide-react";

import mainImage from "../assets/WRC - Safari 2023.jpeg";
import maasaiImg from "../assets/Maasai.jpeg";

const SafariRallySection = () => {
  return (
    <section className="bg-[#f7f5f1] py-28 px-6 md:px-20 overflow-hidden">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT SIDE IMAGES */}
        <div className="grid grid-cols-2 gap-6 items-end">

          {/* LARGE IMAGE */}
          <div className="col-span-1">
            <div className="overflow-hidden rounded-[32px] shadow-2xl">
              <img
                src={mainImage}
                alt="Safari Rally"
                className="w-full h-[620px] object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div>

          {/* SECOND COLUMN */}
          <div className="flex flex-col gap-6">

            {/* SMALL IMAGE */}
            <div className="overflow-hidden rounded-[28px] shadow-xl">
              <img
                src={maasaiImg}
                alt="Maasai Experience"
                className="w-full h-[260px] object-cover hover:scale-105 transition duration-700"
              />
            </div>

            {/* LUXURY INFO CARD */}
            <div className="bg-white rounded-[28px] p-8 shadow-lg">

              <p
                className="uppercase tracking-[0.3em] text-xs mb-3"
                style={{ color: "#c8a248" }}
              >
                Elite Experience
              </p>

              <h3 className="text-3xl font-bold text-[#111] mb-4 leading-tight">
                Safari Rally <br />
                Kenya 2025
              </h3>

              <p className="text-[#666] leading-relaxed">
                A curated rally and safari journey crafted for travelers
                who appreciate luxury, speed, wilderness, and unforgettable
                moments.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE CONTENT */}
        <div>

          {/* SMALL LABEL */}
          <p
            className="uppercase tracking-[0.35em] text-sm mb-6"
            style={{ color: "#c8a248" }}
          >
            Limited Time Offer
          </p>

          {/* HEADING */}
          <h2 className="text-5xl lg:text-7xl font-bold leading-[1.05] text-[#111] mb-8">

            WRC Safari
            <br />

            <span style={{ color: "#0b3d2e" }}>
              Rally Experience
            </span>

          </h2>

          {/* DESCRIPTION */}
          <p className="text-[#555] text-lg leading-relaxed mb-12 max-w-xl">
            Discover the thrill of the legendary Safari Rally with luxury
            accommodation, premium viewing access, curated excursions,
            and world-class hospitality across Kenya’s breathtaking
            landscapes.
          </p>

          {/* FEATURES */}
          <div className="space-y-8 mb-14">

            {/* FEATURE */}
            <div className="flex items-start gap-5">

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#ebe4d3" }}
              >
                <Hotel size={24} style={{ color: "#0b3d2e" }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#111] mb-1">
                  Premium Lodging
                </h3>

                <p className="text-[#666]">
                  Stay at Sarova Lion Hill & Sawela Lodges
                </p>
              </div>

            </div>

            {/* FEATURE */}
            <div className="flex items-start gap-5">

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#ebe4d3" }}
              >
                <MapPin size={24} style={{ color: "#0b3d2e" }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#111] mb-1">
                  VIP Rally Access
                </h3>

                <p className="text-[#666]">
                  Front-row access to iconic Naivasha rally stages
                </p>
              </div>

            </div>

          </div>

          {/* PRICE + BUTTON */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">

            {/* PRICE */}
            <div>

              <p className="uppercase tracking-[0.25em] text-xs text-[#777] mb-2">
                Starting From
              </p>

              <h3
                className="text-5xl font-bold"
                style={{ color: "#c8a248" }}
              >
                $ 134
                <span className="text-lg text-[#777] font-normal ml-2">
                  / night
                </span>
              </h3>

            </div>

            {/* BUTTON */}
            <Link
              to="/tours"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white text-sm tracking-wide transition duration-300 hover:scale-105"
              style={{ backgroundColor: "#0b3d2e" }}
            >
              Book Your Spot
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
};

export default SafariRallySection;