import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Trash2, CheckCircle, XCircle, Image as ImageIcon,
  X, Plus, Eye, EyeOff, AlertCircle, Grid, List,
} from 'lucide-react';
import api from '../../api/axios';
import getImageUrl from '../../utils/imageUrl';

const CATEGORIES = ['Safari', 'Luxury', 'Wildlife', 'Culture', 'Beach', 'Adventure', 'General'];
const ASSET_BASE = import.meta.env.VITE_ASSET_BASE_URL || '';

const STATUS_STYLE = {
  approved: 'bg-emerald-50 text-emerald-700',
  pending:  'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-600',
};

export default function GalleryAdminView() {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [toast,    setToast]    = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const [form, setForm] = useState({ caption: '', category: 'Safari', file: null, url: '', preview: null, mode: 'file' });
  const fileRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const r = await api.get('/gallery?status=all');
      setImages(Array.isArray(r.data) ? r.data : (r.data?.data || []));
    } catch { setImages([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchImages(); }, []);

  const filtered = filter === 'all' ? images : images.filter(i => i.status === filter);

  const stats = {
    total:    images.length,
    approved: images.filter(i => i.status === 'approved').length,
    pending:  images.filter(i => i.status === 'pending').length,
    rejected: images.filter(i => i.status === 'rejected').length,
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, file, preview: URL.createObjectURL(file) }));
  };

  const handleUpload = async () => {
    if (form.mode === 'file' && !form.file) { showToast('Please select an image file', 'error'); return; }
    if (form.mode === 'url' && !form.url?.trim()) { showToast('Please enter an image URL', 'error'); return; }
    setUploading(true);
    try {
      if (form.mode === 'file' && form.file) {
        const fd = new FormData();
        fd.append('image',          form.file);
        fd.append('caption',        form.caption);
        fd.append('category',       form.category);
        fd.append('source',         'admin');
        fd.append('submitterName',  'Admin');
        await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/gallery', {
          url: form.url.trim(),
          caption: form.caption,
          category: form.category,
          source: 'admin',
          submitterName: 'Admin',
        });
      }
      showToast('Image added to gallery');
      setShowUpload(false);
      setForm({ caption: '', category: 'Safari', file: null, url: '', preview: null, mode: 'file' });
      fetchImages();
    } catch (e) {
      showToast(e.response?.data?.message || 'Upload failed', 'error');
    } finally { setUploading(false); }
  };

  // ── Status toggle ─────────────────────────────────────────────────────────
  const toggleStatus = async (img) => {
    const next = img.status === 'approved' ? 'rejected' : 'approved';
    try {
      await api.patch(`/gallery/${img._id}`, { status: next });
      showToast(`Image ${next}`);
      fetchImages();
    } catch { showToast('Failed to update status', 'error'); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      showToast('Image deleted');
      setConfirmDel(null);
      fetchImages();
    } catch { showToast('Failed to delete', 'error'); }
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

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Images', value: stats.total,    color: '#0b3d2e' },
          { label: 'Approved',     value: stats.approved, color: '#10b981' },
          { label: 'Pending',      value: stats.pending,  color: '#f59e0b' },
          { label: 'Rejected',     value: stats.rejected, color: '#ef4444' },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-black text-primary/40 mb-1">{label}</p>
            <p className="text-3xl font-serif" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap flex-1">
          {['all', 'approved', 'pending', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === s ? 'bg-primary text-white' : 'bg-primary/5 text-primary/50 hover:bg-primary/10'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-accent hover:text-primary transition-all whitespace-nowrap">
          <Plus size={15} /> Upload Image
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-square bg-primary/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <ImageIcon size={40} className="mx-auto mb-3 text-primary/20" />
            <p className="text-primary/40 font-medium">No images found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(img => (
              <div key={img._id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100">
                <img src={getImageUrl(img.url)} alt={img.caption || 'Gallery'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-between p-3">
                  {/* Status badge */}
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[img.status] || STATUS_STYLE.pending}`}>
                      {img.status}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-primary/60">
                      {img.category}
                    </span>
                  </div>

                  {/* Actions — visible on hover */}
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {/* Preview */}
                    <button onClick={() => setPreview(img)}
                      className="p-2 bg-white rounded-xl text-primary hover:bg-accent hover:text-white transition-all shadow">
                      <Eye size={14} />
                    </button>
                    {/* Approve / Reject toggle */}
                    <button onClick={() => toggleStatus(img)}
                      className={`p-2 rounded-xl transition-all shadow ${
                        img.status === 'approved'
                          ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                      }`}
                      title={img.status === 'approved' ? 'Remove from gallery' : 'Approve for gallery'}>
                      {img.status === 'approved' ? <EyeOff size={14} /> : <CheckCircle size={14} />}
                    </button>
                    {/* Delete */}
                    <button onClick={() => setConfirmDel(img)}
                      className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Caption */}
                  {img.caption && (
                    <p className="text-white text-[10px] font-semibold truncate opacity-0 group-hover:opacity-100 transition-all">
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Upload Modal ── */}
      <AnimatePresence>
        {showUpload && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowUpload(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-[101] bg-white rounded-3xl shadow-2xl overflow-hidden">

              <div className="bg-primary px-7 py-5 flex items-center justify-between">
                <div>
                  <p className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-0.5">Gallery</p>
                  <h2 className="font-serif text-xl text-white">Upload New Image</h2>
                </div>
                <button onClick={() => setShowUpload(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="p-7 space-y-5">
                {/* Upload Mode Selector */}
                <div className="flex bg-primary/5 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, mode: 'file' }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      form.mode === 'file' ? 'bg-white text-primary shadow-sm' : 'text-primary/50 hover:text-primary'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, mode: 'url' }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      form.mode === 'url' ? 'bg-white text-primary shadow-sm' : 'text-primary/50 hover:text-primary'
                    }`}
                  >
                    Image URL
                  </button>
                </div>

                {form.mode === 'file' ? (
                  /* Drop zone */
                  <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all">
                    {form.preview ? (
                      <img src={form.preview} alt="preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                    ) : (
                      <>
                        <Upload size={32} className="mx-auto mb-3 text-primary/20" />
                        <p className="text-sm font-semibold text-primary/40">Click to select image</p>
                        <p className="text-xs text-primary/25 mt-1">JPG, PNG, WEBP — max 10MB</p>
                      </>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2 block">Direct Image URL</label>
                    <input
                      type="url"
                      value={form.url}
                      onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-primary/[0.03] border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-accent/50 transition-all"
                    />
                    {form.url && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <img src={form.url} alt="URL preview" className="max-h-36 mx-auto rounded-lg object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Caption */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2 block">Caption</label>
                  <input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                    placeholder="e.g. Maasai Mara sunset game drive"
                    className="w-full bg-primary/[0.03] border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-accent/50 transition-all" />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2 block">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-primary/[0.03] border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent/50 transition-all">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowUpload(false)}
                    className="flex-1 border border-primary/15 text-primary/60 py-3 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || (form.mode === 'file' ? !form.file : !form.url?.trim())}
                    className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-accent hover:text-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {uploading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                      : <><Upload size={15} />Save to Gallery</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Preview Lightbox ── */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6">
            <button onClick={() => setPreview(null)} className="absolute top-6 right-6 text-white/60 hover:text-white">
              <X size={28} />
            </button>
            <img src={getImageUrl(preview.url)} alt={preview.caption}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              {preview.caption && <p className="text-white font-semibold">{preview.caption}</p>}
              <p className="text-white/40 text-xs mt-1">{preview.category} · {preview.status}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {confirmDel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDel(null)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-bold text-primary text-lg mb-2">Delete Image?</h3>
              <p className="text-primary/50 text-sm mb-6">This will permanently remove the image from the gallery.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDel(null)}
                  className="flex-1 border border-primary/15 text-primary/60 py-3 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDel._id)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
