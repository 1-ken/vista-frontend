import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tours as staticTours } from '../data/toursData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Info,
  ArrowRight,
  ShieldCheck,
  Star,
  Plus,
  Minus
} from 'lucide-react';

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    fromDate: '',
    toDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setBookingData(prev => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      }));
    }
  }, []);

  useEffect(() => {
    const fetchTour = async () => {
      const staticTour = staticTours.find(t => t.id === id);
      if (staticTour) {
        setTour(staticTour);
        setLoadingTour(false);
        return;
      }

      try {
        const response = await api.get(`/tours/${id}`);
        setTour(response.data);
      } catch (err) {
        console.error('Error fetching tour from API:', err);
      } finally {
        setLoadingTour(false);
      }
    };

    fetchTour();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (tour && bookingData.fromDate && bookingData.toDate) {
        try {
          const response = await api.get(`/bookings/price?tourId=${tour._id || tour.id}&fromDate=${bookingData.fromDate}&toDate=${bookingData.toDate}&adults=${bookingData.adults}&children=${bookingData.children}`);
          setTotalPrice(response.data.price);
        } catch (err) {
          console.error('Error fetching dynamic price:', err);
        }
      } else if (tour) {
        // Fallback to static calculation if dates aren't set
        const base = tour.price * (parseInt(bookingData.adults) + (parseInt(bookingData.children) * 0.75));
        setTotalPrice(Math.round(base));
      }
    };

    fetchPrice();
  }, [tour, bookingData.fromDate, bookingData.toDate, bookingData.adults, bookingData.children]);

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd';
    if (typeof image === 'string' && image.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.split('/api')[0] : 'http://localhost:5000';
      return `${baseUrl}${image}`;
    }
    return image;
  };

  if (loadingTour) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <h2 className="text-4xl font-serif text-primary mb-6">Package Not Found</h2>
        <p className="text-primary/60 mb-10 max-w-md">We couldn't find the itinerary you're looking for.</p>
        <Link to="/tours" className="btn-primary px-10 py-4 rounded-full">Explore Other Packages</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/bookings', {
        type: 'PACKAGE',
        tourId: tour._id || tour.id,
        guestName: bookingData.name,
        guestEmail: bookingData.email,
        guestPhone: bookingData.phone,
        fromDate: bookingData.fromDate,
        toDate: bookingData.toDate,
        guestsCount: parseInt(bookingData.adults) + parseInt(bookingData.children) + parseInt(bookingData.infants),
        totalPrice: totalPrice,
        metadata: {
          adults: bookingData.adults,
          children: bookingData.children,
          infants: bookingData.infants,
          message: bookingData.message
        }
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions & Exclusions' },
    { id: 'info', label: 'Important Info' }
  ];

  // Use real itinerary or fallback
  const itinerary = (tour.itinerary && tour.itinerary.length > 0) ? tour.itinerary : [
    { day: 1, title: 'Arrival & Welcome', description: 'Arrive at the destination and transfer to your luxury accommodation. Evening welcome dinner with a briefing on the upcoming adventure.' },
    { day: 2, title: 'Full Day Exploration', description: 'A comprehensive guided tour of the major attractions. Lunch provided at a scenic spot, followed by afternoon leisure or optional activities.' },
    { day: 3, title: 'Cultural Immersion', description: 'Visit local communities and experience the authentic lifestyle. Learn about traditional crafts and enjoy a local culinary experience.' },
    { day: 4, title: 'Nature & Wildlife', description: 'Early morning expedition to witness the natural beauty and wildlife of the region. Expert-led trek or safari drive.' },
    { day: 5, title: 'Departure', description: 'Last breakfast at the lodge, some time for final souvenir shopping, and transfer to the airport for your flight home.' }
  ].slice(0, parseInt(tour.duration) || 5);

  return (
    <div className="bg-[#FBFBFA] min-h-screen">
      <Navbar />
      
      {/* Dynamic Header */}
      <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <img 
          src={getImageUrl(tour.image)} 
          alt={tour.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="container mx-auto">
            <Reveal>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  {tour.tag || 'Exclusive'}
                </span>
                <div className="flex items-center text-white/80 gap-2 text-sm font-medium">
                  <MapPin size={16} className="text-accent" />
                  {tour.location}
                </div>
              </div>
              <h1 className="text-4xl md:text-7xl font-serif text-white mb-8 max-w-4xl leading-tight">
                {tour.title}
              </h1>
              <div className="flex flex-wrap gap-10 items-center">
                <div className="flex items-center text-white gap-3">
                  <Clock size={20} className="text-accent" />
                  <span className="text-lg font-medium">{tour.duration}</span>
                </div>
                <div className="flex items-center text-white gap-3">
                  <Users size={20} className="text-accent" />
                  <span className="text-lg font-medium">Group Size: 2-12</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20">
                  <span className="text-white/60 text-xs uppercase tracking-widest block mb-1">Starting from</span>
                  <span className="text-3xl font-serif text-white">KES {tour.price?.toLocaleString()}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Left Content Column */}
            <div className="lg:w-2/3">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-12 sticky top-24 bg-[#FBFBFA] z-40 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-6 text-xs uppercase tracking-widest font-bold transition-all duration-300 relative ${
                      activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 w-full h-1 bg-accent" 
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-12">
                      <div>
                        <h3 className="text-3xl font-serif text-primary mb-8">Experience Overview</h3>
                        <p className="text-primary/70 text-lg leading-relaxed mb-10 font-medium">
                          {tour.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                          <h4 className="font-serif text-xl text-primary mb-6 flex items-center gap-3">
                            <Star className="text-accent" size={20} />
                            Key Highlights
                          </h4>
                          <ul className="space-y-4">
                            {['Expert Local Guides', 'Luxury Transportation', 'Boutique Accommodations', 'Curated Dining'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-primary/60 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-accent" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                          <h4 className="font-serif text-xl text-primary mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-accent" size={20} />
                            Safe & Secure
                          </h4>
                          <ul className="space-y-4">
                            {['All Permits Included', '24/7 Support', 'Fully Insured', 'COVID Protocols'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-primary/60 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-accent" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'itinerary' && (
                    <div className="space-y-10">
                      <h3 className="text-3xl font-serif text-primary mb-8">Daily Itinerary</h3>
                      <div className="relative">
                        <div className="absolute left-8 top-0 h-full w-[2px] bg-gray-100"></div>
                        <div className="space-y-12">
                          {itinerary.map((day, idx) => (
                            <div key={idx} className="relative pl-24 group">
                              <div className="absolute left-0 top-0 w-16 h-16 bg-white border-2 border-accent text-accent rounded-2xl flex flex-col items-center justify-center font-bold shadow-lg shadow-accent/10 z-10 transition-transform group-hover:scale-110">
                                <span className="text-[10px] uppercase tracking-tighter">Day</span>
                                <span className="text-xl leading-none">{day.day || idx + 1}</span>
                              </div>
                              <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                                <h4 className="text-2xl font-serif text-primary mb-4">{day.title}</h4>
                                <p className="text-primary/60 text-base leading-relaxed font-medium">{day.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'inclusions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <h3 className="text-2xl font-serif text-primary flex items-center gap-3">
                          <CheckCircle2 className="text-green-500" />
                          What's Included
                        </h3>
                        <ul className="space-y-6">
                          {(tour.inclusions && tour.inclusions.length > 0 ? tour.inclusions : [
                            'Luxury Accommodation (Twin Sharing)',
                            'Gourmet Meals as per Itinerary',
                            'Professional English Speaking Guides',
                            'All Park Entrance Fees & Taxes',
                            'Bottled Water during the Journey',
                            'Emergency Medical Evacuation Cover'
                          ]).map((item, i) => (
                            <li key={i} className="flex items-start gap-4 text-primary/70 text-sm font-medium">
                              <span className="min-w-[8px] h-[8px] rounded-full bg-accent mt-1.5"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-8">
                        <h3 className="text-2xl font-serif text-primary flex items-center gap-3">
                          <XCircle className="text-red-400" />
                          What's Excluded
                        </h3>
                        <ul className="space-y-6">
                          {(tour.exclusions && tour.exclusions.length > 0 ? tour.exclusions : [
                            'International Flight Tickets',
                            'Travel Insurance',
                            'Personal Expenses & Tips',
                            'Visa Application Fees',
                            'Optional Activities not listed',
                            'Single Room Supplement'
                          ]).map((item, i) => (
                            <li key={i} className="flex items-start gap-4 text-primary/50 text-sm font-medium">
                              <span className="min-w-[8px] h-[8px] rounded-full bg-gray-300 mt-1.5"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'info' && (
                    <div className="space-y-12">
                      <h3 className="text-3xl font-serif text-primary">Essential Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-primary/5 border border-primary/5">
                          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mb-6">
                            <Info size={24} />
                          </div>
                          <h4 className="text-xl font-serif text-primary mb-4">Pack List</h4>
                          <p className="text-primary/60 text-sm font-medium leading-relaxed">
                            We recommend comfortable clothing, sturdy walking shoes, sunscreen, a hat, and a good camera. For safaris, neutral colored clothing is preferred.
                          </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-accent/5 border border-accent/5">
                          <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center mb-6">
                            <Calendar size={24} />
                          </div>
                          <h4 className="text-xl font-serif text-primary mb-4">Best Time to Visit</h4>
                          <p className="text-primary/60 text-sm font-medium leading-relaxed">
                            While this destination is beautiful year-round, the peak experience is during the dry season between June and October.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sticky Sidebar Booking Column */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-primary/5 overflow-hidden">
                  <div className="bg-primary p-10 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                      <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] border-[40px] border-white rounded-full"></div>
                    </div>
                    <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-black block mb-4">Luxury Travel Inquiry</span>
                    <h3 className="text-white text-3xl font-serif">Request a Quote</h3>
                  </div>

                  <div className="p-10">
                    {submitted ? (
                      <div className="text-center py-10">
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
                        >
                          <CheckCircle2 size={40} />
                        </motion.div>
                        <h4 className="text-2xl font-serif text-primary mb-4">Quote Request Received!</h4>
                        <p className="text-primary/60 text-sm font-medium mb-10">We've received your booking request. Our team will send your personalised quote within 24 hours.</p>
                        <button 
                          onClick={() => setSubmitted(false)} 
                          className="text-primary text-[10px] font-bold uppercase tracking-widest border-b-2 border-accent pb-1"
                        >
                          Submit Another Request
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest border border-red-100">
                            {error}
                          </div>
                        )}
                        
                        <div className="space-y-6">
                          <div className="relative group">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60 group-focus-within:text-accent transition-colors mb-2 block">Full Name</label>
                            <input 
                              type="text" 
                              required
                              className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-sm focus:border-accent outline-none transition-all" 
                              placeholder="Your full name"
                              value={bookingData.name}
                              onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 group-focus-within:text-accent mb-2 block">Email</label>
                              <input 
                                type="email" 
                                required
                                className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-sm focus:border-accent outline-none transition-all" 
                                placeholder="Email address"
                                value={bookingData.email}
                                onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                              />
                            </div>
                            <div className="relative group">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 group-focus-within:text-accent mb-2 block">Phone</label>
                              <input 
                                type="tel" 
                                required
                                className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-sm focus:border-accent outline-none transition-all" 
                                placeholder="Contact number"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="relative">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 block">Travel Dates</label>
                              <div className="flex items-center bg-transparent border-b-2 border-gray-100 py-3 text-xs font-medium text-primary">
                                <Calendar size={14} className="mr-2 text-accent" />
                                {bookingData.fromDate ? new Date(bookingData.fromDate).toLocaleDateString() : 'From'} 
                                <span className="mx-2 text-primary/20">—</span> 
                                {bookingData.toDate ? new Date(bookingData.toDate).toLocaleDateString() : 'To'}
                              </div>
                              <div className="flex gap-2 mt-4">
                                <input 
                                  type="date" 
                                  required
                                  className="w-full bg-transparent border-b border-gray-100 py-2 text-[10px] focus:border-accent outline-none"
                                  value={bookingData.fromDate}
                                  onChange={(e) => setBookingData({...bookingData, fromDate: e.target.value})}
                                />
                                <input 
                                  type="date" 
                                  required
                                  className="w-full bg-transparent border-b border-gray-100 py-2 text-[10px] focus:border-accent outline-none"
                                  value={bookingData.toDate}
                                  onChange={(e) => setBookingData({...bookingData, toDate: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="relative">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 block">Guests</label>
                              <div 
                                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-medium text-primary cursor-pointer hover:border-accent hover:shadow-sm transition-all group/guests"
                              >
                                <div className="flex items-center gap-3">
                                  <Users size={18} className="text-accent group-hover/guests:scale-110 transition-transform" />
                                  <div className="flex flex-col">
                                    <span className="text-[13px] text-primary font-bold">
                                      {parseInt(bookingData.adults) + parseInt(bookingData.children) + parseInt(bookingData.infants)} Guests
                                    </span>
                                    <span className="text-[10px] text-primary/40 uppercase tracking-tighter">
                                      {bookingData.adults}A · {bookingData.children}C · {bookingData.infants}I
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight size={14} className={`text-primary/30 transition-transform duration-300 ${showGuestDropdown ? 'rotate-90' : ''}`} />
                              </div>

                              <AnimatePresence>
                                {showGuestDropdown && (
                                  <>
                                    <motion.div 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      onClick={() => setShowGuestDropdown(false)}
                                      className="fixed inset-0 z-40 bg-black/5"
                                    />
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute bottom-full left-1/2 -translate-x-1/2 w-[280px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 z-50 mb-3 space-y-6 overflow-hidden"
                                    >
                                      <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-2">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/40">Select Travelers</h4>
                                        <Users size={14} className="text-accent/30" />
                                      </div>
                                      
                                      {[
                                        { id: 'adults', label: 'Adults', sub: 'Ages 12+', min: 1 },
                                        { id: 'children', label: 'Children', sub: 'Ages 2-12', min: 0 },
                                        { id: 'infants', label: 'Infants', sub: 'Under 2', min: 0 }
                                      ].map((type) => (
                                        <div key={type.id} className="flex items-center justify-between group/row">
                                          <div>
                                            <p className="text-[12px] font-bold text-primary group-hover/row:text-accent transition-colors">{type.label}</p>
                                            <p className="text-[10px] text-primary/40 font-medium">{type.sub}</p>
                                          </div>
                                          <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-full border border-gray-100">
                                            <button 
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setBookingData({...bookingData, [type.id]: Math.max(type.min, parseInt(bookingData[type.id]) - 1)});
                                              }}
                                              disabled={parseInt(bookingData[type.id]) <= type.min}
                                              className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary hover:bg-accent hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-primary transition-all active:scale-90"
                                            >
                                              <Minus size={12} strokeWidth={3} />
                                            </button>
                                            <span className="text-sm font-black w-5 text-center text-primary tabular-nums">{bookingData[type.id]}</span>
                                            <button 
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setBookingData({...bookingData, [type.id]: parseInt(bookingData[type.id]) + 1});
                                              }}
                                              className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all active:scale-90"
                                            >
                                              <Plus size={12} strokeWidth={3} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      <div className="pt-2 border-t border-gray-50">
                                        <button 
                                          type="button"
                                          onClick={() => setShowGuestDropdown(false)}
                                          className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
                                        >
                                          Apply Selection
                                        </button>
                                      </div>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <div className="flex justify-between items-end mb-8 px-2">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Starting From</span>
                            <span className="text-4xl font-serif text-primary">
                              KES {(totalPrice || 0).toLocaleString()}
                            </span>
                          </div>
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/95 text-white py-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 group disabled:opacity-70 shadow-xl shadow-primary/20"
                          >
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <span className="uppercase tracking-[0.2em] text-[10px] font-black">Request a Quote</span>
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                              </>
                            )}
                          </button>
                          <p className="text-center text-[9px] text-primary/40 uppercase tracking-widest font-bold mt-6">
                            * No payment required — our team will contact you within 24 hours
                          </p>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Extra Help Card */}
                <div className="mt-8 p-8 bg-accent/10 rounded-3xl border border-accent/20 flex items-center gap-6">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-primary font-bold text-sm">Need a Custom Tour?</h4>
                    <p className="text-primary/60 text-xs">Our experts can tailor-make this experience for you.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TourDetails;
