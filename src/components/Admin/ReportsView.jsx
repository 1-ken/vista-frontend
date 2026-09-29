import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, ShoppingBag, 
  ArrowUpRight, Download, PieChart, Activity, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const ReportsView = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports</h2>
          <p className="text-sm text-white/40 mt-1">Comprehensive platform performance analytics</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-indigo-600 transition-all shadow-lg shadow-violet-500/25">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Gross Revenue', value: `KSH ${(stats?.totalRevenue || 53000).toLocaleString()}`, change: '+14.2%', icon: DollarSign, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-400' },
          { label: 'Average Booking', value: `KSH ${Math.round((stats?.totalRevenue || 53000) / (stats?.totalBookings || 1)).toLocaleString()}`, change: '+5.7%', icon: TrendingUp, color: 'from-cyan-500 to-blue-600', textColor: 'text-cyan-400' },
          { label: 'Conversion Rate', value: '3.4%', change: '-0.8%', icon: Activity, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-400' },
        ].map((kpi, i) => (
          <div key={i} className="rounded-3xl border border-white/5 p-6" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-lg`}>
                <kpi.icon size={18} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${kpi.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-xs font-medium text-white/50 mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Mix */}
        <div className="rounded-3xl border border-white/5 p-6" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Revenue Mix</h3>
            <PieChart size={20} className="text-white/30" />
          </div>
          <div className="space-y-5">
            {[
              { label: 'Luxury Packages', value: 65, color: 'from-violet-500 to-indigo-600' },
              { label: 'Flight Reservations', value: 25, color: 'from-cyan-500 to-blue-600' },
              { label: 'Consultation Fees', value: 10, color: 'from-amber-500 to-orange-600' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white/70">{item.label}</span>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="rounded-3xl border border-white/5 p-6" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Monthly Performance</h3>
            <Calendar size={20} className="text-white/30" />
          </div>
          <div className="h-40 flex items-end gap-2">
            {[65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 70, 88].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${v}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500 to-indigo-500 opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
              <span key={i} className="text-xs text-white/30">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-white/5 p-6" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-xs text-white/50">Total Bookings</p>
              <p className="text-xl font-bold text-white">{stats?.totalBookings || 1462}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <ArrowUpRight size={14} /> +12% from last month
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 p-6" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-xs text-white/50">Active Clients</p>
              <p className="text-xl font-bold text-white">{stats?.staffOnline || 2300}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-cyan-400">
            <ArrowUpRight size={14} /> +3% from last month
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 p-6" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-xs text-white/50">Active Tours</p>
              <p className="text-xl font-bold text-white">{stats?.activeTours || 12}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-violet-400">
            <ArrowUpRight size={14} /> +5% from last month
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
