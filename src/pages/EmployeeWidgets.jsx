import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Clock, TrendingUp, Mail, Building2 } from 'lucide-react';
import { Avatar, formatDate, StatusBadge, PriorityBadge } from './TaskUtils';

export const EmployeeCard = ({ employee, tasks, onClick }) => {
  const empTasks = tasks.filter(t =>
    t.assignedTo?._id === employee._id || t.assignedTo === employee._id
  );
  const completed = empTasks.filter(t => t.status === 'completed').length;
  const overdue = empTasks.filter(t => {
    if (t.status === 'completed') return false;
    return t.dueDate && new Date(t.dueDate) < new Date();
  }).length;
  const inProgress = empTasks.filter(t => t.status === 'in_progress').length;
  const completionRate = empTasks.length > 0 ? Math.round((completed / empTasks.length) * 100) : 0;

  return (
    <motion.div whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(11,61,46,0.12)' }}
      onClick={() => onClick(employee)}
      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm cursor-pointer transition-all">

      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Avatar name={employee.name} size="lg" photo={employee.photo} />
          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
            employee.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-primary truncate">{employee.name}</h4>
          <p className="text-xs text-primary/40 font-medium">{employee.department?.name || employee.departmentName}</p>
          <span className={`inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${
            employee.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}>
            {employee.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-serif text-primary">{empTasks.length}</p>
          <p className="text-[9px] uppercase tracking-widest font-black text-primary/30">Tasks</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-bold text-primary/40 mb-1.5">
          <span>Completion Rate</span>
          <span className="text-primary">{completionRate}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1 }}
            className={`h-full rounded-full ${completionRate >= 80 ? 'bg-emerald-500' : completionRate >= 50 ? 'bg-accent' : 'bg-red-400'}`} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-50 rounded-xl p-2 text-center">
          <p className="text-sm font-bold text-emerald-600">{completed}</p>
          <p className="text-[9px] uppercase tracking-widest font-black text-emerald-400">Done</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-2 text-center">
          <p className="text-sm font-bold text-blue-600">{inProgress}</p>
          <p className="text-[9px] uppercase tracking-widest font-black text-blue-400">Active</p>
        </div>
        <div className={`rounded-xl p-2 text-center ${overdue > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
          <p className={`text-sm font-bold ${overdue > 0 ? 'text-red-500' : 'text-slate-400'}`}>{overdue}</p>
          <p className={`text-[9px] uppercase tracking-widest font-black ${overdue > 0 ? 'text-red-400' : 'text-slate-300'}`}>Overdue</p>
        </div>
      </div>
    </motion.div>
  );
};

export const EmployeeProfile = ({ employee, tasks, open, onClose }) => {
  if (!employee) return null;

  const empTasks = tasks.filter(t =>
    t.assignedTo?._id === employee._id || t.assignedTo === employee._id
  );
  const completed = empTasks.filter(t => t.status === 'completed');
  const active = empTasks.filter(t => t.status === 'in_progress');
  const overdue = empTasks.filter(t => {
    if (t.status === 'completed') return false;
    return t.dueDate && new Date(t.dueDate) < new Date();
  });
  const completionRate = empTasks.length > 0 ? Math.round((completed.length / empTasks.length) * 100) : 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="relative bg-primary rounded-t-3xl px-8 pt-8 pb-16 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ background: '#c8a248' }} />
              <button onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                <X size={16} className="text-white" />
              </button>
              <div className="relative z-10 flex items-center gap-5">
                <div className="relative">
                  <Avatar name={employee.name} size="xl" photo={employee.photo} />
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-primary ${
                    employee.isOnline ? 'bg-emerald-400' : 'bg-slate-400'
                  }`} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-white">{employee.name}</h2>
                  <p className="text-white/50 text-sm font-medium">{employee.role}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-white/50">
                      <Building2 size={12} />{employee.department?.name || employee.departmentName}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-white/50">
                      <Mail size={12} />{employee.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="mx-6 -mt-8 relative z-10 grid grid-cols-4 gap-3">
              {[
                { label: 'Total', value: empTasks.length, color: 'bg-white border border-gray-100' },
                { label: 'Done', value: completed.length, color: 'bg-emerald-50' },
                { label: 'Active', value: active.length, color: 'bg-blue-50' },
                { label: 'Overdue', value: overdue.length, color: overdue.length > 0 ? 'bg-red-50' : 'bg-slate-50' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${color} rounded-2xl p-3 text-center shadow-sm`}>
                  <p className="text-xl font-serif text-primary">{value}</p>
                  <p className="text-[9px] uppercase tracking-widest font-black text-primary/40">{label}</p>
                </div>
              ))}
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Performance */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Performance</p>
                  <span className="text-sm font-bold text-primary">{completionRate}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${completionRate >= 80 ? 'bg-emerald-500' : completionRate >= 50 ? 'bg-accent' : 'bg-red-400'}`} />
                </div>
              </div>

              {/* Current assignments */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Current Assignments</p>
                {active.length === 0 ? (
                  <p className="text-sm text-primary/30 text-center py-4">No active tasks</p>
                ) : (
                  <div className="space-y-2">
                    {active.map(task => (
                      <div key={task._id} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
                        <PriorityBadge priority={task.priority} />
                        <span className="flex-1 text-sm text-primary font-medium truncate">{task.title}</span>
                        <span className="text-xs text-primary/30 font-medium">{formatDate(task.dueDate)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Overdue tasks */}
              {overdue.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-red-400 mb-3 flex items-center gap-1.5">
                    <AlertCircle size={10} />Overdue Tasks
                  </p>
                  <div className="space-y-2">
                    {overdue.map(task => (
                      <div key={task._id} className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-2xl">
                        <span className="flex-1 text-sm text-red-700 font-medium truncate">{task.title}</span>
                        <span className="text-xs text-red-400 font-bold">{formatDate(task.dueDate)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed tasks */}
              {completed.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={10} />Recently Completed
                  </p>
                  <div className="space-y-2">
                    {completed.slice(0, 5).map(task => (
                      <div key={task._id} className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-2xl">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        <span className="flex-1 text-sm text-emerald-700 font-medium truncate line-through opacity-70">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
