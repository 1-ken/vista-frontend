import React, { useState } from 'react';
import { Image as ImageIcon, ChevronDown, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import getImageUrl from '../../utils/imageUrl';
import {
  INPUT, LABEL, TEXTAREA, SectionHeader, RemoveBtn, AddBtn, DragHandle,
  CURRENCIES, CATEGORIES, DIFFICULTIES, TRAVEL_STYLES, MEAL_OPTIONS, TRAVEL_TYPES,
} from './TourFormHelpers';

/* ─── 1. BASIC INFORMATION ─────────────────────────────────────────────────── */
export function BasicInfoSection({ form, set }) {
  const autoSlug = (title) => {
    const s = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    set('title', title);
    if (!form.slug || form.slug === form.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) {
      set('slug', s);
    }
  };

  const isExperience = form.travelType === 'experience';

  return (
    <div className="p-6 space-y-5">
      {/* Travel World Selector */}
      <div className="bg-[#f8f6f1] p-4 rounded-2xl border border-black/5">
        <label className="text-[10px] text-[#0b3d2e] uppercase tracking-[0.25em] font-black mb-2.5 block">
          VistaVoyage Travel World *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TRAVEL_TYPES.map(tw => {
            const active = (form.travelType || 'journey') === tw.value;
            return (
              <button
                type="button"
                key={tw.value}
                onClick={() => {
                  set('travelType', tw.value);
                  if (tw.value === 'experience' && !form.duration) set('duration', '12 Hours');
                  if (tw.value === 'experience') set('nights', 0);
                }}
                className={`py-3 px-3.5 rounded-xl text-left border transition-all text-xs ${
                  active
                    ? 'bg-[#0b3d2e] text-white border-[#0b3d2e] shadow-md shadow-[#0b3d2e]/20'
                    : 'bg-white text-black/70 border-black/8 hover:border-[#0b3d2e]/30'
                }`}
              >
                <div className="font-bold tracking-tight">{tw.label.split('(')[0].trim()}</div>
                <div className={`text-[10px] mt-0.5 ${active ? 'text-[#c8a248]' : 'text-black/40'}`}>
                  {tw.label.includes('(') ? tw.label.split('(')[1].replace(')', '') : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={LABEL}>Package Title *</label>
          <input required value={form.title} onChange={e => autoSlug(e.target.value)}
            placeholder={isExperience ? "e.g. The Nairobi Experience" : "e.g. Exclusive Maasai Mara Luxury Safari"}
            className={INPUT} />
        </div>

        <div className="md:col-span-2">
          <label className={LABEL}>Subtitle / Punchline</label>
          <input value={form.subtitle || ''} onChange={e => set('subtitle', e.target.value)}
            placeholder={isExperience ? "e.g. 12 Hours. One City. A thousand impressions." : "e.g. Go Deeper into Africa's Most Revered Wildlife Theatre"}
            className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Destination *</label>
          <input value={form.destination} onChange={e => set('destination', e.target.value)}
            placeholder="e.g. Maasai Mara, Kenya" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Country</label>
          <input value={form.country} onChange={e => set('country', e.target.value)}
            placeholder="e.g. Kenya" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Region</label>
          <input value={form.region} onChange={e => set('region', e.target.value)}
            placeholder="e.g. Narok County" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={INPUT}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={LABEL}>Tag / Badge</label>
          <input value={form.tag} onChange={e => set('tag', e.target.value)}
            placeholder="e.g. Best Seller, Ultra-Luxury" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Duration *</label>
          <input required value={form.duration} onChange={e => set('duration', e.target.value)}
            placeholder={isExperience ? "e.g. 12 Hours or 6 Hours" : "e.g. 4 Days 3 Nights"} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>{isExperience ? 'Number of Nights (0 for Day Trip)' : 'Number of Nights'}</label>
          <input type="number" min={0} value={form.nights} onChange={e => set('nights', e.target.value)}
            placeholder={isExperience ? "0" : "e.g. 3"} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Best Season</label>
          <input value={form.bestSeason} onChange={e => set('bestSeason', e.target.value)}
            placeholder="e.g. July to October" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Difficulty</label>
          <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={INPUT}>
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className={LABEL}>Travel Style</label>
          <select value={form.travelStyle} onChange={e => set('travelStyle', e.target.value)} className={INPUT}>
            {TRAVEL_STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className={LABEL}>Min Travelers</label>
          <input type="number" min={1} value={form.minTravelers} onChange={e => set('minTravelers', e.target.value)} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Max Travelers</label>
          <input type="number" min={1} value={form.maxTravelers} onChange={e => set('maxTravelers', e.target.value)} className={INPUT} />
        </div>
      </div>

      <div>
        <label className={LABEL}>Short Description * <span className="text-gray-300 font-normal normal-case">(shown on tour cards)</span></label>
        <textarea required rows={2} value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="One or two compelling sentences shown on tour cards and the hero section."
          className={TEXTAREA} />
      </div>

      <div>
        <label className={LABEL}>Full Description <span className="text-gray-300 font-normal normal-case">(shown on tour detail page)</span></label>
        <textarea rows={5} value={form.fullDescription} onChange={e => set('fullDescription', e.target.value)}
          placeholder="Detailed description for the Experience section on the tour detail page."
          className={TEXTAREA} />
      </div>
    </div>
  );
}

/* ─── 2. MEDIA ──────────────────────────────────────────────────────────────── */
export function MediaSection({ form, set }) {
  const [urlInput, setUrlInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (file) set('image', file);
  };

  const handleApplyCoverUrl = () => {
    if (urlInput.trim()) {
      set('image', urlInput.trim());
      setUrlInput('');
    }
  };

  const handleMultipleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    setUploadError('');
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const { data } = await api.post('/tours/upload-images', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newUrls = data.urls || [];
      const currentGallery = Array.isArray(form.gallery) ? form.gallery : [];
      set('gallery', [...currentGallery, ...newUrls]);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Error uploading gallery images');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleAddGalleryUrl = () => {
    if (galleryUrlInput.trim()) {
      const currentGallery = Array.isArray(form.gallery) ? form.gallery : [];
      set('gallery', [...currentGallery, galleryUrlInput.trim()]);
      setGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (index) => {
    const currentGallery = Array.isArray(form.gallery) ? form.gallery : [];
    set('gallery', currentGallery.filter((_, i) => i !== index));
  };

  const coverPreview = form.image
    ? typeof form.image === 'string'
      ? getImageUrl(form.image)
      : URL.createObjectURL(form.image)
    : null;

  const galleryList = Array.isArray(form.gallery) ? form.gallery : [];

  return (
    <div className="p-6 space-y-6">
      {/* ── Cover Image ── */}
      <div className="space-y-3">
        <label className={LABEL}>Cover / Hero Image *</label>
        
        {coverPreview && (
          <div className="relative w-full max-w-md h-48 rounded-2xl overflow-hidden border border-gray-200 group mb-3 shadow-sm bg-gray-50">
            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => set('image', null)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1 shadow"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
            <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Current Cover Image
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-3 px-4 cursor-pointer hover:border-accent/40 transition-all group">
            <Upload size={18} className="text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700 truncate">
                {form.image ? (typeof form.image === 'string' ? 'Change file' : form.image.name) : 'Upload File (JPG, PNG, WEBP)'}
              </p>
              <p className="text-[10px] text-gray-400">Click to browse your device</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
          </label>

          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className={INPUT}
            />
            <button
              type="button"
              onClick={handleApplyCoverUrl}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-accent hover:text-primary transition-all whitespace-nowrap"
            >
              Set URL
            </button>
          </div>
        </div>
      </div>

      {/* ── Tour Gallery Photos ── */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <label className={LABEL}>Tour Gallery Photos</label>
            <p className="text-xs text-gray-500">Showcase destinations, lodges, game drives, and scenery for this tour</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent/15 text-accent uppercase tracking-wider">
            {galleryList.length} photo{galleryList.length !== 1 ? 's' : ''}
          </span>
        </div>

        {uploadError && (
          <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-xl">{uploadError}</p>
        )}

        {/* Gallery Thumbnails Grid */}
        {galleryList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200/60">
            {galleryList.map((imgUrl, idx) => (
              <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <img src={getImageUrl(imgUrl)} alt={`Tour gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600/90 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                  title="Remove image"
                >
                  <Trash2 size={12} />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1.5 rounded">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload & Add controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className={`flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-3 px-4 cursor-pointer hover:border-accent/40 transition-all group ${uploadingGallery ? 'opacity-60 pointer-events-none' : ''}`}>
            {uploadingGallery ? (
              <Loader2 size={18} className="text-accent animate-spin" />
            ) : (
              <Upload size={18} className="text-accent group-hover:scale-110 transition-transform" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700">
                {uploadingGallery ? 'Uploading images...' : 'Upload Gallery Photos (Multiple)'}
              </p>
              <p className="text-[10px] text-gray-400">Select multiple JPG, PNG, WEBP files</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleMultipleGalleryUpload}
              disabled={uploadingGallery}
            />
          </label>

          <div className="flex items-center gap-2">
            <input
              type="url"
              value={galleryUrlInput}
              onChange={e => setGalleryUrlInput(e.target.value)}
              placeholder="Or paste photo URL..."
              className={INPUT}
            />
            <button
              type="button"
              onClick={handleAddGalleryUrl}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-accent hover:text-primary transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus size={13} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* ── Video URL ── */}
      <div className="pt-4 border-t border-gray-100">
        <label className={LABEL}>Video URL <span className="text-gray-300 font-normal normal-case">(YouTube or Vimeo embed URL)</span></label>
        <input value={form.videoUrl || ''} onChange={e => set('videoUrl', e.target.value)}
          placeholder="https://www.youtube.com/embed/..." className={INPUT} />
      </div>
    </div>
  );
}

/* ─── 3. HIGHLIGHTS ─────────────────────────────────────────────────────────── */
export function HighlightsSection({ form, set, open, onToggle }) {
  const add    = () => set('highlights', [...form.highlights, { title: '', description: '' }]);
  const remove = i  => set('highlights', form.highlights.filter((_, idx) => idx !== i));
  const update = (i, patch) => set('highlights', form.highlights.map((h, idx) => idx === i ? { ...h, ...patch } : h));

  return (
    <>
      <SectionHeader icon="02" title="Highlights" subtitle="Key selling points of this tour"
        count={form.highlights.length} open={open} onToggle={onToggle}
        action={<AddBtn onClick={e => { e.stopPropagation(); add(); }} label="Add Highlight" />} />
      {open && (
        <div className="px-6 pb-6 space-y-3">
          {form.highlights.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-sm text-gray-400 mb-3">No highlights yet</p>
              <AddBtn onClick={add} label="Add First Highlight" />
            </div>
          )}
          {form.highlights.map((h, i) => (
            <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <DragHandle />
                <div className="flex-1 space-y-2">
                  <input value={h.title} onChange={e => update(i, { title: e.target.value })}
                    placeholder="Highlight title (e.g. Private Game Drives)"
                    className={INPUT} />
                  <textarea rows={2} value={h.description} onChange={e => update(i, { description: e.target.value })}
                    placeholder="Brief description of this highlight..."
                    className={TEXTAREA} />
                </div>
                <RemoveBtn onClick={() => remove(i)} />
              </div>
            </div>
          ))}
          {form.highlights.length > 0 && <AddBtn onClick={add} label="Add Highlight" />}
        </div>
      )}
    </>
  );
}

/* ─── 4. DAILY ITINERARY / TIMELINE ─────────────────────────────────────────── */
function ItineraryDay({ day, index, isExperience, onUpdate, onRemove, onDuplicate }) {
  const [expanded, setExpanded] = useState(true);

  const addActivity    = () => onUpdate({ activities: [...(day.activities || []), { time: '', description: '' }] });
  const updateActivity = (ai, patch) => onUpdate({ activities: (day.activities || []).map((a, idx) => idx === ai ? { ...a, ...patch } : a) });
  const removeActivity = (ai) => onUpdate({ activities: (day.activities || []).filter((_, idx) => idx !== ai) });

  const toggleMeal = (meal) => {
    const meals = Array.isArray(day.meals) ? day.meals : (day.meals ? [day.meals] : []);
    onUpdate({ meals: meals.includes(meal) ? meals.filter(m => m !== meal) : [...meals, meal] });
  };

  const selectedMeals = Array.isArray(day.meals) ? day.meals : (day.meals ? [day.meals] : []);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <DragHandle />
        <div className={`rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 px-2 py-1 ${
          isExperience ? 'bg-[#c8a248] min-w-[58px]' : 'w-10 h-10 bg-primary'
        }`}>
          <span className="text-[8px] uppercase tracking-wider opacity-75">{isExperience ? 'Time' : 'Day'}</span>
          <span className="text-xs font-bold leading-none font-mono">
            {isExperience ? (day.timings || `0${index + 1}:00`) : String(day.day || index + 1).padStart(2, '0')}
          </span>
        </div>
        {isExperience && (
          <input
            value={day.timings || ''}
            onChange={e => onUpdate({ timings: e.target.value })}
            placeholder="e.g. 06:00"
            className="w-24 bg-white border border-gray-200 rounded-lg py-1 px-2.5 text-xs font-mono font-bold text-[#0b3d2e] focus:outline-none focus:border-primary"
          />
        )}
        <input value={day.title} onChange={e => onUpdate({ title: e.target.value })}
          placeholder={isExperience ? "Stop / Highlight title (e.g. Nairobi National Park Game Drive)" : "Day title (e.g. Arrival & Welcome to Maasai Mara)"}
          className="flex-1 bg-transparent border-b border-gray-200 py-1 text-sm font-semibold text-primary focus:outline-none focus:border-primary" />
        <div className="flex items-center gap-1 flex-shrink-0">
          <button type="button" onClick={onDuplicate}
            className="text-[10px] text-gray-400 hover:text-primary px-2 py-1 rounded-lg hover:bg-white transition-all font-bold uppercase tracking-widest">
            Copy
          </button>
          <RemoveBtn onClick={onRemove} />
          <button type="button" onClick={() => setExpanded(e => !e)}
            className="p-1 text-gray-400 hover:text-primary transition-colors">
            <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className={LABEL}>Day Description</label>
            <textarea rows={3} value={day.description} onChange={e => onUpdate({ description: e.target.value })}
              placeholder="Describe what happens on this day..."
              className={TEXTAREA} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={LABEL + ' mb-0'}>Activities & Schedule</label>
              <AddBtn onClick={addActivity} label="Add Activity" />
            </div>
            {(day.activities || []).length === 0 && (
              <p className="text-xs text-gray-400 italic py-2">No activities added yet</p>
            )}
            <div className="space-y-2">
              {(day.activities || []).map((act, ai) => (
                <div key={ai} className="flex items-center gap-2">
                  <input value={act.time} onChange={e => updateActivity(ai, { time: e.target.value })}
                    placeholder="08:00" className="w-20 bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-primary/40 transition-all" />
                  <input value={act.description} onChange={e => updateActivity(ai, { description: e.target.value })}
                    placeholder="Activity description (e.g. Airport pickup)" className={INPUT} />
                  <RemoveBtn onClick={() => removeActivity(ai)} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Meals Included</label>
              <div className="flex flex-wrap gap-2">
                {MEAL_OPTIONS.map(m => (
                  <button key={m} type="button" onClick={() => toggleMeal(m)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${selectedMeals.includes(m) ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary/30'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL}>Accommodation Note</label>
              <input value={day.accommodation || ''} onChange={e => onUpdate({ accommodation: e.target.value })}
                placeholder="e.g. Mara Serena Lodge" className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Day Notes / Tips</label>
            <input value={day.notes || ''} onChange={e => onUpdate({ notes: e.target.value })}
              placeholder="Optional notes for this day..." className={INPUT} />
          </div>
        </div>
      )}
    </div>
  );
}

export function ItinerarySection({ form, set, open, onToggle }) {
  const isExperience = form?.travelType === 'experience';

  const add = () => set('itinerary', [...form.itinerary, {
    day: form.itinerary.length + 1,
    timings: isExperience ? `${String(Math.min(6 + form.itinerary.length * 2, 22)).padStart(2, '0')}:00` : '',
    title: '', description: '',
    activities: [], meals: [], accommodation: '', notes: '',
  }]);

  const remove = i => {
    const next = form.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 }));
    set('itinerary', next);
  };

  const update    = (i, patch) => set('itinerary', form.itinerary.map((d, idx) => idx === i ? { ...d, ...patch } : d));
  const duplicate = (i) => set('itinerary', [...form.itinerary, { ...form.itinerary[i], day: form.itinerary.length + 1 }]);

  return (
    <>
      <SectionHeader
        icon="04"
        title={isExperience ? "Hourly Schedule / Timeline" : "Daily Itinerary"}
        subtitle={isExperience ? "Hour-by-hour pacing through the experience" : "Day-by-day schedule with activities and meals"}
        count={form.itinerary.length} open={open} onToggle={onToggle}
        action={<AddBtn onClick={e => { e.stopPropagation(); add(); }} label={isExperience ? "Add Stop" : "Add Day"} />} />
      {open && (
        <div className="px-6 pb-6 space-y-3">
          {form.itinerary.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-sm text-gray-400 mb-3">{isExperience ? "No stops or timeline entries yet" : "No itinerary days yet"}</p>
              <AddBtn onClick={add} label={isExperience ? "Add First Stop" : "Add Day 1"} />
            </div>
          )}
          {form.itinerary.map((day, i) => (
            <ItineraryDay key={i} day={day} index={i} isExperience={isExperience}
              onUpdate={patch => update(i, patch)}
              onRemove={() => remove(i)}
              onDuplicate={() => duplicate(i)} />
          ))}
          {form.itinerary.length > 0 && (
            <AddBtn onClick={add} label={isExperience ? `Add Stop ${form.itinerary.length + 1}` : `Add Day ${form.itinerary.length + 1}`} />
          )}
        </div>
      )}
    </>
  );
}
