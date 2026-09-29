import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertCircle, ChevronLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Full pipeline in order
const PIPELINE = [
  { key: 'submitted',    label: 'Submitted',     desc: 'Your application has been received.' },
  { key: 'screening',    label: 'Screening',      desc: 'Your application is being reviewed against our requirements.' },
  { key: 'under_review', label: 'Under Review',   desc: 'Our HR team is reviewing your full application.' },
  { key: 'shortlisted',  label: 'Shortlisted',    desc: 'You have been shortlisted for further consideration.' },
  { key: 'interview',    label: 'Interview',      desc: 'You have been invited for an interview.' },
  { key: 'final_review', label: 'Final Review',   desc: 'Your application is in the final review stage.' },
  { key: 'selected',     label: 'Selected',       desc: 'Congratulations — you have been selected!' },
];

// Statuses that are terminal non-positive
const TERMINAL_NEGATIVE = ['not_selected', 'received'];

function getStepIndex(status) {
  const idx = PIPELINE.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
}

const SCREENING_LABELS = {
  qualified:                  { label: 'Qualified',                  color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  below_minimum_experience:   { label: 'Below Minimum Experience',   color: 'text-amber-600 bg-amber-50 border-amber-200' },
  incomplete_documents:       { label: 'Incomplete Documents',       color: 'text-orange-600 bg-orange-50 border-orange-200' },
  pending:                    { label: 'Pending Screening',          color: 'text-blue-600 bg-blue-50 border-blue-200' },
};

export default function ApplicationStatusPage() {
  const [ref,    setRef]    = useState('');
  const [email,  setEmail]  = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,  setError]  = useState('');

  const lookup = async (e) => {
    e.preventDefault();
    if (!ref.trim() || !email.trim()) { setError('Please enter both your reference number and email.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`/api/careers/applications/status?ref=${encodeURIComponent(ref.trim())}&email=${encodeURIComponent(email.trim())}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || 'Not found');
      setResult(d);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = result ? getStepIndex(result.status) : -1;
  const isNotSelected = result?.status === 'not_selected';
  const isReceived    = result?.status === 'received'; // saved but not qualified

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      <Navbar />

      <div className="bg-primary pt-32 pb-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Link to="/careers" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <ChevronLeft size={14} /> Back to Careers
          </Link>
          <p className="text-accent text-xs uppercase tracking-[0.4em] font-bold mb-3">Track Your Application</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Application Status</h1>
          <p className="text-white/50 max-w-md mx-auto text-sm leading-relaxed">
            Enter your application reference number and email address to check the status of your application.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12">

        {/* Lookup form */}
        <div className="bg-white rounded-2xl border border-primary/8 shadow-sm p-8 mb-8">
          <form onSubmit={lookup} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">
                Application Reference
              </label>
              <input
                value={ref}
                onChange={e => setRef(e.target.value.toUpperCase())}
                placeholder="VV-CAREERS-2026-00482"
                className={INPUT}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={INPUT}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={15} className="flex-shrink-0" />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-accent hover:text-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking...</>
                : <><Search size={15} /> Check Status</>}
            </button>
          </form>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-5">

              {/* Header card */}
              <div className="bg-white rounded-2xl border border-primary/8 shadow-sm p-7">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-wider mb-1">Position</p>
                    <h2 className="font-serif text-xl text-primary">{result.position}</h2>
                    {result.department && <p className="text-sm text-primary/50 mt-0.5">{result.department}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-wider mb-1">Reference</p>
                    <p className="text-sm font-bold text-accent font-mono">{result.applicationRef}</p>
                  </div>
                </div>

                {/* Screening badge */}
                {result.screeningResult && SCREENING_LABELS[result.screeningResult] && (
                  <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${SCREENING_LABELS[result.screeningResult].color}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {SCREENING_LABELS[result.screeningResult].label}
                  </div>
                )}

                <p className="text-xs text-primary/30 mt-4">
                  Submitted {new Date(result.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Not selected */}
              {isNotSelected ? (
                <div className="bg-white rounded-2xl border border-primary/8 shadow-sm p-7 text-center">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={24} className="text-red-400" />
                  </div>
                  <h3 className="font-serif text-xl text-primary mb-2">Application Unsuccessful</h3>
                  <p className="text-primary/50 text-sm leading-relaxed max-w-sm mx-auto">
                    Thank you for your interest in joining VistaVoyage. Unfortunately, your application was not successful at this time. We encourage you to apply for future openings.
                  </p>
                  <Link to="/careers" className="inline-flex items-center gap-2 mt-6 text-accent text-sm font-semibold hover:underline">
                    View Open Positions <ArrowRight size={14} />
                  </Link>
                </div>
              ) : isReceived ? (
                /* Saved but below requirements */
                <div className="bg-white rounded-2xl border border-primary/8 shadow-sm p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Application Received</h3>
                      <p className="text-primary/50 text-sm leading-relaxed">
                        Your application has been saved. It did not meet all the minimum requirements for this role at this time. Our team may still review it at their discretion.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pipeline tracker */
                <div className="bg-white rounded-2xl border border-primary/8 shadow-sm p-7">
                  <h3 className="font-bold text-primary text-sm mb-6">Application Progress</h3>
                  <div className="space-y-0">
                    {PIPELINE.map((step, i) => {
                      const done    = i < currentStep;
                      const active  = i === currentStep;
                      const pending = i > currentStep;

                      // Find history entry for this step
                      const histEntry = result.statusHistory?.find(h => h.status === step.key);

                      return (
                        <div key={step.key} className="flex gap-4">
                          {/* Timeline */}
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              done   ? 'bg-emerald-500'  :
                              active ? 'bg-primary ring-4 ring-primary/20' :
                                       'bg-gray-100'
                            }`}>
                              {done ? (
                                <CheckCircle size={16} className="text-white" />
                              ) : active ? (
                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                              )}
                            </div>
                            {i < PIPELINE.length - 1 && (
                              <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${done ? 'bg-emerald-300' : 'bg-gray-100'}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className={`pb-6 flex-1 ${i === PIPELINE.length - 1 ? 'pb-0' : ''}`}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className={`text-sm font-bold ${
                                done ? 'text-emerald-600' : active ? 'text-primary' : 'text-primary/30'
                              }`}>{step.label}</p>
                              {active && (
                                <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className={`text-xs leading-relaxed ${
                              pending ? 'text-primary/25' : 'text-primary/50'
                            }`}>
                              {active ? step.desc : done ? step.desc : '—'}
                            </p>
                            {histEntry?.timestamp && (
                              <p className="text-[10px] text-primary/30 mt-1">
                                {new Date(histEntry.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer note */}
              <p className="text-center text-xs text-primary/30 pb-4">
                Questions? Contact us at{' '}
                <a href="mailto:hr@vistavoyagetravel.group" className="text-accent hover:underline">
                  hr@vistavoyagetravel.group
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

const INPUT = 'w-full bg-primary/[0.03] border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all font-mono tracking-wide';
