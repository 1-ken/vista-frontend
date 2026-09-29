import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const TaskContext = createContext(null);
export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('taskUser')); } catch { return null; }
  });
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = (u = user) => ({ headers: { Authorization: `Bearer ${u?.token}` } });

  const login = async (email, password) => {
    const { data } = await api.post('/tasks/auth/login', { email, password });
    localStorage.setItem('taskUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('taskUser');
    setUser(null);
    setTasks([]);
  };

  const fetchTasks = useCallback(async (filters = {}) => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/tasks?${params}`, getHeaders());
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch { setTasks([]); } finally { setLoading(false); }
  }, [user]);

  const fetchEmployees = useCallback(async () => {
    if (!user || user.role === 'employee') return;
    try {
      const { data } = await api.get('/tasks/employees', getHeaders());
      setEmployees(Array.isArray(data) ? data : []);
    } catch { setEmployees([]); }
  }, [user]);

  const fetchDepartments = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/tasks/departments', getHeaders());
      setDepartments(Array.isArray(data) ? data : []);
    } catch { setDepartments([]); }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/tasks/notifications', getHeaders());
      setNotifications(Array.isArray(data) ? data : []);
    } catch { setNotifications([]); }
  }, [user]);

  const createTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData, getHeaders());
    await fetchTasks();
    return data;
  };

  const updateTask = async (id, updates) => {
    const { data } = await api.put(`/tasks/${id}`, updates, getHeaders());
    setTasks(prev => prev.map(t => t._id === id ? data : t));
    return data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`, getHeaders());
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  const addComment = async (taskId, text) => {
    const { data } = await api.post(`/tasks/${taskId}/comments`, { text }, getHeaders());
    return data;
  };

  const uploadAttachment = async (taskId, formData) => {
    const { data } = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data' }
    });
    return data;
  };

  const markNotificationRead = async (id) => {
    await api.put(`/tasks/notifications/${id}/read`, {}, getHeaders());
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchEmployees();
      fetchDepartments();
      fetchNotifications();
    }
  }, [user]);

  return (
    <TaskContext.Provider value={{
      user, login, logout, tasks, employees, departments, notifications,
      loading, fetchTasks, fetchEmployees, fetchDepartments, fetchNotifications,
      createTask, updateTask, deleteTask, addComment, uploadAttachment,
      markNotificationRead, getHeaders
    }}>
      {children}
    </TaskContext.Provider>
  );
};
