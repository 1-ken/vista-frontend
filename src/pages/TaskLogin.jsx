import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Shield, CheckSquare, Users } from 'lucide-react';
import { useTask } from './TaskContext';
import Logo from '../components/Logo';

const TaskLogin = () => {
  const { user, login } = useTask();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/tasks" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      if (data.role === 'super_admin' || data.role === 'manager') {
        navigate('/tasks');
      } else {
        navigate('/tasks/my');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-luxury overflow-hidden flex flex-col md:flex-row border border-slate-100">

        {/* Left branding panel */}
        <div className="md:w-5/12 p-12 flex flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(195deg, #0b3d2e 0%, #072a1f 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20"
            style={{ background: '#c8a248' }} />
          <div className="relative z-10">
            <div className="mb-12 flex items-center justify-center">
              <Logo height={90} width={280} inverted />
            </div>
            <h2 className="text-3xl font-serif text-white mb-3 leading-tight">Operations<br />Command Centre</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10">
              Manage safari operations, assign tasks, and track team performance across all departments.
            </p>
            <div className="space-y-5">
              {[
                { icon: CheckSquare, text: 'Task Assignment & Tracking' },
                { icon: Users, text: 'Department Workload Management' },
                { icon: Shield, text: 'Role-Based Access Control' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-white/10">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-white/70">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/10">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-black">VistaVoyage Task System v1.0</p>
          </div>
        </div>

        {/* Right login form */}
        <div className="md:w-7/12 p-12 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-serif text-primary mb-1">Staff Sign In</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Access your task dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold uppercase tracking-widest px-5 py-4 rounded-2xl">
                {error}
              </motion.div>
            )}

            <div className="group">
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@vistavoyagetravel.group"
                  required
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white transition-all text-sm text-primary placeholder:text-slate-300" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="password" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white transition-all text-sm text-primary placeholder:text-slate-300" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent hover:text-primary transition-all shadow-lg group disabled:opacity-50 mt-4">
              {loading ? 'Authenticating...' : 'Access Dashboard'}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              System Online
            </span>
            <span>VistaVoyage Travel Group</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskLogin;
