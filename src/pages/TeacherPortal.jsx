import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Lock, Mail, ArrowRight, LogOut, Users, FileText,
  CreditCard, MessageSquare, CheckCircle2, Clock, AlertCircle,
  Upload, Download, Plus, ChevronRight, School, Calendar, BookOpen
} from 'lucide-react';
import Logo from '../components/Logo';

// ─── Mock data (replace with API calls) ──────────────────────────────────────
const MOCK_SCHOOL = {
  schoolName: 'Alliance High School',
  contactPerson: 'Mr. James Kariuki',
  email: 'jkariuki@alliancehigh.ac.ke',
  county: 'Kiambu',
  logo: null,
};

const MOCK_TRIPS = [
  {
    id: 1, program: 'South Africa Educational Experience', destination: 'Cape Town',
    dates: 'Aug 12–18, 2026', students: 28, status: 'confirmed',
    paid: 2800000, total: 5180000, coordinator: 'Grace Wanjiku',
  },
  {
    id: 2, program: 'Kenya Wildlife Conservation Program', destination: 'Maasai Mara',
    dates: 'Oct 5–9, 2026', students: 20, status: 'pending',
    paid: 0, total: 1900000, coordinator: 'Brian Ochieng',
  },
];

const MOCK_DOCS = [
  { name: 'Consent Form Template.pdf', type: 'template', date: '2025-06-01' },
  { name: 'Medical Form Template.pdf', type: 'template', date: '2025-06-01' },
  { name: 'South Africa Itinerary.pdf', type: 'itinerary', date: '2025-06-15' },
  { name: 'Invoice #INV-2025-089.pdf', type: 'invoice', date: '2025-06-20' },
];

// ─── Login ────────────────────────────────────────────────────────────────────
const PortalLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Demo: accept any @school email
    await new Promise(r => setTimeout(r, 800));
    if (form.email.includes('@') && form.password.length >= 6) {
      onLogin({ email: form.email, ...MOCK_SCHOOL });
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-luxury overflow-hidden flex flex-col md:flex-row border border-slate-100">

        {/* Left panel */}
        <div className="md:w-5/12 p-12 flex flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(195deg, #0b3d2e 0%, #072a1f 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20"
            style={{ background: '#c8a248' }} />
          <div className="relative z-10">
            <div className="mb-10 flex items-center justify-center">
              <Logo height={80} width={240} inverted />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full mb-6">
              <GraduationCap size={13} className="text-accent" />
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.25em]">EduTravel Portal</span>
            </div>
            <h2 className="text-3xl font-serif text-white mb-3 leading-tight">Teacher &<br />School Portal</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Manage your school's educational trips, student lists, documents, and payments in one place.
            </p>
            <div className="space-y-4">
              {[
                { icon: Users, text: 'Student Management' },
                { icon: FileText, text: 'Documents & Consent Forms' },
                { icon: CreditCard, text: 'Payment Tracking' },
                { icon: MessageSquare, text: 'Coordinator Messaging' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10"><Icon size={14} className="text-accent" /></div>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-white/60">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 pt-6 border-t border-white/10">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-black">VistaVoyage EduTravel</p>
          </div>
        </div>

        {/* Right: form */}
        <div className="md:w-7/12 p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-serif text-primary mb-1">School Sign In</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Access your school dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-2xl">
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">School Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="teacher@school.ac.ke" required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary placeholder:text-slate-300" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary placeholder:text-slate-300" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent hover:text-primary transition-all disabled:opacity-50 mt-2">
              {loading ? 'Signing in...' : 'Access Portal'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400">Don't have an account?{' '}
              <Link to="/educational-travel/quote" className="text-accent font-bold hover:underline">Request a Quote</Link>
              {' '}to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const PortalDashboard = ({ school, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const statusColor = (s) => ({
    confirmed: 'bg-emerald-50 text-emerald-600',
    pending:   'bg-amber-50 text-amber-600',
    completed: 'bg-primary/10 text-primary',
  }[s] || 'bg-slate-100 text-slate-500');

  const tabs = [
    { id: 'overview',  icon: School,    label: 'Overview' },
    { id: 'trips',     icon: Calendar,  label: 'Trips' },
    { id: 'students',  icon: Users,     label: 'Students' },
    { id: 'documents', icon: FileText,  label: 'Documents' },
    { id: 'payments',  icon: CreditCard,label: 'Payments' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo height={60} width={180} />
            <div className="hidden md:block w-px h-8 bg-gray-200" />
            <div className="hidden md:block">
              <p className="text-[10px] uppercase tracking-widest font-black text-primary/30">EduTravel Portal</p>
              <p className="text-sm font-bold text-primary">{school.schoolName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-primary">{school.contactPerson}</p>
              <p className="text-xs text-primary/40">{school.email}</p>
            </div>
            <button onClick={onLogout}
              className="p-2.5 text-primary/40 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto pb-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-primary/40 hover:text-primary'
              }`}>
              <tab.icon size={13} />{tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Upcoming Trips', value: MOCK_TRIPS.filter(t => t.status !== 'completed').length, icon: Calendar, color: '#0b3d2e' },
                { label: 'Total Students', value: MOCK_TRIPS.reduce((a, t) => a + t.students, 0), icon: Users, color: '#c8a248' },
                { label: 'Documents', value: MOCK_DOCS.length, icon: FileText, color: '#3b82f6' },
                { label: 'Pending Payments', value: MOCK_TRIPS.filter(t => t.paid < t.total).length, icon: CreditCard, color: '#f59e0b' },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="text-2xl font-serif text-primary">{value}</p>
                  <p className="text-[10px] uppercase tracking-widest font-black text-primary/30 mt-1">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Upcoming trips */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-serif text-primary">Upcoming Trips</h3>
                <button onClick={() => setActiveTab('trips')}
                  className="text-xs font-bold text-primary/40 hover:text-primary uppercase tracking-widest transition-colors">
                  View All →
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {MOCK_TRIPS.map(trip => (
                  <div key={trip.id} className="px-6 py-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-primary/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{trip.program}</p>
                      <p className="text-xs text-primary/40 mt-0.5">{trip.destination} • {trip.dates} • {trip.students} students</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Plus, label: 'Request New Trip', desc: 'Browse programs and request a quote', to: '/educational-travel/quote', color: 'bg-primary text-white' },
                { icon: Upload, label: 'Upload Documents', desc: 'Consent forms, medical info, passports', action: () => setActiveTab('documents'), color: 'bg-white border border-gray-100' },
                { icon: MessageSquare, label: 'Message Coordinator', desc: 'Contact your VistaVoyage coordinator', to: '/contact', color: 'bg-white border border-gray-100' },
              ].map(({ icon: Icon, label, desc, to, action, color }, i) => (
                <motion.div key={i} whileHover={{ y: -2 }}
                  className={`${color} rounded-3xl p-5 shadow-sm cursor-pointer`}
                  onClick={action || undefined}>
                  {to ? (
                    <Link to={to} className="block">
                      <Icon size={20} className={color.includes('bg-primary') ? 'text-accent mb-3' : 'text-primary/40 mb-3'} />
                      <p className={`text-sm font-bold mb-1 ${color.includes('bg-primary') ? 'text-white' : 'text-primary'}`}>{label}</p>
                      <p className={`text-xs ${color.includes('bg-primary') ? 'text-white/60' : 'text-primary/40'}`}>{desc}</p>
                    </Link>
                  ) : (
                    <>
                      <Icon size={20} className="text-primary/40 mb-3" />
                      <p className="text-sm font-bold text-primary mb-1">{label}</p>
                      <p className="text-xs text-primary/40">{desc}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Trips tab */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-serif text-primary">Your Trips</h2>
              <Link to="/educational-travel/quote"
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                <Plus size={13} />New Trip
              </Link>
            </div>
            {MOCK_TRIPS.map(trip => (
              <div key={trip.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-serif text-primary">{trip.program}</h3>
                    <p className="text-sm text-primary/50 mt-1">{trip.destination} • {trip.dates}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${statusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Students', value: trip.students },
                    { label: 'Coordinator', value: trip.coordinator },
                    { label: 'Paid', value: `KES ${trip.paid.toLocaleString()}` },
                    { label: 'Balance', value: `KES ${(trip.total - trip.paid).toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-2xl p-3">
                      <p className="text-[10px] uppercase tracking-widest font-black text-primary/30 mb-1">{label}</p>
                      <p className="text-sm font-bold text-primary">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(trip.paid / trip.total) * 100}%` }} />
                </div>
                <p className="text-xs text-primary/30 font-bold mt-1.5">
                  {Math.round((trip.paid / trip.total) * 100)}% paid
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Students tab */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-serif text-primary">Student Management</h2>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                <Upload size={13} />Upload Student List
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-primary/30" />
              </div>
              <h3 className="text-lg font-serif text-primary mb-2">Upload Your Student List</h3>
              <p className="text-sm text-primary/50 mb-6 max-w-sm mx-auto">
                Upload a CSV or Excel file with student names, parent contacts, medical information, passport numbers, and dietary requirements.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                  <Upload size={13} />Upload CSV / Excel
                </button>
                <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-primary/50 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                  <Download size={13} />Download Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-serif text-primary">Documents</h2>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                <Upload size={13} />Upload Document
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {MOCK_DOCS.map((doc, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-primary/[0.02] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-primary/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{doc.name}</p>
                      <p className="text-xs text-primary/30 mt-0.5 capitalize">{doc.type} • {doc.date}</p>
                    </div>
                    <button className="p-2 hover:bg-primary/5 rounded-xl transition-all text-primary/40 hover:text-primary">
                      <Download size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payments tab */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-primary mb-2">Payment Tracking</h2>
            {MOCK_TRIPS.map(trip => (
              <div key={trip.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-serif text-primary">{trip.program}</h3>
                    <p className="text-xs text-primary/40 mt-0.5">{trip.students} students</p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                    trip.paid >= trip.total ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {trip.paid >= trip.total ? 'Fully Paid' : 'Balance Due'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-2xl p-3 text-center">
                    <p className="text-xs font-black text-primary/30 uppercase tracking-wider mb-1">Total</p>
                    <p className="text-sm font-bold text-primary">KES {trip.total.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">Paid</p>
                    <p className="text-sm font-bold text-emerald-600">KES {trip.paid.toLocaleString()}</p>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-3 text-center">
                    <p className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">Balance</p>
                    <p className="text-sm font-bold text-amber-600">KES {(trip.total - trip.paid).toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(trip.paid / trip.total) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-emerald-500 rounded-full" />
                </div>
                {trip.paid < trip.total && (
                  <button className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                    <CreditCard size={13} />Make Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
const TeacherPortal = () => {
  const [school, setSchool] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('eduPortal')); } catch { return null; }
  });

  const handleLogin = (data) => {
    sessionStorage.setItem('eduPortal', JSON.stringify(data));
    setSchool(data);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('eduPortal');
    setSchool(null);
  };

  if (!school) return <PortalLogin onLogin={handleLogin} />;
  return <PortalDashboard school={school} onLogout={handleLogout} />;
};

export default TeacherPortal;
