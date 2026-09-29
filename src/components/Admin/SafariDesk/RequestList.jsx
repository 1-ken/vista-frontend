import React, { useState } from 'react';
import RequestItem from './RequestItem';
import { Search, ChevronDown, Calendar, User, SlidersHorizontal } from 'lucide-react';

const RequestList = ({ activeTab, bookings = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'name'

  const filteredBookings = bookings.filter(b => {
    // Tab filtering
    let tabMatch = true;
    if (activeTab === 'Everything') tabMatch = true;
    else if (activeTab === 'New') tabMatch = (b.workflowStatus || 'NEW') === 'NEW';
    else if (activeTab === 'Working On') tabMatch = ['ASSIGNED', 'QUOTE_SENT', 'PENDING_CONFIRMATION'].includes(b.workflowStatus);
    else if (activeTab === 'Open') tabMatch = ['NEW', 'ASSIGNED', 'QUOTE_SENT', 'PENDING_CONFIRMATION'].includes(b.workflowStatus);
    else if (activeTab === 'Booked') tabMatch = b.workflowStatus === 'CONFIRMED';
    else if (activeTab === 'Completed') tabMatch = b.workflowStatus === 'COMPLETED';
    else if (activeTab === 'Not Booked') tabMatch = b.workflowStatus === 'CANCELLED';

    // Search filtering
    const searchLower = searchQuery.toLowerCase();
    const guestName = (b.guestName || '').toLowerCase();
    const tourTitle = (b.tour?.title || '').toLowerCase();
    const searchMatch = guestName.includes(searchLower) || tourTitle.includes(searchLower);

    return tabMatch && searchMatch;
  });

  // Sorting
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'name') {
      return (a.guestName || '').localeCompare(b.guestName || '');
    }
    return 0;
  });

  return (
    <div className="flex-1 bg-white/[0.03] rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/5 flex flex-col backdrop-blur-md">
      <div className="p-8 border-b border-white/5 bg-transparent flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Curated by</span>
            <button className="flex items-center gap-3 px-5 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent hover:border-accent/40 transition-all duration-500 group">
              <User size={14} className="text-slate-600 group-hover:text-accent transition-colors" />
              Strategic Units
              <ChevronDown size={14} className="text-slate-700 ml-2" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Sequencing</span>
            <button 
              onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
              className="flex items-center gap-3 px-5 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent hover:border-accent/40 transition-all duration-500 group"
            >
              <Calendar size={14} className="text-slate-600 group-hover:text-accent transition-colors" />
              {sortBy === 'date' ? 'Arrival Sequence' : 'Alpha Designator'}
              <ChevronDown size={14} className="text-slate-700 ml-2" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-3 rounded-xl text-slate-500 hover:text-accent hover:bg-accent/10 transition-all duration-500 border border-transparent hover:border-accent/20">
            <SlidersHorizontal size={18} />
          </button>
          <div className="relative group w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-accent transition-all duration-500" size={14} />
            <input 
              type="text" 
              placeholder="Query Repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-500 placeholder:text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-hide">
        {sortedBookings.length > 0 ? (
          sortedBookings.map((request) => (
            <RequestItem key={request._id} request={request} />
          ))
        ) : (
          <div className="p-32 text-center space-y-6">
            <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Search className="text-slate-700" size={32} />
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] italic">Void Detected</p>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Monitoring {sortedBookings.length} of {bookings.length} Strategic Assets</p>
        <div className="flex gap-3">
          <button className="px-5 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white hover:border-white/20 transition-all duration-500 disabled:opacity-20" disabled>Vector Backward</button>
          <button className="px-5 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all duration-500">Vector Forward</button>
        </div>
      </div>
    </div>
  );
};

export default RequestList;
