import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Compass } from 'lucide-react';

import { ChapterHero, ChapterGlance, ChapterExperience, ChapterHighlights, ChapterItinerary } from './TourDetails_p1';
import { ChapterAccommodations, ChapterInclusions, ChapterExperiencesDetail, ChapterTransport, ChapterTravelInfo, ChapterBooking } from './TourDetails_p2';
import { useSEO, buildTourSchema, buildBreadcrumbSchema } from '../utils/seo';
import { tours as fallbackTours } from '../data/toursData';

// ─── SEO wrapper ─────────────────────────────────────────────────────────────
function TourSEO({ tour }) {
  const slug = tour._id || tour.id || '';
  const destination = tour.location?.split(',')[0]?.trim() || 'Africa';
  const title = `${tour.title} | ${destination} Luxury Safari`;
  const description = (tour.description || '').slice(0, 160) ||
    `Book the ${tour.title} with VistaVoyage. ${tour.duration} luxury safari in ${destination}. Private guides, 5-star lodges, bespoke itinerary.`;

  useSEO(
    title,
    description,
    `/travel/${slug}`,
    typeof tour.image === 'string' && tour.image.startsWith('http') ? tour.image : undefined,
    [
      buildTourSchema(tour),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Tours', path: '/tours' },
        { name: tour.title, path: `/travel/${slug}` },
      ]),
    ]
  );
  return null;
}

// ─── Section nav bar ─────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'experience',     label: 'Overview' },
  { id: 'itinerary',      label: 'Itinerary' },
  { id: 'accommodation',  label: 'Accommodation' },
  { id: 'inclusions',     label: 'Inclusions' },
  { id: 'experiences',    label: 'Experiences' },
  { id: 'transport',      label: 'Transport' },
  { id: 'travel-info',    label: 'Travel Info' },
  { id: 'request',        label: 'Book' },
];

function SectionNav() {
  const [active, setActive] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
      const ids = NAV_SECTIONS.map(s => s.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(ids[i]); return;
        }
      }
      setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/8 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
        {NAV_SECTIONS.map(({ id, label }) => (
          <a key={id} href={`#${id}`}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
              active === id
                ? 'bg-primary text-white'
                : 'text-primary/40 hover:text-primary hover:bg-primary/5'
            }`}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Sticky request bar ───────────────────────────────────────────────────────
function StickyBar({ tour }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-6 py-3.5 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
      <div className="hidden sm:block">
        <p className="font-serif font-bold text-neutral-900 text-base truncate max-w-xs">{tour.title}</p>
        <p className="text-xs text-[#b88a24] font-semibold">{tour.duration} · {tour.currency || 'USD'} {Number(tour.price || 0).toLocaleString()} pp</p>
      </div>
      <div className="flex gap-3 ml-auto">
        <a href="#itinerary" className="border border-neutral-200 text-neutral-700 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-neutral-900 hover:text-neutral-900 transition-all">Itinerary</a>
        <a href="#request" className="bg-[#c8a248] text-neutral-950 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-all shadow-sm">Request Trip</a>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TourDetails() {
  const { id } = useParams();
  const [tour,    setTour]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError,   setBookingError]   = useState(null);
  const [bookingResult,  setBookingResult]  = useState(null);
  const [selectedAccom,  setSelectedAccom]  = useState(0);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);

    const load = async () => {
      if (!id) { setTour(null); setLoading(false); return; }
      try {
        const { data } = await api.get(`/tours/${id}`);
        setTour(data);
      } catch {
        const found = fallbackTours.find(t => t._id === id || t.id === id || t.slug === id);
        setTour(found || null);
      } finally {
        setLoading(false);
      }
      if (window.location.hash) {
        setTimeout(() => {
          const el = document.getElementById(window.location.hash.replace('#', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    };

    load();
  }, [id]);

  const handleBooking = async (form) => {
    setBookingLoading(true);
    setBookingError(null);
    try {
      const travelDate = form.month && form.year ? `${form.month} ${form.year}` : '';
      const { data } = await api.post('/bookings', {
        type:         'PACKAGE',
        tourId:       tour._id || tour.id,
        packageName:  tour.title,
        guestName:    `${form.firstName} ${form.lastName}`.trim(),
        guestEmail:   form.email,
        guestPhone:   form.phone,
        fromDate:     travelDate,
        guestsCount:  form.adults,
        children:     form.children,
        travelStyle:  form.style,
        accommodation:form.accommodation || '',
        message:      form.message,
        totalPrice:   form.estimatedTotal || tour.price || 0,
        currency:     tour.currency || 'USD',
      });
      setBookingResult(data);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary/30 text-sm">Preparing your journey...</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!tour) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6 text-center">
        <Navbar />
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
          <Compass size={28} className="text-accent/40" />
        </div>
        <h2 className="font-serif text-3xl text-primary mb-3">Journey Not Found</h2>
        <p className="text-primary/40 text-sm mb-8">This path has yet to be discovered.</p>
        <Link to="/tours" className="bg-primary text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all">
          Explore All Journeys
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f6]">
      <TourSEO tour={tour} />
      <Navbar />

      <SectionNav />
      <ChapterHero tour={tour} />
      <ChapterGlance tour={tour} />
      <div id="experience"><ChapterExperience tour={tour} /></div>
      <ChapterHighlights tour={tour} />
      <ChapterItinerary tour={tour} />
      {tour.nights > 0 && (
        <div id="accommodation"><ChapterAccommodations tour={tour} selectedAccom={selectedAccom} setSelectedAccom={setSelectedAccom} /></div>
      )}
      <div id="inclusions"><ChapterInclusions tour={tour} /></div>
      <ChapterExperiencesDetail tour={tour} />
      <ChapterTransport tour={tour} />
      <ChapterTravelInfo tour={tour} />
      <ChapterBooking
        tour={tour}
        onSubmit={handleBooking}
        loading={bookingLoading}
        error={bookingError}
        result={bookingResult}
        selectedAccom={selectedAccom}
      />

      <StickyBar tour={tour} />
      <Footer />
    </div>
  );
}
