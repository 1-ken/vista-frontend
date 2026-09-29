import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, Globe, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';
import getImageUrl from '../../utils/imageUrl';
import { EMPTY_FORM } from './TourFormHelpers';
import { BasicInfoSection, MediaSection, HighlightsSection, ItinerarySection } from './TourFormSections';
import {
  AccommodationSection, ExperiencesSection, TransportSection, PricingSection,
  InclusionsSection, TravelInfoSection, BookingSettingsSection, SeoSection, PublishingSection,
} from './TourFormSections2';

const STATUS_BADGE = {
  published: 'bg-emerald-50 text-emerald-600',
  draft:     'bg-gray-100 text-gray-500',
  archived:  'bg-red-50 text-red-400',
};

const SECTIONS = [
  'basic', 'media', 'highlights', 'itinerary',
  'accommodation', 'experiences', 'transport', 'pricing',
  'inclusions', 'travelInfo', 'bookingSettings', 'seo', 'publishing',
];

const SECTION_LABELS = {
  basic: 'Basic Info', media: 'Media', highlights: 'Highlights',
  itinerary: 'Itinerary', accommodation: 'Accommodation', experiences: 'Experiences',
  transport: 'Transport', pricing: 'Pricing', inclusions: 'Inclusions',
  travelInfo: 'Travel Info', bookingSettings: 'Booking', seo: 'SEO', publishing: 'Publishing',
};

const JSON_KEYS = [
  'highlights','itinerary','inclusions','exclusions',
  'accommodationOptions','experienceOptions','transportOptions','pricingRules','faq',
  'gallery',
];

export default function ToursManagement() {
  const [tours,        setTours]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [formError,    setFormError]    = useState('');
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWorld,  setFilterWorld]  = useState('all');
  const [view,         setView]         = useState('list'); // 'list' | 'form'
  const [editingTour,  setEditingTour]  = useState(null);
  const [formData,     setFormData]     = useState(EMPTY_FORM);
  const [open, setOpen] = useState(
    Object.fromEntries(SECTIONS.map(s => [s, s === 'basic']))
  );

  const toggle = k => setOpen(o => ({ ...o, [k]: !o[k] }));
  const set    = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  useEffect(() => { fetchTours(); }, []);

  const fetchTours = async () => {
    try {
      const r = await api.get('/tours?limit=500&page=1');
      setTours(listItemsFromResponse(r));
    } catch { setTours([]); }
    finally { setLoading(false); }
  };

  const buildPayload = (data) => {
    const normalized = { ...data, location: data.destination || data.location || '' };

    // Strip base64 propertyImages — too large for form fields
    if (Array.isArray(normalized.accommodationOptions)) {
      normalized.accommodationOptions = normalized.accommodationOptions.map(opt => {
        if (opt.propertyImage && opt.propertyImage.startsWith('data:')) {
          const { propertyImage, ...rest } = opt;
          return rest;
        }
        return opt;
      });
    }

    // Always use FormData so multer on the backend can parse it
    const SKIP = ['_id', 'id', '__v', 'createdAt', 'updatedAt'];
    const fd = new FormData();
    Object.entries(normalized).forEach(([k, v]) => {
      if (SKIP.includes(k)) return;
      if (k === 'image') {
        if (v && typeof v !== 'string') {
          fd.append('image', v);
        } else if (typeof v === 'string' && v.trim()) {
          fd.append('imageUrl', v);
        }
      } else if (JSON_KEYS.includes(k)) {
        fd.append(k, JSON.stringify(v ?? []));
      } else if (typeof v === 'boolean') {
        fd.append(k, String(v));
      } else if (v !== null && v !== undefined && v !== '') {
        fd.append(k, v);
      }
    });
    return { data: fd, headers: {} };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError('');
    const { data, headers } = buildPayload(formData);
    try {
      if (editingTour?._id) await api.patch(`/tours/${editingTour._id}`, data, { headers });
      else                  await api.post('/tours', data, { headers });
      closeForm(); fetchTours();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error
        || JSON.stringify(err.response?.data) || err.message || 'Failed to save';
      setFormError(`${err.response?.status || ''} ${msg}`.trim());
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tour package?')) return;
    try { await api.delete(`/tours/${id}`); fetchTours(); }
    catch { alert('Error deleting tour'); }
  };

  const handleDuplicate = async (tour) => {
    const copy = { ...tour, title: `${tour.title} (Copy)`, status: 'draft', image: null };
    const { data, headers } = buildPayload(copy);
    try { await api.post('/tours', data, { headers }); fetchTours(); }
    catch (err) { alert(err.response?.data?.message || 'Error duplicating tour'); }
  };

  const handleToggleStatus = async (tour) => {
    const next = tour.status === 'published' ? 'draft' : 'published';
    try {
      const fd = new FormData();
      fd.append('status', next);
      await api.patch(`/tours/${tour._id}`, fd);
      fetchTours();
    } catch { alert('Error updating status'); }
  };

  const openCreate = () => {
    setEditingTour(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setOpen(Object.fromEntries(SECTIONS.map(s => [s, s === 'basic'])));
    setView('form');
  };

  const openEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      ...EMPTY_FORM, ...tour,
      image:               tour.image || null,
      gallery:             Array.isArray(tour.gallery) ? tour.gallery : [],
      travelType:          tour.travelType          || 'journey',
      subtitle:            tour.subtitle            || '',
      highlights:          tour.highlights          || [],
      itinerary:           tour.itinerary           || [],
      inclusions:          tour.inclusions          || [],
      exclusions:          tour.exclusions          || [],
      accommodationOptions:tour.accommodationOptions|| [],
      experienceOptions:   tour.experienceOptions   || [],
      transportOptions:    tour.transportOptions    || [],
      pricingRules:        tour.pricingRules        || [],
    });
    setFormError('');
    setOpen(Object.fromEntries(SECTIONS.map(s => [s, s === 'basic'])));
    setView('form');
  };

  const closeForm = () => {
    setView('list');
    setEditingTour(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const filtered = tours.filter(t => {
    const matchSearch = !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.destination?.toLowerCase().includes(search.toLowerCase()) ||
      t.country?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || (t.status || 'published') === filterStatus;
    const matchWorld  = filterWorld === 'all' || (t.travelType || 'journey') === filterWorld;
    return matchSearch && matchStatus && matchWorld;
  });

  const counts = {
    all:        tours.length,
    published:  tours.filter(t => (t.status || 'published') === 'published').length,
    draft:      tours.filter(t => t.status === 'draft').length,
    archived:   tours.filter(t => t.status === 'archived').length,
    experience: tours.filter(t => t.travelType === 'experience').length,
    journey:    tours.filter(t => !t.travelType || t.travelType === 'journey').length,
    worldwide:  tours.filter(t => t.travelType === 'worldwide').length,
  };

  /* ── FORM VIEW ── */
  if (view === 'form') {
    return (
      <div className="pb-16">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={closeForm} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-xl transition-all">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="font-serif text-xl text-primary">
                {editingTour ? 'Edit Tour Package' : 'Create Tour Package'}
              </h2>
              <p className="text-[10px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">
                {editingTour?.title || 'New package'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={closeForm}
              className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 border border-gray-200 rounded-xl hover:text-primary transition-all">
              Cancel
            </button>
            <button form="tour-form" type="submit" disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 disabled:opacity-60 transition-all">
              {saving
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : editingTour ? 'Save Changes' : 'Publish Package'}
            </button>
          </div>
        </div>

        {/* Section nav pills */}
        <div className="flex flex-wrap gap-1.5 mb-6 px-1">
          {SECTIONS.map(s => (
            <button key={s} type="button"
              onClick={() => setOpen(o => ({ ...o, [s]: true }))}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${open[s] ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-primary/50 hover:text-primary'}`}>
              {SECTION_LABELS[s]}
            </button>
          ))}
        </div>

        <form id="tour-form" onSubmit={handleSubmit} className="space-y-3">

          {/* Each section is a card */}
          {[
            { key: 'basic',           label: 'Basic Information',        icon: '01', content: <BasicInfoSection form={formData} set={set} /> },
            { key: 'media',           label: 'Media',                    icon: '02', content: <MediaSection form={formData} set={set} /> },
            { key: 'highlights',      label: 'Highlights',               icon: '03', content: null },
            { key: 'itinerary',       label: 'Daily Itinerary',          icon: '04', content: null },
            { key: 'accommodation',   label: 'Accommodation Options',    icon: '05', content: null },
            { key: 'experiences',     label: 'Experiences',              icon: '06', content: null },
            { key: 'transport',       label: 'Transport Options',        icon: '07', content: null },
            { key: 'pricing',         label: 'Pricing',                  icon: '08', content: null },
            { key: 'inclusions',      label: 'Inclusions & Exclusions',  icon: '09', content: null },
            { key: 'travelInfo',      label: 'Travel Information',       icon: '10', content: null },
            { key: 'bookingSettings', label: 'Booking Settings',         icon: '11', content: null },
            { key: 'seo',             label: 'SEO & Meta',               icon: '12', content: null },
            { key: 'publishing',      label: 'Publishing',               icon: '13', content: null },
          ].map(({ key, label, icon, content }) => (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Sections that use SectionHeader internally */}
              {key === 'highlights' && (
                <HighlightsSection form={formData} set={set} open={open.highlights} onToggle={() => toggle('highlights')} />
              )}
              {key === 'itinerary' && (
                <ItinerarySection form={formData} set={set} open={open.itinerary} onToggle={() => toggle('itinerary')} />
              )}
              {key === 'accommodation' && (
                <AccommodationSection form={formData} set={set} open={open.accommodation} onToggle={() => toggle('accommodation')} />
              )}
              {key === 'experiences' && (
                <ExperiencesSection form={formData} set={set} open={open.experiences} onToggle={() => toggle('experiences')} />
              )}
              {key === 'transport' && (
                <TransportSection form={formData} set={set} open={open.transport} onToggle={() => toggle('transport')} />
              )}
              {key === 'pricing' && (
                <PricingSection form={formData} set={set} open={open.pricing} onToggle={() => toggle('pricing')} />
              )}
              {key === 'inclusions' && (
                <InclusionsSection form={formData} set={set} open={open.inclusions} onToggle={() => toggle('inclusions')} />
              )}
              {key === 'travelInfo' && (
                <TravelInfoSection form={formData} set={set} open={open.travelInfo} onToggle={() => toggle('travelInfo')} />
              )}
              {key === 'bookingSettings' && (
                <BookingSettingsSection form={formData} set={set} open={open.bookingSettings} onToggle={() => toggle('bookingSettings')} />
              )}
              {key === 'seo' && (
                <SeoSection form={formData} set={set} open={open.seo} onToggle={() => toggle('seo')} />
              )}
              {key === 'publishing' && (
                <PublishingSection form={formData} set={set} open={open.publishing} onToggle={() => toggle('publishing')} />
              )}

              {/* Sections with inline header + content */}
              {(key === 'basic' || key === 'media') && (
                <>
                  <button type="button" onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-base">{icon}</span>
                      <p className="text-[11px] font-black text-primary uppercase tracking-widest">{label}</p>
                    </div>
                    <span className="text-gray-400 text-xs">{open[key] ? '▲' : '▼'}</span>
                  </button>
                  {open[key] && content}
                </>
              )}
            </div>
          ))}

          {formError && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
              <p className="font-bold mb-1">⚠ Save failed</p>
              <p className="font-mono text-xs break-all">{formError}</p>
            </div>
          )}

          {/* Bottom save bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={closeForm}
              className="px-6 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500 border border-gray-200 rounded-xl hover:text-primary transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 disabled:opacity-60 transition-all shadow-sm">
              {saving
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : editingTour ? 'Save Changes' : 'Create Tour Package'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ── LIST VIEW ── */
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
          <h2 className="font-serif text-xl text-primary">Tour Packages</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">
            {counts.published} published · {counts.draft} drafts
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm whitespace-nowrap">
          <Plus size={16} /> Create Tour Package
        </button>
      </div>

      {/* Filters + Search */}
      <div className="space-y-2.5">
        {/* Travel World filter */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            ['all', 'All Travel Worlds', counts.all],
            ['experience', '01 · Experiences (Day)', counts.experience],
            ['journey', '02 · Journeys (Safaris)', counts.journey],
            ['worldwide', '03 · Worldwide (Global)', counts.worldwide],
          ].map(([val, label, count]) => (
            <button key={val} onClick={() => setFilterWorld(val)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                filterWorld === val
                  ? 'bg-[#0b3d2e] text-white shadow-md shadow-[#0b3d2e]/20'
                  : 'bg-white border border-gray-200 text-primary/50 hover:text-primary hover:border-primary/30'
              }`}>
              {label} <span className="opacity-60 text-[10px]">({count})</span>
            </button>
          ))}
        </div>

        {/* Status + Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
            {[['all','All'],['published','Published'],['draft','Drafts'],['archived','Archived']].map(([val, label]) => (
              <button key={val} onClick={() => setFilterStatus(val)}
                className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${filterStatus === val ? 'bg-primary text-white' : 'text-primary/40 hover:text-primary'}`}>
                {label} <span className="opacity-50">({counts[val]})</span>
              </button>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, destination, country..."
              className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
          </div>
        </div>
      </div>

      {/* Tour Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map(tour => (
            <motion.div key={tour._id || tour.id} layout
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-500">

              <div className="relative h-56 overflow-hidden">
                <img src={getImageUrl(tour.image)} alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-start gap-1.5 flex-wrap">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow ${
                    tour.travelType === 'experience'
                      ? 'bg-[#c8a248] text-white'
                      : tour.travelType === 'worldwide'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#0b3d2e] text-white'
                  }`}>
                    {tour.travelType === 'experience' ? '01 · Experience' : tour.travelType === 'worldwide' ? '03 · Worldwide' : '02 · Journey'}
                  </span>
                  {tour.tag && (
                    <span className="bg-white/90 text-[#0b3d2e] text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow">
                      {tour.tag}
                    </span>
                  )}
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ml-auto ${STATUS_BADGE[tour.status || 'published']}`}>
                    {tour.status || 'published'}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between text-white/70 text-xs mb-1">
                    <span>{tour.destination || tour.location}</span>
                    <span className="font-bold text-[#c8a248]">{tour.duration}</span>
                  </div>
                  <h3 className="font-serif text-white text-lg leading-snug line-clamp-1">{tour.title}</h3>
                  {tour.subtitle && (
                    <p className="text-white/60 text-xs italic line-clamp-1 mt-0.5">{tour.subtitle}</p>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(tour)} title="Edit"
                    className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all shadow-lg">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDuplicate(tour)} title="Duplicate"
                    className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => handleToggleStatus(tour)} title={tour.status === 'published' ? 'Unpublish' : 'Publish'}
                    className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-primary hover:bg-emerald-500 hover:text-white transition-all shadow-lg">
                    <Globe size={14} />
                  </button>
                  <button onClick={() => handleDelete(tour._id)} title="Delete"
                    className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-primary hover:bg-red-500 hover:text-white transition-all shadow-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <p className="text-primary/50 text-sm leading-relaxed line-clamp-2 mb-4">
                  {tour.description || 'No description added yet.'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-xs text-primary/40">
                    <span>{tour.duration}</span>
                    {tour.accommodationOptions?.length > 0 && (
                      <><span className="w-px h-3 bg-gray-200" /><span>{tour.accommodationOptions.length} lodges</span></>
                    )}
                  </div>
                  <span className="font-serif text-primary font-bold text-sm">
                    {tour.currency || 'KES'} {Number(tour.price || 0).toLocaleString()}
                    <span className="text-primary/30 text-xs font-sans"> pp</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <p className="text-gray-400 text-sm">No tour packages found.</p>
        </div>
      )}
    </div>
  );
}
