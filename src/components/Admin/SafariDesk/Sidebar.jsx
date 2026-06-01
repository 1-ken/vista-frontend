import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, HelpCircle, LayoutDashboard, Clock, CheckCircle2, XCircle, MoreVertical, Compass, List } from 'lucide-react';

const Sidebar = ({ activeTab = 'Everything', setActiveTab, bookings = [], tabCounts }) => {
  const counts = tabCounts || {
    Everything: bookings.length,
    New: bookings.filter(b => (b.workflowStatus || 'NEW') === 'NEW').length,
    'Working On': bookings.filter(b => ['ASSIGNED', 'QUOTE_SENT', 'PENDING_CONFIRMATION'].includes(b.workflowStatus)).length,
    Open: bookings.filter(b => ['NEW', 'ASSIGNED', 'QUOTE_SENT', 'PENDING_CONFIRMATION'].includes(b.workflowStatus)).length,
    Booked: bookings.filter(b => b.workflowStatus === 'CONFIRMED').length,
    Completed: bookings.filter(b => b.workflowStatus === 'COMPLETED').length,
    'Not Booked': bookings.filter(b => b.workflowStatus === 'CANCELLED').length
  };

  const menuItems = [
    { name: 'Everything', count: counts.Everything, icon: List },
    { name: 'New', count: counts.New, icon: LayoutDashboard },
    { name: 'Working On', count: counts['Working On'], icon: Clock },
    { name: 'Open', count: counts.Open, icon: MoreVertical },
    { name: 'Booked', count: counts.Booked, icon: CheckCircle2 },
    { name: 'Completed', count: counts.Completed, icon: CheckCircle2 },
    { name: 'Not Booked', count: counts['Not Booked'], icon: XCircle }
  ];

  return (
    <div className="w-80 bg-white/[0.02] border-r border-white/5 min-h-full flex flex-col p-8 space-y-10">
      <button className="w-full flex items-center justify-center gap-3 py-5 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-[0_0_30px_rgba(var(--color-accent),0.3)] transition-all duration-700 group relative overflow-hidden">
        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]" />
        <Plus size={18} className="relative z-10 group-hover:rotate-90 group-hover:text-primary transition-all duration-700" />
        <span className="relative z-10 group-hover:text-primary transition-colors duration-700">New Request</span>
      </button>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-accent transition-all duration-500" size={16} />
        <input 
          type="text" 
          placeholder="Global Search..."
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-500 placeholder:text-slate-700"
        />
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;
          return (
            <button 
              key={item.name}
              onClick={() => setActiveTab && setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-500 group relative ${
                isActive 
                ? 'bg-accent/10 text-accent border border-accent/20' 
                : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon size={16} className={isActive ? 'text-accent' : 'text-slate-600 group-hover:text-slate-400 transition-all duration-500'} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
              </div>
              <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border ${isActive ? 'bg-accent text-white border-accent/20' : 'bg-white/[0.05] text-slate-600 border-white/5 group-hover:bg-white/[0.1]'} transition-all duration-500`}>
                {item.count}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute left-0 w-1 h-6 bg-accent rounded-r-full shadow-[0_0_15px_rgba(var(--color-accent),0.5)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/5 space-y-4">
        <button className="w-full flex items-center justify-center gap-3 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.05] hover:text-white hover:border-accent/40 transition-all duration-700 group">
          <Compass size={18} className="group-hover:animate-spin-slow transition-transform" />
          Active Expeditions
        </button>

        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-slate-600 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-500">
            <HelpCircle size={20} />
          </button>
          <button className="flex-1 flex items-center justify-center p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-slate-600 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-500">
            <LayoutDashboard size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
