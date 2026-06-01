import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  CheckCircle2, XCircle, Search, Filter, 
  MoreVertical, Calendar, User, ShoppingBag,
  ArrowRight, Mail, FileText, Clock, X, Plane, Package as PackageIcon,
  Users, MessageSquare, History, Tag, CreditCard, Send, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const BookingsManagement = ({ initialType = 'ALL' }) => {
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterWorkflow, setFilterWorkflow] = useState('ALL');
  const [filterQuote, setFilterQuote] = useState('ALL');
  const [filterWorker, setFilterWorker] = useState('ALL');
  const [filterType, setFilterType] = useState(initialType);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  
  const [quoteData, setQuoteData] = useState({
    quote: '',
    expiresAt: '',
    approve: true
  });
  const [noteText, setNoteText] = useState('');
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  useEffect(() => {
    setFilterType(initialType);
    fetchData();

    // Listen for real-time updates
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const socket = io(socketUrl);
    
    socket.on('newBooking', (booking) => {
      console.log('📡 Real-time: New booking received', booking);
      setBookings(prev => [booking, ...prev]);
    });

    socket.on('bookingUpdated', (updatedBooking) => {
      console.log('📡 Real-time: Booking updated', updatedBooking);
      setBookings(prev => prev.map(b => b._id === updatedBooking._id ? updatedBooking : b));
    });

    socket.on('statsUpdate', fetchData);

    return () => {
      socket.disconnect();
    };
  }, [initialType]);

  const fetchData = async () => {
    try {
      const [bookingsRes, staffRes] = await Promise.all([
        api.get('/bookings?limit=500&page=1'),
        api.get('/admin/staff')
      ]);
      setBookings(listItemsFromResponse(bookingsRes));
      setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleUpdateWorkflow = async (id, workflowStatus) => {
    try {
      await api.patch(`/admin/bookings/${id}/workflow`, { workflowStatus });
      fetchData();
    } catch (error) {
      console.error('Workflow update error:', error);
      alert('Error updating workflow status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAssignWorkers = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/bookings/${selectedBooking._id}/assign`, { 
        workerIds: selectedWorkers 
      });
      setShowAssignModal(false);
      fetchData();
    } catch (error) {
      console.error('Assignment error:', error);
      alert('Error assigning workers: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/bookings/${selectedBooking._id}/notes`, { 
        text: noteText 
      });
      setNoteText('');
      fetchData();
    } catch (error) {
      alert('Error adding note');
    }
  };

  const handleSendQuote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/bookings/${selectedBooking._id}/quote`, quoteData);
      setShowQuoteModal(false);
      setQuoteData({ quote: '', expiresAt: '', approve: true });
      fetchData();
    } catch (error) {
      alert('Error sending quote');
    }
  };

  const filteredBookings = (bookings || []).filter(b => {
    if (!b) return false;
    const bookingType = String(b.type || 'PACKAGE').toUpperCase();
    const guestName = String(b.guestName || "").toLowerCase();
    const guestEmail = String(b.guestEmail || "").toLowerCase();
    const bookingId = String(b._id || "").toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch = guestName.includes(searchLower) ||
                          guestEmail.includes(searchLower) ||
                          bookingId.includes(searchLower);
    
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesWorkflow = filterWorkflow === 'ALL' || (b.workflowStatus || 'NEW') === filterWorkflow;
    const matchesQuote = filterQuote === 'ALL' || (b.quoteStatus || 'NOT_SENT') === filterQuote;
    const matchesType = filterType === 'ALL' || bookingType === filterType;
    const matchesWorker = filterWorker === 'ALL' || (Array.isArray(b.assignedWorkers) && b.assignedWorkers.some(w => w?._id === filterWorker));
    
    return matchesSearch && matchesStatus && matchesWorkflow && matchesQuote && matchesType && matchesWorker;
  });

  const stats = {
    total: (bookings || []).length,
    new: (bookings || []).filter(b => (b?.workflowStatus || 'NEW') === 'NEW').length,
    confirmed: (bookings || []).filter(b => b?.status === 'CONFIRMED').length,
    pendingQuote: (bookings || []).filter(b => (b?.quoteStatus || 'NOT_SENT') === 'NOT_SENT').length
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      {/* Executive Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Operations', value: stats.total, color: 'from-violet-500/20 to-indigo-500/20', icon: ShoppingBag, accent: 'text-violet-400' },
          { label: 'New Requests', value: stats.new, color: 'from-cyan-500/20 to-blue-500/20', icon: Send, accent: 'text-cyan-400' },
          { label: 'Confirmed Assets', value: stats.confirmed, color: 'from-emerald-500/20 to-teal-500/20', icon: CheckCircle2, accent: 'text-emerald-400' },
          { label: 'Awaiting Quote', value: stats.pendingQuote, color: 'from-amber-500/20 to-orange-500/20', icon: FileText, accent: 'text-amber-400' },
        ].map((s, i) => (
          <div key={i} className={`p-6 rounded-3xl border border-white/5 bg-gradient-to-br ${s.color} backdrop-blur-md flex items-center gap-4 group hover:border-white/10 transition-all`}>
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${s.accent} shadow-lg group-hover:scale-105 transition-transform`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-white/50 mb-1">{s.label}</p>
              <h4 className="text-2xl font-bold text-white">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filtering Terminal */}
      <div className="rounded-3xl border border-white/5 p-8 space-y-6 backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-all" size={16} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-80 bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all" 
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-accent/40 text-slate-400 appearance-none hover:bg-white/[0.05] transition-all cursor-pointer min-w-[180px]"
            >
              <option value="ALL" className="bg-[#12141C]">All Modalities</option>
              <option value="FLIGHT" className="bg-[#12141C]">Aviation</option>
              <option value="PACKAGE" className="bg-[#12141C]">Expeditions</option>
              <option value="APPOINTMENT" className="bg-[#12141C]">Consultations</option>
            </select>

            <select 
              value={filterWorkflow}
              onChange={(e) => setFilterWorkflow(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-accent/40 text-slate-400 appearance-none hover:bg-white/[0.05] transition-all cursor-pointer min-w-[180px]"
            >
              <option value="ALL" className="bg-[#12141C]">Full Workflow</option>
              {['NEW', 'ASSIGNED', 'QUOTE_SENT', 'PENDING_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                <option key={s} value={s} className="bg-[#12141C]">{s.replace('_', ' ')}</option>
              ))}
            </select>

            <select 
              value={filterWorker}
              onChange={(e) => setFilterWorker(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-accent/40 text-slate-400 appearance-none hover:bg-white/[0.05] transition-all cursor-pointer min-w-[180px]"
            >
              <option value="ALL" className="bg-[#12141C]">All Operatives</option>
              {staff.map(s => (
                <option key={s._id} value={s._id} className="bg-[#12141C]">{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-white/40 font-semibold">Booking ID</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-white/40 font-semibold">Customer</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-white/40 font-semibold">Package</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-white/40 font-semibold">Date</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-white/40 font-semibold">Payment</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-white/40 font-semibold">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-white/40 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-white/40">No bookings found</td></tr>
              ) : filteredBookings.slice(0, 20).map((booking, idx) => (
                <tr key={booking._id || idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-medium text-white/60 bg-white/5 px-3 py-1.5 rounded-lg">
                      {booking.bookingCode || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {(booking.guestName || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{booking.guestName}</p>
                        <p className="text-xs text-white/40">{booking.guestEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white/70 truncate max-w-[150px] block">
                      {booking.tourName || booking.packageName || 'Custom Package'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white/60">
                    {booking.fromDate ? new Date(booking.fromDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'TBA'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">
                    KSH {(booking.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{booking.guestName}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{booking.guestEmail}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-slate-100 ${
                        booking.type === 'FLIGHT' ? 'text-blue-500 bg-blue-50' :
                        booking.type === 'APPOINTMENT' ? 'text-purple-500 bg-purple-50' :
                        'text-accent bg-accent/5'
                      }`}>
                        {booking.type === 'FLIGHT' ? <Plane size={14} /> : 
                         booking.type === 'APPOINTMENT' ? <Clock size={14} /> : 
                         <PackageIcon size={14} />}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">
                        {booking.tour?.title || (booking.type === 'FLIGHT' ? 'Flight' : (booking.type === 'APPOINTMENT' ? 'Consultation' : 'Package'))}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-bold text-slate-600">
                    {booking.fromDate ? new Date(booking.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBA'}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      booking.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      booking.paymentStatus === 'PARTIALLY_PAID' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {booking.paymentStatus || 'UNPAID'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      (booking.workflowStatus || 'NEW') === 'NEW' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      (booking.workflowStatus || 'NEW') === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      (booking.workflowStatus || 'NEW') === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      (booking.workflowStatus || 'NEW') === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {(booking.workflowStatus || 'NEW').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => { setSelectedBooking(booking); setShowTimelineModal(true); }}
                        className="p-2 text-slate-400 hover:text-accent hover:bg-slate-50 rounded-lg transition-all"
                        title="View Timeline"
                      >
                        <History size={16} />
                      </button>
                      <button 
                        onClick={() => { setSelectedBooking(booking); setShowNotesModal(true); }}
                        className="p-2 text-slate-400 hover:text-accent hover:bg-slate-50 rounded-lg transition-all"
                        title="Internal Notes"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        onClick={() => { setSelectedBooking(booking); setShowQuoteModal(true); }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Send Quote"
                      >
                        <FileText size={16} />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-100 rounded-2xl shadow-luxury opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 p-2">
                          <button 
                            onClick={() => { setSelectedBooking(booking); setShowTimelineModal(true); }}
                            className="w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-accent rounded-xl transition-all flex items-center gap-3"
                          >
                            <History size={14} />
                            View Details / Timeline
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setSelectedWorkers(booking.assignedWorkers?.map(w => w._id) || []);
                              setShowAssignModal(true);
                            }}
                            className="w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-accent rounded-xl transition-all flex items-center gap-3"
                          >
                            <Users size={14} />
                            Assign Staff
                          </button>
                          <div className="h-px bg-slate-50 my-2 mx-2" />
                          {[
                            { id: 'CONFIRMED', label: 'Approve Booking', color: 'text-emerald-500' },
                            { id: 'CANCELLED', label: 'Cancel Booking', color: 'text-rose-500' },
                            { id: 'COMPLETED', label: 'Mark Complete', color: 'text-indigo-500' }
                          ].map(action => (
                            <button 
                              key={action.id}
                              onClick={() => handleUpdateWorkflow(booking._id, action.id)}
                              className={`w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest ${action.color} hover:bg-slate-50 rounded-xl transition-all`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals Implementation (Timeline, Assign, Notes, Quote) */}
      <AnimatePresence>
        {/* Timeline Modal */}
        {showTimelineModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTimelineModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-luxury overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-serif text-slate-900">Activity Timeline</h3>
                <button onClick={() => setShowTimelineModal(false)} className="text-slate-400 hover:text-rose-500"><X size={20} /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                <div className="relative border-l-2 border-slate-100 ml-3 pl-8 space-y-8">
                  {selectedBooking?.activityTimeline?.length > 0 ? (
                    selectedBooking.activityTimeline.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-accent flex items-center justify-center" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{item?.action || 'Update'}</p>
                          <p className="text-xs text-slate-500 mt-1">{item?.details}</p>
                          <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-2">
                            {item?.timestamp ? new Date(item.timestamp).toLocaleString() : '--:--'} • {item?.performer?.name || 'System'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-200" />
                      <p className="text-xs text-slate-400 italic">No activity logged yet. Tracking started at booking creation.</p>
                      <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-2">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAssignModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-luxury overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-serif text-slate-900">Assign Executives</h3>
                <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-rose-500"><X size={20} /></button>
              </div>
              <form onSubmit={handleAssignWorkers} className="p-8 space-y-6">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {staff.map(member => (
                    <label key={member._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedWorkers.includes(member._id) ? 'bg-accent/5 border-accent text-accent' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedWorkers.includes(member._id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedWorkers([...selectedWorkers, member._id]);
                          else setSelectedWorkers(selectedWorkers.filter(id => id !== member._id));
                        }}
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedWorkers.includes(member._id) ? 'bg-accent border-accent' : 'border-slate-300'}`}>
                        {selectedWorkers.includes(member._id) && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">{member.name}</p>
                        <p className="text-[8px] opacity-70">{member.role} • {member.status}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all">Update Assignments</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Internal Notes Modal */}
        {showNotesModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotesModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-luxury overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-serif text-slate-900">Internal Advisory Notes</h3>
                <button onClick={() => setShowNotesModal(false)} className="text-slate-400 hover:text-rose-500"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {selectedBooking.internalNotes?.map((note, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-700 leading-relaxed italic">"{note.text}"</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                        {note.author?.name} • {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {(!selectedBooking.internalNotes || selectedBooking.internalNotes.length === 0) && (
                    <p className="text-center py-8 text-[10px] text-slate-400 uppercase tracking-widest font-bold">No internal records</p>
                  )}
                </div>
                <form onSubmit={handleAddNote} className="space-y-4">
                  <textarea 
                    required 
                    placeholder="Append internal observation..." 
                    value={noteText} 
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/40 transition-all font-medium h-24" 
                  />
                  <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all">Record Note</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quote Modal */}
        {showQuoteModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQuoteModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-luxury overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-serif text-slate-900">Formulate Executive Quote</h3>
                <button onClick={() => setShowQuoteModal(false)} className="text-slate-400 hover:text-rose-500"><X size={20} /></button>
              </div>
              <form onSubmit={handleSendQuote} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Itinerary & Terms</label>
                  <textarea 
                    required 
                    placeholder="Describe custom inclusions, pricing tiers, and conditions..." 
                    value={quoteData.quote}
                    onChange={(e) => setQuoteData({...quoteData, quote: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-xs focus:outline-none focus:border-accent/40 transition-all font-medium h-48" 
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Expiry Date</label>
                      <input type="date" required value={quoteData.expiresAt} onChange={(e) => setQuoteData({...quoteData, expiresAt: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-medium" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-accent text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent-dark transition-all shadow-lg shadow-accent/20">Dispatch Official Quote</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsManagement;