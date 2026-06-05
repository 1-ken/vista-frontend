import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

import nairobi from '../assets/Nairobi.jpg'

import api from '../api/axios';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  consultationType: 'Luxury Tours',
  message: ''
};

const AppointmentsPage = () => {
  const [formData, setFormData] = useState(initialFormData);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/bookings', {
        type: 'APPOINTMENT',
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        fromDate: formData.date,
        metadata: {
          time: formData.time,
          consultationType: formData.consultationType,
          message: formData.message
        },
        totalPrice: 35 // Discounted fee as mentioned in UI
      });
      
      setLoading(false);
      setFormData(initialFormData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Navbar />
      
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={nairobi} 
            alt="Office Consultation" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Reveal>
            <span className="text-accent text-[9px] uppercase tracking-ultra-wide font-bold mb-6 block">
              Personalized Planning
            </span>
            <h1 className="text-4xl md:text-7xl font-serif text-white mb-8">
              Book an Office <span className="italic text-accent">Consultation</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-start">
            <div className="lg:w-1/2">
              <Reveal>
                <h2 className="text-3xl md:text-5xl font-serif text-primary mb-10 leading-tight">
                  Expert Guidance for Your <span className="italic">Next Journey</span>
                </h2>
                <p className="text-primary/70 text-lg font-medium leading-relaxed mb-12">
                  Our luxury travel consultants are available for both in-person & online at our Nairobi office. We provide expert advice, itinerary customization, and comprehensive planning for both corporate and leisure travel.
                </p>
                
                <div className="space-y-10 mb-16">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-accent shrink-0">
                      <MapPin size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif mb-2 text-primary">Location</h4>
                      <p className="text-primary/60 text-sm font-medium">Applewood Adams, Ngong Rd, Nairobi. 9th floor, office 904B.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-accent shrink-0">
                      <Calendar size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif mb-2 text-primary">Availability</h4>
                      <p className="text-primary/60 text-sm font-medium">Monday – Friday: 8:30 AM – 5:30 PM</p>
                      <p className="text-primary/60 text-sm font-medium">Saturday: 9:00 AM – 1:00 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-accent p-8 bg-accent/5 rounded-3xl border border-accent/10 hover:border-dark-red transition-all duration-500">
                  <CheckCircle size={24} strokeWidth={1.5} className="shrink-0" />
                  <p className="text-sm font-bold leading-relaxed">
                    IMPORTANT NOTE: All our Office Consultation cost a Non-refundable but redeemable fee of $50!
                    
                    <br />

                    <span className="text-[#004B49]">
                      24-Hour Round-the-Clock Services Available at an Additional Cost.
                    </span>
                  </p>
                </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:w-1/2 w-full">
              <Reveal delay={0.2}>
                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-luxury border border-gray-50 hover:border-dark-red transition-all duration-500">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-10 text-accent">
                        <CheckCircle size={40} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-3xl font-serif text-primary mb-6">Request Confirmed</h3>
                      <p className="text-primary/70 text-base font-medium mb-10 leading-relaxed">
                        Your consultation request has been received. Our team will contact you shortly to confirm your preferred time slot and provide payment details for the consultation fee.
                      </p>
                      <button 
                        onClick={() => {
                          setFormData(initialFormData);
                          setSubmitted(false);
                        }}
                        className="btn-primary"
                      >
                        Book Another Session
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold uppercase tracking-widest">
                          {error}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-dark mb-3 block">Full Name</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-surface border-none px-6 py-4 text-xs focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-dark/40 font-bold rounded-2xl" 
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-dark mb-3 block">Email Address</label>
                          <input 
                            type="email" 
                            required
                            className="w-full bg-surface border-none px-6 py-4 text-xs focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-dark/40 font-bold rounded-2xl" 
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-dark mb-3 block">Phone Number</label>
                          <input 
                            type="tel" 
                            required
                            className="w-full bg-surface border-none px-6 py-4 text-xs focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-dark/40 font-bold rounded-2xl" 
                            placeholder="+254..."
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-dark mb-3 block">Consultation Topic</label>
                          <select 
                            className="w-full bg-surface border-none px-6 py-4 text-xs focus:ring-1 focus:ring-accent outline-none transition-all font-bold rounded-2xl appearance-none"
                            value={formData.consultationType}
                            onChange={(e) => setFormData({...formData, consultationType: e.target.value})}
                          >
                            <option>Luxury Tours</option>
                            <option>Corporate Travel</option>
                            <option>Event Planning</option>
                            <option>Visa & Documentation</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-dark mb-3 block">Preferred Date</label>
                          <input 
                            type="date" 
                            required
                            className="w-full bg-surface border-none px-6 py-4 text-xs focus:ring-1 focus:ring-accent outline-none transition-all font-bold rounded-2xl"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-dark mb-3 block">Preferred Time</label>
                          <input 
                            type="time" 
                            required
                            className="w-full bg-surface border-none px-6 py-4 text-xs focus:ring-1 focus:ring-accent outline-none transition-all font-bold rounded-2xl"
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-dark mb-3 block">Additional Details</label>
                        <textarea 
                          rows="4"
                          className="w-full bg-surface border-none px-6 py-4 text-xs focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-dark/40 font-bold rounded-2xl resize-none" 
                          placeholder="Tell us about your travel plans..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        ></textarea>
                      </div>

                      <button type="submit" disabled={loading} className="btn-primary w-full py-5! disabled:opacity-70 flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : 'Confirm Appointment Request'}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AppointmentsPage;
