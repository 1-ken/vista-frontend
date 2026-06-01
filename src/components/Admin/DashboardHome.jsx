import React, { useState, useEffect } from 'react';
import {
  DollarSign, Users, ShoppingBag, Plane,
  ArrowUpRight, Bell, Activity, CreditCard,
  CheckCircle2, MapPin, TrendingUp, Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const StatCard = ({ title, value, change, icon: Icon, accent, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">{title}</p>
        <h4 className="text-3xl font-serif text-primary">{value}</h4>
        <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
          <ArrowUpRight size={13} /> {change}
        </p>
      </div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: accent }}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, staffOnline: 0, activeTours: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/bookings?limit=50&page=1'),
      api.get('/admin/activity'),
    ]).then(([s, b, a]) => {
      setStats(s.data || {});
      setRecentBookings(listItemsFromResponse(b).slice(0, 5));
      setActivities(Array.isArray(a.data) ? a.data.slice(0, 6) : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const barData = [40, 60, 35, 80, 55, 90, 65, 75, 50, 85, 70, 95];
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];

  return (
    <div className="space-y-6 pb-10">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Today's Revenue" value={`KSH ${(stats.totalRevenue || 53000).toLocaleString()}`} change="+55% this week" icon={DollarSign} accent="#0b3d2e" delay={0} />
        <StatCard title="Active Clients" value={stats.staffOnline || "2,300"} change="+3% this month" icon={Users} accent="#c8a248" delay={0.1} />
        <StatCard title="New Bookings" value={stats.totalBookings || 1462} change="+8% this week" icon={ShoppingBag} accent="#0b3d2e" delay={0.2} />
        <StatCard title="Total Revenue" value={`KSH ${(stats.totalRevenue || 103430).toLocaleString()}`} change="+5% vs last month" icon={CreditCard} accent="#c8a248" delay={0.3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Sales Overview */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          {/* Bar chart area */}
          <div className="h-52 relative bg-primary">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #c8a248 0%, transparent 60%)' }} />
            <div className="absolute inset-0 flex items-end px-6 pb-4 gap-1.5">
              {barData.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="w-full rounded-t-md"
                    style={{ background: i % 3 === 0 ? '#c8a248' : 'rgba(255,255,255,0.2)', maxHeight: '100%' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h6 className="text-lg font-serif text-primary">Sales Overview</h6>
                <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp size={13} /> +4.6% more in 2025
                </p>
              </div>
              <div className="flex gap-5 text-xs font-bold text-primary/40 uppercase tracking-widest">
                {['Packages','Flights','Consults'].map((l, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: i === 0 ? '#c8a248' : i === 1 ? '#0b3d2e' : '#d1d5db' }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between px-1">
              {months.map((m, i) => (
                <span key={i} className="text-xs font-bold text-primary/30">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-gray-100 shadow-sm p-6">
          <h6 className="text-lg font-serif text-primary mb-1">Recent Activity</h6>
          <p className="text-xs text-emerald-600 font-bold mb-6 flex items-center gap-1">
            <ArrowUpRight size={13} /> 24% this month
          </p>
          <div className="relative space-y-5">
            <div className="absolute left-[14px] top-1 bottom-4 w-px bg-primary/10" />
            {[
              { label: 'New booking received', time: '2 min ago', bg: 'bg-primary', icon: ShoppingBag },
              { label: 'Flight confirmed', time: '1 hr ago', bg: 'bg-accent', icon: Plane },
              { label: 'Payment processed', time: '3 hr ago', bg: 'bg-primary', icon: CreditCard },
              { label: 'Tour package updated', time: 'Yesterday', bg: 'bg-accent', icon: MapPin },
              { label: 'Client check-in', time: '2 days ago', bg: 'bg-primary', icon: Users },
              { label: 'Report generated', time: '3 days ago', bg: 'bg-accent', icon: Activity },
            ].concat(activities.slice(0, 2).map(a => ({
              label: a?.action || 'Activity logged',
              time: a?.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recent',
              bg: 'bg-primary',
              icon: Bell
            }))).slice(0, 6).map((item, i) => (
              <div key={i} className="flex gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                  <item.icon size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary leading-tight">{item.label}</p>
                  <p className="text-xs text-primary/40 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Recent Bookings Table */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h6 className="text-lg font-serif text-primary">Recent Bookings</h6>
              <p className="text-xs text-primary/40 font-bold mt-1 flex items-center gap-2 uppercase tracking-widest">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {recentBookings.length} bookings this period
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Client', 'Type', 'Date', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] uppercase font-bold text-primary/40 tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-primary/40">No bookings yet</td></tr>
                ) : recentBookings.map((b, i) => (
                  <tr key={b._id || i} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-accent text-sm font-bold shadow-sm">
                          {(b.guestName || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">{b.guestName || 'Guest'}</p>
                          <p className="text-xs text-primary/40">{b.guestEmail || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        b.type === 'FLIGHT' ? 'bg-primary/10 text-primary' :
                        b.type === 'APPOINTMENT' ? 'bg-accent/10 text-accent-dark' :
                        'bg-accent/15 text-primary'
                      }`}>
                        {b.type === 'FLIGHT' ? 'Flight' : b.type === 'APPOINTMENT' ? 'Consult' : 'Package'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary/60">
                      {b.fromDate ? new Date(b.fromDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) : 'TBA'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary font-serif">
                      KSH {(b.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        b.workflowStatus === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                        b.workflowStatus === 'COMPLETED' ? 'bg-primary/10 text-primary' :
                        b.workflowStatus === 'CANCELLED' ? 'bg-red-50 text-red-500' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {b.workflowStatus || 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-4 space-y-5">
          {/* Progress Bars */}
          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6">
            <h6 className="text-lg font-serif text-primary mb-6">Platform Overview</h6>
            <div className="space-y-5">
              {[
                { label: 'Active Tours', value: stats.activeTours || 12, color: 'bg-primary', pct: 75 },
                { label: 'Confirmed Bookings', value: stats.totalBookings || 48, color: 'bg-accent', pct: 60 },
                { label: 'Pending Payments', value: stats.pendingPayments || 8, color: 'bg-primary', pct: 30 },
                { label: 'Staff Online', value: stats.staffOnline || 5, color: 'bg-accent', pct: 50 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">{item.label}</span>
                    <span className="text-sm font-bold text-primary">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full ${item.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Card */}
          <div className="rounded-3xl p-6 text-white shadow-lg relative overflow-hidden bg-primary">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
              style={{ background: 'rgba(200,162,72,0.2)' }} />
            <div className="relative z-10">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Monthly Revenue</p>
              <h3 className="text-4xl font-serif text-accent mb-2">KSH {(stats.totalRevenue || 53000).toLocaleString()}</h3>
              <p className="text-xs text-white/60 flex items-center gap-1 font-bold uppercase tracking-widest">
                <TrendingUp size={13} /> +12% from last month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
