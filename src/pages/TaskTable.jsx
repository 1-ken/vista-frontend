import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit2, Trash2, Eye } from 'lucide-react';
import { PriorityBadge, StatusBadge, Avatar, formatDate, isOverdue } from './TaskUtils';
import { useTask } from './TaskContext';

const TaskTable = ({ tasks, onTaskClick, onEdit, onDelete }) => {
  const { user } = useTask();
  const [sortKey, setSortKey] = useState('dueDate');
  const [sortDir, setSortDir] = useState('asc');

  const canDelete = user?.role === 'super_admin';
  const canEdit = user?.role === 'super_admin' || user?.role === 'manager';

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...tasks].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (sortKey === 'assignedTo') { av = a.assignedTo?.name || ''; bv = b.assignedTo?.name || ''; }
    if (sortKey === 'department') { av = a.department?.name || ''; bv = b.department?.name || ''; }
    if (!av) return 1; if (!bv) return -1;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : <ChevronUp size={12} className="opacity-20" />;

  const cols = [
    { key: 'title', label: 'Task' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'priority', label: 'Priority' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'progress', label: 'Progress' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              {cols.map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)}
                  className="px-5 py-4 text-[10px] uppercase font-black text-primary/40 tracking-widest cursor-pointer hover:text-primary transition-colors whitespace-nowrap">
                  <span className="flex items-center gap-1">{col.label}<SortIcon k={col.key} /></span>
                </th>
              ))}
              <th className="px-5 py-4 text-[10px] uppercase font-black text-primary/40 tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={cols.length + 1} className="px-5 py-16 text-center text-sm text-primary/30">
                  No tasks found
                </td>
              </tr>
            ) : sorted.map(task => {
              const overdue = isOverdue(task.dueDate, task.status);
              return (
                <tr key={task._id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-5 py-4 max-w-[220px]">
                    <p className="text-sm font-semibold text-primary truncate">{task.title}</p>
                    {task.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {task.tags.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[9px] bg-accent/10 text-accent-dark px-1.5 py-0.5 rounded font-bold">#{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignedTo.name || 'U'} size="sm" photo={task.assignedTo.photo} />
                        <span className="text-sm text-primary font-medium whitespace-nowrap">{task.assignedTo.name}</span>
                      </div>
                    ) : <span className="text-sm text-primary/30">Unassigned</span>}
                  </td>
                  <td className="px-5 py-4"><PriorityBadge priority={task.priority} /></td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-primary/60 font-medium">{task.department?.name || '—'}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={overdue ? 'overdue' : task.status} /></td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${overdue ? 'text-red-500' : 'text-primary/60'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${task.progress || 0}%` }} />
                      </div>
                      <span className="text-xs font-bold text-primary/40">{task.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onTaskClick(task)}
                        className="p-1.5 hover:bg-primary/10 rounded-lg transition-all text-primary/50 hover:text-primary">
                        <Eye size={14} />
                      </button>
                      {canEdit && (
                        <button onClick={() => onEdit(task)}
                          className="p-1.5 hover:bg-primary/10 rounded-lg transition-all text-primary/50 hover:text-primary">
                          <Edit2 size={14} />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => onDelete(task._id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-all text-primary/50 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
