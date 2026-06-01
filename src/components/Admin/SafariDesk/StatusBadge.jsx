import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'ASSIGNED':
      case 'WORKING ON':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'QUOTE_SENT':
      case 'PENDING_CONFIRMATION':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'CONFIRMED':
      case 'BOOKED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'COMPLETED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'CANCELLED':
      case 'NOT BOOKED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusDot = (status) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'bg-blue-500';
      case 'ASSIGNED':
      case 'WORKING ON':
        return 'bg-green-500';
      case 'QUOTE_SENT':
      case 'PENDING_CONFIRMATION':
        return 'bg-amber-500';
      case 'CONFIRMED':
      case 'BOOKED':
        return 'bg-emerald-500';
      case 'COMPLETED':
        return 'bg-indigo-500';
      case 'CANCELLED':
      case 'NOT BOOKED':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(status)} w-fit ml-auto`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(status)}`} />
      {status?.replace('_', ' ')}
    </div>
  );
};

export default StatusBadge;
