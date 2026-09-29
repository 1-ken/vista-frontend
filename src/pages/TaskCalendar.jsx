import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PriorityBadge, isOverdue } from './TaskUtils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const TaskCalendar = ({ tasks, onTaskClick }) => {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const getTasksForDay = (day) => {
    const date = new Date(current.year, current.month, day);
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getFullYear() === date.getFullYear() &&
             d.getMonth() === date.getMonth() &&
             d.getDate() === date.getDate();
    });
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day) => day && today.getDate() === day &&
    today.getMonth() === current.month && today.getFullYear() === current.year;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-serif text-primary">
          {MONTHS[current.month]} {current.year}
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-2 hover:bg-primary/5 rounded-xl transition-all text-primary/50 hover:text-primary">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
            className="px-3 py-1.5 text-xs font-bold text-primary/50 hover:bg-primary/5 rounded-xl transition-all uppercase tracking-widest">
            Today
          </button>
          <button onClick={next} className="p-2 hover:bg-primary/5 rounded-xl transition-all text-primary/50 hover:text-primary">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-50">
        {DAYS.map(d => (
          <div key={d} className="px-2 py-3 text-center text-[10px] font-black text-primary/30 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dayTasks = day ? getTasksForDay(day) : [];
          return (
            <div key={i} className={`min-h-[100px] p-2 border-b border-r border-gray-50 last:border-r-0 ${
              !day ? 'bg-slate-50/50' : 'hover:bg-primary/[0.01]'
            }`}>
              {day && (
                <>
                  <span className={`inline-flex w-7 h-7 items-center justify-center rounded-xl text-xs font-bold mb-1 ${
                    isToday(day)
                      ? 'bg-primary text-white'
                      : 'text-primary/50 hover:bg-primary/5'
                  }`}>
                    {day}
                  </span>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => {
                      const overdue = isOverdue(task.dueDate, task.status);
                      return (
                        <button key={task._id} onClick={() => onTaskClick(task)}
                          className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold truncate transition-all hover:opacity-80 ${
                            overdue ? 'bg-red-50 text-red-600' :
                            task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                            task.priority === 'critical' ? 'bg-red-50 text-red-500' :
                            task.priority === 'high' ? 'bg-amber-50 text-amber-600' :
                            'bg-primary/10 text-primary'
                          }`}>
                          {task.title}
                        </button>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <span className="text-[9px] text-primary/30 font-bold px-2">+{dayTasks.length - 3} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCalendar;
