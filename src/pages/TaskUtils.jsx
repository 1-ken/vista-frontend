// Shared helpers for the Task Management System

export const PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const STATUSES = ['not_started', 'in_progress', 'waiting', 'completed', 'overdue'];

export const priorityConfig = {
  low:      { label: 'Low',      color: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400' },
  medium:   { label: 'Medium',   color: 'bg-blue-50 text-blue-600',      dot: 'bg-blue-500' },
  high:     { label: 'High',     color: 'bg-amber-50 text-amber-600',    dot: 'bg-amber-500' },
  critical: { label: 'Critical', color: 'bg-red-50 text-red-600',        dot: 'bg-red-500' },
};

export const statusConfig = {
  not_started: { label: 'Not Started', color: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400' },
  in_progress: { label: 'In Progress', color: 'bg-blue-50 text-blue-600',      dot: 'bg-blue-500' },
  waiting:     { label: 'Waiting',     color: 'bg-amber-50 text-amber-600',    dot: 'bg-amber-500' },
  completed:   { label: 'Completed',   color: 'bg-emerald-50 text-emerald-600',dot: 'bg-emerald-500' },
  overdue:     { label: 'Overdue',     color: 'bg-red-50 text-red-600',        dot: 'bg-red-500' },
};

export const PriorityBadge = ({ priority }) => {
  const cfg = priorityConfig[priority] || priorityConfig.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.not_started;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export const Avatar = ({ name = '', size = 'md', photo }) => {
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-12 h-12 text-sm', xl: 'w-16 h-16 text-base' };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (photo) return <img src={photo} alt={name} className={`${sizes[size]} rounded-xl object-cover`} />;
  return (
    <div className={`${sizes[size]} rounded-xl bg-primary flex items-center justify-center text-accent font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

export const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const isOverdue = (dueDate, status) => {
  if (status === 'completed') return false;
  return dueDate && new Date(dueDate) < new Date();
};

export const daysUntil = (dueDate) => {
  if (!dueDate) return null;
  const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};
