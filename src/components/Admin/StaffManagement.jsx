import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Shield, Edit2, Trash2, Key, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

const ROLES = ['ADMIN', 'MANAGER', 'AGENT'];
const PERMISSIONS = ['View Bookings', 'Edit Bookings', 'Delete Bookings', 'View Clients', 'Edit Clients', 'View Finance', 'Edit Finance', 'Manage Staff', 'Manage Tours', 'Send Emails', 'View Reports', 'System Settings'];

const STATUS_DOT = { online: 'bg-emerald-400', working: 'bg-blue-400', away: 'bg-amber-400', offline: 'bg-gray-300' };
const STATUS_LABEL = { online: 'Online', working: 'Working', away: 'Away', offline: 'Offline' };

const Modal = ({ onClose, title, children, maxW = 'max-w-2xl' }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`relative bg-white w-full ${maxW} rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
      <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
        <h3 className="font-serif text-lg text-primary">{title}</h3>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={16} /></button>
      </div>
      <div className="p-7 overflow-y-auto">{children}</div>
    </motion.div>
  </div>
);

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'AGENT', password: '', permissions: [] });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/staff');
      setStaff(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const filtered = staff.filter(s =>
    !search || (s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.role || '').toLowerCase().includes(search.toLowerCase()) || (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/admin/staff', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        permissions: form.permissions,
      });
      setModal(null);
      setForm({ name: '', email: '', phone: '', role: 'AGENT', password: '', permissions: [] });
      fetchStaff();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const togglePerm = (perm) => setForm(f => ({
    ...f,
    permissions: f.permissions.includes(perm) ? f.permissions.filter(p => p !== perm) : [...f.permissions, perm]
  }));

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Staff Management</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">
            {staff.filter(s => s.status === 'online' || s.status === 'working').length} staff online now
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStaff} className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setModal('add')}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Plus size={14} /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff',  value: staff.length,                                                                    bg: 'bg-primary text-white' },
          { label: 'Online Now',   value: staff.filter(s => s.status === 'online' || s.status === 'working').length,       bg: 'bg-emerald-50 text-emerald-700' },
          { label: 'Admins',       value: staff.filter(s => s.role === 'ADMIN').length,                                    bg: 'bg-blue-50 text-blue-700' },
          { label: 'Agents',       value: staff.filter(s => s.role === 'AGENT').length,                                    bg: 'bg-purple-50 text-purple-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.bg}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <p className="text-2xl font-serif font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff by name, email or role..."
            className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {['Staff Member', 'Role', 'Status', 'Last Active', 'Permissions', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-400">No staff members found</td></tr>
              ) : filtered.map((s, i) => (
                <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent font-bold text-sm">
                          {(s.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${STATUS_DOT[s.status] || 'bg-gray-300'}`} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-primary">{s.name}</p>
                        <p className="text-[11px] text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg">{s.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_DOT[s.status] || 'bg-gray-300'}`} />
                      <span className="text-[12px] font-semibold text-gray-600">{STATUS_LABEL[s.status] || 'Offline'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-gray-400">
                    {s.lastActivity ? new Date(s.lastActivity).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[12px] text-gray-400">{(s.permissions || []).length} permissions</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelected(s); setModal('permissions'); }} title="Permissions"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"><Shield size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* Add Staff Modal */}
        {modal === 'add' && (
          <Modal onClose={() => setModal(null)} title="Add New Staff Member">
            <form onSubmit={handleAdd} className="space-y-5">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold border border-red-100">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                {[['name','Full Name','text'],['email','Email Address','email'],['password','Password','password']].map(([k, l, t]) => (
                  <div key={k} className={k === 'name' ? 'col-span-2' : ''}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{l}</label>
                    <input type={t} required value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none cursor-pointer">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map(perm => (
                    <label key={perm} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-[12px] font-semibold ${form.permissions.includes(perm) ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                      <input type="checkbox" className="hidden" checked={form.permissions.includes(perm)} onChange={() => togglePerm(perm)} />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${form.permissions.includes(perm) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                        {form.permissions.includes(perm) && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Staff Member'}
              </button>
            </form>
          </Modal>
        )}

        {/* Permissions Modal */}
        {modal === 'permissions' && selected && (
          <Modal onClose={() => setModal(null)} title={`Permissions — ${selected.name}`}>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Role: <span className="font-bold text-primary">{selected.role}</span></p>
              {(selected.permissions || []).length === 0
                ? <p className="text-sm text-gray-400 text-center py-6">No specific permissions assigned</p>
                : (
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.map(perm => {
                      const has = (selected.permissions || []).includes(perm);
                      return (
                        <div key={perm} className={`flex items-center gap-2 p-3 rounded-xl border text-[12px] font-semibold ${has ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                          <div className={`w-4 h-4 rounded-full flex-shrink-0 ${has ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                          {perm}
                        </div>
                      );
                    })}
                  </div>
                )
              }
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffManagement;
