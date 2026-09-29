import React, { useState } from 'react';
import { Star } from 'lucide-react';
import {
  INPUT, LABEL, TEXTAREA, SectionHeader, RemoveBtn, AddBtn, DragHandle,
  CURRENCIES,
} from './TourFormHelpers';

/* --- 5. ACCOMMODATION OPTIONS --- */
const PROP_TYPES = ['Luxury Lodge','Safari Camp','Tented Camp','Boutique Hotel','Villa','Resort','Private Camp','Eco Lodge','Hotel','Guesthouse','Other'];
const EMPTY_OPT = {
  propertyName: '', propertyType: 'Luxury Lodge', starRating: 5,
  destinationName: '', roomType: '', notes: '',
  recommended: false, featured: false, supplement: '',
};

function AccomCard({ opt, onUpdate, onRemove, onMoveUp, onMoveDown }) {
  const [expanded, setExpanded] = useState(true);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onUpdate({ propertyImage: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${opt.recommended ? 'border-accent/40' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
        <DragHandle />
        {opt.propertyImage && (
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
            <img src={opt.propertyImage} alt={opt.propertyName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-primary text-sm truncate">{opt.propertyName || <span className="text-gray-300 italic">Unnamed property</span>}</p>
          <p className="text-[11px] text-gray-400">{opt.propertyType}{opt.destinationName ? ` · ${opt.destinationName}` : ''}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {opt.recommended && <span className="text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Recommended</span>}
          <button type="button" onClick={onMoveUp} className="p-1 text-gray-300 hover:text-primary transition-colors text-xs">↑</button>
          <button type="button" onClick={onMoveDown} className="p-1 text-gray-300 hover:text-primary transition-colors text-xs">↓</button>
          <button type="button" onClick={() => setExpanded(e => !e)}
            className="text-[10px] text-gray-400 hover:text-primary px-2 py-1 rounded-lg hover:bg-white transition-all font-bold uppercase tracking-widest">
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <RemoveBtn onClick={onRemove} />
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-3 border-t border-gray-100">
          <div>
            <label className={LABEL}>Property Photo</label>
            <label className="flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-3 px-4 cursor-pointer hover:border-accent/40 transition-all group">
              {opt.propertyImage ? (
                <img src={opt.propertyImage} alt="preview" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-300 text-xl">+</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 truncate">{opt.propertyImage ? 'Click to change photo' : 'Upload property photo'}</p>
                <p className="text-[10px] text-gray-300">JPG, PNG, WEBP</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent border border-accent/30 px-3 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0">Choose</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={LABEL}>Property Name *</label>
              <input value={opt.propertyName || ''} onChange={e => onUpdate({ propertyName: e.target.value })}
                placeholder="e.g. Angama Mara, Saruni Samburu" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Property Type</label>
              <select value={opt.propertyType || 'Luxury Lodge'} onChange={e => onUpdate({ propertyType: e.target.value })} className={INPUT}>
                {PROP_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Star Rating</label>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => onUpdate({ starRating: n })} className="transition-transform hover:scale-110">
                    <Star size={18} className={n <= (opt.starRating || 5) ? 'fill-[#c8a248] text-[#c8a248]' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL}>Destination / Area</label>
              <input value={opt.destinationName || ''} onChange={e => onUpdate({ destinationName: e.target.value })}
                placeholder="e.g. Samburu, Maasai Mara" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Room Type</label>
              <input value={opt.roomType || ''} onChange={e => onUpdate({ roomType: e.target.value })}
                placeholder="e.g. Luxury Tent, Suite" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Price Supplement</label>
              <input type="number" value={opt.supplement || ''} onChange={e => onUpdate({ supplement: e.target.value })}
                placeholder="e.g. 1200" className={INPUT} />
            </div>
            <div className="col-span-2">
              <label className={LABEL}>Customer-Facing Note</label>
              <input value={opt.notes || ''} onChange={e => onUpdate({ notes: e.target.value })}
                placeholder="e.g. Private luxury accommodation with bush views" className={INPUT} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={opt.recommended || false} onChange={e => onUpdate({ recommended: e.target.checked })} className="w-4 h-4 accent-primary rounded" />
              <span className="text-sm text-gray-600 font-medium">Recommended</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={opt.featured || false} onChange={e => onUpdate({ featured: e.target.checked })} className="w-4 h-4 accent-primary rounded" />
              <span className="text-sm text-gray-600 font-medium">Featured</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export function AccommodationSection({ form, set, open, onToggle }) {
  const opts = form.accommodationOptions || [];
  const add = () => set('accommodationOptions', [...opts, { ...EMPTY_OPT }]);
  const remove = i => set('accommodationOptions', opts.filter((_, idx) => idx !== i));
  const update = (i, patch) => set('accommodationOptions', opts.map((o, idx) => idx === i ? { ...o, ...patch } : o));
  const moveUp = i => {
    if (i === 0) return;
    const arr = [...opts]; [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; set('accommodationOptions', arr);
  };
  const moveDown = i => {
    const arr = [...opts]; if (i >= arr.length - 1) return;
    [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; set('accommodationOptions', arr);
  };

  return (
    <>
      <SectionHeader icon="05" title="Accommodation Options" subtitle="Add properties directly — name, type, stars, notes"
        count={opts.length} open={open} onToggle={onToggle}
        action={<AddBtn onClick={e => { e.stopPropagation(); add(); }} label="Add Property" />} />
      {open && (
        <div className="px-6 pb-6 space-y-3">
          {opts.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-sm text-gray-400 mb-3">No properties added yet</p>
              <AddBtn onClick={add} label="Add Property" />
            </div>
          )}
          {opts.map((opt, i) => (
            <AccomCard key={i} opt={opt}
              onUpdate={patch => update(i, patch)}
              onRemove={() => remove(i)}
              onMoveUp={() => moveUp(i)}
              onMoveDown={() => moveDown(i)} />
          ))}
          {opts.length > 0 && <AddBtn onClick={add} label="Add Another Property" />}
        </div>
      )}
    </>
  );
}

/* --- 6. EXPERIENCES --- */
export function ExperiencesSection({ form, set, open, onToggle }) {
  const opts = form.experienceOptions || [];
  const [name, setName] = useState('');

  const add = () => {
    if (!name.trim()) return;
    set('experienceOptions', [...opts, { experienceName: name.trim(), included: false, supplement: null, notes: '' }]);
    setName('');
  };
  const remove = i => set('experienceOptions', opts.filter((_, idx) => idx !== i));
  const update = (i, patch) => set('experienceOptions', opts.map((o, idx) => idx === i ? { ...o, ...patch } : o));

  return (
    <>
      <SectionHeader icon="06" title="Experiences" subtitle="Activities and experiences included in this tour"
        count={opts.length} open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 space-y-3">
          <div className="flex gap-2">
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
              placeholder="Experience name (e.g. Hot Air Balloon)" className={INPUT} />
            <AddBtn onClick={add} label="Add" />
          </div>
          {opts.length === 0 && (
            <p className="text-xs text-gray-400 italic py-2">No experiences added yet</p>
          )}
          {opts.map((opt, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#0b3d2e]" />
              <p className="flex-1 text-sm font-semibold text-primary">{opt.experienceName}</p>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={opt.included || false}
                  onChange={e => update(i, { included: e.target.checked })}
                  className="w-3.5 h-3.5 accent-primary" />
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Included</span>
              </label>
              <input type="number" value={opt.supplement || ''} onChange={e => update(i, { supplement: e.target.value })}
                placeholder="Supplement $" className="w-28 bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-primary/40 transition-all" />
              <RemoveBtn onClick={() => remove(i)} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* --- 7. TRANSPORT --- */
export function TransportSection({ form, set, open, onToggle }) {
  const opts = form.transportOptions || [];
  const [name, setName] = useState('');

  const add = () => {
    if (!name.trim()) return;
    set('transportOptions', [...opts, { transportName: name.trim(), included: true, supplement: null, notes: '' }]);
    setName('');
  };
  const remove = i => set('transportOptions', opts.filter((_, idx) => idx !== i));
  const update = (i, patch) => set('transportOptions', opts.map((o, idx) => idx === i ? { ...o, ...patch } : o));

  return (
    <>
      <SectionHeader icon="07" title="Transport Options" subtitle="Vehicles and transfers included in this tour"
        count={opts.length} open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 space-y-3">
          <div className="flex gap-2">
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
              placeholder="Vehicle / transfer name (e.g. 4x4 Land Cruiser)" className={INPUT} />
            <AddBtn onClick={add} label="Add" />
          </div>
          {opts.length === 0 && (
            <p className="text-xs text-gray-400 italic py-2">No transport options added yet</p>
          )}
          {opts.map((opt, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#0b3d2e]" />
              <p className="flex-1 text-sm font-semibold text-primary">{opt.transportName}</p>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={opt.included !== false}
                  onChange={e => update(i, { included: e.target.checked })}
                  className="w-3.5 h-3.5 accent-primary" />
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Included</span>
              </label>
              <input type="number" value={opt.supplement || ''} onChange={e => update(i, { supplement: e.target.value })}
                placeholder="Supplement $" className="w-28 bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-primary/40 transition-all" />
              <RemoveBtn onClick={() => remove(i)} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* --- 8. PRICING --- */
export function PricingSection({ form, set, open, onToggle }) {
  const rules = form.pricingRules || [];
  const addRule = () => set('pricingRules', [...rules, { label: '', price: '', type: 'supplement' }]);
  const removeRule = i => set('pricingRules', rules.filter((_, idx) => idx !== i));
  const updateRule = (i, patch) => set('pricingRules', rules.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  return (
    <>
      <SectionHeader icon="08" title="Pricing" subtitle="Base price, currency, and pricing rules"
        open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className={LABEL}>Base Price *</label>
              <div className="flex gap-2">
                <select value={form.currency} onChange={e => set('currency', e.target.value)}
                  className="w-24 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-primary/40 transition-all flex-shrink-0">
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <input required type="number" min={0} value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="e.g. 2500" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all" />
              </div>
            </div>
            <div>
              <label className={LABEL}>Display Price Label</label>
              <input value={form.displayPrice || ''} onChange={e => set('displayPrice', e.target.value)}
                placeholder="e.g. From $2,500" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Price Type</label>
              <select value={form.priceType} onChange={e => set('priceType', e.target.value)} className={INPUT}>
                <option value="per_person">Per Person</option>
                <option value="per_group">Per Group</option>
                <option value="per_night">Per Night</option>
                <option value="request_quote">Request Quote Only</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={LABEL + ' mb-0'}>Additional Pricing Rules</label>
              <AddBtn onClick={addRule} label="Add Rule" />
            </div>
            {rules.length === 0 && (
              <p className="text-xs text-gray-400 italic">No additional pricing rules.</p>
            )}
            <div className="space-y-2">
              {rules.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={r.label} onChange={e => updateRule(i, { label: e.target.value })}
                    placeholder="e.g. Single Supplement, Child Rate"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/40 transition-all" />
                  <select value={r.type} onChange={e => updateRule(i, { type: e.target.value })}
                    className="w-32 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-primary/40 transition-all">
                    <option value="supplement">Supplement</option>
                    <option value="discount">Discount</option>
                    <option value="flat">Flat Rate</option>
                  </select>
                  <input type="number" value={r.price} onChange={e => updateRule(i, { price: e.target.value })}
                    placeholder="Amount" className="w-28 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/40 transition-all" />
                  <RemoveBtn onClick={() => removeRule(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* --- 9. INCLUSIONS & EXCLUSIONS --- */
export function InclusionsSection({ form, set, open, onToggle }) {
  const inc = form.inclusions || [];
  const exc = form.exclusions || [];
  const addInc = () => set('inclusions', [...inc, '']);
  const addExc = () => set('exclusions', [...exc, '']);
  const updateInc = (i, v) => set('inclusions', inc.map((x, idx) => idx === i ? v : x));
  const updateExc = (i, v) => set('exclusions', exc.map((x, idx) => idx === i ? v : x));
  const removeInc = i => set('inclusions', inc.filter((_, idx) => idx !== i));
  const removeExc = i => set('exclusions', exc.filter((_, idx) => idx !== i));

  return (
    <>
      <SectionHeader icon="✓" title="Inclusions & Exclusions" subtitle="What is and isn't included in this package"
        open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[9px]">✓</span>
                Included ({inc.length})
              </p>
              <AddBtn onClick={addInc} label="Add Item" />
            </div>
            <div className="space-y-2">
              {inc.length === 0 && <p className="text-xs text-gray-400 italic py-2">No inclusions added yet</p>}
              {inc.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <DragHandle />
                  <input value={item} onChange={e => updateInc(i, e.target.value)}
                    placeholder="e.g. Accommodation, Daily breakfast, Park fees" className={INPUT} />
                  <RemoveBtn onClick={() => removeInc(i)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center text-[9px]">✗</span>
                Excluded ({exc.length})
              </p>
              <AddBtn onClick={addExc} label="Add Item" />
            </div>
            <div className="space-y-2">
              {exc.length === 0 && <p className="text-xs text-gray-400 italic py-2">No exclusions added yet</p>}
              {exc.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <DragHandle />
                  <input value={item} onChange={e => updateExc(i, e.target.value)}
                    placeholder="e.g. International flights, Travel insurance" className={INPUT} />
                  <RemoveBtn onClick={() => removeExc(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* --- 10. TRAVEL INFORMATION --- */
export function TravelInfoSection({ form, set, open, onToggle }) {
  const fields = [
    ['bestTimeToVisit',    'Best Time to Visit',    'e.g. July to October for the Great Migration'],
    ['whatToPack',         'What to Pack',           'e.g. Light clothing, sunscreen, binoculars...'],
    ['travelRequirements', 'Travel Requirements',    'e.g. Valid passport, visa requirements...'],
    ['healthSafety',       'Health & Safety',        'e.g. Vaccinations recommended, malaria prophylaxis...'],
    ['cancellationPolicy', 'Cancellation Policy',    'e.g. Free cancellation up to 30 days before departure...'],
    ['importantNotes',     'Important Notes',        'e.g. Wildlife sightings are not guaranteed...'],
  ];

  return (
    <>
      <SectionHeader icon="10" title="Travel Information" subtitle="Important details for travellers"
        open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(([key, label, placeholder]) => (
            <div key={key}>
              <label className={LABEL}>{label}</label>
              <textarea rows={3} value={form[key] || ''} onChange={e => set(key, e.target.value)}
                placeholder={placeholder} className={TEXTAREA} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* --- 11. BOOKING SETTINGS --- */
export function BookingSettingsSection({ form, set, open, onToggle }) {
  return (
    <>
      <SectionHeader icon="11" title="Booking Settings" subtitle="How customers request and book this tour"
        open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={LABEL}>Booking Method</label>
              <div className="space-y-2">
                {[
                  ['enquiry',    'Request / Enquiry',  'Customer submits a journey request'],
                  ['quote_only', 'Request Quote Only', 'Admin prepares a custom quote'],
                ].map(([val, label, desc]) => (
                  <label key={val} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.bookingType === val ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="bookingType" value={val}
                      checked={form.bookingType === val}
                      onChange={() => set('bookingType', val)}
                      className="mt-0.5 accent-primary" />
                    <div>
                      <p className="text-sm font-semibold text-primary">{label}</p>
                      <p className="text-[11px] text-gray-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={LABEL}>Availability</label>
                <select value={form.availability || 'On Request'} onChange={e => set('availability', e.target.value)} className={INPUT}>
                  <option>On Request</option>
                  <option>Instant</option>
                  <option>Seasonal</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-primary">Online Payment</p>
                    <p className="text-[11px] text-gray-400">Customers pay online at checkout</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-all relative ${form.onlinePayment ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => set('onlinePayment', !form.onlinePayment)}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.onlinePayment ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-primary">Admin Approval Required</p>
                    <p className="text-[11px] text-gray-400">Admin must approve before confirming</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-all relative ${form.requiresApproval ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => set('requiresApproval', !form.requiresApproval)}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.requiresApproval ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-[12px] text-amber-700">
            <strong>Booking flow:</strong> Customer submits journey request → Admin checks availability → Admin prepares quote → Customer approves → Admin marks payment received → Booking confirmed
          </div>
        </div>
      )}
    </>
  );
}

/* --- 12. SEO --- */
export function SeoSection({ form, set, open, onToggle }) {
  return (
    <>
      <SectionHeader icon="12" title="SEO & Meta" subtitle="Search engine optimisation settings"
        open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className={LABEL}>SEO Title <span className="text-gray-300 font-normal normal-case">(defaults to tour title)</span></label>
            <input value={form.seoTitle || ''} onChange={e => set('seoTitle', e.target.value)}
              placeholder="e.g. Maasai Mara Luxury Safari | Vista Voyages" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Meta Description</label>
            <textarea rows={2} value={form.seoDescription || ''} onChange={e => set('seoDescription', e.target.value)}
              placeholder="150–160 character description for search engines..." className={TEXTAREA} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>URL Slug</label>
              <input value={form.slug || ''} onChange={e => set('slug', e.target.value)}
                placeholder="e.g. maasai-mara-luxury-safari" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Keywords</label>
              <input value={form.seoKeywords || ''} onChange={e => set('seoKeywords', e.target.value)}
                placeholder="e.g. safari, kenya, luxury, maasai mara" className={INPUT} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* --- 13. PUBLISHING --- */
export function PublishingSection({ form, set, open, onToggle }) {
  return (
    <>
      <SectionHeader icon="13" title="Publishing" subtitle="Control visibility and featured status"
        open={open} onToggle={onToggle} />
      {open && (
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className={LABEL}>Status</label>
            <div className="flex gap-3">
              {[['draft','Draft','bg-gray-100 text-gray-500'],['published','Published','bg-emerald-50 text-emerald-600'],['archived','Archived','bg-red-50 text-red-400']].map(([val, label, badge]) => (
                <label key={val} className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.status === val ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" name="status" value={val}
                    checked={form.status === val}
                    onChange={() => set('status', val)}
                    className="accent-primary" />
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-gray-200 transition-all">
            <input type="checkbox" checked={form.featured || false}
              onChange={e => set('featured', e.target.checked)}
              className="w-4 h-4 accent-primary rounded" />
            <div>
              <p className="text-sm font-semibold text-primary">Featured on Homepage</p>
              <p className="text-[11px] text-gray-400">Show this tour in the featured section on the homepage</p>
            </div>
          </label>
        </div>
      )}
    </>
  );
}
