import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Building2, Plane, Car, Utensils, Shield, Hotel, Edit2, Trash2, Phone, Mail, Star } from 'lucide-react';

const SUPPLIER_TYPES = ['Hotel', 'Airline', 'Tour Operator', 'Driver', 'Restaurant', 'Insurance Provider', 'Activity Provider'];
const TYPE_ICON  = { Hotel: Hotel, Airline: Plane, 'Tour Operator': Building2, Driver: Car, Restaurant: Utensils, 'Insurance Provider': Shield, 'Activity Provider': Star };
const TYPE_COLOR = { Hotel: 'bg-blue-50 text-blue-600', Airline: 'bg-primary/8 text-primary', 'Tour Operator': 'bg-purple-50 text-purple-600', Driver: 'bg-amber-50 text-amber-600', Restaurant: 'bg-orange-50 text-orange-600', 'Insurance Provider': 'bg-emerald-50 text-emerald-600', 'Activity Provider': 'bg-pink-50 text-pink-600' };
const STORAGE_KEY = 'vv_suppliers';

const Modal = ({ onClose, title, children, maxW = 'max-w-xl' }) => (
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

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', type: SUPPLIER_TYPES[0], contact: '', phone: '', location: '', rates: '', notes: '', rating: 4 });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSuppliers(JSON.parse(saved));
  }, []);

  const save = (updated) => {
    setSuppliers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filtered = suppliers.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.location || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || s.type === filterType;
    return matchSearch && matchType;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      save(suppliers.map(s => s.id === editing ? { ...form, id: editing, contract: 'Active' } : s));
      setEditing(null);
    } else {
      save([{ ...form, id: `SP${Date.now()}`, contract: 'Active' }, ...suppliers]);
    }
    setModal(null);
    setForm({ name: '', type: SUPPLIER_TYPES[0], contact: '', phone: '', location: '', rates: '', notes: '', rating: 4 });
  };

  const openEdit = (s) => {
    setForm({ name: s.name, type: s.type, contact: s.contact, phone: s.phone, location: s.location, rates: s.rates, notes: s.notes || '', rating: s.rating || 4 });
    setEditing(s.id);
    setModal('form');
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Supplier Management</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">{suppliers.length} suppliers on record</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', type: SUPPLIER_TYPES[0], contact: '', phone: '', location: '', rates: '', notes: '', rating: 4 }); setModal('form'); }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus size={14} /> Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Suppliers', value: suppliers.length,                                          bg: 'bg-primary text-white' },
          { label: 'Hotels',          value: suppliers.filter(s => s.type === 'Hotel').length,          bg: 'bg-blue-50 text-blue-700' },
          { label: 'Airlines',        value: suppliers.filter(s => s.type === 'Airline').length,        bg: 'bg-primary/8 text-primary' },
          { label: 'Active',          value: suppliers.filter(s => s.contract === 'Active').length,     bg: 'bg-emerald-50 text-emerald-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.bg}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <p className="text-2xl font-serif font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers..."
            className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-primary outline-none cursor-pointer">
          <option value="ALL">All Types</option>
          {SUPPLIER_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Building2 size={32} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm text-gray-400 mb-4">{suppliers.length === 0 ? 'No suppliers added yet' : 'No suppliers match your search'}</p>
          {suppliers.length === 0 && (
            <button onClick={() => setModal('form')} className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
              Add First Supplier
            </button>
          )}
        </div>
      )}

      {/* Supplier Cards */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const Icon = TYPE_ICON[s.type] || Building2;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[s.type]}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-[14px]">{s.name}</p>
                      <p className="text-[11px] text-gray-400">{s.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"><Edit2 size={13} /></button>
                    <button onClick={() => save(suppliers.filter(x => x.id !== s.id))} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  {s.contact && <div className="flex items-center gap-2 text-[12px] text-gray-400"><Mail size={11} /> {s.contact}</div>}
                  {s.phone   && <div className="flex items-center gap-2 text-[12px] text-gray-400"><Phone size={11} /> {s.phone}</div>}
                  {s.location && <div className="flex items-center gap-2 text-[12px] text-gray-400"><Building2 size={11} /> {s.location}</div>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-[12px] font-bold text-primary">{s.rates || '—'}</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: Math.min(s.rating || 4, 5) }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
                {s.notes && <p className="text-[11px] text-gray-400 mt-2 italic">{s.notes}</p>}
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modal === 'form' && (
          <Modal onClose={() => { setModal(null); setEditing(null); }} title={editing ? 'Edit Supplier' : 'Add New Supplier'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[['name','Supplier Name','text',true],['contact','Contact Email','email',false],['phone','Phone','tel',false],['location','Location','text',false],['rates','Rates / Pricing','text',false]].map(([k,l,t,r]) => (
                <div key={k}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{l}</label>
                  <input type={t} required={r} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none cursor-pointer">
                    {SUPPLIER_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary outline-none focus:border-primary/30 transition-all resize-none" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                {editing ? 'Update Supplier' : 'Add Supplier'}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplierManagement;
