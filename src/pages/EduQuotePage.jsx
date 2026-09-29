import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, CheckCircle2, School, Users, Calendar, BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const PROGRAMS = [
  'South Africa Educational Experience',
  'Kenya Wildlife Conservation Program',
  'East Africa Debate Championship',
  'Tanzania Serengeti Migration Study',
  'Custom Program (describe below)',
];

const SUBJECTS = ['Geography', 'Biology', 'History', 'Environmental Science', 'English', 'Social Studies', 'Tourism Studies', 'Mathematics', 'Physics', 'Chemistry'];

const EduQuotePage = () => {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('program') || '';

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    schoolName: '', contactPerson: '', email: '', phone: '', county: '', country: 'Kenya',
    program: preselected ? PROGRAMS.find(p => p.toLowerCase().includes(preselected.split('-')[0])) || '' : '',
    studentCount: '', ageGroup: '', preferredDates: '', flexibleDates: false,
    subjects: [], budget: '', specialRequirements: '', message: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleSubject = (s) => set('subjects', form.subjects.includes(s)
    ? form.subjects.filter(x => x !== s)
    : [...form.subjects, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/edu/quote', form);
    } catch {}
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-serif text-primary mb-4">Quote Request Received</h2>
          <p className="text-primary/60 mb-8 leading-relaxed">
            Thank you, <strong>{form.contactPerson}</strong>. Our Education Travel Specialist will contact you within 24 hours with a detailed proposal for <strong>{form.schoolName}</strong>.
          </p>
          <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-primary/40 font-bold uppercase tracking-wider text-xs">School</span>
              <span className="text-primary font-semibold">{form.schoolName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary/40 font-bold uppercase tracking-wider text-xs">Program</span>
              <span className="text-primary font-semibold">{form.program || 'Custom'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary/40 font-bold uppercase tracking-wider text-xs">Students</span>
              <span className="text-primary font-semibold">{form.studentCount}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/educational-travel"
              className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
              Back to EduTravel
            </Link>
            <Link to="/educational-travel/portal"
              className="px-6 py-3 border border-primary/20 text-primary rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-primary/5 transition-all">
              Teacher Portal
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  const steps = [
    { n: 1, label: 'School Info' },
    { n: 2, label: 'Program' },
    { n: 3, label: 'Details' },
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <Link to="/educational-travel"
              className="inline-flex items-center gap-2 text-primary/40 hover:text-primary text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
              <ChevronLeft size={14} />EduTravel
            </Link>
            <h1 className="text-4xl font-serif text-primary mb-2">Request School Quotation</h1>
            <p className="text-primary/50">We'll prepare a detailed proposal tailored to your school's curriculum and budget.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= s.n ? 'bg-primary text-white' : 'bg-white border-2 border-gray-200 text-primary/30'
                  }`}>
                    {step > s.n ? <CheckCircle2 size={14} /> : s.n}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step >= s.n ? 'text-primary' : 'text-primary/30'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-all ${step > s.n ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

              {/* Step 1: School Info */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <School size={18} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-serif text-primary">School Information</h2>
                        <p className="text-xs text-primary/40">Tell us about your school</p>
                      </div>
                    </div>

                    {[
                      { key: 'schoolName', label: 'School Name', placeholder: 'e.g. Alliance High School', icon: School },
                      { key: 'contactPerson', label: 'Contact Person (Teacher/Principal)', placeholder: 'Full name', icon: Users },
                      { key: 'email', label: 'Email Address', placeholder: 'teacher@school.ac.ke', icon: Mail, type: 'email' },
                      { key: 'phone', label: 'Phone Number', placeholder: '+254 700 000 000', icon: Phone },
                      { key: 'county', label: 'County / Region', placeholder: 'e.g. Nairobi', icon: MapPin },
                    ].map(({ key, label, placeholder, icon: Icon, type = 'text' }) => (
                      <div key={key}>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                          <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                            placeholder={placeholder} required
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary placeholder:text-slate-300" />
                        </div>
                      </div>
                    ))}

                    <button type="button" onClick={() => setStep(2)}
                      className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all mt-4">
                      Continue →
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Program */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <BookOpen size={18} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-serif text-primary">Program Selection</h2>
                        <p className="text-xs text-primary/40">Choose your preferred program</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Preferred Program</label>
                      <select value={form.program} onChange={e => set('program', e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary">
                        <option value="">Select a program</option>
                        {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Subjects to Cover</label>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map(s => (
                          <button key={s} type="button" onClick={() => toggleSubject(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              form.subjects.includes(s) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                          <Users size={10} className="inline mr-1" />Number of Students
                        </label>
                        <input type="number" value={form.studentCount} onChange={e => set('studentCount', e.target.value)}
                          placeholder="e.g. 30" min="5" required
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Age Group</label>
                        <select value={form.ageGroup} onChange={e => set('ageGroup', e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary">
                          <option value="">Select</option>
                          <option>10–13 (Junior)</option>
                          <option>13–16 (Middle)</option>
                          <option>16–18 (Senior)</option>
                          <option>18+ (University)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex-1 py-4 border border-gray-200 text-primary/50 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                        ← Back
                      </button>
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                        Continue →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Calendar size={18} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-serif text-primary">Trip Details</h2>
                        <p className="text-xs text-primary/40">Dates, budget and special requirements</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Preferred Travel Dates</label>
                      <input type="text" value={form.preferredDates} onChange={e => set('preferredDates', e.target.value)}
                        placeholder="e.g. August 2026, Term 3"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary placeholder:text-slate-300" />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Budget Per Student (KES)</label>
                      <select value={form.budget} onChange={e => set('budget', e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary">
                        <option value="">Select budget range</option>
                        <option>Under KES 50,000</option>
                        <option>KES 50,000 – 100,000</option>
                        <option>KES 100,000 – 200,000</option>
                        <option>KES 200,000 – 300,000</option>
                        <option>Above KES 300,000</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Special Requirements</label>
                      <textarea value={form.specialRequirements} onChange={e => set('specialRequirements', e.target.value)}
                        rows={3} placeholder="Dietary requirements, accessibility needs, specific learning objectives..."
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary resize-none placeholder:text-slate-300" />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Additional Message</label>
                      <textarea value={form.message} onChange={e => set('message', e.target.value)}
                        rows={3} placeholder="Anything else you'd like us to know..."
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary resize-none placeholder:text-slate-300" />
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)}
                        className="flex-1 py-4 border border-gray-200 text-primary/50 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                        ← Back
                      </button>
                      <button type="submit" disabled={loading}
                        className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? 'Sending...' : <><Send size={14} />Submit Quote Request</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EduQuotePage;
