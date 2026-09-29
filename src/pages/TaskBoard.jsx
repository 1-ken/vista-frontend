import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import { PriorityBadge, Avatar, formatDate, isOverdue, daysUntil, statusConfig } from './TaskUtils';
import { useTask } from './TaskContext';

const COLUMNS = [
  { id: 'not_started', label: 'Not Started', accent: '#94a3b8' },
  { id: 'in_progress', label: 'In Progress', accent: '#3b82f6' },
  { id: 'waiting',     label: 'Waiting',     accent: '#f59e0b' },
  { id: 'completed',   label: 'Completed',   accent: '#10b981' },
];

const TaskCard = ({ task, onClick }) => {
  const overdue = isOverdue(task.dueDate, task.status);
  const days = daysUntil(task.dueDate);
  const checkDone = task.checklist?.filter(c => c.done).length || 0;
  const checkTotal = task.checklist?.length || 0;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(11,61,46,0.12)' }}
      onClick={() => onClick(task)}
      className="bg-white rounded-2xl p-4 cursor-pointer border border-gray-100 shadow-sm transition-all">

      <div className="flex items-start justify-between gap-2 mb-3">
        <PriorityBadge priority={task.priority} />
        {task.department?.name && (
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary/30 bg-primary/5 px-2 py-1 rounded-lg">
            {task.department.name}
          </span>
        )}
      </div>

      <h4 className="text-sm font-semibold text-primary leading-snug mb-3 line-clamp-2">{task.title}</h4>

      {checkTotal > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-primary/40 font-bold mb-1">
            <span>Checklist</span><span>{checkDone}/{checkTotal}</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(checkDone / checkTotal) * 100}%` }} />
          </div>
        </div>
      )}

      {task.progress > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-primary/40 font-bold mb-1">
            <span>Progress</span><span>{task.progress}%</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          {task.assignedTo && (
            <Avatar name={task.assignedTo.name || 'U'} size="sm" photo={task.assignedTo.photo} />
          )}
          {task.collaborators?.slice(0, 2).map((c, i) => (
            <Avatar key={i} name={c.name || 'C'} size="sm" photo={c.photo} />
          ))}
          {task.collaborators?.length > 2 && (
            <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
              +{task.collaborators.length - 2}
            </span>
          )}
        </div>
        {task.dueDate && (
          <span className={`text-[10px] font-bold ${overdue ? 'text-red-500' : days <= 2 ? 'text-amber-500' : 'text-primary/30'}`}>
            {overdue ? 'Overdue' : days === 0 ? 'Today' : formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const TaskBoard = ({ tasks, onTaskClick, onNewTask }) => {
  const { user } = useTask();
  const canCreate = user?.role === 'super_admin' || user?.role === 'manager';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pb-6">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => {
          if (isOverdue(t.dueDate, t.status) && col.id === 'overdue') return true;
          return t.status === col.id;
        });

        return (
          <div key={col.id} className="flex flex-col gap-3">
            {/* Column header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.accent }} />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{col.label}</span>
                <span className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  {colTasks.length}
                </span>
              </div>
              {canCreate && col.id === 'not_started' && (
                <button onClick={onNewTask}
                  className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <Plus size={12} />
                </button>
              )}
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[200px]">
              {colTasks.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-100 p-6 text-center">
                  <p className="text-xs text-primary/20 font-bold uppercase tracking-widest">Empty</p>
                </div>
              ) : (
                colTasks.map(task => (
                  <TaskCard key={task._id} task={task} onClick={onTaskClick} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;
