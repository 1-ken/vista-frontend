import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Eye, EyeOff, Briefcase, MapPin, Clock,
  Search, X, CheckCircle, AlertCircle, Edit2, Users, RefreshCw
} from 'lucide-react';
import api from '../../api/axios';

const DEPARTMENTS = ['Sales', 'Operations', 'Marketing', 'Finance', 'HR', 'Technology', 'Other'];
const EMP_TYPES   = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const EMPTY_FORM = {
  title: '', department: '', location: '', employmentType: 'Full-time',
  experience: '', salary: '', description: '', deadline: '',
  responsibilities: '', qualifications: '', requirements: '', benefits: '',
};

const DEPT_COLORS = {
  Sales: 'bg-blue-50 text-blue-700', Operations: 'bg-green-50 text-green-700',
  Marketing: 'bg-purple-50 text-purple-700', Finance: 'bg-yellow-50 text-yellow-700',
  HR: 'bg-pink-50 text-pink-700', Technology: 'bg-indigo-50 text-indigo-700',
  default: 'bg-slate-100 text-slate-600',
};

const STATUS_COLORS = {
  published: 'bg-emerald-50 text-emerald-700',
  draft:     'bg-amber-50 text-amber-700',
  closed:    'bg-red-50 text-red-600',
  archived:  'bg-slate-100 text-slate-500',
};

export default function CareersAdminView() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/careers/jobs?all=1');
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const openAdd = () => { setEditJob(null); setForm(EMPTY_FORM); setShowForm(true); };

  const openEdit = (job) => {
    setEditJob(job);
    setForm({
      title:            job.title || '',
      department:       job.department || '',
      location:         job.location || '',
      employmentType:   job.employmentType || 'Full-time',
      experience:       job.experience || '',
      salary:           job.salary || '',
      description:      job.description || '',
      deadline:         job.deadline ? job.deadline.slice(0, 10) : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      qualifications:   Array.isArray(job.qualifications)   ? job.qualifications.join('\n')   : '',
      requirements:     Array.isArray(job.requirements)     ? job.requirements.join('\n')     : '',
      benefits:         Array.isArray(job.benefits)         ? job.benefits.join('\n')         : '',
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditJob(null); setForm(EMPTY_FORM); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toArray = (str) => str.split('\n').map(s => s.trim()).filter(Boolean);

  const save = async (status = 'draft') => {
    if (!form.title.trim())      { showToast('Job title is required', 'error'); return; }
    if (!form.department.trim()) { showToast('Department is required', 'error'); return; }
    if (!form.location.trim())   { showToast('Location is required', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        status,
        responsibilities: toArray(form.responsibilities),
        qualifications:   toArray(form.qualifications),
        requirements:     toArray(form.requirements),
        benefits:         toArray(form.benefits),
        deadline:         form.deadline || undefined,
      };
      if (editJob) {
        await api.put(`/careers/jobs/${editJob._id}`, payload);
      } else {
        await api.post('/careers/jobs', payload);
      }
      showToast(editJob ? 'Vacancy updated' : `Vacancy ${status === 'published' ? 'published' : 'saved as draft'}`);
      closeForm();
      fetchJobs();
    } catch (e) {
      showToast(e.response?.data?.message || e.message || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'published' ? 'closed' : 'published';
    try {
      await api.put(`/careers/jobs/${job._id}`, { status: newStatus });
      showToast(`Vacancy ${newStatus === 'published' ? 'published' : 'closed'}`);
      fetchJobs();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const deleteJob = async (id) => {
    try {
      await api.delete(`/careers/jobs/${id}`);
      showToast('Vacancy deleted');
      setConfirmDelete(null);
      fetchJobs();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const filtered = jobs.filter(j =>
    !search ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.department?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:     jobs.length,
    published: jobs.filter(j => j.status === 'published').length,
    draft:     jobs.filter(j => j.status === 'draft').length,
    closed:    jobs.filter(j => j.status === 'closed').length,
  };

  return (
    <div className="space-y-6 pb-10 relative">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Careers</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">Manage job vacancies & applications</p>
        </div>
        <button onClick={fetchJobs} className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Vacancies', value: stats.total,     color: '#0b3d2e' },
          { label: 'Published',       value: stats.published, color: '#10b981' },
          { label: 'Drafts',          value: stats.draft,     color: '#f59e0b' },
          { label: 'Closed',          value: stats.closed,    color: '#ef4444' },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-black text-primary/40 mb-1">{label}</p>
            <p className="text-3xl font-serif" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl px-4 py-2.5">
            <Search size={14} className="text-primary/30 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vacancies..."
              className="bg-transparent outline-none text-sm text-primary placeholder:text-primary/30 flex-1" />
            {search && <button onClick={() => setSearch('')}><X size={13} className="text-primary/30 hover:text-primary" /></button>}
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-accent hover:text-primary transition-all whitespace-nowrap">
            <Plus size={15} /> Add Vacancy
          </button>
        </div>
      </div>

      {/* Jobs list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-primary/5 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Briefcase size={40} className="mx-auto mb-3 text-primary/20" />
            <p className="text-primary/40 font-medium">
              {search ? 'No vacancies match your search.' : 'No vacancies yet. Click "Add Vacancy" to create one.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(job => (
              <div key={job._id} className="flex items-center gap-4 px-5 py-4 hover:bg-primary/[0.02] transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={16} className="text-primary/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{job.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DEPT_COLORS[job.department] || DEPT_COLORS.default}`}>
                      {job.department}
                    </span>
                    {job.location && <span className="flex items-center gap-1 text-xs text-primary/40"><MapPin size={10} />{job.location}</span>}
                    {job.employmentType && <span className="flex items-center gap-1 text-xs text-primary/40"><Clock size={10} />{job.employmentType}</span>}
                    {job.applicantCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-accent font-semibold">
                        <Users size={10} />{job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full hidden sm:block ${STATUS_COLORS[job.status] || STATUS_COLORS.draft}`}>
                  {job.status}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleStatus(job)} title={job.status === 'published' ? 'Close' : 'Publish'}
                    className={`p-2 rounded-xl transition-all ${job.status === 'published' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-primary/5 text-primary/40 hover:bg-primary/10 hover:text-primary'}`}>
                    {job.status === 'published' ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(job)} title="Edit"
                    className="p-2 rounded-xl bg-primary/5 text-primary/40 hover:bg-primary/10 hover:text-primary transition-all">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => setConfirmDelete(job)} title="Delete"
                    className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeForm} className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed inset-x-4 top-6 bottom-6 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-[101] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-primary px-7 py-6 flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-0.5">{editJob ? 'Edit Vacancy' : 'New Vacancy'}</p>
                  <h2 className="font-serif text-xl text-white">{editJob ? editJob.title : 'Add a New Position'}</h2>
                </div>
                <button onClick={closeForm} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-all">
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Job Title *">
                    <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Travel Consultant" className={INPUT} />
                  </FormField>
                  <FormField label="Department *">
                    <select value={form.department} onChange={e => set('department', e.target.value)} className={INPUT}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Location *">
                    <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Nairobi / Remote" className={INPUT} />
                  </FormField>
                  <FormField label="Employment Type">
                    <select value={form.employmentType} onChange={e => set('employmentType', e.target.value)} className={INPUT}>
                      {EMP_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Experience Required">
                    <input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 3+ Years" className={INPUT} />
                  </FormField>
                  <FormField label="Salary">
                    <input value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="e.g. KES 80,000" className={INPUT} />
                  </FormField>
                </div>
                <FormField label="Application Deadline">
                  <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className={INPUT} />
                </FormField>
                <FormField label="Job Description">
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Describe the role..." className={`${INPUT} resize-none`} />
                </FormField>
                <FormField label="Responsibilities" hint="One per line">
                  <textarea value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} rows={4} placeholder={"Manage client accounts\nDesign itineraries"} className={`${INPUT} resize-none`} />
                </FormField>
                <FormField label="Requirements" hint="One per line">
                  <textarea value={form.requirements} onChange={e => set('requirements', e.target.value)} rows={3} placeholder={"3+ years experience\nExcellent communication"} className={`${INPUT} resize-none`} />
                </FormField>
                <FormField label="Qualifications" hint="One per line">
                  <textarea value={form.qualifications} onChange={e => set('qualifications', e.target.value)} rows={3} placeholder={"Degree in Tourism\nIATA certification"} className={`${INPUT} resize-none`} />
                </FormField>
                <FormField label="Benefits" hint="One per line">
                  <textarea value={form.benefits} onChange={e => set('benefits', e.target.value)} rows={3} placeholder={"Competitive salary\nMedical cover\nTravel perks"} className={`${INPUT} resize-none`} />
                </FormField>
              </div>
              <div className="px-7 py-5 border-t border-primary/5 flex gap-3 flex-shrink-0 bg-white">
                <button onClick={closeForm} className="flex-1 border border-primary/15 text-primary/60 py-3 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all">Cancel</button>
                <button onClick={() => save('draft')} disabled={saving} className="flex-1 border border-primary/20 text-primary py-3 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all disabled:opacity-50">Save as Draft</button>
                <button onClick={() => save('published')} disabled={saving}
                  className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-accent hover:text-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : editJob ? 'Update & Publish' : 'Publish Now'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)} className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-bold text-primary text-lg mb-2">Delete Vacancy?</h3>
              <p className="text-primary/50 text-sm mb-6">
                "<strong>{confirmDelete.title}</strong>" will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-primary/15 text-primary/60 py-3 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all">Cancel</button>
                <button onClick={() => deleteJob(confirmDelete._id)} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormField({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs font-bold text-primary/50 uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[10px] text-primary/30">({hint})</span>}
      </div>
      {children}
    </div>
  );
}

const INPUT = 'w-full bg-primary/[0.03] border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all';
