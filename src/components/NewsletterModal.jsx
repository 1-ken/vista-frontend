import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from 'lucide-react';

const NewsletterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    email: '',
    updates: false,
    terms: false,
    captcha: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.captcha) {
      alert("Please confirm you are not a robot.");
      return;
    }
    console.log('Newsletter subscription:', formData);
    // Add logic here
    onClose();
  };

  const locations = [
    "United States", "United Kingdom", "Ireland", "Australia", 
    "Kenya", "South Africa", "Canada", "Germany", "France", "Other"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 hover:bg-black/5 rounded-full transition-colors group"
            >
              <X size={24} className="text-gray-400 group-hover:text-black transition-colors" />
            </button>

            {/* CONTENT */}
            <div className="p-8 md:p-12 w-full">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 tracking-tight">
                  Get the latest <span className="italic text-[#7A0C0C]">from VistaVoyage</span>
                </h2>
                <p className="text-gray-500 font-sans max-w-md mx-auto leading-relaxed">
                  Sign up to receive luxury travel news, guides and exclusive experiences.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7A0C0C] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7A0C0C] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Location</label>
                    <div className="relative">
                      <select
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-[#7A0C0C] transition-all cursor-pointer"
                      >
                        <option value="" disabled>Select your location</option>
                        {locations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7A0C0C] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setFormData(p => ({...p, updates: !p.updates}))}>
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.updates ? 'bg-[#7A0C0C] border-[#7A0C0C]' : 'border-gray-300 group-hover:border-[#7A0C0C]'}`}>
                      {formData.updates && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-xs text-gray-500 leading-tight">I would like to receive email updates from VistaVoyage</span>
                  </div>

                  <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setFormData(p => ({...p, terms: !p.terms}))}>
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.terms ? 'bg-[#7A0C0C] border-[#7A0C0C]' : 'border-gray-300 group-hover:border-[#7A0C0C]'}`}>
                      {formData.terms && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-xs text-gray-500 leading-tight">I confirm I have read and accepted the Terms and Conditions</span>
                  </div>
                </div>

                {/* FAKE CAPTCHA */}
                <div 
                  className="bg-gray-50 border border-gray-200 rounded p-4 flex items-center justify-between cursor-pointer group"
                  onClick={() => setFormData(p => ({...p, captcha: !p.captcha}))}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center ${formData.captcha ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                      {formData.captcha && <Check size={16} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-600">I'm not a robot</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8" />
                    <span className="text-[8px] text-gray-400 mt-1">reCAPTCHA</span>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#5A0909" }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-[#7A0C0C] text-white font-bold uppercase tracking-[0.3em] px-16 py-4 rounded shadow-lg transition-colors"
                  >
                    JOIN
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
