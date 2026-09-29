import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Paperclip, MessageSquare, Clock, CheckSquare, Square, Send, Upload, Edit2, Trash2, Lock } from 'lucide-react';
import { useTask } from './TaskContext';
import { PriorityBadge, StatusBadge, Avatar, formatDate, isOverdue, daysUntil } from './TaskUtils';
import api from '../api/axios';

const TaskDetail = ({ task: initialTask, open, onClose, onEdit, onDelete }) => {
  const { user, addComment, uploadAttachment, updateTask, getHeaders } = useTask();
  const [task, setTask] = useState(initialTask);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => { setTask(initialTask); }, [initialTask]);

  const canEdit = user?.role === 'super_admin' || user?.role === 'manager' ||
    task?.assignedTo?._id === user?._id || task?.assignedTo === user?._id;

  const canDelete = user?.role === 'super_admin';

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const updated = await addComment(task._id, comment);
      setTask(updated);
      setComment('');
    } catch { } finally { setSubmitting(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const updated = await uploadAttachment(task._id, fd);
      setTask(updated);
    } catch { } finally { setUploading(false); }
  };

  const toggleCheckItem = async (idx) => {
    if (!canEdit) return;
    const checklist = task.checklist.map((item, i) =>
      i === idx ? { ...item, done: !item.done } : item
    );
    const updated = await updateTask(task._id, { checklist });
    setTask(updated);
  };

  const updateProgress = async (progress) => {
    if (!canEdit) return;
    const updated = await updateTask(task._id, { progress: Number(progress) });
    setTask(updated);
  };

  const updateStatus = async (status) => {
    if (!canEdit) return;
    const updated = await updateTask(task._id, { status });
    setTask(updated);
  };

  if (!task) return null;

  const overdue = isOverdue(task.dueDate, task.status);
  const days = daysUntil(task.dueDate);
  const checkDone = task.checklist?.filter(c => c.done).length || 0;
  const checkTotal = task.checklist?.length || 0;

  const tabs = ['details', 'comments', 'activity', 'attachments'];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="px-8 pt-7 pb-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={overdue ? 'overdue' : task.status} />
                    {task.department?.name && (
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {task.department.name}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-serif text-primary leading-tight">{task.title}</h2>
                  {task.dueDate && (
                    <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${overdue ? 'text-red-500' : days <= 2 ? 'text-amber-500' : 'text-primary/40'}`}>
                      <Clock size={11} />
                      {overdue ? `Overdue by ${Math.abs(days)} day(s)` : days === 0 ? 'Due today' : `Due in ${days} day(s) — ${formatDate(task.dueDate)}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {canEdit && (
                    <button onClick={() => onEdit(task)} className="p-2 hover:bg-primary/5 rounded-xl transition-all text-primary/50 hover:text-primary">
                      <Edit2 size={16} />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => { onDelete(task._id); onClose(); }}
                      className="p-2 hover:bg-red-50 rounded-xl transition-all text-primary/50 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                    <X size={18} className="text-primary/50" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-5">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab ? 'bg-primary text-white' : 'text-primary/40 hover:bg-primary/5'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6">

              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Assigned + Collaborators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Assigned To</p>
                      {task.assignedTo ? (
                        <div className="flex items-center gap-3">
                          <Avatar name={task.assignedTo.name || 'U'} photo={task.assignedTo.photo} />
                          <div>
                            <p className="text-sm font-semibold text-primary">{task.assignedTo.name || 'Unknown'}</p>
                            <p className="text-xs text-primary/40">{task.assignedTo.department?.name || ''}</p>
                          </div>
                        </div>
                      ) : <p className="text-sm text-primary/40">Unassigned</p>}
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Collaborators</p>
                      {task.collaborators?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {task.collaborators.map((c, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Avatar name={c.name || 'C'} size="sm" photo={c.photo} />
                              <span className="text-xs text-primary font-medium">{c.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-primary/40">None</p>}
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Description</p>
                      <p className="text-sm text-primary/70 leading-relaxed bg-slate-50 rounded-2xl p-4">{task.description}</p>
                    </div>
                  )}

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Progress</p>
                      <span className="text-sm font-bold text-primary">{task.progress || 0}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={task.progress || 0}
                      onChange={e => updateProgress(e.target.value)}
                      disabled={!canEdit}
                      className="w-full accent-primary" />
                    <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <motion.div animate={{ width: `${task.progress || 0}%` }}
                        className="h-full bg-primary rounded-full" />
                    </div>
                  </div>

                  {/* Status update */}
                  {canEdit && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {['not_started','in_progress','waiting','completed'].map(s => (
                          <button key={s} onClick={() => updateStatus(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              task.status === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}>
                            {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Checklist */}
                  {task.checklist?.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Checklist</p>
                        <span className="text-xs font-bold text-primary/40">{checkDone}/{checkTotal}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: checkTotal ? `${(checkDone / checkTotal) * 100}%` : '0%' }} />
                      </div>
                      <div className="space-y-2">
                        {task.checklist.map((item, i) => (
                          <button key={i} onClick={() => toggleCheckItem(i)}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-left">
                            {item.done
                              ? <CheckSquare size={16} className="text-emerald-500 flex-shrink-0" />
                              : <Square size={16} className="text-slate-300 flex-shrink-0" />}
                            <span className={`text-sm ${item.done ? 'line-through text-primary/30' : 'text-primary'}`}>
                              {item.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {task.tags?.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-accent/10 text-accent-dark rounded-lg text-xs font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {task.comments?.length === 0 && (
                    <p className="text-sm text-primary/40 text-center py-8">No comments yet. Be the first to comment.</p>
                  )}
                  {task.comments?.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <Avatar name={c.author?.name || 'U'} size="sm" photo={c.author?.photo} />
                      <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-primary">{c.author?.name || 'Unknown'}</span>
                          <span className="text-[10px] text-primary/30">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-primary/70">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <form onSubmit={handleComment} className="flex gap-3 pt-2">
                    <Avatar name={user?.name || 'U'} size="sm" />
                    <div className="flex-1 flex gap-2">
                      <input value={comment} onChange={e => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-accent/40 text-sm text-primary" />
                      <button type="submit" disabled={submitting || !comment.trim()}
                        className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-accent hover:text-primary transition-all disabled:opacity-50">
                        <Send size={14} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="relative space-y-4">
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-primary/10" />
                  {task.activityLog?.length === 0 && (
                    <p className="text-sm text-primary/40 text-center py-8">No activity recorded yet.</p>
                  )}
                  {task.activityLog?.map((log, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock size={12} className="text-primary/50" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm text-primary">{log.action}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-primary/40">{log.performedBy?.name || 'System'}</span>
                          <span className="text-[10px] text-primary/30">•</span>
                          <span className="text-[10px] text-primary/30">{formatDate(log.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  {canEdit && (
                    <label className="flex items-center gap-3 px-5 py-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all">
                      <Upload size={18} className="text-primary/40" />
                      <span className="text-sm text-primary/50 font-medium">
                        {uploading ? 'Uploading...' : 'Click to upload attachment'}
                      </span>
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  )}
                  {task.attachments?.length === 0 && (
                    <p className="text-sm text-primary/40 text-center py-6">No attachments yet.</p>
                  )}
                  {task.attachments?.map((att, i) => (
                    <a key={i} href={att.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                      <Paperclip size={14} className="text-primary/40" />
                      <span className="text-sm text-primary font-medium flex-1 truncate">{att.filename}</span>
                      <span className="text-xs text-primary/30">{formatDate(att.uploadedAt)}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetail;
