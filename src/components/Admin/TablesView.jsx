import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, X, Mail, Lock, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const avatarColors = [
  'linear-gradient(195deg, #8b5cf6, #6366f1)',
  'linear-gradient(195deg, #06b6d4, #0ea5e9)',
  'linear-gradient(195deg, #10b981, #059669)',
  'linear-gradient(195deg, #f59e0b, #d97706)',
  'linear-gradient(195deg, #ec407a, #db2777)',
  'linear-gradient(195deg, #26c6da, #00acc1)',
];

const StatusBadge = ({ status }) => {
  const map = {
    online:  'bg-emerald-500/20 text-emerald-400',
    working: 'bg-cyan-500/20 text-cyan-400',
    away:    'bg-amber-500/20 text-amber-400',
    offline: 'bg-white/10 text-white/40',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || map.offline}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-400' : status === 'working' ? 'bg-cyan-400' : status === 'away' ? 'bg-amber-400' : 'bg-white/30'}`} />
      {status || 'Offline'}
    </span>
  );
};

const TablesView = () => {
  const [staff, setStaff]       = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'AGENT' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sRes, bRes] = await Promise.all([api.get('/admin/staff'), api.get('/bookings?limit=200&page=1')]);
      setStaff(Array.isArray(sRes.data) ? sRes.data : []);
      setBookings(listItemsFromResponse(bRes));
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/staff', form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'AGENT' });
      fetchData();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add member'); }
    finally { setSaving(false); }
  };

  const filteredStaff = staff.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));
  const recentBookings = bookings.slice(0, 8);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* AUTHORS TABLE */}
      <div className="rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
          <div>
            <h6 className="text-base font-semibold text-white">Authors Table</h6>
            <p className="text-sm text-white/40 mt-0.5">Staff & travel agents directory</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 gap-2">
              <Search size={13} className="text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent outline-none text-sm text-white/70 w-32 placeholder:text-white/30" />
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-600 transition-all">
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {['Author', 'Function', 'Status', 'Employed', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs uppercase font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStaff.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-white/40">No staff members found</td></tr>
              ) : filteredStaff.map((member, i) => (
                <tr key={member._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: avatarColors[i % avatarColors.length] }}>
                        {(member.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-white/40">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-white/70 capitalize">{member.role}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={member.status} /></td>
                  <td className="px-5 py-4 text-xs text-white/50">{member.createdAt ? new Date(member.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-medium text-violet-400 hover:text-violet-300">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h6 className="text-base font-semibold text-white">Bookings Table</h6>
          <p className="text-sm text-white/40 mt-0.5">All tour & travel reservations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {['Client', 'Tour / Service', 'Type', 'Travel Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs uppercase font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-white/40">No bookings yet</td></tr>
              ) : recentBookings.map((b, i) => (
                <tr key={b._id || i} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: avatarColors[i % avatarColors.length] }}>
                        {(b.guestName || 'G').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{b.guestName || 'Guest'}</p>
                        <p className="text-xs text-white/40">{b.guestEmail || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/70 max-w-[160px] truncate">{b.tour?.title || (b.type === 'FLIGHT' ? `${b.metadata?.from || ''} → ${b.metadata?.to || ''}` : b.type === 'APPOINTMENT' ? b.metadata?.consultationType || 'Consultation' : 'Custom Package')}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      b.type === 'FLIGHT' ? 'bg-cyan-500/20 text-cyan-400' :
                      b.type === 'APPOINTMENT' ? 'bg-pink-500/20 text-pink-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>{b.type === 'FLIGHT' ? 'Flight' : b.type === 'APPOINTMENT' ? 'Consult' : 'Package'}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/50">{b.fromDate ? new Date(b.fromDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'TBA'}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-white">KSH {(b.totalPrice || 0).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      b.workflowStatus === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' :
                      b.workflowStatus === 'COMPLETED' ? 'bg-cyan-500/20 text-cyan-400' :
                      b.workflowStatus === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                      'bg-white/10 text-white/50'
                    }`}>{b.workflowStatus || 'New'}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-medium text-violet-400 hover:text-violet-300">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md rounded-3xl border border-white/10 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)' }}>
              <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-violet-500 to-indigo-600">
                <h3 className="text-base font-semibold text-white">Add Staff Member</h3>
                <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                {error && <p className="text-xs text-red-400 bg-red-500/10 px-4 py-2 rounded-xl">{error}</p>}
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input required type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                </div>
                <div className="relative">
                  <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none appearance-none">
                    <option value="AGENT" className="text-black">Agent</option>
                    <option value="MANAGER" className="text-black">Manager</option>
                    <option value="ADMIN" className="text-black">Admin</option>
                  </select>
                </div>
                <button type="submit" disabled={saving} className="w-full py-3 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-600">
                  {saving ? 'Adding...' : 'Add Member'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TablesView;
