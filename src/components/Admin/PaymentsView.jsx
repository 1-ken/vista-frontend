import React, { useState, useEffect } from 'react';
import { 
  CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, 
  Search, Filter, Download, CheckCircle2, XCircle, Clock,
  Smartphone, Wallet, Banknote
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const PaymentsView = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/bookings?limit=500&page=1');
      // Using booking data to mock payments for now
      const paymentData = listItemsFromResponse(response)
        .filter(b => b.paymentStatus === 'PAID' || b.paymentStatus === 'PARTIALLY_PAID')
        .map(b => ({
          id: b._id,
          client: b.guestName,
          amount: b.totalPrice,
          method: b.metadata?.paymentMethod || 'Credit Card',
          date: b.updatedAt,
          status: b.paymentStatus,
          type: b.type
        }));
      setPayments(paymentData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.client?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Top Section: Card, Salary/Paypal, Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Credit Card & Methods */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CREDIT CARD */}
            <div className="relative overflow-hidden bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl h-56 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <CreditCard size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">VistaVoyage Premium</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-mono tracking-[0.2em]">4562 &nbsp; 1122 &nbsp; 4594 &nbsp; 7852</h3>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[10px] uppercase opacity-60 mb-1">Card Holder</p>
                    <p className="text-sm font-bold tracking-wide">JACK PETERSON</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase opacity-60 mb-1">Expires</p>
                    <p className="text-sm font-bold tracking-wide">11/22</p>
                  </div>
                  <div className="w-10">
                    <img src="https://demos.creative-tim.com/soft-ui-dashboard/assets/img/logos/mastercard.png" alt="mastercard" className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* SALARY & PAYPAL */}
            <div className="grid grid-cols-1 gap-6">
              {/* SALARY */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-gradient-to-tl from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white mb-3 shadow-md">
                  <Banknote size={20} />
                </div>
                <h6 className="text-sm font-bold text-slate-700">Salary</h6>
                <p className="text-xs text-gray-400 mb-2">Belong Interactive</p>
                <div className="h-px bg-gray-100 w-full my-2" />
                <h5 className="text-base font-bold text-slate-700">+KSH 2,000</h5>
              </div>
              {/* PAYPAL */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-gradient-to-tl from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white mb-3 shadow-md">
                  <Wallet size={20} />
                </div>
                <h6 className="text-sm font-bold text-slate-700">Paypal</h6>
                <p className="text-xs text-gray-400 mb-2">Freelance Payment</p>
                <div className="h-px bg-gray-100 w-full my-2" />
                <h5 className="text-base font-bold text-slate-700">KSH 455.00</h5>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h6 className="font-bold text-slate-700">Payment Method</h6>
              <button className="px-4 py-2 bg-gradient-to-tl from-slate-800 to-slate-700 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                <Download size={14} /> Add New Card
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between group hover:border-blue-400 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <img src="https://demos.creative-tim.com/soft-ui-dashboard/assets/img/logos/mastercard.png" alt="mastercard" className="w-8" />
                  <h6 className="text-sm font-bold text-slate-700">**** &nbsp; **** &nbsp; **** &nbsp; 7852</h6>
                </div>
                <button className="text-gray-400 hover:text-slate-700"><Filter size={14} /></button>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between group hover:border-blue-400 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <img src="https://demos.creative-tim.com/soft-ui-dashboard/assets/img/logos/visa.png" alt="visa" className="w-8" />
                  <h6 className="text-sm font-bold text-slate-700">**** &nbsp; **** &nbsp; **** &nbsp; 5248</h6>
                </div>
                <button className="text-gray-400 hover:text-slate-700"><Filter size={14} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Invoices */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h6 className="font-bold text-slate-700">Invoices</h6>
              <button className="px-3 py-1.5 border border-blue-500 text-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 transition-all">
                View All
              </button>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
              {[
                { date: 'March, 01, 2020', id: '#MS-415646', price: 'KSH 180' },
                { date: 'February, 10, 2021', id: '#RV-126749', price: 'KSH 250' },
                { date: 'April, 05, 2020', id: '#FB-212562', price: 'KSH 560' },
                { date: 'June, 25, 2019', id: '#QW-103578', price: 'KSH 120' },
                { date: 'March, 01, 2019', id: '#AR-803481', price: 'KSH 300' },
              ].map((inv, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-700">{inv.date}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{inv.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xs font-bold text-gray-500">{inv.price}</p>
                    <button className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-500 transition-colors">
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Billing Info & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Billing Information */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <h6 className="font-bold text-slate-700 mb-6">Billing Information</h6>
            <div className="space-y-4">
              {[
                { name: 'Oliver Liam', company: 'Viking Burrito', email: 'oliver@burrito.com', vat: 'FRB1235476' },
                { name: 'Lucas Harper', company: 'Stone Tech Zone', email: 'lucas@stone-tech.com', vat: 'FRB1235476' },
                { name: 'Ethan James', company: 'Fiber Notion', email: 'ethan@fiber.com', vat: 'FRB1235476' },
              ].map((info, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-2xl group relative">
                  <div className="absolute top-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="text-red-500 text-[10px] font-bold uppercase flex items-center gap-1 hover:underline">
                      <XCircle size={12} /> Delete
                    </button>
                    <button className="text-slate-700 text-[10px] font-bold uppercase flex items-center gap-1 hover:underline">
                      <Filter size={12} /> Edit
                    </button>
                  </div>
                  <h6 className="text-sm font-bold text-slate-700 mb-4">{info.name}</h6>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Company Name: <span className="text-slate-600 font-bold">{info.company}</span></p>
                    <p className="text-xs text-gray-400">Email Address: <span className="text-slate-600 font-bold">{info.email}</span></p>
                    <p className="text-xs text-gray-400">VAT Number: <span className="text-slate-600 font-bold">{info.vat}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Your Transactions */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h6 className="font-bold text-slate-700">Your Transactions</h6>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2 mt-1">
                  <Clock size={12} /> 23 - 30 March 2020
                </p>
              </div>
            </div>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Newest</p>
            <div className="space-y-6">
              {[
                { name: 'Netflix', date: '27 March 2020, at 12:30 PM', amount: '- KSH 2,500', color: 'text-red-500', iconColor: 'text-red-500 bg-red-50' },
                { name: 'Apple', date: '27 March 2020, at 04:30 AM', amount: '+ KSH 2,000', color: 'text-emerald-500', iconColor: 'text-emerald-500 bg-emerald-50' },
                { name: 'Stripe', date: '26 March 2020, at 13:45 PM', amount: '+ KSH 750', color: 'text-emerald-500', iconColor: 'text-emerald-500 bg-emerald-50' },
                { name: 'HubSpot', date: '26 March 2020, at 12:30 PM', amount: '+ KSH 1,000', color: 'text-emerald-500', iconColor: 'text-emerald-500 bg-emerald-50' },
                { name: 'Creative Tim', date: '26 March 2020, at 08:30 AM', amount: '+ KSH 2,500', color: 'text-emerald-500', iconColor: 'text-emerald-500 bg-emerald-50' },
                { name: 'Webflow', date: '26 March 2020, at 05:00 AM', amount: 'Pending', color: 'text-slate-700', iconColor: 'text-slate-700 bg-gray-50' },
              ].map((tx, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${tx.iconColor} border-current/20`}>
                      {tx.amount.startsWith('+') ? <ArrowUpRight size={14} /> : tx.amount.startsWith('-') ? <ArrowDownRight size={14} /> : <Clock size={14} />}
                    </div>
                    <div>
                      <h6 className="text-sm font-bold text-slate-700">{tx.name}</h6>
                      <p className="text-[10px] text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`text-xs font-bold ${tx.color}`}>{tx.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default PaymentsView;
