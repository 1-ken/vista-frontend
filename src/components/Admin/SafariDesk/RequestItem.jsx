import React from 'react';
import { User, Clock, Flag, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

const RequestItem = ({ request }) => {
  const { 
    _id,
    guestName,
    guestsCount,
    fromDate,
    workflowStatus,
    tour,
    assignedWorkers = [],
    updatedAt,
    metadata = {}
  } = request;

  const title = tour?.title || (request.type === 'FLIGHT' ? 'Flight Request' : 'Exclusive Package');
  const startDate = fromDate ? new Date(fromDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'TBA';
  const clientName = guestName;
  const travelers = guestsCount;
  const country = tour?.location || 'International';
  const countryCode = "🌍";
  const description = metadata?.message || tour?.description || "Inquiry for a custom safari experience.";
  const assignedStaff = assignedWorkers.length > 0 ? assignedWorkers[0] : { name: "Unassigned", avatar: null };
  const lastEdit = updatedAt ? new Date(updatedAt).toLocaleRelativeTime?.() || new Date(updatedAt).toLocaleDateString() : 'N/A';
  const status = workflowStatus || 'NEW';

  return (
    <div className="group bg-transparent border-b border-white/5 hover:bg-white/[0.03] transition-all duration-700 p-10 flex items-center justify-between relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top shadow-[0_0_15px_rgba(var(--color-accent),0.5)]" />
      
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-6">
          <h3 className="text-xl font-serif text-white group-hover:text-accent transition-colors duration-700">{title}</h3>
          <div className="h-px w-12 bg-white/10" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] bg-white/[0.02] px-4 py-1.5 rounded-full border border-white/5 group-hover:border-accent/20 transition-all duration-700">{startDate}</span>
        </div>
        
        <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <div className="flex items-center gap-3 group/info">
            <User size={14} className="text-slate-700 group-hover/info:text-accent transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{clientName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users size={14} className="text-slate-700" />
            <span className="text-slate-400">{travelers} <span className="text-slate-600">Personnel</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg grayscale group-hover:grayscale-0 transition-all duration-700">{countryCode}</span>
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{country}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 max-w-3xl line-clamp-1 italic font-medium group-hover:text-slate-400 transition-colors duration-700">
          "{description}"
        </p>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4 bg-white/[0.02] px-6 py-3 rounded-2xl border border-white/5 group-hover:border-accent/10 transition-all duration-700">
          <div className="text-right">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">{assignedStaff.name}</p>
            <p className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-black">Designated Agent</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#12141C] border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-accent/40 transition-all duration-700">
            {assignedStaff.avatar ? (
              <img src={assignedStaff.avatar} alt={assignedStaff.name} className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-slate-700 group-hover:text-accent transition-colors" />
            )}
          </div>
        </div>

        <div className="text-right w-40">
          <div className="flex items-center justify-end gap-2 text-slate-600 mb-2 group-hover:text-slate-400 transition-colors">
            <Clock size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">{lastEdit}</span>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
