import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import api from '../api/axios';
import { motion } from 'framer-motion';

const AdminCRM = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings?limit=500&page=1');
      const payload = response.data;
      const rows = Array.isArray(payload) ? payload : (payload.data || []);
      setBookings(rows);

      const total =
        payload.pagination?.scopeTotal ??
        payload.pagination?.total ??
        rows.length;
      const confirmed = rows.filter((b) => b.status === 'CONFIRMED').length;
      const pending = rows.filter((b) => b.status === 'PENDING').length;
      const revenue = rows.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

      setStats({ total, confirmed, pending, revenue });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      if (response.status === 200) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto px-6">
        <Reveal>
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">VistaVoyage CRM</h1>
            <p className="text-primary/60 font-medium uppercase tracking-widest text-[10px]">Management Dashboard</p>
          </div>
        </Reveal>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'bg-blue-50 text-blue-600' },
            { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-50 text-green-600' },
            { label: 'Pending Requests', value: stats.pending, color: 'bg-amber-50 text-amber-600' },
            { label: 'Total Revenue', value: `KES ${stats.revenue.toLocaleString()}`, color: 'bg-primary text-white' }
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`p-8 rounded-[2rem] ${stat.color} shadow-sm border border-transparent hover:border-dark-red transition-all duration-500`}>
                <p className="text-[10px] uppercase tracking-ultra-wide font-black mb-4 opacity-80">{stat.label}</p>
                <h3 className="text-3xl font-serif">{stat.value}</h3>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bookings Table */}
        <Reveal delay={0.4}>
          <div className="bg-surface rounded-[3rem] p-10 border border-gray-100 overflow-hidden">
            <h2 className="text-2xl font-serif text-primary mb-10">Recent Bookings</h2>
            
            {loading ? (
              <div className="py-20 text-center text-primary/40 uppercase tracking-widest text-xs font-bold">Loading Bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center text-primary/40 uppercase tracking-widest text-xs font-bold">No bookings found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-6 text-[10px] uppercase tracking-widest font-black text-primary/40">Client</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest font-black text-primary/40">Package</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest font-black text-primary/40">Dates</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest font-black text-primary/40">Amount</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest font-black text-primary/40">Status</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest font-black text-primary/40">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="group hover:bg-white/50 transition-colors">
                        <td className="py-6">
                          <p className="font-bold text-sm text-primary">{booking.guestName}</p>
                          <p className="text-[10px] text-primary/50">{booking.guestEmail}</p>
                        </td>
                        <td className="py-6">
                          <p className="text-xs font-medium text-primary/80">
                            {booking.type === 'FLIGHT' ? `${booking.metadata?.from} → ${booking.metadata?.to}` : 
                             booking.type === 'APPOINTMENT' ? booking.metadata?.consultationType :
                             booking.tour?.title || 'Custom Package'}
                          </p>
                          <span className="text-[8px] font-black uppercase tracking-widest text-primary/30">{booking.type}</span>
                        </td>
                        <td className="py-6">
                          <p className="text-[10px] font-bold text-primary/60">
                            {booking.fromDate ? new Date(booking.fromDate).toLocaleDateString() : 'N/A'} 
                            {booking.toDate ? ` - ${new Date(booking.toDate).toLocaleDateString()}` : ''}
                          </p>
                        </td>
                        <td className="py-6">
                          <p className="text-sm font-black text-primary">KES {booking.totalPrice?.toLocaleString()}</p>
                        </td>
                        <td className="py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-6">
                          <div className="flex gap-2">
                            {booking.status === 'PENDING' && (
                              <button 
                                onClick={() => updateStatus(booking._id, 'CONFIRMED')}
                                className="text-[9px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 underline underline-offset-4"
                              >
                                Confirm
                              </button>
                            )}
                            <button 
                              onClick={() => updateStatus(booking._id, 'CANCELLED')}
                              className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 underline underline-offset-4"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  );
};

export default AdminCRM;
