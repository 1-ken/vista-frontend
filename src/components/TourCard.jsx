import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import getImageUrl from '../utils/imageUrl';

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const tourId = tour?._id || tour?.id;

  if (!tourId) return null;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/travel/${tourId}`)}
      className="group cursor-pointer h-full"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          navigate(`/travel/${tourId}`);
        }
      }}
    >
      <div
        className="
          h-full
          flex
          flex-col
          overflow-hidden
          rounded-[32px]
          bg-white
          border border-[#D9C9A3]/30
          shadow-[0_12px_40px_rgba(0,0,0,0.08)]
          hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)]
          transition-all
          duration-500
        "
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden aspect-[4/5]">
          <motion.img
            src={getImageUrl(tour.image)}
            alt={tour.title}
            loading="lazy"
            decoding="async"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = getImageUrl(null); }}
          />

          {/* Luxury overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Discount Badge */}
          {tour.discount && (
            <div className="absolute top-4 left-4">
              <span className="bg-dark-red text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider shadow-lg">
                SAVE {tour.discount}%
              </span>
            </div>
          )}

          {/* Price */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <span className="text-lg font-bold text-[#004B49]">
                KES {Number(tour.price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="absolute bottom-5 left-5">
            <span className="text-white text-sm tracking-[0.2em] uppercase font-medium">
              {tour.location}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-grow p-5 md:p-6">
          {/* Duration + Rating */}
          <div className="flex items-center justify-between mb-5">
            <div className="bg-[#004B49]/10 px-4 py-2 rounded-full">
              <span className="text-sm font-bold text-[#004B49]">
                {tour.duration || 'Tour Package'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-sm ${
                    star <= (tour.rating || 5)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* TITLE (NOW ACCENT GOLD) */}
          <h3
            className="
              text-xl
              md:text-2xl
              lg:text-3xl
              font-serif
              text-accent
              leading-tight
              mb-4
              tracking-wide
            "
          >
            {tour.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-accent/100 text-sm md:text-base leading-relaxed mb-6 flex-grow">
            {tour.shortDescription ||
              'Experience carefully curated journeys, breathtaking destinations, and luxury travel experiences tailored for unforgettable memories.'}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between border-t border-black/5 pt-5">
            <span className="text-sm font-semibold text-[#004B49] tracking-wide">
              Explore Journey
            </span>

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-[#004B49]
                text-white
                flex
                items-center
                justify-center
                group-hover:translate-x-1
                transition-all
                duration-300
              "
            >
              →
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;