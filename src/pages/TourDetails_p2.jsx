import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, ArrowRight, MessageCircle, Star, Car,
} from 'lucide-react';

const fmt = (n) => Number(n || 0).toLocaleString();

// ─── Chapter 4 · Accommodations ───────────────────────────────────────────────
function ChapterAccommodations({ tour, selectedAccom, setSelectedAccom }) {
  const list = Array.isArray(tour.accommodationOptions)
    ? tour.accommodationOptions
    : Array.isArray(tour.accommodations)
      ? tour.accommodations
      : [];
  if (list.length === 0) return null;

  return (
    <section className="bg-[#faf9f6] py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <span className="text-accent/50 text-[10px] uppercase tracking-[0.5em] font-semibold">03 — Where You Stay</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mt-4">Choose Your Lodge</h2>
          <p className="text-primary/40 text-sm mt-3">Select an accommodation tier — your choice is noted in your request.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          {list.map((acc, i) => {
            const isSelected = selectedAccom === i;
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => setSelectedAccom(i)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'border-accent bg-white shadow-xl shadow-accent/10'
                    : 'border-black/6 bg-white hover:border-accent/30 hover:shadow-md'
                }`}
              >
                {acc.propertyImage && (
                  <div className="h-40 w-full overflow-hidden">
                    <img src={acc.propertyImage} alt={acc.propertyName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: acc.starRating || 5 }).map((_, s) => (
                        <Star key={s} size={11} className="fill-accent text-accent" />
                      ))}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={12} className="text-white" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-primary text-base mb-0.5">{acc.propertyName}</h3>
                  {acc.destinationName && <p className="text-xs text-primary/40 mb-1">{acc.destinationName}</p>}
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary/30">{acc.propertyType}</span>
                  {acc.roomType && <p className="text-xs text-primary/50 mt-2">{acc.roomType}</p>}
                  {acc.notes && <p className="text-sm text-primary/55 leading-relaxed mt-2 line-clamp-2">{acc.notes}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    {acc.recommended && (
                      <span className="text-[9px] bg-accent text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Recommended</span>
                    )}
                    {acc.supplement && (
                      <span className="text-[10px] text-primary/40">
                        +{tour.currency || 'USD'} {fmt(acc.supplement)} supplement
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Chapter 5 · Inclusions & Exclusions ─────────────────────────────────────
function ChapterInclusions({ tour }) {
  const inclusions = tour.inclusions || [];
  const exclusions = tour.exclusions || [];
  if (inclusions.length === 0 && exclusions.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="text-accent/50 text-[10px] uppercase tracking-[0.5em] font-semibold">04 — What's Included</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mt-4">The Full Picture</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {inclusions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-5 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> Included
              </h3>
              <ul className="space-y-3">
                {inclusions.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 text-sm text-primary/65 leading-relaxed"
                  >
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {exclusions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-5 flex items-center gap-2">
                <XCircle size={14} className="text-red-400" /> Not Included
              </h3>
              <ul className="space-y-3">
                {exclusions.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 text-sm text-primary/40 leading-relaxed"
                  >
                    <XCircle size={15} className="text-red-300 flex-shrink-0 mt-0.5" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {tour.notes && (
          <p className="mt-10 text-xs text-primary/30 leading-relaxed border-t border-black/5 pt-6">
            * {tour.notes}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Chapter 6 · Experiences ─────────────────────────────────────────────────
function ChapterExperiencesDetail({ tour }) {
  const list = (tour.experienceOptions || []);
  if (list.length === 0) return null;
  return (
    <section id="experiences" className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <span className="text-accent/50 text-[10px] uppercase tracking-[0.5em] font-semibold">05 — Experiences</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mt-4">Activities & Experiences</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((exp, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#faf9f6] rounded-2xl p-5 border border-black/5">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-primary text-sm">{exp.experienceName}</p>
                {exp.included && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0 ml-2">Included</span>
                )}
              </div>
              {exp.notes && <p className="text-xs text-primary/45 leading-relaxed">{exp.notes}</p>}
              {!exp.included && exp.supplement && (
                <p className="text-xs text-primary/40 mt-2">+{tour.currency || 'USD'} {fmt(exp.supplement)}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chapter 7 · Transport ────────────────────────────────────────────────────
function ChapterTransport({ tour }) {
  const list = (tour.transportOptions || []);
  if (list.length === 0) return null;
  const icons = { air: Plane, road: Car, cycle: Bike, water: Ship, bus: Bus, truck: Truck };
  return (
    <section id="transport" className="bg-[#faf9f6] py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <span className="text-accent/50 text-[10px] uppercase tracking-[0.5em] font-semibold">06 — Getting Around</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mt-4">Transport</h2>
        </motion.div>
        <div className="flex flex-wrap gap-4">
          {list.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 border border-black/5">
              <Car size={18} className="text-accent flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary text-sm">{t.transportName}</p>
                {t.notes && <p className="text-xs text-primary/40">{t.notes}</p>}
              </div>
              {t.included !== false && (
                <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-2">Included</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chapter 8 · Travel Info ──────────────────────────────────────────────────
function ChapterTravelInfo({ tour }) {
  const fields = [
    ['bestTimeToVisit',    'Best Time to Visit'],
    ['whatToPack',         'What to Pack'],
    ['travelRequirements', 'Travel Requirements'],
    ['healthSafety',       'Health & Safety'],
    ['cancellationPolicy', 'Cancellation Policy'],
    ['importantNotes',     'Important Notes'],
  ].filter(([key]) => tour[key]);
  if (fields.length === 0) return null;
  return (
    <section id="travel-info" className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <span className="text-accent/50 text-[10px] uppercase tracking-[0.5em] font-semibold">07 — Good to Know</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mt-4">Travel Information</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(([key, label], i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#faf9f6] rounded-2xl p-6 border border-black/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent/60 mb-3">{label}</p>
              <p className="text-sm text-primary/65 leading-relaxed whitespace-pre-line">{tour[key]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chapter 6 · Experiences ─────────────────────────────────────────────────
const TRAVEL_STYLES = [
  { key: 'Private', desc: 'Solo or exclusive' },
  { key: 'Couple',  desc: 'Romantic escape' },
  { key: 'Family',  desc: 'Kids welcome' },
  { key: 'Group',   desc: '5+ travellers' },
];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function ChapterBooking({ tour, onSubmit, loading, error, result, selectedAccom }) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2];
  const accomList = Array.isArray(tour.accommodationOptions)
    ? tour.accommodationOptions
    : Array.isArray(tour.accommodations)
      ? tour.accommodations
      : [];
  const accom = accomList[selectedAccom];

  const [form, setForm] = useState({
    month: '', year: String(currentYear + 1),
    adults: 2, children: 0,
    style: 'Private',
    message: '',
    firstName: '', lastName: '', email: '', phone: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const base = tour.price || 0;
  const currency = tour.currency || 'USD';
  const multipliers = { 1: 1.30, 2: 1.00, 3: 0.88, 4: 0.80 };
  const paxMult = multipliers[form.adults] || 0.75;
  const estimatedTotal = Math.round(base * paxMult) * form.adults;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, accommodation: accom?.propertyName || '', estimatedTotal });
  };

  if (result) {
    return (
      <section id="request" className="bg-primary py-24 md:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={40} className="text-accent" />
            </div>
            <p className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-3">Request Received</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Your Journey Begins</h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Our travel specialist is preparing your personalised itinerary and quotation. Expect to hear from us within 24 hours.
            </p>
            <div className="bg-white/10 rounded-2xl p-6 mb-8 inline-block">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Your Reference</p>
              <p className="font-mono text-2xl font-bold text-accent tracking-wider">{result.reference || result.bookingRef || '—'}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/tours" className="bg-accent text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                Explore More Journeys
              </Link>
              <a
                href={`https://wa.me/254700000000?text=Hi, my booking reference is ${result.reference || result.bookingRef}`}
                target="_blank" rel="noreferrer"
                className="border border-white/20 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="request" className="bg-primary py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="text-accent/60 text-[10px] uppercase tracking-[0.5em] font-semibold">08 — Request This Trip</span>
          <h2 className="font-serif text-4xl md:text-5xl text-white mt-4">Tell Us When You're Ready</h2>
          <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
            No payment required. A travel specialist will send your personalised quote within 24 hours.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* LEFT — trip preferences */}
            <div className="lg:col-span-3 space-y-4">

              {/* When */}
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <p className="text-black text-[10px] uppercase tracking-widest font-black">When are you travelling?</p>
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.month} onChange={e => set('month', e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-black rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all">
                    <option value="">Select month</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={form.year} onChange={e => set('year', e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-black rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all">
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Travellers */}
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <p className="text-black text-[10px] uppercase tracking-widest font-black">How many travellers?</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'adults',   label: 'Adults',   sub: 'Age 12+',  min: 1 },
                    { key: 'children', label: 'Children', sub: 'Under 12', min: 0 },
                  ].map(({ key, label, sub, min }) => (
                    <div key={key} className="bg-gray-50 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-black text-sm font-bold">{label}</p>
                          <p className="text-black/60 text-[10px] font-semibold">{sub}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => set(key, Math.max(min, form[key] - 1))}
                            className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-black hover:bg-accent hover:text-white transition-all text-base leading-none">
                            −
                          </button>
                          <span className="text-black font-bold w-5 text-center">{form[key]}</span>
                          <button type="button" onClick={() => set(key, form[key] + 1)}
                            className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-black hover:bg-accent hover:text-white transition-all text-base leading-none">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel style */}
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <p className="text-black text-[10px] uppercase tracking-widest font-black">Travel style</p>
                <div className="grid grid-cols-2 gap-2">
                  {TRAVEL_STYLES.map(({ key, desc }) => (
                    <button
                      key={key} type="button"
                      onClick={() => set('style', key)}
                      className={`px-4 py-3 rounded-xl text-left transition-all ${
                        form.style === key
                          ? 'bg-accent text-white'
                          : 'bg-gray-50 text-black hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-black uppercase tracking-wider">{key}</p>
                      <p className={`text-[10px] mt-0.5 font-semibold ${form.style === key ? 'text-white/80' : 'text-black/60'}`}>{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="bg-white rounded-2xl p-6">
                <p className="text-black text-[10px] uppercase tracking-widest font-black mb-3">Special requests</p>
                <textarea
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  rows={3}
                  placeholder="Dietary requirements, special occasions, accessibility needs..."
                  className="w-full bg-gray-50 border border-gray-200 text-black placeholder:text-black/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all resize-none"
                />
              </div>
            </div>

            {/* RIGHT — contact + summary */}
            <div className="lg:col-span-2 space-y-4">

              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <p className="text-accent text-[10px] uppercase tracking-widest font-black mb-4">Estimated Total</p>
                <p className="font-serif text-4xl text-black mb-1">
                  {currency} {fmt(estimatedTotal)}
                </p>
                <p className="text-black/70 text-xs font-semibold mb-4">
                  {form.adults} adult{form.adults !== 1 ? 's' : ''}
                  {form.children > 0 ? ` + ${form.children} child${form.children !== 1 ? 'ren' : ''}` : ''}
                  {accom ? ` · ${accom.propertyName}` : ''}
                </p>
                <p className="text-black/50 text-[10px] font-medium leading-relaxed">
                  Indicative only. Final quote confirmed by your travel specialist.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 space-y-3">
                <p className="text-black text-[10px] uppercase tracking-widest font-black">Your details</p>
                {[
                  { key: 'firstName', placeholder: 'First name',       type: 'text',  required: true },
                  { key: 'lastName',  placeholder: 'Last name',        type: 'text',  required: false },
                  { key: 'email',     placeholder: 'Email address',    type: 'email', required: true },
                  { key: 'phone',     placeholder: 'Phone / WhatsApp', type: 'tel',   required: true },
                ].map(({ key, placeholder, type, required }) => (
                  <input
                    key={key}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-black placeholder:text-black/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-white text-white hover:text-primary py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Request My Itinerary
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-white/20 text-xs">
                No payment required · Quote within 24 hours
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export { ChapterAccommodations, ChapterInclusions, ChapterExperiencesDetail, ChapterTransport, ChapterTravelInfo, ChapterBooking };
