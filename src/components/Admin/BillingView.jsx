import React, { useState, useEffect } from 'react';
import { CreditCard, Download, ArrowUpRight, ArrowDownRight, Clock, Trash2, Edit2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const BillingView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/bookings?limit=300&page=1').then((r) => {
      setBookings(listItemsFromResponse(r));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const paid    = bookings.filter(b => b.paymentStatus === 'PAID');
  const partial = bookings.filter(b => b.paymentStatus === 'PARTIALLY_PAID');
  const unpaid  = bookings.filter(b => !b.paymentStatus || b.paymentStatus === 'UNPAID');
  const totalRevenue = paid.reduce((s, b) => s + (b.totalPrice || 0), 0);

  const transactions = bookings.slice(0, 8).map(b => ({
    name: b.guestName || 'Guest',
    date: b.updatedAt ? new Date(b.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '—',
    amount: b.paymentStatus === 'PAID' ? `+ KSH ${(b.totalPrice||0).toLocaleString()}` : b.paymentStatus === 'PARTIALLY_PAID' ? `~ KSH ${(b.totalPrice||0).toLocaleString()}` : `Pending`,
    color: b.paymentStatus === 'PAID' ? 'text-emerald-400' : b.paymentStatus === 'PARTIALLY_PAID' ? 'text-amber-400' : 'text-white/40',
    icon: b.paymentStatus === 'PAID' ? ArrowUpRight : b.paymentStatus === 'PARTIALLY_PAID' ? ArrowUpRight : Clock,
  }));

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white">Billing</h2>
          <p className="text-sm text-white/40 mt-1">Payment tracking and revenue</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-indigo-600 transition-all">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `KSH ${totalRevenue.toLocaleString()}`, sub: `${paid.length} paid bookings`, gradient: 'from-violet-500 to-indigo-600' },
          { label: 'Partial Payments', value: partial.length, sub: 'Awaiting balance', gradient: 'from-amber-500 to-orange-600' },
          { label: 'Unpaid', value: unpaid.length, sub: 'Pending collection', gradient: 'from-pink-500 to-rose-600' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-white/5 p-5 flex justify-between items-start" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">{c.label}</p>
              <h4 className="text-2xl font-bold text-white">{c.value}</h4>
              <p className="text-xs text-white/40 mt-1">{c.sub}</p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${c.gradient.includes('violet') ? '#8b5cf6, #6366f1' : c.gradient.includes('amber') ? '#f59e0b, #d97706' : '#ec407a, #db2777'})` }}>
              <CreditCard size={18} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h6 className="text-base font-semibold text-white">Recent Transactions</h6>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {['Client', 'Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs uppercase font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-white/40">No transactions yet</td></tr>
              ) : transactions.map((t, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {(t.name || 'G').charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-white">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/50">{t.date}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{t.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      t.amount.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' :
                      t.amount.startsWith('~') ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/10 text-white/50'
                    }`}>{t.amount.startsWith('+') ? 'Paid' : t.amount.startsWith('~') ? 'Partial' : 'Pending'}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingView;
