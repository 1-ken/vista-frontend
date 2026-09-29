import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Briefcase, Clock, ChevronRight, ArrowDown,
  Globe, TrendingUp, GraduationCap, Users, Leaf, Award,
  Heart, Search, Filter, X, Handshake
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSEO, ORGANIZATION_SCHEMA, buildBreadcrumbSchema } from '../utils/seo';

const CULTURE = [
  { icon: Globe,         title: 'Travel Opportunities',    desc: 'Explore Africa and beyond as part of your role. Familiarisation trips are a core part of our team culture.' },
  { icon: TrendingUp,    title: 'Career Growth',            desc: 'Clear progression paths, leadership programmes and internal promotions across all departments.' },
  { icon: GraduationCap, title: 'Professional Development', desc: 'Funded training, industry certifications, mentorship and access to global travel conferences.' },
  { icon: Handshake,     title: 'Inclusive Workplace',      desc: 'A diverse, welcoming team where every voice matters and every background is celebrated.' },
  { icon: Leaf,          title: 'Conservation Impact',      desc: 'Work that directly supports wildlife conservation and sustainable tourism across Africa.' },
  { icon: Award,         title: 'Competitive Benefits',     desc: 'Medical cover, performance bonuses, travel perks, flexible working and team retreats.' },
];

const DEPT_COLORS = {
  Sales:       { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  Operations:  { bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-400' },
  Marketing:   { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400' },
  Finance:     { bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-400' },
  HR:          { bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-400' },
  Technology:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-400' },
  default:     { bg: 'bg-slate-50',   text: 'text-slate-600',   dot: 'bg-slate-400' },
};



export default function CareersPage() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [deptFilter, setDept]   = useState('All');
  const [typeFilter, setType]   = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useSEO(
    'Careers at VistaVoyage | Travel Jobs in Nairobi, Kenya',
    'Join the VistaVoyage team — explore open positions in luxury travel, safari operations, sales, marketing and more. Build your career with Africa\'s premier travel company in Nairobi.',
    '/careers',
    undefined,
    [ORGANIZATION_SCHEMA, buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }])]
  );

  useEffect(() => {
    const load = () =>
      fetch('/api/careers/jobs?status=published')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => { setJobs(Array.isArray(d) ? d : []); setLoading(false); })
        .catch(() => { setJobs([]); setLoading(false); });

    load();
    const interval = setInterval(load, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const activeJobs = jobs.filter(j => !j.deadline || new Date(j.deadline) >= now);
  const departments = ['All', ...new Set(activeJobs.map(j => j.department).filter(Boolean))];
  const types = ['All', ...new Set(activeJobs.map(j => j.employmentType).filter(Boolean))];

  const filtered = activeJobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || j.department === deptFilter;
    const matchType = typeFilter === 'All' || j.employmentType === typeFilter;
    return matchSearch && matchDept && matchType;
  });

  const dc = (dept) => DEPT_COLORS[dept] || DEPT_COLORS.default;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80"
            alt="VistaVoyage team" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,61,46,0.93) 0%, rgba(11,61,46,0.78) 55%, rgba(0,0,0,0.55) 100%)' }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/20 border border-accent/30 rounded-full mb-8">
            <Heart size={13} className="text-accent" />
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">We're Hiring</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
            Build Your Career<br />
            <span className="text-accent italic">With VistaVoyage</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a passionate team creating unforgettable African travel experiences. Shape careers, inspire journeys, protect wildlife.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#positions"
              className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-accent/30">
              View Open Positions <ChevronRight size={16} />
            </a>
            <a href="#culture"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Learn About Our Culture <ArrowDown size={16} />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-sm mx-auto">
            {[['6+', 'Years']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-accent font-serif text-3xl font-bold">{n}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30">
          <ArrowDown size={24} />
        </motion.div>
      </section>

      {/* ── Culture ── */}
      <section id="culture" className="py-24 px-6 bg-[#f9f8f6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-xs uppercase tracking-[0.4em] font-bold mb-3">Life at VistaVoyage</p>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Why Join Our Team</h2>
            <p className="text-primary/50 max-w-xl mx-auto">More than a job — a mission to connect people with the wonders of Africa.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CULTURE.map((c, i) => (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-primary/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <c.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-primary text-lg mb-2">{c.title}</h3>
                <p className="text-primary/50 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual strip ── */}
      <div className="grid grid-cols-4 h-40 md:h-56 overflow-hidden">
        {[
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
          'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80',
        ].map((src, i) => (
          <div key={i} className="overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        ))}
      </div>

      {/* ── Open Positions ── */}
      <section id="positions" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent text-xs uppercase tracking-[0.4em] font-bold mb-3">Join Us</p>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Open Positions</h2>
            <p className="text-primary/50 max-w-xl mx-auto">Find your perfect role and become part of Africa's premier travel company.</p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
              <Search size={15} className="text-primary/30 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or department..."
                className="bg-transparent outline-none text-sm text-primary placeholder:text-primary/30 flex-1" />
              {search && <button onClick={() => setSearch('')}><X size={14} className="text-primary/30 hover:text-primary" /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'border-primary/15 text-primary/60 hover:border-primary/30'}`}>
              <Filter size={14} /> Filters {(deptFilter !== 'All' || typeFilter !== 'All') && <span className="w-2 h-2 bg-accent rounded-full" />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6">
                <div className="bg-primary/3 rounded-2xl p-5 flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Department</p>
                    <div className="flex flex-wrap gap-2">
                      {departments.map(d => (
                        <button key={d} onClick={() => setDept(d)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${deptFilter === d ? 'bg-primary text-white' : 'bg-white border border-primary/10 text-primary/50 hover:border-primary/30'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Type</p>
                    <div className="flex flex-wrap gap-2">
                      {types.map(t => (
                        <button key={t} onClick={() => setType(t)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${typeFilter === t ? 'bg-primary text-white' : 'bg-white border border-primary/10 text-primary/50 hover:border-primary/30'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <p className="text-xs text-primary/40 font-medium mb-6">
            {loading ? 'Loading...' : `${filtered.length} position${filtered.length !== 1 ? 's' : ''} found`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-52 bg-primary/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Briefcase size={48} className="mx-auto mb-4 text-primary/20" />
              {search || deptFilter !== 'All' || typeFilter !== 'All' ? (
                <>
                  <p className="text-primary/40 text-lg mb-2">No positions match your search.</p>
                  <button onClick={() => { setSearch(''); setDept('All'); setType('All'); }}
                    className="text-accent text-sm underline">Clear filters</button>
                </>
              ) : (
                <>
                  <p className="text-primary/50 text-lg font-medium mb-2">No open positions right now.</p>
                  <p className="text-primary/35 text-sm">Check back soon or send a speculative application below.</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((job, i) => {
                const c = dc(job.department);
                return (
                  <motion.div key={job._id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                    className="group bg-white border border-primary/8 rounded-2xl p-7 hover:shadow-xl hover:border-accent/20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="font-bold text-primary text-xl mb-2 group-hover:text-accent transition-colors leading-tight">{job.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${c.bg} ${c.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{job.department}
                        </span>
                      </div>
                      {job.deadline && (
                        <span className="text-xs text-primary/30 bg-primary/5 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                          Closes {new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-primary/40 mb-5">
                      {job.location && <span className="flex items-center gap-1.5"><MapPin size={13} />{job.location}</span>}
                      {job.employmentType && <span className="flex items-center gap-1.5"><Clock size={13} />{job.employmentType}</span>}
                      {job.experience && <span className="flex items-center gap-1.5"><Briefcase size={13} />{job.experience}</span>}
                      {job.salary && <span className="flex items-center gap-1.5 text-accent font-semibold">{job.salary}</span>}
                    </div>

                    {job.description && (
                      <p className="text-primary/50 text-sm leading-relaxed mb-6 line-clamp-2">{job.description}</p>
                    )}

                    <div className="flex gap-3">
                      <Link to={`/careers/${job._id}`}
                        className="flex-1 text-center border border-primary/15 text-primary/70 text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all">
                        View Details
                      </Link>
                      <Link to={`/careers/apply?jobId=${job._id}`}
                        className="flex-1 text-center bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-accent hover:text-primary transition-all">
                        Apply Now
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
