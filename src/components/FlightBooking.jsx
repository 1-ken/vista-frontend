import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plane, Calendar, Users, ArrowRightLeft, Search, MapPin, AlertCircle } from 'lucide-react';

import api from '../api/axios';

const FlightBooking = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('round-trip');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'Economy',
    title: 'Mr.',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    nationality: '',
    email: '',
    countryCode: '+254',
    phoneNumber: ''
  });

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const validateStep1 = () => {
    if (!formData.from.trim()) return "Please enter origin city";
    if (!formData.to.trim()) return "Please enter destination";
    if (!formData.departureDate) return "Please select departure date";
    if (tripType === 'round-trip' && !formData.returnDate) return "Please select return date";
    
    const today = new Date().toISOString().split('T')[0];
    if (formData.departureDate < today) return "Departure date cannot be in the past";
    if (tripType === 'round-trip' && formData.returnDate < formData.departureDate) {
      return "Return date must be after departure date";
    }
    
    if (totalPassengers < 1) return "At least one passenger is required";
    return "";
  };

  const validateStep2 = () => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Please enter a valid email";
    if (!formData.phoneNumber.trim()) return "Phone number is required";
    if (!formData.dob) return "Date of birth is required";
    return "";
  };

  const handleNextStep = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSend = async () => {
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }
    
    setError('');
    setIsSending(true);
    
    try {
      await api.post('/bookings', {
        type: 'FLIGHT',
        guestName: `${formData.title} ${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: `${formData.countryCode}${formData.phoneNumber}`,
        fromDate: formData.departureDate,
        toDate: formData.returnDate || formData.departureDate,
        guestsCount: totalPassengers,
        totalPrice: 0,
        metadata: {
          from: formData.from,
          to: formData.to,
          tripType,
          passengers: formData.passengers,
          cabinClass: formData.cabinClass,
          dob: formData.dob,
          nationality: formData.nationality
        }
      });

      setIsSending(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setStep(1);
        setFormData({
          from: '',
          to: '',
          departureDate: '',
          returnDate: '',
          passengers: { adults: 1, children: 0, infants: 0 },
          cabinClass: 'Economy',
          title: 'Mr.',
          firstName: '',
          lastName: '',
          gender: 'Male',
          dob: '',
          nationality: '',
          email: '',
          countryCode: '+254',
          phoneNumber: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting flight request:', error);
      setIsSending(false);
      setError('Failed to submit request. Please try again.');
    }
  };

  const swapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handlePassengerChange = (type, increment) => {
    setFormData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(type === 'adults' ? 1 : 0, prev.passengers[type] + (increment ? 1 : -1))
      }
    }));
  };

  const totalPassengers = formData.passengers.adults + formData.passengers.children + formData.passengers.infants;

  const steps = [
    { id: 1, title: 'Flight Details', icon: Plane },
    { id: 2, title: 'Passenger Info', icon: Users }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/20"
        >
          {/* Header */}
          <div className="bg-[#002B2A] p-8 md:p-12 flex justify-between items-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-serif text-white">Book Your <span className="italic text-accent">Flight</span></h2>
              <p className="text-white/80 mt-4 max-w-md font-light">Experience seamless corporate travel arrangements with VistaVoyage premium services.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-full transition-all duration-500 absolute top-8 right-8 z-20 group"
            >
              <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-500" />
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          </div>

          <div className="p-8 md:p-12">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-12">
              {steps.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${
                      step >= s.id ? 'bg-accent text-white shadow-accent' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <s.icon size={20} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${
                      step >= s.id ? 'text-primary' : 'text-gray-400'
                    }`}>{s.title}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-24 h-[2px] bg-gray-100 mx-4 -mt-6 relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: step > 1 ? '100%' : '0%' }}
                        className="absolute inset-0 bg-accent"
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100"
                >
                  <AlertCircle size={18} />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key={isSubmitted ? 'success' : step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isSubmitted ? (
                <div className="py-20 text-center">
                  <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-10 text-accent">
                    <Plane size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-4xl font-serif text-[#1a1a1a] mb-6">Flight Request Received</h3>
                  <p className="text-[#1a1a1a] text-lg font-medium max-w-md mx-auto leading-relaxed">
                    Our team is processing your request for the flight from <span className="text-[#C5A358] font-bold">{formData.from}</span> to <span className="text-[#C5A358] font-bold">{formData.to}</span>. We'll contact you shortly.
                  </p>
                </div>
              ) : step === 1 ? (
                <>
                  {/* Trip Type Selector */}
                  <div className="flex gap-4 mb-10">
                    {['round-trip', 'one-way'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTripType(type)}
                        className={`px-8 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-500 ${
                          tripType === type 
                          ? 'bg-[#002B2A] text-white shadow-xl' 
                          : 'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200'
                        }`}
                      >
                        {type === 'round-trip' ? 'Round Trip' : 'One Way'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* From */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">From</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} />
                        <input
                          type="text"
                          name="from"
                          placeholder="Origin City"
                          value={formData.from}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 pl-14 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Swap Button (Desktop) */}
                    <div className="hidden lg:flex absolute left-[25%] top-[58%] -translate-x-1/2 z-10">
                      <button 
                        onClick={swapLocations}
                        className="w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all transform hover:rotate-180 duration-700 border border-gray-100"
                      >
                        <ArrowRightLeft size={18} />
                      </button>
                    </div>

                    {/* To */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">To</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} />
                        <input
                          type="text"
                          name="to"
                          placeholder="Destination"
                          value={formData.to}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 pl-14 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className={`${tripType === 'round-trip' ? 'lg:col-span-2' : 'lg:col-span-1'} grid grid-cols-2 gap-4`}>
                      <div className="relative">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Departure</label>
                        <div className="relative group">
                          <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} />
                          <input
                            type="date"
                            name="departureDate"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.departureDate}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 pl-14 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                          />
                        </div>
                      </div>
                      {tripType === 'round-trip' && (
                        <div className="relative">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Return</label>
                          <div className="relative group">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} />
                            <input
                              type="date"
                              name="returnDate"
                              min={formData.departureDate || new Date().toISOString().split('T')[0]}
                              value={formData.returnDate}
                              onChange={handleInputChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 pl-14 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
                    {/* Passengers */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Passengers</label>
                      <button
                        onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 pl-14 text-[#1a1a1a] text-left focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500 flex items-center"
                      >
                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} />
                        {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
                      </button>
                      
                      <AnimatePresence>
                        {showPassengerDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-4 p-8 bg-white rounded-3xl shadow-2xl z-50 border border-gray-100"
                          >
                            {Object.entries(formData.passengers).map(([type, count]) => (
                              <div key={type} className="flex justify-between items-center mb-6 last:mb-0">
                                <div>
                                  <p className="capitalize font-bold text-[#1a1a1a] text-sm">{type}</p>
                                  <p className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-widest">
                                    {type === 'adults' ? '12+ years' : type === 'children' ? '2-11 years' : 'Under 2 years'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-6">
                                  <button 
                                    onClick={() => handlePassengerChange(type, false)}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002B2A] hover:text-white transition-all duration-500 font-bold text-[#1a1a1a]"
                                  >-</button>
                                  <span className="w-4 text-center font-bold text-[#1a1a1a]">{count}</span>
                                  <button 
                                    onClick={() => handlePassengerChange(type, true)}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002B2A] hover:text-white transition-all duration-500 font-bold text-[#1a1a1a]"
                                  >+</button>
                                </div>
                              </div>
                            ))}
                            <button 
                              onClick={() => setShowPassengerDropdown(false)}
                              className="w-full mt-6 py-3 bg-[#002B2A] text-white rounded-xl text-xs uppercase tracking-widest font-bold"
                            >
                              Done
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Class */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Cabin Class</label>
                      <div className="relative group">
                        <select
                          name="cabinClass"
                          value={formData.cabinClass}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                        >
                          <option>Economy</option>
                          <option>Premium Economy</option>
                          <option>Business Class</option>
                          <option>First Class</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <button 
                      onClick={handleNextStep}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-lg group uppercase tracking-[0.2em] text-sm"
                    >
                      Continue to Passenger Details
                      <Search size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Title</label>
                      <select
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                      >
                        <option>Mr.</option>
                        <option>Mrs.</option>
                        <option>Ms.</option>
                        <option>Dr.</option>
                      </select>
                    </div>
                    
                    <div className="relative lg:col-span-1">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                      />
                    </div>

                    <div className="relative lg:col-span-1">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-3 ml-1">Phone Number</label>
                      <div className="flex gap-2">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-2xl py-4 px-3 text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                        >
                          <option value="+254">🇰🇪 +254</option>
                          <option value="+255">🇹🇿 +255</option>
                          <option value="+256">🇺🇬 +256</option>
                          <option value="+27">🇿🇦 +27</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+1">🇺🇸 +1</option>
                        </select>
                        <input
                          type="tel"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 pt-8">
                    <button 
                      onClick={handlePrevStep}
                      className="border border-gray-300 hover:border-[#002B2A] hover:bg-[#002B2A]/5 text-[#1a1a1a] font-bold py-4 px-8 rounded-2xl transition-all duration-500 flex-1 order-2 md:order-1 uppercase tracking-widest text-xs"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleSend}
                      disabled={isSending}
                      className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 flex-[2] order-1 md:order-2 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                    >
                      {isSending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Booking Request
                          <Plane size={16} className="text-white" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ChevronDown = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default FlightBooking;
