import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Kanban, Table2, Calendar, Users, BarChart3,
  Plus, Search, Filter, Bell, LogOut, ChevronDown, X,
  CheckCircle2, Clock, AlertTriangle, TrendingUp, Building2
} from 'lucide-react';
import { useTask } from './TaskContext';
import TaskBoard from './TaskBoard';
import TaskTable from './TaskTable';
import TaskCalendar from './TaskCalendar';
import TaskForm from './TaskForm';
import TaskDetail from './TaskDetail';
import { EmployeeCard, EmployeeProfile } from './EmployeeWidgets';
import TaskReports from './TaskReports';
import { Avatar, isOverdue, statusConfig, priorityConfig } from './TaskUtils';
import Logo from '../components/Logo';

const StatCard = ({ icon: Icon, label, value, sub, accent, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest font-black text-primary/40 mb-1">{label}</p>
        <h3 className="text-3xl font-serif text-primary">{value}</h3>
        {sub && <p className="text-xs text-primary/40 font-medium mt-1">{sub}</p>}
      </div>
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: accent }}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const VIEWS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'board',    icon: Kanban,          label: 'Board' },
  { id: 'table',    icon: Table2,          label: 'Table' },
  { id: 'calendar', icon: Calendar,        label: 'Calendar' },
  { id: 'team',     icon: Users,           label: 'Team' },
  { id: 'reports',  icon: BarChart3,       label: 'Reports' },
];

const TaskDashboard = () => {
  const { user, logout, tasks, employees, departments, notifications, fetchTasks, deleteTask, loading } = useTask();
  const [view, setView] = useState('overview');
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', department: '' });
  const [showFilters, setShowFilters] = useState(false);

  if (!user) return <Navigate to="/tasks/login" replace />;

  const isEmployee = user.role === 'employee';
  const canCreate = user.role === 'super_admin' || user.role === 'manager';

  const filteredTasks = tasks.filter(t => {
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.department && t.department?._id !== filters.department && t.department !== filters.department) return false;
    return true;
  });

  const totalTasks = tasks.length;
  const completedToday = tasks.filter(t => {
    if (t.status !== 'completed') return false;
    const d = new Date(t.updatedAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleEdit = (task) => { setEditTask(task); setFormOpen(true); setDetailTask(null); };
  const handleDelete = async (id) => { if (window.confirm('Delete this task?')) await deleteTask(id); };
  const handleNewTask = () => { setEditTask(null); setFormOpen(true); };

  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));
  const clearFilters = () => setFilters({ search: '', status: '', priority: '', department: '' });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 z-40 hidden lg:flex flex-col p-3">
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(180deg, #0b3d2e 0%, #072a1f 100%)' }}>
          <div className="px-5 py-5 border-b border-white/10 flex items-center justify-center">
            <Logo height={80} width={240} inverted />
          </div>
          <div className="px-3 py-2 mx-3 mt-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[9px] uppercase tracking-widest font-black text-white/30 mb-1">Signed in as</p>
            <div className="flex items-center gap-2">
              <Avatar name={user.name} size="sm" photo={user.photo} />
              <div className="min-w-0">
                <p className="text-white text-xs font-bold truncate">{user.name}</p>
                <p className="text-white/40 text-[10px] capitalize">{user.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {VIEWS.filter(v => !isEmployee || ['board', 'table', 'calendar'].includes(v.id)).map(v => (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group relative ${
                  view === v.id ? 'bg-accent/15' : 'hover:bg-white/5'
                }`}>
                {view === v.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-accent rounded-r-full" />}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  view === v.id ? 'bg-accent text-primary shadow-lg shadow-accent/30' : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70'
                }`}>
                  <v.icon size={15} />
                </div>
                <span className={`text-[13px] font-medium ${view === v.id ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                  {v.label}
                </span>
              </button>
            ))}
          </nav>
          <div className="px-3 pb-4">
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-red-500/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all">
                <LogOut size={15} />
              </div>
              <span className="text-[13px] font-medium text-white/50 group-hover:text-red-400">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="px-4 lg:px-6 pt-4 lg:pt-5">
          <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 border border-primary/10 shadow-sm">
            <div>
              <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Task Management</p>
              <h6 className="text-base font-bold text-primary capitalize">{view === 'overview' ? 'Dashboard' : view}</h6>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl">
                <Search size={13} className="text-primary/40" />
                <input value={filters.search} onChange={e => setFilter('search', e.target.value)}
                  placeholder="Search tasks..." className="bg-transparent outline-none text-sm text-primary/70 w-36 placeholder:text-primary/30" />
              </div>

              {/* Filter toggle */}
              <button onClick={() => setShowFilters(p => !p)}
                className={`p-2.5 rounded-xl transition-all relative ${showFilters || hasFilters ? 'bg-primary text-white' : 'text-primary/50 hover:bg-primary/5'}`}>
                <Filter size={16} />
                {hasFilters && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotif(p => !p)}
                  className="p-2.5 text-primary/50 hover:bg-primary/5 rounded-xl transition-all relative">
                  <Bell size={16} />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {unreadNotifs}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotif && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden z-50">
                      <div className="px-5 py-4 border-b border-primary/5 flex justify-between items-center">
                        <span className="text-sm font-bold text-primary">Notifications</span>
                        <button onClick={() => setShowNotif(false)}><X size={14} className="text-primary/40" /></button>
                      </div>
                      {notifications.length === 0
                        ? <p className="px-5 py-8 text-sm text-primary/40 text-center">No notifications</p>
                        : notifications.slice(0, 6).map((n, i) => (
                          <div key={i} className={`px-5 py-3.5 border-b border-primary/5 last:border-0 ${!n.read ? 'bg-accent/5' : ''}`}>
                            <p className="text-sm font-medium text-primary">{n.message}</p>
                            <p className="text-xs text-primary/30 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* New Task */}
              {canCreate && (
                <button onClick={handleNewTask}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-sm">
                  <Plus size={14} />
                  <span className="hidden sm:inline">New Task</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-white rounded-2xl border border-primary/10 px-5 py-4 flex flex-wrap gap-3 items-center">
                <select value={filters.status} onChange={e => setFilter('status', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-primary focus:outline-none focus:border-accent/40">
                  <option value="">All Statuses</option>
                  {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={filters.priority} onChange={e => setFilter('priority', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-primary focus:outline-none focus:border-accent/40">
                  <option value="">All Priorities</option>
                  {Object.entries(priorityConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={filters.department} onChange={e => setFilter('department', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-primary focus:outline-none focus:border-accent/40">
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                {hasFilters && (
                  <button onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">
                    <X size={12} />Clear
                  </button>
                )}
                <span className="text-xs text-primary/30 font-bold ml-auto">{filteredTasks.length} tasks</span>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 pt-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Overview */}
              {view === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard icon={CheckCircle2} label="Total Tasks"      value={totalTasks}      sub={`${filteredTasks.length} matching filters`} accent="#0b3d2e" delay={0} />
                    <StatCard icon={TrendingUp}  label="Completed Today"   value={completedToday}  sub="tasks finished today"                        accent="#c8a248" delay={0.1} />
                    <StatCard icon={AlertTriangle} label="Overdue"         value={overdueTasks}    sub="need immediate attention"                    accent={overdueTasks > 0 ? '#ef4444' : '#0b3d2e'} delay={0.2} />
                    <StatCard icon={Clock}       label="In Progress"       value={inProgressTasks} sub="currently being worked on"                   accent="#3b82f6" delay={0.3} />
                  </div>

                  {/* Department breakdown */}
                  {!isEmployee && departments.length > 0 && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-lg font-serif text-primary mb-5">Department Overview</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {departments.map(dept => {
                          const deptTasks = tasks.filter(t => t.department?._id === dept._id || t.department === dept._id);
                          const deptDone = deptTasks.filter(t => t.status === 'completed').length;
                          const pct = deptTasks.length > 0 ? Math.round((deptDone / deptTasks.length) * 100) : 0;
                          return (
                            <div key={dept._id} className="bg-slate-50 rounded-2xl p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Building2 size={14} className="text-primary/40" />
                                <span className="text-xs font-bold text-primary truncate">{dept.name}</span>
                              </div>
                              <div className="flex justify-between text-[10px] font-bold text-primary/40 mb-1.5">
                                <span>{deptTasks.length} tasks</span><span>{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent tasks */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="text-lg font-serif text-primary">Recent Tasks</h3>
                      <button onClick={() => setView('table')} className="text-xs font-bold text-primary/40 hover:text-primary transition-colors uppercase tracking-widest">
                        View All →
                      </button>
                    </div>
                    <TaskTable tasks={filteredTasks.slice(0, 8)} onTaskClick={setDetailTask} onEdit={handleEdit} onDelete={handleDelete} />
                  </div>
                </div>
              )}

              {view === 'board' && (
                <TaskBoard tasks={filteredTasks} onTaskClick={setDetailTask} onNewTask={handleNewTask} />
              )}

              {view === 'table' && (
                <TaskTable tasks={filteredTasks} onTaskClick={setDetailTask} onEdit={handleEdit} onDelete={handleDelete} />
              )}

              {view === 'calendar' && (
                <TaskCalendar tasks={filteredTasks} onTaskClick={setDetailTask} />
              )}

              {view === 'team' && !isEmployee && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {employees.map(emp => (
                      <EmployeeCard key={emp._id} employee={emp} tasks={tasks} onClick={setSelectedEmployee} />
                    ))}
                  </div>
                </div>
              )}

              {view === 'reports' && !isEmployee && (
                <TaskReports tasks={tasks} employees={employees} departments={departments} />
              )}
            </>
          )}
        </main>

        <footer className="px-6 pb-5">
          <p className="text-center text-xs text-primary/20">© 2025 VistaVoyage Travel Group — Task Management System</p>
        </footer>
      </div>

      {/* Modals */}
      <TaskForm open={formOpen} onClose={() => { setFormOpen(false); setEditTask(null); }} task={editTask} />
      <TaskDetail task={detailTask} open={!!detailTask} onClose={() => setDetailTask(null)}
        onEdit={handleEdit} onDelete={handleDelete} />
      <EmployeeProfile employee={selectedEmployee} tasks={tasks} open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)} />
    </div>
  );
};

export default TaskDashboard;
