import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingBag, CreditCard, MessageSquare, CheckCircle2, AlertTriangle, Users, Settings, Trash2, Check, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const TYPE_FILTERS = ['All', 'booking', 'payment', 'activity', 'system'];

const buildNotifications = (bookings, activity) => {
  const notifs = [];

  // Recent bookings → notifications
  bookings.slice(0, 10).forEach(b => {
    const isNew = (b.workflowStatus || 'NEW') === 'NEW';
    const isCancelled = b.workflowStatus === 'CANCELLED';
    notifs.push({
      id: `b-${b._id}`,
      type: 'booking',
      title: isCancelled ? 'Booking Cancelled' : isNew ? 'New Booking Received' : 'Booking Updated',
      message: `${b.guestName} — ${b.packageName || b.tour?.title || 'Custom Package'}`,
      time: b.createdAt ? new Date(b.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—',
      read: !isNew,
      icon: ShoppingBag,
      color: isCancelled ? '#ef4444' : '#0b3d2e',
    });
  });

  // Bookings with payments
  bookings.filter(b => b.paymentStatus === 'PARTIALLY_PAID' || b.paymentStatus === 'PAID').slice(0, 5).forEach(b => {
    notifs.push({
      id: `p-${b._id}`,
      type: 'payment',
      title: b.paymentStatus === 'PAID' ? 'Payment Received' : 'Partial Payment Received',
      message: `KES ${(b.totalPrice || 0).toLocaleString()} — ${b.guestName}`,
      time: b.updatedAt ? new Date(b.updatedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—',
      read: true,
      icon: CreditCard,
      color: '#c8a248',
    });
  });

  // Activity feed
  activity.slice(0, 8).forEach(a => {
    notifs.push({
      id: `a-${a._id}`,
      type: 'activity',
      title: a.action || 'Staff Action',
      message: a.staffId?.name ? `By ${a.staffId.name}` : (a.metadata ? JSON.stringify(a.metadata).slice(0, 80) : ''),
      time: a.timestamp ? new Date(a.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—',
      read: true,
      icon: Users,
      color: '#0b3d2e',
    });
  });

  // Sort by most recent
  return notifs.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
};

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, aRes] = await Promise.all([
        api.get('/bookings?limit=50&page=1'),
        api.get('/admin/activity').catch(() => ({ data: [] })),
      ]);
      const bookings = listItemsFromResponse(bRes);
      const activity = Array.isArray(aRes.data) ? aRes.data : [];
      setNotifications(buildNotifications(bookings, activity));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = notifications.filter(n => filter === 'All' || n.type === filter);
  const unread = notifications.filter(n => !n.read).length;

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Notification Center</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">
            {unread > 0 ? `${unread} unread notifications` : 'All caught up'}
          </p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all border border-primary/10">
              <Check size={13} /> Mark All Read
            </button>
          )}
          <button onClick={fetchData} className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: notifications.length,                                    bg: 'bg-primary text-white' },
          { label: 'Unread',   value: unread,                                                  bg: 'bg-red-50 text-red-600' },
          { label: 'Bookings', value: notifications.filter(n => n.type === 'booking').length,  bg: 'bg-emerald-50 text-emerald-700' },
          { label: 'Payments', value: notifications.filter(n => n.type === 'payment').length,  bg: 'bg-amber-50 text-amber-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.bg}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <p className="text-2xl font-serif font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all capitalize ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white text-primary/50 border-gray-100 hover:border-primary/20'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Bell size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400">No notifications in this category</p>
          </div>
        ) : filtered.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className={`bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4 transition-all ${n.read ? 'border-gray-100' : 'border-primary/10 bg-primary/[0.01]'}`}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: n.color }}>
              <n.icon size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-[14px] font-semibold ${n.read ? 'text-primary/70' : 'text-primary'}`}>{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />}
                  </div>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">{n.time}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} title="Mark as read"
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
                      <Check size={13} />
                    </button>
                  )}
                  <button onClick={() => deleteNotif(n.id)} title="Delete"
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <Settings size={18} className="text-primary" />
          <h3 className="font-serif text-lg text-primary">Notification Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['New Bookings', true], ['New Inquiries', true], ['Payment Received', true],
            ['Quote Accepted', true], ['Staff Actions', false], ['Website Issues', true],
            ['Booking Cancellations', true], ['Overdue Payments', true],
          ].map(([label, defaultOn], i) => (
            <label key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
              <span className="text-[13px] font-semibold text-primary">{label}</span>
              <div className={`w-10 h-5 rounded-full transition-all relative ${defaultOn ? 'bg-primary' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${defaultOn ? 'left-5' : 'left-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
