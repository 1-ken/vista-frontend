import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Mail, Phone, Calendar, 
  MoreVertical, MessageSquare, History,
  UserCheck, ShieldAlert, Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/customers');
      setCustomers(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-white/5 p-5" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div>
          <h2 className="text-xl font-bold text-white">Customers</h2>
          <p className="text-sm text-white/40 mt-1">Manage your client database</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input 
              type="text" 
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Customer</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Contact</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Total Bookings</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Total Spent</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Joined</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-white/40">No customers found</td></tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {(customer.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{customer.name || 'Guest'}</p>
                        <p className="text-xs text-white/40">{customer.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-white/70">{customer.phone || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-white">{customer.totalBookings || 0}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-white">${(customer.totalSpent || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-white/50">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Mail size={14} />
                      </button>
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <MessageSquare size={14} />
                      </button>
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <MoreVertical size={14} />
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

export default CustomerManagement;
