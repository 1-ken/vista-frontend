import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { isOverdue } from './TaskUtils';

const Bar = ({ value, max, color = 'bg-primary', label, sub }) => (
  <div className="flex items-center gap-3">
    <div className="w-24 text-right">
      <p className="text-xs font-bold text-primary truncate">{label}</p>
      {sub && <p className="text-[10px] text-primary/30">{sub}</p>}
    </div>
    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}
        transition={{ duration: 0.8 }}
        className={`h-full ${color} rounded-full`} />
    </div>
    <span className="text-xs font-bold text-primary w-8 text-right">{value}</span>
  </div>
);

const TaskReports = ({ tasks, employees, departments }) => {
  const [period, setPeriod] = useState('all');

  const filterByPeriod = (items) => {
    if (period === 'all') return items;
    const now = new Date();
    const cutoff = new Date();
    if (period === 'week') cutoff.setDate(now.getDate() - 7);
    if (period === 'month') cutoff.setMonth(now.getMonth() - 1);
    if (period === 'year') cutoff.setFullYear(now.getFullYear() - 1);
    return items.filter(t => new Date(t.createdAt) >= cutoff);
  };

  const filtered = filterByPeriod(tasks);
  const completed = filtered.filter(t => t.status === 'completed');
  const overdue = filtered.filter(t => isOverdue(t.dueDate, t.status));
  const completionRate = filtered.length > 0 ? Math.round((completed.length / filtered.length) * 100) : 0;

  const byEmployee = employees.map(emp => {
    const empTasks = filtered.filter(t => t.assignedTo?._id === emp._id || t.assignedTo === emp._id);
    const done = empTasks.filter(t => t.status === 'completed').length;
    return { name: emp.name, total: empTasks.length, done, rate: empTasks.length > 0 ? Math.round((done / empTasks.length) * 100) : 0 };
  }).sort((a, b) => b.total - a.total);

  const byDept = departments.map(dept => {
    const deptTasks = filtered.filter(t => t.department?._id === dept._id || t.department === dept._id);
    const done = deptTasks.filter(t => t.status === 'completed').length;
    return { name: dept.name, total: deptTasks.length, done };
  }).sort((a, b) => b.total - a.total);

  const byPriority = ['critical', 'high', 'medium', 'low'].map(p => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    value: filtered.filter(t => t.priority === p).length
  }));

  const maxEmp = Math.max(...byEmployee.map(e => e.total), 1);
  const maxDept = Math.max(...byDept.map(d => d.total), 1);

  const exportCSV = () => {
    const rows = [
      ['Title', 'Assigned To', 'Department', 'Priority', 'Status', 'Due Date', 'Progress'],
      ...filtered.map(t => [
        t.title, t.assignedTo?.name || '', t.department?.name || '',
        t.priority, t.status, t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '', `${t.progress || 0}%`
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tasks-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['all', 'week', 'month', 'year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                period === p ? 'bg-primary text-white' : 'bg-white text-primary/50 border border-gray-100 hover:bg-primary/5'
              }`}>
              {p === 'all' ? 'All Time' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
            </button>
          ))}
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-primary/60 hover:bg-primary hover:text-white hover:border-primary transition-all">
          <Download size={13} />Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: 'Completion Rate', value: `${completionRate}%`, color: 'bg-emerald-500' },
          { icon: TrendingUp,   label: 'Total Tasks',     value: filtered.length,       color: 'bg-primary' },
          { icon: Users,        label: 'Completed',       value: completed.length,       color: 'bg-accent' },
          { icon: AlertTriangle,label: 'Overdue',         value: overdue.length,         color: overdue.length > 0 ? 'bg-red-500' : 'bg-slate-400' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-2xl font-serif text-primary">{value}</p>
            <p className="text-[10px] uppercase tracking-widest font-black text-primary/30 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee productivity */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-serif text-primary mb-5">Employee Productivity</h3>
          <div className="space-y-4">
            {byEmployee.length === 0
              ? <p className="text-sm text-primary/30 text-center py-6">No data</p>
              : byEmployee.map((emp, i) => (
                <Bar key={i} label={emp.name} sub={`${emp.rate}% complete`} value={emp.total} max={maxEmp}
                  color={emp.rate >= 80 ? 'bg-emerald-500' : emp.rate >= 50 ? 'bg-accent' : 'bg-red-400'} />
              ))
            }
          </div>
        </div>

        {/* Department performance */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-serif text-primary mb-5">Department Performance</h3>
          <div className="space-y-4">
            {byDept.length === 0
              ? <p className="text-sm text-primary/30 text-center py-6">No data</p>
              : byDept.map((dept, i) => (
                <Bar key={i} label={dept.name} sub={`${dept.done} completed`} value={dept.total} max={maxDept} color="bg-primary" />
              ))
            }
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-serif text-primary mb-5">Priority Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            {byPriority.map(({ label, value }, i) => {
              const colors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-slate-400'];
              const pct = filtered.length > 0 ? Math.round((value / filtered.length) * 100) : 0;
              return (
                <div key={i} className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors[i]}`} />
                    <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">{label}</span>
                  </div>
                  <p className="text-2xl font-serif text-primary">{value}</p>
                  <p className="text-[10px] text-primary/30 font-bold">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-serif text-primary mb-5">Status Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Completed',   value: filtered.filter(t => t.status === 'completed').length,   color: 'bg-emerald-500' },
              { label: 'In Progress', value: filtered.filter(t => t.status === 'in_progress').length, color: 'bg-blue-500' },
              { label: 'Not Started', value: filtered.filter(t => t.status === 'not_started').length, color: 'bg-slate-400' },
              { label: 'Waiting',     value: filtered.filter(t => t.status === 'waiting').length,     color: 'bg-amber-500' },
              { label: 'Overdue',     value: overdue.length,                                          color: 'bg-red-500' },
            ].map(({ label, value, color }, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                <span className="text-xs font-bold text-primary/60 w-24">{label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }}
                    animate={{ width: filtered.length > 0 ? `${(value / filtered.length) * 100}%` : '0%' }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full ${color} rounded-full`} />
                </div>
                <span className="text-xs font-bold text-primary w-6 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReports;
