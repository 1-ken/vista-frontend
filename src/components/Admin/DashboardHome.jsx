import React, { useState, useEffect } from 'react';
import {
  DollarSign, Users, ShoppingBag, CreditCard,
  TrendingUp, ArrowUpRight, Plane, MapPin,
  Activity, Bell, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

/* ── Stat Card ─────────────────────────────────────────────────────────────── */
const StatCard = ({ title, value, sub, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start justify-between group hover:shadow-md transition-shadow duration-300">
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35 mb-2">{title}</p>
      <h3 className="text-2xl font-serif font-bold text-primary mb-1">{value}</h3>
      <p className="text-xs text-primary/40 font-medium">{sub}</p>
    </div>
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{ background: color }}>
      <Icon size={20} className="text-white" />
    </div>
  </motion.div>
);

/* ── Status Badge ──────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    CONFIRMED: 'bg-emerald-50 text-emerald-600',
    COMPLETED: 'bg-primary/8 text-primary',
    CANCELLED:  'bg-red-50 text-red-500',
    PENDING:    'bg-amber-50 text-amber-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status || 'New'}
    </span>
  );
};

/* ── Main ──────────────────────────────────────────────────────────────────── */
const DashboardHome = () => {
  const [stats, setStats]               = useState({});
  const [recentBookings, setBookings]   = useState([]);
  const [loading, setLoading]           = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const barData  = [42, 58, 37, 82, 54, 91, 67, 74, 49, 88, 71, 96];
  const months   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxBar   = Math.max(...barData);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/bookings?limit=50&page=1'),
    ]).then(([s, b]) => {
      setStats(s.data || {});
      setBookings(listItemsFromResponse(b).slice(0, 6));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { title: "Today's Revenue",  value: `KES ${(stats.todayRevenue   || 0).toLocaleString()}`, sub: `${stats.bookingsToday || 0} bookings today`,          icon: DollarSign,  color: '#0b3d2e', delay: 0    },
    { title: 'Total Bookings',   value: (stats.totalBookings  || 0).toLocaleString(),           sub: `${stats.pendingBookings || 0} pending`,               icon: ShoppingBag, color: '#c8a248', delay: 0.08 },
    { title: 'Active Clients',   value: (stats.activeClients  || 0).toLocaleString(),           sub: `${stats.totalBookings || 0} total bookings`,          icon: Users,       color: '#0b3d2e', delay: 0.16 },
    { title: 'Monthly Revenue',  value: `KES ${(stats.monthlyRevenue || 0).toLocaleString()}`,  sub: `KES ${(stats.totalRevenue || 0).toLocaleString()} total`, icon: CreditCard,  color: '#c8a248', delay: 0.24 },
  ];

  const feed = [
    { label: 'New booking received',  time: '2 min ago',   icon: ShoppingBag, color: '#0b3d2e' },
    { label: 'Flight confirmed',       time: '1 hr ago',    icon: Plane,       color: '#c8a248' },
    { label: 'Payment processed',      time: '3 hrs ago',   icon: CreditCard,  color: '#0b3d2e' },
    { label: 'Tour package updated',   time: 'Yesterday',   icon: MapPin,      color: '#c8a248' },
    { label: 'Client check-in',        time: '2 days ago',  icon: Users,       color: '#0b3d2e' },
    { label: 'Report generated',       time: '3 days ago',  icon: Activity,    color: '#c8a248' },
  ];

  return (
    <div className="space-y-5 pb-10 max-w-[1400px]">

      {/* ── Greeting Banner ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-primary px-8 py-6 flex items-center justify-between overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #c8a248 0%, transparent 55%)' }} />
        <div className="relative z-10">
          <p className="text-accent text-[11px] font-black uppercase tracking-[0.3em] mb-1">{greeting}</p>
          <h2 className="text-white font-serif text-2xl md:text-3xl">Welcome back, <span className="text-accent italic">Admin</span></h2>
          <p className="text-white/40 text-sm mt-1">Here's what's happening at VistaVoyage today.</p>
        </div>
        <div className="hidden md:flex items-center gap-6 relative z-10">
          {[
            { label: 'Active Tours',  value: stats.activeTours     || 0, icon: MapPin      },
            { label: 'Pending',       value: stats.pendingBookings  || 0, icon: Clock       },
            { label: 'Overdue',       value: stats.overdueCount     || 0, icon: AlertCircle },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-1">
                <s.icon size={16} className="text-accent" />
              </div>
              <p className="text-white font-bold text-lg font-serif">{s.value}</p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* ── Charts + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h6 className="font-serif text-lg text-primary">Revenue Overview</h6>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> +4.6% vs last year
              </p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-primary/35 uppercase tracking-widest">
              {[['#c8a248','Packages'],['#0b3d2e','Flights'],['#d1d5db','Consults']].map(([c,l]) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
                </span>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1.5 h-36">
            {barData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(h / maxBar) * 100}%` }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-t-lg"
                  style={{ background: i % 3 === 0 ? '#c8a248' : i % 3 === 1 ? '#0b3d2e' : '#e5e7eb' }} />
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="flex gap-1.5 mt-2">
            {months.map((m, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[9px] font-bold text-primary/25">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h6 className="font-serif text-lg text-primary mb-1">Live Activity</h6>
          <p className="text-[10px] text-primary/35 uppercase tracking-widest font-bold mb-5">Real-time updates</p>
          <div className="relative space-y-4">
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gray-100" />
            {feed.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-3 relative z-10">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: item.color }}>
                  <item.icon size={13} className="text-white" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[13px] font-semibold text-primary leading-tight">{item.label}</p>
                  <p className="text-[11px] text-primary/35 mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bookings Table + Platform Overview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h6 className="font-serif text-lg text-primary">Recent Bookings</h6>
              <p className="text-[10px] text-primary/35 uppercase tracking-widest font-bold mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-emerald-500" />
                {recentBookings.length} bookings this period
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Client','Type','Date','Amount','Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-[10px] uppercase font-black text-primary/30 tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-primary/30">No bookings yet</td></tr>
                ) : recentBookings.map((b, i) => (
                  <tr key={b._id || i} className="hover:bg-primary/[0.015] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                          {(b.guestName || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-primary">{b.guestName || 'Guest'}</p>
                          <p className="text-[11px] text-primary/35">{b.guestEmail || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        b.type === 'FLIGHT' ? 'bg-primary/8 text-primary' :
                        b.type === 'APPOINTMENT' ? 'bg-accent/10 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {b.type === 'FLIGHT' ? 'Flight' : b.type === 'APPOINTMENT' ? 'Consult' : 'Package'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-primary/50 font-medium">
                      {b.fromDate ? new Date(b.fromDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) : 'TBA'}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-primary font-serif">
                      KES {(b.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={b.workflowStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h6 className="font-serif text-lg text-primary mb-5">Platform Overview</h6>
            <div className="space-y-4">
              {[
                { label: 'Active Tours',    value: stats.activeTours     || 0, max: 20,  color: '#0b3d2e' },
                { label: 'Total Bookings',  value: stats.totalBookings   || 0, max: 100, color: '#c8a248' },
                { label: 'Pending',         value: stats.pendingBookings || 0, max: 50,  color: '#0b3d2e' },
                { label: 'Active Clients',  value: stats.activeClients   || 0, max: 200, color: '#c8a248' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-primary/50 uppercase tracking-widest">{item.label}</span>
                    <span className="text-[13px] font-bold text-primary">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Revenue Card */}
          <div className="rounded-2xl p-6 bg-primary relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-20"
              style={{ background: '#c8a248' }} />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-1">Monthly Revenue</p>
              <h3 className="text-3xl font-serif text-accent mb-2">
                KES {(stats.monthlyRevenue || 0).toLocaleString()}
              </h3>
              <p className="text-[11px] text-white/40 flex items-center gap-1 font-bold uppercase tracking-widest">
                <ArrowUpRight size={12} className="text-emerald-400" />
                KES {(stats.todayRevenue || 0).toLocaleString()} today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
