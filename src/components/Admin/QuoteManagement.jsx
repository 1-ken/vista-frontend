import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Send, FileText, Search, Download, Mail, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const QUOTE_ITEMS = ['Flights', 'Hotels', 'Transfers', 'Game Drives', 'Activities', 'Visa Assistance', 'Insurance', 'Taxes', 'Service Fees', 'Meals', 'Park Fees'];

const STATUS_STYLE = {
  NOT_SENT:          'bg-gray-100 text-gray-500 border-gray-200',
  SENT:              'bg-amber-50 text-amber-600 border-amber-100',
  PENDING_RESPONSE:  'bg-blue-50 text-blue-600 border-blue-100',
  CONFIRMED:         'bg-emerald-50 text-emerald-600 border-emerald-100',
};

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

const QuoteManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    items: [], flights: '', hotels: '', transfers: '', activities: '',
    visa: '', insurance: '', taxes: '', serviceFee: '', notes: '', expires: ''
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings?limit=500&page=1');
      setBookings(listItemsFromResponse(res));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || (b.guestName || '').toLowerCase().includes(q) || (b.referenceId || '').toLowerCase().includes(q) || (b.guestEmail || '').toLowerCase().includes(q);
    const matchFilter = filter === 'ALL' || (b.quoteStatus || 'NOT_SENT') === filter;
    return matchSearch && matchFilter;
  });

  const totalAmount = () => {
    return ['flights','hotels','transfers','activities','visa','insurance','taxes','serviceFee']
      .reduce((acc, k) => acc + (parseFloat(form[k]) || 0), 0);
  };

  const handleSendQuote = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError('');
    try {
      const quoteText = [
        `Items: ${form.items.join(', ')}`,
        form.flights    ? `Flights: KES ${parseFloat(form.flights).toLocaleString()}`    : '',
        form.hotels     ? `Hotels: KES ${parseFloat(form.hotels).toLocaleString()}`      : '',
        form.transfers  ? `Transfers: KES ${parseFloat(form.transfers).toLocaleString()}`: '',
        form.activities ? `Activities: KES ${parseFloat(form.activities).toLocaleString()}` : '',
        form.visa       ? `Visa: KES ${parseFloat(form.visa).toLocaleString()}`          : '',
        form.insurance  ? `Insurance: KES ${parseFloat(form.insurance).toLocaleString()}`: '',
        form.taxes      ? `Taxes: KES ${parseFloat(form.taxes).toLocaleString()}`        : '',
        form.serviceFee ? `Service Fee: KES ${parseFloat(form.serviceFee).toLocaleString()}` : '',
        `TOTAL: KES ${totalAmount().toLocaleString()}`,
        form.notes ? `Notes: ${form.notes}` : '',
      ].filter(Boolean).join('\n');

      await api.post(`/admin/bookings/${selected._id}/quote`, {
        quote: quoteText,
        expiresAt: form.expires,
        approve: true,
      });
      setModal(null);
      setForm({ items: [], flights: '', hotels: '', transfers: '', activities: '', visa: '', insurance: '', taxes: '', serviceFee: '', notes: '', expires: '' });
      fetchBookings();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    ALL:              bookings.length,
    NOT_SENT:         bookings.filter(b => (b.quoteStatus || 'NOT_SENT') === 'NOT_SENT').length,
    SENT:             bookings.filter(b => b.quoteStatus === 'SENT').length,
    PENDING_RESPONSE: bookings.filter(b => b.quoteStatus === 'PENDING_RESPONSE').length,
    CONFIRMED:        bookings.filter(b => b.quoteStatus === 'CONFIRMED').length,
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Quote Management</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">Create & track client quotations</p>
        </div>
        <button onClick={fetchBookings} className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${filter === k ? 'bg-primary text-white border-primary' : 'bg-white text-primary/50 border-gray-100 hover:border-primary/20'}`}>
            {k.replace(/_/g, ' ')} <span className="ml-1 opacity-60">{v}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client name, email or booking ID..."
            className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {['Ref', 'Client', 'Package', 'Amount', 'Quote Status', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-400">No bookings found</td></tr>
              ) : filtered.slice(0, 50).map((b, i) => (
                <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-mono font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                      {b.referenceId || b._id?.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-semibold text-primary">{b.guestName}</p>
                    <p className="text-[11px] text-gray-400">{b.guestEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-primary/70 max-w-[160px] truncate">
                    {b.packageName || b.tour?.title || 'Custom Package'}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-bold text-primary font-serif">
                    KES {(b.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${STATUS_STYLE[b.quoteStatus || 'NOT_SENT']}`}>
                      {(b.quoteStatus || 'NOT_SENT').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-gray-400">
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {b.quote && (
                        <button onClick={() => { setSelected(b); setModal('view'); }} title="View Quote"
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"><FileText size={14} /></button>
                      )}
                      <button onClick={() => { setSelected(b); setModal('create'); }} title="Send Quote"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"><Send size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <div className="px-5 py-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">Showing 50 of {filtered.length}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {/* Create Quote Modal */}
        {modal === 'create' && selected && (
          <Modal onClose={() => setModal(null)} title={`Send Quote — ${selected.guestName}`} maxW="max-w-3xl">
            <form onSubmit={handleSendQuote} className="space-y-5">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold border border-red-100">{error}</div>}

              <div className="bg-primary/5 rounded-2xl p-4 grid grid-cols-2 gap-3">
                {[['Client', selected.guestName], ['Email', selected.guestEmail], ['Phone', selected.guestPhone || '—'], ['Package', selected.packageName || selected.tour?.title || 'Custom']].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
                    <p className="text-sm font-semibold text-primary">{v}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quote Items</label>
                <div className="flex flex-wrap gap-2">
                  {QUOTE_ITEMS.map(item => (
                    <button key={item} type="button"
                      onClick={() => setForm({ ...form, items: form.items.includes(item) ? form.items.filter(i => i !== item) : [...form.items, item] })}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${form.items.includes(item) ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-primary/50 border-gray-200 hover:border-primary/30'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['flights','Flights'],['hotels','Hotels'],['transfers','Transfers'],['activities','Activities'],['visa','Visa'],['insurance','Insurance'],['taxes','Taxes'],['serviceFee','Service Fee']].map(([k, l]) => (
                  <div key={k}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{l} (KES)</label>
                    <input type="number" min="0" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-widest text-primary/50">Total Quote Amount</span>
                <span className="text-2xl font-serif text-primary">KES {totalAmount().toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Expiry Date</label>
                  <input type="date" required value={form.expires} onChange={e => setForm({ ...form, expires: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Notes & Terms</label>
                  <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Additional conditions..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={13} /> Send Quote</>}
                </button>
                <button type="button" onClick={() => setModal(null)}
                  className="px-6 bg-gray-100 text-primary/60 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* View Quote Modal */}
        {modal === 'view' && selected && (
          <Modal onClose={() => setModal(null)} title={`Quote — ${selected.guestName}`}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[['Client', selected.guestName], ['Email', selected.guestEmail], ['Package', selected.packageName || 'Custom'], ['Amount', `KES ${(selected.totalPrice || 0).toLocaleString()}`], ['Status', (selected.quoteStatus || 'NOT_SENT').replace(/_/g, ' ')], ['Expires', selected.quoteExpiresAt ? new Date(selected.quoteExpiresAt).toLocaleDateString() : '—']].map(([l, v]) => (
                  <div key={l} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
                    <p className="text-sm font-semibold text-primary">{v}</p>
                  </div>
                ))}
              </div>
              {selected.quote && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quote Details</p>
                  <pre className="text-sm text-primary/70 whitespace-pre-wrap font-sans leading-relaxed">{selected.quote}</pre>
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuoteManagement;
