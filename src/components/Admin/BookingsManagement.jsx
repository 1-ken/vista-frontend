import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, Search, MoreVertical,
  FileText, Clock, X, Users, MessageSquare,
  History, CreditCard, Send, ShoppingBag,
  Eye, Phone, Mail, Calendar, Compass, Bed, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

/* ── helpers ── */
const STATUS_STYLES = {
  NEW:                  'bg-accent/15 text-accent font-black border border-accent/20',
  ASSIGNED:             'bg-blue-50 text-blue-600',
  QUOTE_SENT:           'bg-amber-50 text-amber-600',
  PENDING_CONFIRMATION: 'bg-orange-50 text-orange-600',
  CONFIRMED:            'bg-emerald-50 text-emerald-600',
  COMPLETED:            'bg-primary/8 text-primary',
  CANCELLED:            'bg-red-50 text-red-500',
};

const TYPE_STYLES = {
  FLIGHT:      'bg-gray-100 text-gray-700',
  PACKAGE:     'bg-black text-white',
  APPOINTMENT: 'bg-gray-100 text-gray-700',
  CONTACT:     'bg-gray-100 text-gray-700',
};

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-500'}`}>
    {(status || 'NEW').replace(/_/g, ' ')}
  </span>
);

const TypeBadge = ({ type }) => (
  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${TYPE_STYLES[type] || 'bg-gray-100 text-gray-700'}`}>
    {type === 'FLIGHT' ? 'Flight' : type === 'APPOINTMENT' ? 'Consult' : type === 'CONTACT' ? 'Contact' : 'Package'}
  </span>
);

/* ── Modal wrapper ── */
const Modal = ({ onClose, title, children, maxW = 'max-w-xl' }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`relative bg-white w-full ${maxW} rounded-3xl shadow-2xl overflow-hidden`}>
      <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-serif text-lg text-primary">{title}</h3>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
          <X size={16} />
        </button>
      </div>
      <div className="p-7">{children}</div>
    </motion.div>
  </div>
);

/* ── Main Component ── */
const BookingsManagement = ({ initialType = 'ALL' }) => {
  const [bookings, setBookings]           = useState([]);
  const [staff, setStaff]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [filterWorkflow, setFilterWorkflow] = useState('ALL');
  const [filterType, setFilterType]       = useState(initialType);
  const [selectedBooking, setSelected]    = useState(null);
  const [modal, setModal]                 = useState(null); // 'timeline' | 'assign' | 'notes' | 'quote'
  const [quoteData, setQuoteData]         = useState({ quote: '', expiresAt: '' });
  const [noteText, setNoteText]           = useState('');
  const [selectedWorkers, setWorkers]     = useState([]);

  const openModal = (type, booking) => { setSelected(booking); setModal(type); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const fetchData = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        api.get('/bookings?limit=500&page=1'),
        api.get('/tasks/employees').catch(() => ({ data: [] })),
      ]);
      setBookings(listItemsFromResponse(bRes));
      const staffList = Array.isArray(sRes.data) ? sRes.data : (sRes.data?.data || []);
      setStaff(staffList);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    setFilterType(initialType);
    fetchData();
    // socket.io not available on this backend — polling only
  }, [initialType]);

  const handleWorkflow = async (id, status) => {
    try { await api.patch(`/admin/bookings/${id}/workflow`, { workflowStatus: status }); fetchData(); }
    catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try { await api.post(`/admin/bookings/${selectedBooking._id}/assign`, { workerIds: selectedWorkers }); closeModal(); fetchData(); }
    catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const handleNote = async (e) => {
    e.preventDefault();
    try { await api.post(`/admin/bookings/${selectedBooking._id}/notes`, { text: noteText }); setNoteText(''); fetchData(); }
    catch (_) { alert('Error adding note'); }
  };

  const handleQuote = async (e) => {
    e.preventDefault();
    try { await api.post(`/admin/bookings/${selectedBooking._id}/quote`, { quote: quoteData.quote, expiresAt: quoteData.expiresAt }); closeModal(); setQuoteData({ quote: '', expiresAt: '' }); fetchData(); }
    catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const filtered = bookings.filter(b => {
    if (!b) return false;
    const q = search.toLowerCase();
    const matchSearch = !q || (b.guestName || '').toLowerCase().includes(q) || (b.guestEmail || '').toLowerCase().includes(q) || (b._id || '').toLowerCase().includes(q);
    const matchType   = filterType === 'ALL' || (b.type || 'PACKAGE').toUpperCase() === filterType;
    const matchStatus = filterWorkflow === 'ALL' || (b.workflowStatus || 'NEW') === filterWorkflow;
    return matchSearch && matchType && matchStatus;
  });

  const counts = {
    total:    bookings.length,
    new:      bookings.filter(b => (b?.workflowStatus || 'NEW') === 'NEW').length,
    confirmed: bookings.filter(b => b?.workflowStatus === 'CONFIRMED').length,
    pending:  bookings.filter(b => !b?.quoteStatus || b.quoteStatus === 'NOT_SENT').length,
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings',  value: counts.total,     icon: ShoppingBag, dark: true  },
          { label: 'New Requests',    value: counts.new,       icon: Send,        dark: false },
          { label: 'Confirmed',       value: counts.confirmed, icon: CheckCircle2,dark: true  },
          { label: 'Awaiting Quote',  value: counts.pending,   icon: FileText,    dark: false },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-2xl p-5 flex items-center gap-4 border ${s.dark ? 'bg-primary border-primary' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.dark ? 'bg-white/10' : 'bg-gray-100'}`}>
              <s.icon size={18} className={s.dark ? 'text-accent' : 'text-primary'} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${s.dark ? 'text-white/50' : 'text-primary/40'}`}>{s.label}</p>
              <p className={`text-2xl font-serif font-bold ${s.dark ? 'text-white' : 'text-primary'}`}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or ID..."
            className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
          {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-400 hover:text-primary" /></button>}
        </div>

        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-primary outline-none cursor-pointer">
          <option value="ALL">All Types</option>
          <option value="FLIGHT">Flights</option>
          <option value="PACKAGE">Packages</option>
          <option value="APPOINTMENT">Consultations</option>
          <option value="CONTACT">Contact</option>
        </select>

        <select value={filterWorkflow} onChange={e => setFilterWorkflow(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-primary outline-none cursor-pointer">
          <option value="ALL">All Statuses</option>
          {['NEW','ASSIGNED','QUOTE_SENT','PENDING_CONFIRMATION','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* ── Results count ── */}
      <p className="text-[11px] text-primary/40 font-bold uppercase tracking-widest px-1">
        {filtered.length} booking{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {['Ref', 'Customer', 'Package', 'Type', 'Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <ShoppingBag size={32} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400">No bookings found</p>
                  </td>
                </tr>
              ) : filtered.slice(0, 25).map((b, i) => (
                <motion.tr key={b._id || i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50/60 transition-colors">

                  {/* Ref */}
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-mono font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                      {b.reference || b.referenceId || b._id?.slice(-6).toUpperCase() || 'N/A'}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div
                      onClick={() => openModal('details', b)}
                      className="flex items-center gap-3 cursor-pointer group/cust"
                      title="Click to view full booking request"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-accent text-sm font-bold flex-shrink-0 group-hover/cust:scale-105 transition-transform">
                        {(b.guestName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-primary leading-tight group-hover/cust:text-accent transition-colors flex items-center gap-1.5">
                          {b.guestName || '—'}
                          <Eye size={12} className="opacity-0 group-hover/cust:opacity-100 transition-opacity text-accent" />
                        </p>
                        <p className="text-[11px] text-gray-400">{b.guestEmail || b.guestPhone || ''}</p>
                      </div>
                    </div>
                  </td>

                  {/* Package */}
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-medium text-primary/80 max-w-[170px] truncate" title={b.packageName || b.tourId?.title || b.tour?.title}>
                      {b.packageName || b.tourId?.title || b.tour?.title || 'Custom Package'}
                    </p>
                    {b.accommodation && (
                      <p className="text-[10px] text-accent font-semibold truncate max-w-[170px] flex items-center gap-1">
                        <Bed size={10} /> {b.accommodation}
                      </p>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <TypeBadge type={(b.type || 'PACKAGE').toUpperCase()} />
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-[13px] text-gray-500 font-medium whitespace-nowrap">
                    {b.fromDate || 'TBA'}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 text-[13px] font-bold text-primary font-serif whitespace-nowrap">
                    {b.currency || 'USD'} {(b.totalPrice || 0).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={b.workflowStatus || b.status || 'NEW'} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View full request */}
                      <button onClick={() => openModal('details', b)} title="View Request Details"
                        className="p-2 text-primary/60 hover:text-white hover:bg-primary rounded-lg transition-all shadow-sm bg-gray-50">
                        <Eye size={15} />
                      </button>

                      {/* Quick Confirm for new requests */}
                      {(b.workflowStatus === 'NEW' || b.status === 'pending') && (
                        <button onClick={() => handleWorkflow(b._id, 'CONFIRMED')} title="Accept & Confirm Request"
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1">
                          <CheckCircle2 size={13} /> Confirm
                        </button>
                      )}

                      <button onClick={() => openModal('timeline', b)} title="Timeline"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
                        <History size={15} />
                      </button>
                      <button onClick={() => openModal('notes', b)} title="Notes"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
                        <MessageSquare size={15} />
                      </button>
                      <button onClick={() => openModal('quote', b)} title="Send Quote"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
                        <FileText size={15} />
                      </button>

                      {/* More menu */}
                      <div className="relative group/menu">
                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical size={15} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 p-1.5">
                          <button onClick={() => { setWorkers(b.assignedWorkers?.map(w => (typeof w === 'object' ? w._id : w)) || []); openModal('assign', b); }}
                            className="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-primary/60 hover:bg-gray-50 hover:text-primary rounded-xl transition-all flex items-center gap-2">
                            <Users size={13} /> Assign Staff
                          </button>
                          <div className="h-px bg-gray-100 my-1" />
                          {[
                            { id: 'CONFIRMED', label: 'Confirm Booking',  cls: 'text-emerald-600 hover:bg-emerald-50' },
                            { id: 'COMPLETED', label: 'Mark Complete',    cls: 'text-primary hover:bg-gray-50'        },
                            { id: 'CANCELLED', label: 'Cancel Booking',   cls: 'text-red-500 hover:bg-red-50'         },
                          ].map(a => (
                            <button key={a.id} onClick={() => handleWorkflow(b._id, a.id)}
                              className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all ${a.cls}`}>
                              {a.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination hint */}
        {filtered.length > 25 && (
          <div className="px-5 py-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-medium">Showing 25 of {filtered.length} bookings</p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>

        {/* Timeline */}
        {modal === 'timeline' && selectedBooking && (
          <Modal onClose={closeModal} title="Activity Timeline">
            <div className="relative border-l-2 border-gray-100 ml-3 pl-7 space-y-6 max-h-[55vh] overflow-y-auto pr-2">
              {selectedBooking.activityTimeline?.length > 0 ? (
                selectedBooking.activityTimeline.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[37px] top-0.5 w-4 h-4 rounded-full bg-white border-[3px] border-primary" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary">{item?.action || 'Update'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item?.details}</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">
                      {item?.timestamp ? new Date(item.timestamp).toLocaleString() : ''} · {item?.performer?.name || 'System'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="relative">
                  <div className="absolute -left-[37px] top-0.5 w-4 h-4 rounded-full bg-white border-[3px] border-gray-200" />
                  <p className="text-xs text-gray-400 italic">No activity logged yet.</p>
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">
                    Created {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Assign Staff */}
        {modal === 'assign' && selectedBooking && (
          <Modal onClose={closeModal} title="Assign Staff" maxW="max-w-md">
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {staff.length === 0
                  ? <p className="text-sm text-gray-400 text-center py-6">No staff members found</p>
                  : staff.map(m => (
                    <label key={m._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedWorkers.includes(m._id) ? 'bg-primary/5 border-primary/20' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                      <input type="checkbox" className="hidden"
                        checked={selectedWorkers.includes(m._id)}
                        onChange={e => setWorkers(e.target.checked ? [...selectedWorkers, m._id] : selectedWorkers.filter(id => id !== m._id))} />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedWorkers.includes(m._id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                        {selectedWorkers.includes(m._id) && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-primary">{m.name}</p>
                        <p className="text-[10px] text-gray-400">{m.role} · {m.status}</p>
                      </div>
                    </label>
                  ))
                }
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                Update Assignments
              </button>
            </form>
          </Modal>
        )}

        {/* Notes */}
        {modal === 'notes' && selectedBooking && (
          <Modal onClose={closeModal} title="Internal Notes">
            <div className="space-y-5">
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {selectedBooking.internalNotes?.length > 0
                  ? selectedBooking.internalNotes.map((n, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="text-xs text-gray-700 leading-relaxed">"{n.text}"</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                        {n.author?.name} · {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                  : <p className="text-center py-6 text-sm text-gray-400">No notes yet</p>
                }
              </div>
              <form onSubmit={handleNote} className="space-y-3">
                <textarea required value={noteText} onChange={e => setNoteText(e.target.value)}
                  placeholder="Add an internal note..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary/30 transition-all h-24 resize-none" />
                <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                  Save Note
                </button>
              </form>
            </div>
          </Modal>
        )}

        {/* Quote */}
        {modal === 'quote' && selectedBooking && (
          <Modal onClose={closeModal} title="Send Quote" maxW="max-w-2xl">
            <form onSubmit={handleQuote} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quote Details & Terms</label>
                <textarea required value={quoteData.quote} onChange={e => setQuoteData({ ...quoteData, quote: e.target.value })}
                  placeholder="Describe inclusions, pricing and conditions..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary/30 transition-all h-40 resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Expiry Date</label>
                <input type="date" required value={quoteData.expiresAt} onChange={e => setQuoteData({ ...quoteData, expiresAt: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                Send Quote
              </button>
            </form>
          </Modal>
        )}

        {/* Booking Request Details Modal */}
        {modal === 'details' && selectedBooking && (
          <Modal onClose={closeModal} title="Booking Request Details" maxW="max-w-2xl">
            <div className="space-y-5">
              {/* Header summary */}
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 bg-white rounded-lg shadow-sm">
                      {selectedBooking.reference || selectedBooking.referenceId || selectedBooking._id}
                    </span>
                    <StatusBadge status={selectedBooking.workflowStatus || selectedBooking.status || 'NEW'} />
                  </div>
                  <h4 className="font-serif text-xl text-primary font-bold mt-2">
                    {selectedBooking.packageName || selectedBooking.tourId?.title || selectedBooking.tour?.title || 'Custom Tour Package'}
                  </h4>
                  <p className="text-xs text-primary/50 mt-0.5">
                    Requested on {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString() : 'Recent'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Estimated Investment</p>
                  <p className="text-2xl font-serif font-bold text-primary">
                    {selectedBooking.currency || 'USD'} {(selectedBooking.totalPrice || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Customer Contact Information */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50">Customer Contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Guest Name</p>
                    <p className="text-sm font-bold text-primary">{selectedBooking.guestName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                    <a href={`mailto:${selectedBooking.guestEmail}`} className="text-sm font-bold text-accent hover:underline flex items-center gap-1.5">
                      <Mail size={13} /> {selectedBooking.guestEmail || '—'}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Phone / WhatsApp</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a href={`tel:${selectedBooking.guestPhone}`} className="text-sm font-bold text-primary hover:text-accent flex items-center gap-1">
                        <Phone size={13} /> {selectedBooking.guestPhone || '—'}
                      </a>
                      {selectedBooking.guestPhone && (
                        <a
                          href={`https://wa.me/${selectedBooking.guestPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedBooking.guestName || '')},%20regarding%20your%20VistaVoyage%20booking%20request%20(${selectedBooking.reference || ''})`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 flex items-center gap-1 transition-all"
                        >
                          WhatsApp <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Requested Travel Date</p>
                    <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                      <Calendar size={13} className="text-accent" /> {selectedBooking.fromDate || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Party Size</p>
                  <p className="text-sm font-bold text-primary mt-1 flex items-center gap-1.5">
                    <Users size={14} className="text-accent" />
                    {selectedBooking.guestsCount || 1} Adult{selectedBooking.guestsCount !== 1 ? 's' : ''}
                    {selectedBooking.children > 0 ? `, ${selectedBooking.children} Child${selectedBooking.children !== 1 ? 'ren' : ''}` : ''}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Travel Style</p>
                  <p className="text-sm font-bold text-primary mt-1 flex items-center gap-1.5">
                    <Compass size={14} className="text-accent" />
                    {selectedBooking.travelStyle || 'Private Safari'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Accommodation</p>
                  <p className="text-sm font-bold text-primary mt-1 flex items-center gap-1.5 truncate" title={selectedBooking.accommodation}>
                    <Bed size={14} className="text-accent" />
                    {selectedBooking.accommodation || 'Standard Luxury'}
                  </p>
                </div>
              </div>

              {/* Special Requests & Notes */}
              {selectedBooking.message && (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 mb-1">Guest Special Requests & Notes</p>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium whitespace-pre-wrap">"{selectedBooking.message}"</p>
                </div>
              )}

              {/* Action Controls */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                {selectedBooking.workflowStatus !== 'CONFIRMED' && (
                  <button
                    onClick={() => { handleWorkflow(selectedBooking._id, 'CONFIRMED'); closeModal(); }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Accept & Confirm Request
                  </button>
                )}
                <button
                  onClick={() => { closeModal(); openModal('quote', selectedBooking); }}
                  className="px-4 py-2.5 bg-primary text-white hover:bg-accent hover:text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <FileText size={14} /> Send Custom Quote
                </button>
                <button
                  onClick={() => { closeModal(); openModal('assign', selectedBooking); }}
                  className="px-4 py-2.5 bg-gray-100 text-primary hover:bg-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Users size={14} /> Assign Staff
                </button>
                {selectedBooking.workflowStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => { if (window.confirm('Are you sure you want to decline this request?')) { handleWorkflow(selectedBooking._id, 'CANCELLED'); closeModal(); } }}
                    className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all ml-auto"
                  >
                    Decline Request
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}

      </AnimatePresence>
    </div>
  );
};

export default BookingsManagement;
