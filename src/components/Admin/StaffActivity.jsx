import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, AlertCircle, Plus, 
  User, Shield, Search, MoreVertical,
  X, Mail, Lock, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const StaffActivity = () => {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'AGENT' });
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '', bookingId: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, staffRes, activityRes, bookingsRes] = await Promise.all([
        api.get('/admin/tasks'), api.get('/admin/staff'), api.get('/admin/activity'), api.get('/bookings?limit=200&page=1')
      ]);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
      setActivities(Array.isArray(activityRes.data) ? activityRes.data : []);
      setBookings(listItemsFromResponse(bookingsRes));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/tasks', newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '', bookingId: '' });
      fetchData();
    } catch (error) { alert('Error creating task'); }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/staff', newStaff);
      setShowAddModal(false);
      setNewStaff({ name: '', email: '', password: '', role: 'AGENT' });
      fetchData();
    } catch (error) { alert(error.response?.data?.message || 'Error adding staff'); }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/admin/tasks/${taskId}`, { status });
      fetchData();
    } catch (error) { console.error('Error updating task:', error); }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online': return 'bg-emerald-500';
      case 'working': return 'bg-amber-500';
      case 'away': return 'bg-slate-300';
      case 'offline': return 'bg-rose-500';
      default: return 'bg-slate-200';
    }
  };

  const filteredTasks = tasks.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStaff = staff.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 rounded-3xl border border-white/5 p-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {['tasks', 'staff', 'activity'].map((v) => (
            <button 
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                view === v ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {v === 'tasks' ? 'Tasks' : v === 'staff' ? 'Staff' : 'Activity'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input 
              type="text" 
              placeholder={`Search ${view}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <button 
            onClick={() => view === 'staff' ? setShowAddModal(true) : setShowTaskModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Plus size={14} />
            {view === 'staff' ? 'Add Staff' : 'New Task'}
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)' }}>
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Create Task</h3>
                <button onClick={() => setShowTaskModal(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                <input required placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 h-24" />
                <div className="grid grid-cols-2 gap-3">
                  <select required value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none">
                    <option value="" className="text-black">Assign To...</option>
                    {Array.isArray(staff) && staff.map(s => <option key={s?._id} value={s?._id} className="text-black">{s?.name || 'Anonymous'}</option>)}
                  </select>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none">
                    <option value="low" className="text-black">Low</option>
                    <option value="medium" className="text-black">Medium</option>
                    <option value="high" className="text-black">High</option>
                    <option value="urgent" className="text-black">Urgent</option>
                  </select>
                </div>
                <input type="date" value={newTask.deadline} onChange={(e) => setNewTask({...newTask, deadline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" />
                <button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-indigo-600 transition-all">Create Task</button>
              </form>
            </motion.div>
          </div>
        )}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md rounded-3xl border border-white/10 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)' }}>
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Add Staff Member</h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleAddStaff} className="p-6 space-y-4">
                <input required type="text" placeholder="Full Name" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                <input required type="email" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                <input required type="password" placeholder="Password" value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
                <div className="flex gap-2">
                  {['AGENT', 'MANAGER', 'ADMIN'].map((role) => (
                    <button type="button" key={role} onClick={() => setNewStaff({...newStaff, role})} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${newStaff.role === role ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'}`}>{role}</button>
                  ))}
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-indigo-600 transition-all">Add Staff</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tasks View */}
      {view === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {(filteredTasks || []).map((task) => (
              <motion.div 
                key={task?._id || Math.random()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/5 p-5 hover:border-white/10 transition-all" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    task?.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                    task?.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/10 text-white/50'
                  }`}>{task?.priority || 'Medium'}</span>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Clock size={12} />
                    {task?.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                  </div>
                </div>
                <h4 className="text-base font-semibold text-white mb-4">{task?.title || 'Task'}</h4>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/50">Progress</span>
                    <span className="text-white">{task?.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${task?.progress || 0}%` }} className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40"><User size={14} /></div>
                    <span className="text-xs text-white/60">{task?.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                  <button onClick={() => handleUpdateTaskStatus(task._id, task?.status === 'done' ? 'pending' : 'done')} className={`text-xs font-medium ${task?.status === 'done' ? 'text-emerald-400' : 'text-white/40 hover:text-white'}`}>
                    {task?.status === 'done' ? 'Done' : 'Mark Complete'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Staff View */}
      {view === 'staff' && (
        <div className="rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Name</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Role</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Status</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40">Tasks</th>
                <th className="px-5 py-4 text-xs uppercase font-medium text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(filteredStaff || []).map((member) => (
                <tr key={member?._id || Math.random()} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                          {(member?.name || 'U').charAt(0)}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-slate-800 rounded-full ${getStatusColor(member?.status)}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{member?.name || 'Member'}</p>
                        <p className="text-xs text-white/40">UID: VISTA-{member?._id ? member._id.slice(-4).toUpperCase() : 'NEW'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-white/60">{member.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                      member.status === 'working' ? 'bg-amber-500/20 text-amber-400' :
                      member.status === 'away' ? 'bg-white/10 text-white/50' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>{member.status || 'offline'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-white/70">{(tasks || []).filter(t => t?.assignedTo?._id === member?._id && t?.status !== 'done').length} active</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Activity View */}
      {view === 'activity' && (
        <div className="rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="p-5 border-b border-white/5">
            <h3 className="text-base font-semibold text-white">Activity Log</h3>
          </div>
          <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
            {(!activities || activities.length === 0) ? (
              <div className="p-12 text-center text-sm text-white/40">No activity recorded yet</div>
            ) : (
              activities.map((log) => (
                <div key={log?._id || Math.random()} className="p-5 hover:bg-white/5 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                      <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{log?.staffId?.name || 'System'}</p>
                      <p className="text-xs text-white/40">{log?.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-white/50">{log?.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '--:--'}</p>
                    <p className="text-xs text-white/30">{log?.timestamp ? new Date(log.timestamp).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffActivity;
