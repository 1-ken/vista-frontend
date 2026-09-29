import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Flag, Building2, Users } from 'lucide-react';
import { useTask } from './TaskContext';
import { PRIORITIES, STATUSES, priorityConfig, statusConfig } from './TaskUtils';

const TaskForm = ({ open, onClose, task = null }) => {
  const { createTask, updateTask, employees, departments, user } = useTask();
  const isEdit = !!task;

  const blank = {
    title: '', description: '', priority: 'medium', status: 'not_started',
    dueDate: '', department: '', assignedTo: '', collaborators: [],
    checklist: [], tags: ''
  };

  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkItem, setCheckItem] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'not_started',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        department: task.department?._id || task.department || '',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
        collaborators: task.collaborators?.map(c => c._id || c) || [],
        checklist: task.checklist || [],
        tags: task.tags?.join(', ') || ''
      });
    } else {
      setForm(blank);
    }
  }, [task, open]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addCheckItem = () => {
    if (!checkItem.trim()) return;
    set('checklist', [...form.checklist, { text: checkItem.trim(), done: false }]);
    setCheckItem('');
  };

  const removeCheckItem = (i) => set('checklist', form.checklist.filter((_, idx) => idx !== i));

  const toggleCollab = (id) => {
    set('collaborators', form.collaborators.includes(id)
      ? form.collaborators.filter(c => c !== id)
      : [...form.collaborators, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      if (isEdit) await updateTask(task._id, payload);
      else await createTask(payload);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  const canAssign = user?.role === 'super_admin' || user?.role === 'manager';

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
            <div className="sticky top-0 bg-white px-8 pt-8 pb-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-serif text-primary">{isEdit ? 'Edit Task' : 'New Task'}</h3>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-0.5">
                  {isEdit ? 'Update task details' : 'Create a new task assignment'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X size={18} className="text-primary/50" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Task Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Prepare Kenya Safari Quotation"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={3} placeholder="Describe the task in detail..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary resize-none" />
              </div>

              {/* Priority + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    <Flag size={10} className="inline mr-1" />Priority
                  </label>
                  <select value={form.priority} onChange={e => set('priority', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary">
                    {PRIORITIES.map(p => (
                      <option key={p} value={p}>{priorityConfig[p].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary">
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date + Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    <Calendar size={10} className="inline mr-1" />Due Date
                  </label>
                  <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    <Building2 size={10} className="inline mr-1" />Department
                  </label>
                  <select value={form.department} onChange={e => set('department', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary">
                    <option value="">Select department</option>
                    {departments.map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assign To */}
              {canAssign && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    <User size={10} className="inline mr-1" />Assign To
                  </label>
                  <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary">
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name} — {emp.department?.name || emp.departmentName}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Collaborators */}
              {canAssign && employees.length > 0 && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    <Users size={10} className="inline mr-1" />Collaborators (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {employees.filter(e => e._id !== form.assignedTo).map(emp => (
                      <button key={emp._id} type="button"
                        onClick={() => toggleCollab(emp._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          form.collaborators.includes(emp._id)
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}>
                        {emp.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Checklist</label>
                <div className="flex gap-2 mb-2">
                  <input value={checkItem} onChange={e => setCheckItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCheckItem())}
                    placeholder="Add checklist item..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-accent/40 text-sm text-primary" />
                  <button type="button" onClick={addCheckItem}
                    className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-accent hover:text-primary transition-all">
                    Add
                  </button>
                </div>
                {form.checklist.length > 0 && (
                  <div className="space-y-1.5">
                    {form.checklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                        <span className="flex-1 text-sm text-primary">{item.text}</span>
                        <button type="button" onClick={() => removeCheckItem(i)}
                          className="text-slate-300 hover:text-red-400 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="safari, kenya, quotation"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-accent/40 text-sm text-primary" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-3.5 border border-slate-200 text-slate-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3.5 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all disabled:opacity-50">
                  {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskForm;
