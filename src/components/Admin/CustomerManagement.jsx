import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mail, Phone, MapPin, ChevronRight, RefreshCw, Plus } from 'lucide-react';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const LOYALTY_STYLE = {
  Platinum: 'bg-purple-50 text-purple-600',
  Gold:     'bg-amber-50 text-amber-600',
  Silver:   'bg-gray-100 text-gray-600',
  Bronze:   'bg-orange-50 text-orange-600',
};

const getLoyalty = (totalBookings) => {
  if (totalBookings >= 10) return 'Platinum';
  if (totalBookings >= 5)  return 'Gold';
  if (totalBookings >= 2)  return 'Silver';
  return 'Bronze';
};

const Modal = ({ onClose, title, children, maxW = 'max-w-4xl' }) => (
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

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [profileTab, setProfileTab] = useState('overview');
  const [note, setNote] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get('/bookings?limit=500&page=1'),
      ]);
      const rawCustomers = Array.isArray(cRes.data) ? cRes.data : [];
      const rawBookings  = listItemsFromResponse(bRes);
      setBookings(rawBookings);

      // Enrich customers with booking data
      const enriched = rawCustomers.map(c => {
        const cBookings = rawBookings.filter(b => b.guestEmail === c.email);
        const totalSpent = cBookings.reduce((a, b) => a + (b.totalPrice || 0), 0);
        return {
          ...c,
          totalBookings: cBookings.length,
          totalSpent,
          loyalty: getLoyalty(cBookings.length),
          bookings: cBookings,
          lastTrip: cBookings.length > 0 ? cBookings[0].fromDate : null,
          upcomingTrip: cBookings.find(b => b.fromDate && new Date(b.fromDate) > new Date())?.fromDate || null,
        };
      });

      // Also build customers from bookings for guests who aren't registered users
      const registeredEmails = new Set(rawCustomers.map(c => c.email));
      const guestMap = {};
      rawBookings.forEach(b => {
        if (!registeredEmails.has(b.guestEmail) && b.guestEmail) {
          if (!guestMap[b.guestEmail]) {
            guestMap[b.guestEmail] = {
              _id: b.guestEmail,
              name: b.guestName,
              email: b.guestEmail,
              phone: b.guestPhone,
              bookings: [],
              totalSpent: 0,
            };
          }
          guestMap[b.guestEmail].bookings.push(b);
          guestMap[b.guestEmail].totalSpent += b.totalPrice || 0;
        }
      });
      const guestCustomers = Object.values(guestMap).map(g => ({
        ...g,
        totalBookings: g.bookings.length,
        loyalty: getLoyalty(g.bookings.length),
        lastTrip: g.bookings[0]?.fromDate || null,
        upcomingTrip: g.bookings.find(b => b.fromDate && new Date(b.fromDate) > new Date())?.fromDate || null,
      }));

      setCustomers([...enriched, ...guestCustomers]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = customers.filter(c =>
    !search || (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((a, c) => a + (c.totalSpent || 0), 0);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Customer Management</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">CRM — {customers.length} clients</p>
        </div>
        <button onClick={fetchData} className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients',  value: customers.length,                                                  bg: 'bg-primary text-white' },
          { label: 'Platinum',       value: customers.filter(c => c.loyalty === 'Platinum').length,            bg: 'bg-purple-50 text-purple-700' },
          { label: 'Gold',           value: customers.filter(c => c.loyalty === 'Gold').length,                bg: 'bg-amber-50 text-amber-700' },
          { label: 'Total Revenue',  value: `KES ${totalRevenue.toLocaleString()}`,                            bg: 'bg-emerald-50 text-emerald-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.bg}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <p className="text-xl font-serif font-bold truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients by name or email..."
            className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
        </div>
      </div>

      {/* Customer Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-400">No customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <motion.div key={c._id || c.email} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => { setSelected(c); setProfileTab('overview'); }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-primary/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-accent text-lg font-bold flex-shrink-0">
                    {(c.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-[14px]">{c.name || 'Guest'}</p>
                    <p className="text-[11px] text-gray-400">{c.email}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${LOYALTY_STYLE[c.loyalty]}`}>{c.loyalty}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Bookings</p>
                  <p className="text-lg font-serif font-bold text-primary">{c.totalBookings}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Total Spent</p>
                  <p className="text-sm font-bold text-primary">KES {(c.totalSpent || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                {c.phone && <span className="flex items-center gap-1"><Phone size={11} /> {c.phone}</span>}
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-primary/30 ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Customer Profile Modal */}
      <AnimatePresence>
        {selected && (
          <Modal onClose={() => setSelected(null)} title={selected.name || 'Guest'}>
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start gap-5 p-5 bg-primary rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-accent text-2xl font-bold flex-shrink-0">
                  {(selected.name || 'G').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-serif text-xl">{selected.name || 'Guest'}</h3>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${LOYALTY_STYLE[selected.loyalty]}`}>{selected.loyalty}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-white/50 text-[12px]">
                    <span className="flex items-center gap-1"><Mail size={11} /> {selected.email}</span>
                    {selected.phone && <span className="flex items-center gap-1"><Phone size={11} /> {selected.phone}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-accent text-xl font-serif font-bold">KES {(selected.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{selected.totalBookings} bookings</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
                {['overview', 'bookings', 'notes'].map(tab => (
                  <button key={tab} onClick={() => setProfileTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${profileTab === tab ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              {profileTab === 'overview' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Email', selected.email],
                    ['Phone', selected.phone || '—'],
                    ['Role', selected.role || 'Guest'],
                    ['Status', selected.status || '—'],
                    ['Last Trip', selected.lastTrip ? new Date(selected.lastTrip).toLocaleDateString() : 'N/A'],
                    ['Upcoming Trip', selected.upcomingTrip ? new Date(selected.upcomingTrip).toLocaleDateString() : 'None'],
                    ['Loyalty Level', selected.loyalty],
                    ['Member Since', selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—'],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
                      <p className="text-sm font-semibold text-primary">{v}</p>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === 'bookings' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {(!selected.bookings || selected.bookings.length === 0)
                    ? <p className="text-center py-8 text-sm text-gray-400">No bookings on record</p>
                    : selected.bookings.map((b, i) => (
                      <div key={b._id || i} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <div>
                          <p className="text-[11px] font-mono text-gray-400 mb-0.5">{b.referenceId || b._id?.slice(-6).toUpperCase()}</p>
                          <p className="text-sm font-semibold text-primary">{b.packageName || b.tour?.title || 'Custom Package'}</p>
                          <p className="text-[11px] text-gray-400">{b.fromDate ? new Date(b.fromDate).toLocaleDateString() : 'TBA'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">KES {(b.totalPrice || 0).toLocaleString()}</p>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${b.workflowStatus === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                            {b.workflowStatus || 'NEW'}
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {profileTab === 'notes' && (
                <div className="space-y-4">
                  <textarea rows={4} value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Add a note about this client..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary/30 transition-all resize-none" />
                  <button onClick={() => setNote('')}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                    Save Note
                  </button>
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerManagement;
