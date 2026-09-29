import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Image as ImageIcon, Check, Eye } from 'lucide-react';
import api from '../../api/axios';

const CATEGORIES = ['Safari', 'Luxury', 'Wildlife', 'Culture', 'Beach', 'Adventure', 'General'];
const ASSET_BASE = import.meta.env.VITE_ASSET_BASE_URL || '';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ caption: '', category: 'General', file: null, previewUrl: '' });
  const [filterCat, setFilterCat] = useState('All');

  const fetchImages = async () => {
    try {
      const r = await fetch('/api/gallery');
      const data = await r.json();
      setImages(Array.isArray(data) ? data : []);
    } catch { setImages([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setForm(f => ({ ...f, file, previewUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('image', form.file);
      fd.append('caption', form.caption);
      fd.append('category', form.category);
      fd.append('status', 'approved');
      await api.post('/gallery', fd);
      setShowModal(false);
      setForm({ caption: '', category: 'General', file: null, previewUrl: '' });
      fetchImages();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this image from the gallery?')) return;
    try { await api.delete(`/gallery/${id}`); fetchImages(); }
    catch { alert('Error deleting image'); }
  };

  const handleToggleStatus = async (img) => {
    try {
      await api.patch(`/gallery/${img._id}`, { status: img.status === 'approved' ? 'pending' : 'approved' });
      fetchImages();
    } catch { alert('Error updating status'); }
  };

  const allImages = images;
  const filtered = filterCat === 'All' ? allImages : allImages.filter(i => i.category === filterCat);
  const cats = ['All', ...CATEGORIES];

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div>
          <h2 className="font-serif text-xl text-primary">Gallery Management</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">{images.length} images · {images.filter(i => i.status === 'approved').length} published</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm">
          <Plus size={16} /> Upload Image
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${filterCat === c ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-primary/50 hover:border-primary/30 hover:text-primary'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Images', value: images.length },
          { label: 'Published', value: images.filter(i => i.status === 'approved').length },
          { label: 'Hidden', value: images.filter(i => i.status !== 'approved').length },
          { label: 'Categories', value: new Set(images.map(i => i.category)).size },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 border ${i % 2 === 0 ? 'bg-primary border-primary' : 'bg-white border-gray-100 shadow-sm'}`}>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i % 2 === 0 ? 'text-white/50' : 'text-primary/40'}`}>{s.label}</p>
            <p className={`text-2xl font-serif font-bold ${i % 2 === 0 ? 'text-white' : 'text-primary'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
          <ImageIcon size={40} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 text-sm">No images yet. Upload your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div key={img._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square border border-gray-100 shadow-sm">
                <img src={`${ASSET_BASE}${img.url}`} alt={img.caption || 'Gallery'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                  <div className="flex justify-between items-start">
                    <span className="bg-black/60 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
                      {img.category || 'General'}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => setPreview(img)}
                        className="w-7 h-7 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center text-white transition-all">
                        <Eye size={12} />
                      </button>
                      <button onClick={() => handleToggleStatus(img)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${img.status === 'approved' ? 'bg-emerald-500/80 hover:bg-emerald-500 text-white' : 'bg-white/20 hover:bg-white/40 text-white'}`}>
                        <Check size={12} />
                      </button>
                      <button onClick={() => handleDelete(img._id)}
                        className="w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center text-white transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  {img.caption && (
                    <p className="text-white text-xs font-medium leading-tight line-clamp-2">{img.caption}</p>
                  )}
                </div>

                {/* Status dot */}
                <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${img.status === 'approved' ? 'bg-emerald-400' : 'bg-gray-400'} group-hover:opacity-0 transition-opacity`} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center bg-primary rounded-t-3xl">
                <h3 className="font-serif text-lg text-white">Upload Gallery Image</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 text-white/50 hover:text-white rounded-lg transition-all">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-7 space-y-5">
                {/* File drop */}
                <label className="block cursor-pointer">
                  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${form.previewUrl ? 'border-primary/30 bg-primary/3' : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'}`}>
                    {form.previewUrl ? (
                      <img src={form.previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm text-gray-400 font-medium">Click to upload image</p>
                        <p className="text-[11px] text-gray-300 mt-1">JPG, PNG, WEBP — max 10MB</p>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} required />
                </label>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Caption</label>
                  <input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                    placeholder="e.g. Maasai Mara sunset game drive"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary/30 transition-all" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary outline-none focus:border-primary/30 transition-all">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={saving || !form.file}
                  className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : 'Upload to Gallery'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox preview */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6">
            <button className="absolute top-6 right-6 text-white/50 hover:text-white">
              <X size={28} />
            </button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={`${ASSET_BASE}${preview.url}`} alt={preview.caption}
              className="max-w-full max-h-full object-contain rounded-2xl" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-accent text-[10px] uppercase tracking-widest font-bold mb-1">{preview.category}</p>
              <p className="font-serif text-xl">{preview.caption || 'Gallery Image'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryManagement;
