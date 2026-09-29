import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Calendar, ChevronLeft, CheckCircle, ArrowRight, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CareerJobDetail() {
  const { slug } = useParams();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    // slug can be a MongoDB _id or a slugified title
    fetch(`/api/careers/jobs/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setJob(d); setLoading(false); })
      .catch(() => { setJob(null); setLoading(false); });
  }, [slug]);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-primary/50 text-lg">Job not found.</p>
      <Link to="/careers" className="text-accent underline">Back to Careers</Link>
    </div>
  );

  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/careers" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <ChevronLeft size={16} /> Back to Careers
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold">{job.department}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-white mt-2 mb-6">{job.title}</h1>
            <div className="flex flex-wrap gap-5 text-white/50 text-sm">
              {job.location      && <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>}
              {job.employmentType && <span className="flex items-center gap-1.5"><Clock size={14} />{job.employmentType}</span>}
              {job.experience    && <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.experience}</span>}
              {job.salary        && <span className="flex items-center gap-1.5 text-accent font-semibold">{job.salary}</span>}
              {job.deadline      && (
                <span className={`flex items-center gap-1.5 ${isExpired ? 'text-red-400' : ''}`}>
                  <Calendar size={14} />
                  {isExpired ? 'Applications Closed' : `Deadline: ${new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {job.description && (
              <Section title="About the Role">
                <p className="text-primary/60 leading-relaxed">{job.description}</p>
              </Section>
            )}
            {job.responsibilities?.length > 0 && (
              <Section title="Key Responsibilities">
                <ul className="space-y-3">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-primary/60 text-sm leading-relaxed">
                      <CheckCircle size={15} className="text-accent mt-0.5 flex-shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {job.requirements?.length > 0 && (
              <Section title="Requirements">
                <ul className="space-y-3">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-primary/60 text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {job.qualifications?.length > 0 && (
              <Section title="Qualifications">
                <ul className="space-y-3">
                  {job.qualifications.map((q, i) => (
                    <li key={i} className="flex items-start gap-3 text-primary/60 text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-2 flex-shrink-0" />{q}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {job.benefits?.length > 0 && (
              <Section title="Benefits & Perks">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-accent/5 border border-accent/10 rounded-xl px-4 py-3 text-sm text-primary/70">
                      <CheckCircle size={14} className="text-accent flex-shrink-0" />{b}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <div className="bg-white rounded-2xl border border-primary/8 p-6 shadow-sm">
                <h3 className="font-bold text-primary mb-5 pb-4 border-b border-primary/5">Job Summary</h3>
                <div className="space-y-3 text-sm mb-6">
                  {[
                    ['Department',   job.department],
                    ['Location',     job.location],
                    ['Type',         job.employmentType],
                    ['Experience',   job.experience],
                    ['Salary',       job.salary],
                    ['Deadline',     job.deadline ? new Date(job.deadline).toLocaleDateString('en-GB') : null],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-primary/40">{k}</span>
                      <span className="text-primary font-semibold text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                </div>

                {isExpired ? (
                  <div className="w-full text-center bg-red-50 text-red-500 py-3 rounded-xl text-sm font-semibold">
                    Applications Closed
                  </div>
                ) : (
                  <Link to={`/careers/apply?jobId=${job._id}`}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-accent hover:text-primary transition-all">
                    Apply Now <ArrowRight size={16} />
                  </Link>
                )}

                <button onClick={share}
                  className="w-full flex items-center justify-center gap-2 mt-3 border border-primary/10 text-primary/50 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/5 transition-all">
                  <Share2 size={14} />{copied ? 'Link Copied!' : 'Share This Job'}
                </button>

                <p className="text-center text-xs text-primary/30 mt-4">
                  Questions? <a href="mailto:hr@vistavoyagetravel.group" className="text-accent hover:underline">hr@vistavoyagetravel.group</a>
                </p>
              </div>

              {/* Similar jobs hint */}
              <div className="bg-accent/5 border border-accent/15 rounded-2xl p-5">
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">Also Hiring</p>
                <Link to="/careers" className="text-sm text-primary font-medium hover:text-accent transition-colors flex items-center gap-1">
                  View all open positions <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-primary/5 shadow-sm">
      <h2 className="font-bold text-primary text-lg mb-5 pb-4 border-b border-primary/5">{title}</h2>
      {children}
    </div>
  );
}
