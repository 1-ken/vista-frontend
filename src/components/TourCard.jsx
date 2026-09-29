import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowUpRight, Star } from 'lucide-react';
import getImageUrl from '../utils/imageUrl';

const getTourId = (tour) => {
  if (!tour) return '';

  // Prefer MongoDB _id when available.
  // Do NOT sanitize or modify the value returned by the API.
  if (tour._id) return String(tour._id);
  if (tour.id) return String(tour.id);

  return '';
};

const TourCard = ({ tour, featured = false, index = 0 }) => {
  const navigate = useNavigate();

  if (!tour) return null;

  const tourId = getTourId(tour);

  if (!tourId) return null;

  const path = `/travel/${encodeURIComponent(tourId)}`;

  const priceValue = Number(tour.price);
  const hasPrice = Number.isFinite(priceValue) && priceValue > 0;

  const price = hasPrice
    ? priceValue.toLocaleString()
    : '';

  const itinerary = Array.isArray(tour.itinerary)
    ? tour.itinerary
    : [];

  const nights =
    tour.nights ||
    (itinerary.length > 1 ? itinerary.length - 1 : null);

  const location =
    tour.destination ||
    tour.location ||
    '';

  const accommodationOptions = Array.isArray(tour.accommodationOptions)
    ? tour.accommodationOptions
    : Array.isArray(tour.accommodations)
      ? tour.accommodations
      : [];

  const accomCount = accommodationOptions.length;

  const openTour = () => {
    navigate(path);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        margin: '-60px',
      }}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={openTour}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openTour();
        }
      }}
      role="link"
      tabIndex={0}
      className={`group relative cursor-pointer ${
        featured ? 'md:col-span-2' : ''
      }`}
      aria-label={`View ${tour.title || 'tour package'}`}
    >
      {/* IMAGE */}
      <div
        className={`relative overflow-hidden rounded-[28px] ${
          featured ? 'h-[540px]' : 'h-[400px]'
        }`}
      >
        <img
          src={getImageUrl(tour.image)}
          alt={tour.title || 'VistaVoyage tour'}
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          onError={(e) => {
            const fallback = getImageUrl(null);

            if (e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            }
          }}
          className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        />

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none" />

        {/* TOP ROW */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-white text-[9px] font-black uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full shadow-lg ${
              tour.travelType === 'experience'
                ? 'bg-[#c8a248] text-black font-bold'
                : tour.travelType === 'worldwide'
                ? 'bg-neutral-800 border border-white/20'
                : 'bg-neutral-900 border border-white/20'
            }`}>
              {tour.travelType === 'experience'
                ? '01 · EXPERIENCE'
                : tour.travelType === 'worldwide'
                ? '03 · WORLDWIDE'
                : '02 · JOURNEY'}
            </span>

            {tour.tag && (
              <span className="bg-white/95 text-neutral-900 text-[9px] font-black uppercase tracking-[0.22em] px-3 py-1.5 rounded-full shadow-lg">
                {tour.tag}
              </span>
            )}
          </div>

          {hasPrice && (
            <div className="bg-black/50 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full">
              <span className="text-white text-xs font-bold">
                {tour.currency || 'USD'} {price}
              </span>

              <span className="text-white/50 text-[9px] ml-1">
                / person
              </span>
            </div>
          )}
        </div>

        {/* BOTTOM CONTENT */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* META */}
          <div className="flex items-center gap-3 mb-2.5">
            {location && (
              <span className="flex items-center gap-1.5 text-white/75 text-[11px] font-medium drop-shadow-sm">
                <MapPin
                  size={10}
                  className="text-[#c8a248]"
                />

                {location}
              </span>
            )}

            {tour.duration && (
              <>
                {location && (
                  <span className="w-px h-3 bg-white/20" />
                )}

                <span className="flex items-center gap-1.5 text-white/60 text-[11px] font-semibold drop-shadow-sm">
                  <Clock size={10} />
                  {tour.duration}
                </span>
              </>
            )}
          </div>

          {/* TITLE + ARROW */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3
                style={{ color: '#ffffff' }}
                className={`font-serif text-[#ffffff] leading-[1.12] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${
                  featured
                    ? 'text-3xl md:text-4xl'
                    : 'text-2xl'
                }`}
              >
                {tour.title || 'Untitled Tour'}
              </h3>
              {tour.subtitle && (
                <p
                  style={{ color: '#ffffff' }}
                  className="text-[#ffffff] text-xs font-serif italic line-clamp-1 mt-1 drop-shadow-sm"
                >
                  {tour.subtitle}
                </p>
              )}
            </div>

            <div
              className="
                flex-shrink-0
                w-11
                h-11
                rounded-full
                bg-white/10
                backdrop-blur-sm
                border
                border-white/20
                flex
                items-center
                justify-center
                transition-all
                duration-500
                group-hover:bg-[#c8a248]
                group-hover:border-[#c8a248]
                group-hover:scale-110
              "
            >
              <ArrowUpRight
                size={16}
                className="text-white"
              />
            </div>
          </div>

          {/* HOVER STATS */}
          <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-out">
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              {nights ? (
                <div>
                  <p className="text-white text-sm font-semibold leading-none">
                    {nights}
                  </p>

                  <p className="text-white/35 text-[9px] uppercase tracking-wider mt-0.5">
                    Nights
                  </p>
                </div>
              ) : null}

              {itinerary.length > 0 && (
                <>
                  {nights && (
                    <div className="w-px h-6 bg-white/10" />
                  )}

                  <div>
                    <p className="text-white text-sm font-semibold leading-none">
                      {itinerary.length}
                    </p>

                    <p className="text-white/35 text-[9px] uppercase tracking-wider mt-0.5">
                      Days
                    </p>
                  </div>
                </>
              )}

              {accomCount > 0 && (
                <>
                  {(nights || itinerary.length > 0) && (
                    <div className="w-px h-6 bg-white/10" />
                  )}

                  <div>
                    <p className="text-white text-sm font-semibold leading-none">
                      {accomCount}
                    </p>

                    <p className="text-white/35 text-[9px] uppercase tracking-wider mt-0.5">
                      Lodges
                    </p>
                  </div>
                </>
              )}

              <div className="ml-auto flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={9}
                    className="fill-[#c8a248] text-[#c8a248]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-1 pt-4 pb-1 flex items-center justify-between gap-4">
        <p className="text-black/40 text-sm leading-relaxed line-clamp-1 flex-1">
          {tour.description || ''}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openTour();
          }}
          className="
            flex-shrink-0
            text-[10px]
            font-black
            uppercase
            tracking-[0.25em]
            text-neutral-900
            hover:text-[#c8a248]
            transition-colors
            whitespace-nowrap
          "
        >
          {tour.travelType === 'experience' ? 'View Experience →' : 'View Journey →'}
        </button>
      </div>
    </motion.article>
  );
};

export default TourCard;