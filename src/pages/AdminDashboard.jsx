import React, { useState, useEffect } from 'react';
import AdminLayout        from '../components/Admin/AdminLayout';
import DashboardHome      from '../components/Admin/DashboardHome';
import BillingView        from '../components/Admin/BillingView';
import ToursManagement    from '../components/Admin/ToursManagement';
import BookingsManagement from '../components/Admin/BookingsManagement';
import MessagesView       from '../components/Admin/MessagesView';
import PackagesImport     from '../components/Admin/PackagesImport';
import { Lock, User, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// ── Login Gate ────────────────────────────────────────────────────────────────
const LoginGate = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/auth/login', {
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem('admin', JSON.stringify(data));
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">

        {/* Left branding */}
        <div className="md:w-5/12 p-12 text-white flex flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(195deg, #42424a, #191919)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          <div className="relative z-10">
            <Link to="/" className="flex items-center mb-16 h-28 overflow-hidden">
              <Logo height={110} width={350} inverted className="transform -translate-x-4" />
            </Link>
            <h2 className="text-4xl font-serif mb-6 leading-tight">Executive <br />Terminal Access</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
              Welcome to the VistaVoyage global management portal.
            </p>
            <div className="space-y-6">
              {[
                { icon: Globe,       text: 'Global Fleet Management' },
                { icon: ShieldCheck, text: 'Secure Data Protocol'    },
                { icon: User,        text: 'Staff Portal Access'      },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <item.icon size={18} className="text-yellow-400" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 pt-12 border-t border-white/10">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black">System Version 4.2.0 • 2026</p>
          </div>
        </div>

        {/* Right form */}
        <div className="md:w-7/12 p-12 md:p-20 bg-white">
          <div className="mb-12">
            <h3 className="text-2xl font-serif text-slate-900 mb-2">Admin Portal</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Enter credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold uppercase tracking-widest px-5 py-4 rounded-2xl">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3 ml-1 group-focus-within:text-yellow-500 transition-colors">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-yellow-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-yellow-400/40 focus:bg-white transition-all font-medium text-slate-900 shadow-sm placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3 ml-1 group-focus-within:text-yellow-500 transition-colors">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-yellow-500 transition-colors" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-yellow-400/40 focus:bg-white transition-all font-medium text-slate-900 shadow-sm placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-800 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-yellow-500 hover:text-black transition-all shadow-xl group disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-16 pt-8 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Mainframe Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [authed, setAuthed]     = useState(!!localStorage.getItem('admin'));
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) setActiveTab(hash);
  }, []);

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;

  const render = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'messages':  return <MessagesView />;
      case 'packages':  return <ToursManagement />;
      case 'import':    return <PackagesImport onImportDone={() => {}} />;
      case 'calender':  return <BookingsManagement initialType="APPOINTMENT" />;
      case 'bookings':  return <BookingsManagement initialType="ALL" />;
      case 'invoice':   return <BillingView />;
      case 'socials':   return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Socials Management Coming Soon</div>;
      case 'career':    return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Career Management Coming Soon</div>;
      case 'faqs':      return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">FAQs Management Coming Soon</div>;
      case 'va':        return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Virtual Assistance Coming Soon</div>;
      case 'partners':  return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Partners Management Coming Soon</div>;
      default:          return <DashboardHome />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setAuthed(false)}>
      {render()}
    </AdminLayout>
  );
};

export default AdminDashboard;
