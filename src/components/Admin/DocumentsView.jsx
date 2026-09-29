import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, File, Search, X, Download, Trash2, Eye, Shield, Plane, FileCheck, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const DOC_TYPES = ['Passport', 'Visa', 'Flight Ticket', 'Insurance', 'Signed Form', 'Contract', 'Invoice', 'Other'];
const TYPE_ICON = { Passport: Shield, Visa: FileCheck, 'Flight Ticket': Plane, Insurance: FileText, 'Signed Form': FileCheck, Contract: File, Invoice: FileText, Other: File };
const TYPE_COLOR = { Passport: 'bg-blue-50 text-blue-600', Visa: 'bg-purple-50 text-purple-600', 'Flight Ticket': 'bg-primary/8 text-primary', Insurance: 'bg-emerald-50 text-emerald-600', 'Signed Form': 'bg-amber-50 text-amber-600', Contract: 'bg-gray-100 text-gray-600', Invoice: 'bg-orange-50 text-orange-600', Other: 'bg-gray-100 text-gray-500' };

const STORAGE_KEY = 'vv_admin_documents';

const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
        <h3 className="font-serif text-lg text-primary">{title}</h3>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={16} /></button>
      </div>
      <div className="p-7 overflow-y-auto">{children}</div>
    </motion.div>
  </div>
);

const DocumentsView = () => {
  const [docs, setDocs] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [modal, setModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({ name: '', type: DOC_TYPES[0], client: '', expires: '' });

  // Load docs from localStorage + fetch real client names from bookings
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setDocs(JSON.parse(saved));

    api.get('/bookings?limit=200&page=1')
      .then(res => {
        const bookings = listItemsFromResponse(res);
        const unique = [...new Map(bookings.map(b => [b.guestEmail, b.guestName])).entries()]
          .map(([email, name]) => ({ email, name }));
        setClients(unique);
      })
      .catch(() => {});
  }, []);

  const saveDocs = (updated) => {
    setDocs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filtered = docs.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || d.type === filterType;
    return matchSearch && matchType;
  });

  const handleUpload = (e) => {
    e.preventDefault();
    const newDoc = {
      ...form,
      id: `D${Date.now()}`,
      size: '—',
      uploaded: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    saveDocs([newDoc, ...docs]);
    setModal(false);
    setForm({ name: '', type: DOC_TYPES[0], client: '', expires: '' });
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Document Management</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">Secure document storage — {docs.length} documents</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Upload size={14} /> Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: docs.length,                                          bg: 'bg-primary text-white' },
          { label: 'Passports',       value: docs.filter(d => d.type === 'Passport').length,       bg: 'bg-blue-50 text-blue-700' },
          { label: 'Visas',           value: docs.filter(d => d.type === 'Visa').length,           bg: 'bg-purple-50 text-purple-700' },
          { label: 'Contracts',       value: docs.filter(d => d.type === 'Contract').length,       bg: 'bg-gray-100 text-gray-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.bg}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <p className="text-2xl font-serif font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents or clients..."
            className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-primary outline-none cursor-pointer">
          <option value="ALL">All Types</option>
          {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText size={32} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm text-gray-400 mb-4">{docs.length === 0 ? 'No documents uploaded yet' : 'No documents match your search'}</p>
          {docs.length === 0 && (
            <button onClick={() => setModal(true)} className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
              Upload First Document
            </button>
          )}
        </div>
      )}

      {/* Document Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, i) => {
            const Icon = TYPE_ICON[doc.type] || File;
            return (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[doc.type]}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-primary truncate">{doc.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{doc.client}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[['Type', doc.type], ['Uploaded', doc.uploaded], ['Expires', doc.expires || 'N/A'], ['Status', doc.status]].map(([l, v]) => (
                    <div key={l} className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
                      <p className="text-[11px] font-bold text-primary">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${doc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>{doc.status}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => saveDocs(docs.filter(d => d.id !== doc.id))}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal onClose={() => setModal(false)} title="Upload Document">
            <form onSubmit={handleUpload} className="space-y-5">
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/30'}`}>
                <Upload size={28} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-semibold text-gray-500 mb-1">Drag & drop file here</p>
                <p className="text-[11px] text-gray-400">PDF, JPG, PNG up to 10MB</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Document Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Client</label>
                <input list="clients-list" type="text" required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
                  placeholder="Type or select client name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                <datalist id="clients-list">
                  {clients.map(c => <option key={c.email} value={c.name} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Document Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none cursor-pointer">
                    {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Expiry Date</label>
                  <input type="date" value={form.expires} onChange={e => setForm({ ...form, expires: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                Save Document Record
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsView;
