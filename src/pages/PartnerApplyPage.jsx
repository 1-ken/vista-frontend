import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { Building2, Globe, Mail, Phone, Briefcase, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const PartnerApplyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    country: '',
    city: '',
    website: '',
    contactName: '',
    jobTitle: '',
    email: '',
    phone: '',
    yearsInOperation: '',
    licenseNumber: '',
    servicesOffered: [],
    targetMarkets: []
  });

  const businessTypes = [
    'Hotel', 'Airline', 'Tour Operator', 'Transport', 'Corporate Travel', 'Other'
  ];

  const services = [
    'Accommodation', 'Flight Booking', 'Guided Tours', 'Car Rental', 'Travel Insurance', 'Event Planning'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => {
      const current = prev[name];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter(item => item !== value) };
      }
      return { ...prev, [name]: [...current, value] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        window.scrollTo(0, 0);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <section className="pt-40 pb-20">
          <div className="container mx-auto px-6 text-center">
            <Reveal>
              <div className="max-w-2xl mx-auto bg-surface p-12 rounded-[3rem] shadow-sm">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="text-accent" size={40} />
                </div>
                <h2 className="text-4xl font-serif text-primary mb-6">Application Submitted!</h2>
                <p className="text-primary/60 mb-10 leading-relaxed">
                  Thank you for applying to become a partner with VistaVoyage. 
                  Our team will review your application and get back to you within 3-5 business days.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all"
                >
                  Return Home
                </button>
              </div>
            </Reveal>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-surface">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 text-center">Partner Application</h1>
              <p className="text-primary/60 text-center mb-12">Please fill out the form below. All fields marked with * are required.</p>
            </Reveal>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-primary/5 space-y-12">
              {/* Company Information */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
                  <Building2 className="text-accent" size={24} />
                  Company Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Company Name *</label>
                    <input 
                      required
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="e.g. Grand Luxury Hotels"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Business Type *</label>
                    <select 
                      required
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium appearance-none"
                    >
                      <option value="">Select Type</option>
                      {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Country *</label>
                    <input 
                      required
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="e.g. Kenya"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">City *</label>
                    <input 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="e.g. Nairobi"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Website (Optional)</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                      <input 
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="pt-8 border-t border-primary/5">
                <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
                  <Mail className="text-accent" size={24} />
                  Contact Person
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Full Name *</label>
                    <input 
                      required
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Job Title *</label>
                    <input 
                      required
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="Director of Operations"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Email *</label>
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                        placeholder="+254 700 000000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="pt-8 border-t border-primary/5">
                <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
                  <Briefcase className="text-accent" size={24} />
                  Business Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Years in Operation *</label>
                    <input 
                      required
                      type="number"
                      name="yearsInOperation"
                      value={formData.yearsInOperation}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">License / Reg Number *</label>
                    <input 
                      required
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                      placeholder="REG-123456"
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Services Offered</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {services.map(service => (
                      <label key={service} className="flex items-center gap-3 p-4 bg-surface rounded-2xl cursor-pointer hover:bg-accent/5 transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-primary/10 text-accent focus:ring-accent"
                          onChange={() => handleCheckboxChange('servicesOffered', service)}
                          checked={formData.servicesOffered.includes(service)}
                        />
                        <span className="text-sm font-medium text-primary/80">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-accent text-white rounded-[2rem] font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Partnership Application
                    <FileText size={24} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerApplyPage;
