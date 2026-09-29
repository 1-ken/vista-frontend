import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Star, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';
import getImageUrl from '../../utils/imageUrl';

const INPUT    = 'w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all';
const LABEL    = 'text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1.5 block';
const TEXTAREA = 'w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all resize-none';

const PROPERTY_TYPES = [
  'Luxury Lodge', 'Safari Camp', 'Tented Camp', 'Boutique Hotel',
  'Villa', 'Resort', 'Private Camp', 'Eco Lodge', 'Hotel', 'Guesthouse', 'Other',
];

const EMPTY = {
  name: '', propertyType: 'Luxury Lodge', location: '', destinationName: '',
  country: '', starRating: 5, shortDescription: '', description: '',
  amenities: '', heroImage: null,
};

export default function PropertiesManagement() {
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [search,     setSearch]     = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [error,      setError]      = useState('');

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      const r = await api.get('/properties?limit=500');
      setProperties(listItemsFromResponse(r));
    } catch { setProperties([]); }
    finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setError(''); setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name:             p.name || '',
      propertyType:     p.propertyType || 'Luxury Lodge',
      location:         p.location || '',
      destinationName:  p.destinationName || '',
      country:          p.country || '',
      starRating:       p.starRating || 5,
      shortDescription: p.shortDescription || '',
      description:      p.description || '',
      amenities:        Array.isArray(p.amenities) ? p.amenities.join(', ') : (p.amenities || ''),
      heroImage:        null,
    });
    setError(''); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');

    // Build payload — use JSON unless there's a new image
    const amenitiesArr = form.amenities
      ? form.amenities.split(',').map(a => a.trim()).filter(Boolean)
      : [];

    if (form.heroImage && typeof form.heroImage !== 'string') {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'heroImage') { fd.append('heroImage', v); return; }
        if (k === 'amenities') { fd.append('amenities', JSON.stringify(amenitiesArr)); return; }
        if (v !== null && v !== undefined && v !== '') fd.append(k, v);
      });
      try {
        if (editing?._id) await api.patch(`/properties/${editing._id}`, fd);
        else              await api.post('/properties', fd);
        close(); fetch();
      } catch (err) { setError(err.response?.data?.message || err.message || 'Failed to save'); }
    } else {
      const body = { ...form, amenities: amenitiesArr };
      delete body.heroImage;
      try {
        if (editing?._id) await api.patch(`/properties/${editing._id}`, body, { headers: { 'Content-Type': 'application/json' } });
        else              await api.post('/properties', body, { headers: { 'Content-Type': 'application/json' } });
        close(); fetch();
      } catch (err) { setError(err.response?.data?.message || err.message || 'Failed to save'); }
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try { await api.delete(`/properties/${id}`); fetch(); }
    catch { alert('Error deleting property'); }
  };

  const close = () => { setShowForm(false); setEditing(null); setForm(EMPTY); setError(''); };

  const filtered = properties.filter(p => {
    const q = search.toLowerCase();
    return !q || p.name?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.destinationName?.toLowerCase().includes(q);
  });

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
          <h2 className="font-serif text-xl text-primary">Properties</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">
            {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} · reused across tour packages
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm whitespace-nowrap">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, location, destination..."
          className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
        {search && <button onClick={() => setSearch('')}><X size={14} className="text-gray-300 hover:text-gray-500" /></button>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
          <Building2 size={36} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 text-sm mb-2">No properties yet.</p>
          <p className="text-gray-300 text-xs mb-6">Add your first property — lodges, camps, hotels, villas.</p>
          <button onClick={openCreate}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
            Add First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map(p => (
              <motion.div key={p._id} layout
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">

                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img src={getImageUrl(p.heroImage)} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={e => { e.currentTarget.src = getImageUrl(null); }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 text-primary text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {p.propertyType}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(p)}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all shadow">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary hover:bg-red-500 hover:text-white transition-all shadow">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-serif text-white text-base leading-tight">{p.name}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: p.starRating || 5 }).map((_, i) => (
                        <Star key={i} size={10} className="fill-[#c8a248] text-[#c8a248]" />
                      ))}
                    </div>
                    {(p.location || p.destinationName) && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin size={9} />{p.destinationName || p.location}
                      </span>
                    )}
                  </div>
                  {p.shortDescription && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                  )}
                  {p.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(Array.isArray(p.amenities) ? p.amenities : []).slice(0, 3).map(a => (
                        <span key={a} className="text-[9px] bg-gray-50 border border-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                      {p.amenities.length > 3 && <span className="text-[9px] text-gray-300">+{p.amenities.length - 3}</span>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh]">

              {/* Modal header */}
              <div className="px-7 py-5 border-b border-gray-100 bg-primary rounded-t-3xl flex justify-between items-center flex-shrink-0">
                <div>
                  <h3 className="font-serif text-xl text-white">{editing ? 'Edit Property' : 'Add Property'}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">
                    Lodges, camps, hotels, villas — anything
                  </p>
                </div>
                <button onClick={close} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-7 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={LABEL}>Property Name *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="e.g. Angama Mara, Giraffe Manor, Hemingways Nairobi"
                      className={INPUT} />
                  </div>

                  <div>
                    <label className={LABEL}>Property Type</label>
                    <select value={form.propertyType} onChange={e => set('propertyType', e.target.value)} className={INPUT}>
                      {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={LABEL}>Star Rating</label>
                    <div className="flex items-center gap-2 mt-1">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => set('starRating', n)}
                          className="transition-transform hover:scale-110">
                          <Star size={22} className={n <= form.starRating ? 'fill-[#c8a248] text-[#c8a248]' : 'text-gray-200'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={LABEL}>Destination / Area</label>
                    <input value={form.destinationName} onChange={e => set('destinationName', e.target.value)}
                      placeholder="e.g. Maasai Mara, Nairobi, Zanzibar"
                      className={INPUT} />
                  </div>

                  <div>
                    <label className={LABEL}>Country</label>
                    <input value={form.country} onChange={e => set('country', e.target.value)}
                      placeholder="e.g. Kenya, Tanzania, UAE"
                      className={INPUT} />
                  </div>

                  <div className="md:col-span-2">
                    <label className={LABEL}>Location / Address</label>
                    <input value={form.location} onChange={e => set('location', e.target.value)}
                      placeholder="e.g. Maasai Mara National Reserve, Narok County, Kenya"
                      className={INPUT} />
                  </div>

                  <div className="md:col-span-2">
                    <label className={LABEL}>Short Description <span className="text-gray-300 font-normal normal-case">(shown on tour cards)</span></label>
                    <input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)}
                      placeholder="e.g. Iconic luxury tented camp perched above the Mara Triangle"
                      className={INPUT} />
                  </div>

                  <div className="md:col-span-2">
                    <label className={LABEL}>Full Description</label>
                    <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                      placeholder="Detailed description of the property..."
                      className={TEXTAREA} />
                  </div>

                  <div className="md:col-span-2">
                    <label className={LABEL}>Amenities <span className="text-gray-300 font-normal normal-case">(comma separated)</span></label>
                    <input value={form.amenities} onChange={e => set('amenities', e.target.value)}
                      placeholder="e.g. Pool, Spa, Wi-Fi, Restaurant, Game Drives, Bush Walks"
                      className={INPUT} />
                  </div>

                  <div className="md:col-span-2">
                    <label className={LABEL}>Hero Image</label>
                    <label className="flex items-center gap-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-4 px-5 cursor-pointer hover:border-accent/40 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 truncate">
                          {form.heroImage
                            ? (typeof form.heroImage === 'string' ? form.heroImage : form.heroImage.name)
                            : editing?.heroImage
                              ? 'Current image — upload to replace'
                              : 'Upload property image (JPG, PNG, WEBP)'}
                        </p>
                        <p className="text-[10px] text-gray-300 mt-0.5">Optional — you can add it later</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={e => set('heroImage', e.target.files[0])} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent border border-accent/30 px-3 py-1.5 rounded-lg whitespace-nowrap">
                        Choose File
                      </span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm font-bold">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={close}
                    className="flex-1 border border-gray-200 text-gray-500 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-primary transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    {saving
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : editing ? 'Save Changes' : 'Add Property'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
