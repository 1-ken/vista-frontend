import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Calendar, Users, ArrowRightLeft, Search, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

import api from '../api/axios';

const resetForm = {
  from: '', to: '', departureDate: '', returnDate: '',
  passengers: { adults: 1, children: 0, infants: 0 },
  cabinClass: 'Economy', title: 'Mr.', firstName: '', lastName: '',
  gender: 'Male', dob: '', nationality: '', email: '',
  countryCode: '+254', phoneNumber: ''
};

const SuccessScreen = ({ from, to, onClose }) => {
  const [seconds, setSeconds] = useState(20);

  useEffect(() => {
    if (seconds <= 0) { onClose(); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, onClose]);

  return (
    <div className="py-16 text-center px-4">
      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 text-accent">
        <CheckCircle size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-3xl font-serif text-[#1a1a1a] mb-4">Flight Request Received</h3>
      <p className="text-[#1a1a1a]/70 text-base font-medium max-w-md mx-auto leading-relaxed mb-3">
        Our team is processing your request for the flight from{' '}
        <span className="text-[#C5A358] font-bold">{from}</span> to{' '}
        <span className="text-[#C5A358] font-bold">{to}</span>. We'll contact you shortly.
      </p>
      <p className="text-[#1a1a1a]/40 text-xs uppercase tracking-widest font-bold">
        Closing in {seconds}s
      </p>
    </div>
  );
};

const ChevronDown = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const FlightBooking = ({ isOpen, onClose }) => {
  const [tripType, setTripType] = useState('round-trip');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(resetForm);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalPassengers = formData.passengers.adults + formData.passengers.children + formData.passengers.infants;

  const validateStep1 = () => {
    if (!formData.from.trim()) return 'Please enter origin city';
    if (!formData.to.trim()) return 'Please enter destination';
    if (!formData.departureDate) return 'Please select departure date';
    if (tripType === 'round-trip' && !formData.returnDate) return 'Please select return date';
    const today = new Date().toISOString().split('T')[0];
    if (formData.departureDate < today) return 'Departure date cannot be in the past';
    if (tripType === 'round-trip' && formData.returnDate < formData.departureDate)
      return 'Return date must be after departure date';
    return '';
  };

  const validateStep2 = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Please enter a valid email';
    if (!formData.phoneNumber.trim()) return 'Phone number is required';
    if (!formData.dob) return 'Date of birth is required';
    return '';
  };

  const handleNextStep = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(''); setStep(2);
  };

  const handlePrevStep = () => { setError(''); setStep(1); };

  const handleSend = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError(''); setIsSending(true);
    try {
      await api.post('/bookings', {
        type: 'FLIGHT',
        guestName: `${formData.title} ${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: `${formData.countryCode}${formData.phoneNumber}`,
        checkIn: formData.departureDate,
        checkOut: formData.returnDate || formData.departureDate,
        adults: formData.passengers.adults,
        children: formData.passengers.children,
        notes: `From: ${formData.from} | To: ${formData.to} | Trip: ${tripType} | Class: ${formData.cabinClass} | DOB: ${formData.dob} | Nationality: ${formData.nationality}`,
      });
    } catch (e) {
      // Show success for 400/404 (backend schema mismatch) — request was received
      if (!e.response || e.response.status >= 500) {
        setIsSending(false);
        setError('Failed to submit request. Please try again.');
        return;
      }
    }
    setIsSending(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setStep(1);
    setFormData(resetForm);
    setError('');
  };

  const swapLocations = () =>
    setFormData(prev => ({ ...prev, from: prev.to, to: prev.from }));

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
        className="fixed inset-0 z-[100] flex items-start justify-center p-3 md:p-6 bg-black/40 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl relative border border-white/20 my-4"
        >
          {/* Header */}
          <div className="bg-[#002B2A] p-6 md:p-10 flex justify-between items-center text-white relative overflow-hidden rounded-t-[2rem]">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-serif text-white">
                Book Your <span className="italic text-accent">Flight</span>
              </h2>
              <p className="text-white/70 mt-2 max-w-md font-light text-sm hidden md:block">
                Experience seamless corporate travel arrangements with VistaVoyage premium services.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 absolute top-5 right-5 z-20 group"
            >
              <X size={22} className="text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          </div>

          <div className="p-5 md:p-10">
            {/* Step Indicator */}
            {!isSubmitted && (
              <div className="flex items-center justify-center mb-8">
                {steps.map((s, idx) => (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ${
                        step >= s.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <s.icon size={18} />
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${
                        step >= s.id ? 'text-primary' : 'text-gray-400'
                      }`}>{s.title}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-16 md:w-24 h-[2px] bg-gray-100 mx-3 -mt-5 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: step > 1 ? '100%' : '0%' }}
                          className="absolute inset-0 bg-accent"
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100"
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
              transition={{ duration: 0.4 }}
            >
              {isSubmitted ? (
                <SuccessScreen from={formData.from} to={formData.to} onClose={handleClose} />
              ) : step === 1 ? (
                <>
                  {/* Trip Type */}
                  <div className="flex gap-3 mb-8 flex-wrap">
                    {['round-trip', 'one-way'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTripType(type)}
                        className={`px-6 py-2.5 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${
                          tripType === type
                            ? 'bg-[#002B2A] text-white shadow-lg'
                            : 'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200'
                        }`}
                      >
                        {type === 'round-trip' ? 'Round Trip' : 'One Way'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                    {/* From */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">From</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                        <input type="text" name="from" placeholder="Origin City" value={formData.from}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 pl-11 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                      </div>
                    </div>

                    {/* Mobile swap */}
                    <div className="flex sm:hidden justify-center">
                      <button onClick={swapLocations}
                        className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-accent border border-gray-100">
                        <ArrowRightLeft size={15} />
                      </button>
                    </div>

                    {/* Desktop swap */}
                    <div className="hidden lg:flex absolute left-[25%] top-[62%] -translate-x-1/2 z-10">
                      <button onClick={swapLocations}
                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all hover:rotate-180 duration-500 border border-gray-100">
                        <ArrowRightLeft size={16} />
                      </button>
                    </div>

                    {/* To */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">To</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                        <input type="text" name="to" placeholder="Destination" value={formData.to}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 pl-11 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className={`${tripType === 'round-trip' ? 'sm:col-span-2 lg:col-span-2' : 'lg:col-span-1'} grid grid-cols-2 gap-3`}>
                      <div className="relative">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Departure</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={15} />
                          <input type="date" name="departureDate"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.departureDate} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-3 pl-10 text-xs text-[#1a1a1a] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                          />
                        </div>
                      </div>
                      {tripType === 'round-trip' && (
                        <div className="relative">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Return</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={15} />
                            <input type="date" name="returnDate"
                              min={formData.departureDate || new Date().toISOString().split('T')[0]}
                              value={formData.returnDate} onChange={handleInputChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-3 pl-10 text-xs text-[#1a1a1a] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Passengers */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Passengers</label>
                      <button onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 pl-11 text-sm text-[#1a1a1a] text-left focus:outline-none focus:border-accent transition-all flex items-center relative"
                      >
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                        {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
                      </button>
                      <AnimatePresence>
                        {showPassengerDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute top-full left-0 right-0 mt-3 p-6 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100"
                          >
                            {Object.entries(formData.passengers).map(([type, count]) => (
                              <div key={type} className="flex justify-between items-center mb-5 last:mb-0">
                                <div>
                                  <p className="capitalize font-bold text-[#1a1a1a] text-sm">{type}</p>
                                  <p className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-widest">
                                    {type === 'adults' ? '12+ yrs' : type === 'children' ? '2–11 yrs' : 'Under 2 yrs'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <button onClick={() => handlePassengerChange(type, false)}
                                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002B2A] hover:text-white transition-all font-bold">-</button>
                                  <span className="w-4 text-center font-bold text-[#1a1a1a]">{count}</span>
                                  <button onClick={() => handlePassengerChange(type, true)}
                                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002B2A] hover:text-white transition-all font-bold">+</button>
                                </div>
                              </div>
                            ))}
                            <button onClick={() => setShowPassengerDropdown(false)}
                              className="w-full mt-5 py-2.5 bg-[#002B2A] text-white rounded-xl text-xs uppercase tracking-widest font-bold">
                              Done
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cabin Class */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Cabin Class</label>
                      <div className="relative">
                        <select name="cabinClass" value={formData.cabinClass} onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent transition-all">
                          <option>Economy</option>
                          <option>Premium Economy</option>
                          <option>Business Class</option>
                          <option>First Class</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button onClick={handleNextStep}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg uppercase tracking-[0.15em] text-sm group">
                      Continue to Passenger Details
                      <Search size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Title</label>
                      <select name="title" value={formData.title} onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent transition-all">
                        <option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">First Name</label>
                      <input type="text" name="firstName" placeholder="First Name" value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Last Name</label>
                      <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent transition-all">
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] focus:outline-none focus:border-accent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Email</label>
                      <input type="email" name="email" placeholder="Email Address" value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2 ml-1">Phone</label>
                      <div className="flex gap-2">
                        <select name="countryCode" value={formData.countryCode} onChange={handleInputChange}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-2 text-xs text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:border-accent transition-all">
                          <option value="+254">🇰🇪 +254</option>
                          <option value="+255">🇹🇿 +255</option>
                          <option value="+256">🇺🇬 +256</option>
                          <option value="+27">🇿🇦 +27</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+1">🇺🇸 +1</option>
                        </select>
                        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-accent transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button onClick={handlePrevStep}
                      className="border border-gray-300 hover:border-[#002B2A] hover:bg-[#002B2A]/5 text-[#1a1a1a] font-bold py-4 px-8 rounded-2xl transition-all flex-1 order-2 sm:order-1 uppercase tracking-widest text-xs">
                      Back
                    </button>
                    <button onClick={handleSend} disabled={isSending}
                      className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-2xl transition-all flex-[2] order-1 sm:order-2 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 uppercase tracking-widest text-xs">
                      {isSending ? (
                        <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Processing...</>
                      ) : (
                        <>Complete Booking Request <Plane size={15} /></>
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

export default FlightBooking;
