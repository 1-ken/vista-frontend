import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Globe, User } from 'lucide-react';
import api from '../api/axios';
import Logo from '../components/Logo';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', formData);
      const { token, role, name, _id } = response.data;
      
      if (['ADMIN', 'MANAGER', 'AGENT'].includes(role)) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ name, role, _id }));
        navigate('/admin');
      } else {
        setError('Unauthorized: Staff access only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-luxury overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* Left Side: Branding & Info */}
        <div className="md:w-5/12 p-12 text-white flex flex-col justify-between relative overflow-hidden" style={{ background: 'linear-gradient(195deg, #42424a, #191919)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          
          <div className="relative z-10">
                <Link to="/" className="flex items-center space-x-2 mb-16 h-28 overflow-hidden">
                  <Logo height={110} width={350} inverted className="transform -translate-x-4" />
                </Link>
            
            <h2 className="text-4xl font-serif mb-6 leading-tight">Executive <br/>Terminal Access</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
              Welcome to the VistaVoyage global management portal. Authorized personnel only.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Globe, text: "Global Fleet Management" },
                { icon: ShieldCheck, text: "Secure Data Protocol" },
                { icon: User, text: "RBAC Compliance Active" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <item.icon size={18} className="text-accent" />
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

        {/* Right Side: Login Form */}
        <div className="md:w-7/12 p-12 md:p-20 bg-white">
          <div className="mb-12">
            <h3 className="text-2xl font-serif text-slate-900 mb-2">Staff Portal</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Identification Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-rose-100 flex items-center gap-3"
              >
                <ShieldCheck size={16} />
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3 ml-1 group-focus-within:text-accent transition-colors">
                  Professional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@vistavoyage.travel"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium text-slate-900 shadow-sm placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-3 px-1">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 group-focus-within:text-accent transition-colors">
                    Security Password
                  </label>
                  <button type="button" className="text-[9px] uppercase tracking-widest font-black text-accent hover:underline">Reset Token</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={18} />
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium text-slate-900 shadow-sm placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 bg-slate-800 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-accent transition-all shadow-xl group disabled:opacity-50 mt-10"
            >
              {loading ? 'Authenticating...' : 'Authorize Access'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-16 pt-8 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Mainframe Online
            </span>
            <span className="hover:text-accent cursor-pointer transition-colors">Legal & Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
