import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../api/axios';

const initialFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setFormData(initialFormData);
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2030&auto=format&fit=crop"
            alt="Contact VistaVoyage"
            className="w-full h-full object-cover"
          />
          {/* Stronger overlay for readability */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <Reveal>
            <span className="text-white/80 text-[11px] uppercase tracking-[0.6em] font-bold mb-8 block">
              OUR
            </span>

            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              CONTACTS
            </h1>

            <div className="w-px h-24 bg-[#C8A96A]/70 mx-auto mt-12"></div>
          </Reveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-24 items-start">

            {/* Contact Details */}
            <div className="lg:w-5/12 w-full">
              <Reveal>
                <div className="mb-16">
                  <h2 className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#C8A96A] mb-8">
                    VistaVoyage Group
                  </h2>

                  <p className="text-gray-600 text-lg leading-relaxed font-medium italic mb-12">
                    Our dedicated travel consultants are committed to providing you with exceptional service and personalized attention to every detail of your journey.
                  </p>
                </div>

                <div className="space-y-16">
                  {/* Address */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-ultra-wide font-bold text-gray-500">
                      Address
                    </span>

                    <div className="flex gap-6 items-start">
                      <div className="text-[#C8A96A] mt-1">
                        <MapPin size={20} strokeWidth={1.5} />
                      </div>

                      <p className="text-gray-900 font-bold text-lg leading-tight max-w-xs">
                        Applewood Adams, Ngong Road, Nairobi (9th floor, office 904B)
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-ultra-wide font-bold text-gray-500">
                      Reservation
                    </span>

                    <div className="flex gap-6 items-start">
                      <div className="text-[#C8A96A] mt-1">
                        <Phone size={20} strokeWidth={1.5} />
                      </div>

                      <div className="space-y-1">
                        <p className="text-gray-900 font-bold text-xl">
                          +254 790 644 745
                        </p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                          Available 24/7 for emergencies
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-ultra-wide font-bold text-gray-500">
                      Email Info
                    </span>

                    <div className="flex gap-6 items-start">
                      <div className="text-[#C8A96A] mt-1">
                        <Mail size={20} strokeWidth={1.5} />
                      </div>

                      <p className="text-gray-900 font-bold text-lg">
                        info@vistavoyagetravel.group
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:w-7/12 w-full lg:pl-16">
              <Reveal delay={0.2}>
                <div className="mb-16">
                  <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6 hover:text-[#C8A96A] transition-colors duration-500 cursor-default">
                    GET IN <span className="italic">TOUCH</span>
                  </h2>

                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                    Write us a message
                  </p>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-16 bg-white rounded-[2.5rem] border border-gray-200 text-center shadow-xl"
                  >
                    <div className="w-20 h-20 bg-[#C8A96A]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#C8A96A]">
                      <Send size={32} />
                    </div>

                    <h3 className="text-2xl font-serif text-gray-900 mb-4">
                      Message Sent Successfully
                    </h3>

                    <p className="text-gray-600 font-medium mb-10 leading-relaxed italic">
                      Thank you for reaching out. Our team will contact you shortly.
                    </p>

                    <button
                      onClick={() => {
                        setFormData(initialFormData);
                        setError('');
                        setSubmitted(false);
                      }}
                      className="text-[#C8A96A] font-bold uppercase tracking-widest text-[10px] border-b border-[#C8A96A]/30 pb-2 hover:border-[#C8A96A] transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-12">

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-xs font-semibold tracking-wide uppercase">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="border-b border-gray-300 py-4 focus-within:border-[#C8A96A]">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 block mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          className="w-full bg-transparent outline-none text-gray-900 font-semibold placeholder:text-gray-400"
                        />
                      </div>

                      <div className="border-b border-gray-300 py-4 focus-within:border-[#C8A96A]">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 block mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                          className="w-full bg-transparent outline-none text-gray-900 font-semibold placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="border-b border-gray-300 py-4 focus-within:border-[#C8A96A]">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 block mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Inquiry Topic"
                        className="w-full bg-transparent outline-none text-gray-900 font-semibold placeholder:text-gray-400"
                      />
                    </div>

                    <div className="border-b border-gray-300 py-4 focus-within:border-[#C8A96A]">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 block mb-2">
                        Message *
                      </label>
                      <textarea
                        rows="4"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full bg-transparent outline-none text-gray-900 font-semibold placeholder:text-gray-400 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary !px-16 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                      <Send size={14} />
                    </button>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="h-125 w-full relative">
          <iframe
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.81394200115!2d36.7788779114777!3d-1.2994958986835266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11ceca23f0f5%3A0x5b6a28559205140a!2sVistaVoyage%20Travel%20Group%20Ltd!5e0!3m2!1sen!2ske!4v1715243000000!5m2!1sen!2ske"
            className="w-full h-full contrast-125 brightness-90"
            style={{ border: 0 }}
            loading="lazy"
            title="VistaVoyage Location"
          ></iframe>

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10 -mt-32 pb-32">
          <Reveal>
            <span className="text-[10px] uppercase tracking-ultra-wide font-bold text-white/40">
              Reservation
            </span>

            <p className="text-4xl md:text-6xl font-serif text-[#C8A96A] tracking-tighter mb-4">
              +254 790 644 745
            </p>

            <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
              Call us anytime
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
