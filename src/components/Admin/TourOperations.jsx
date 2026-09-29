import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Car, User, Hotel, Plane, MapPin, Edit2, Trash2, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const TABS = ['schedules', 'guides', 'vehicles'];
const GUIDES_KEY   = 'vv_guides';
const VEHICLES_KEY = 'vv_vehicles';

const STATUS_STYLE = {
  Available: 'bg-emerald-50 text-emerald-600',
  'On Tour':  'bg-blue-50 text-blue-600',
  Maintenance:'bg-red-50 text-red-500',
  CONFIRMED:  'bg-emerald-50 text-emerald-600',
  PENDING:    'bg-amber-50 text-amber-600',
  NEW:        'bg-gray-100 text-gray-500',
};

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

const TourOperations = () => {
  const [tab, setTab] = useState('schedules');
  const [bookings, setBookings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [guideForm, setGuideForm] = useState({ name: '', phone: '', email: '', languages: '', speciality: '', status: 'Available' });
  const [vehicleForm, setVehicleForm] = useState({ reg: '', type: 'Land Cruiser', capacity: 7, driver: '', condition: 'Good', lastService: '' });

  useEffect(() => {
    const savedGuides   = localStorage.getItem(GUIDES_KEY);
    const savedVehicles = localStorage.getItem(VEHICLES_KEY);
    if (savedGuides)   setGuides(JSON.parse(savedGuides));
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles));

    api.get('/bookings?limit=200&page=1')
      .then(res => setBookings(listItemsFromResponse(res)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveGuides   = (g) => { setGuides(g);   localStorage.setItem(GUIDES_KEY, JSON.stringify(g)); };
  const saveVehicles = (v) => { setVehicles(v); localStorage.setItem(VEHICLES_KEY, JSON.stringify(v)); };

  const addGuide = (e) => {
    e.preventDefault();
    saveGuides([{ ...guideForm, id: `G${Date.now()}`, languages: guideForm.languages.split(',').map(l => l.trim()), rating: 5, trips: 0 }, ...guides]);
    setModal(null);
    setGuideForm({ name: '', phone: '', email: '', languages: '', speciality: '', status: 'Available' });
  };

  const addVehicle = (e) => {
    e.preventDefault();
    saveVehicles([{ ...vehicleForm, id: `V${Date.now()}`, status: 'Available' }, ...vehicles]);
    setModal(null);
    setVehicleForm({ reg: '', type: 'Land Cruiser', capacity: 7, driver: '', condition: 'Good', lastService: '' });
  };

  // Upcoming bookings as schedules
  const schedules = bookings
    .filter(b => b.fromDate && b.workflowStatus !== 'CANCELLED')
    .sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))
    .slice(0, 20);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Tour Operations</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">Manage guides, vehicles & schedules</p>
        </div>
        <button onClick={() => setModal(tab === 'guides' ? 'add-guide' : tab === 'vehicles' ? 'add-vehicle' : null)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40"
          disabled={tab === 'schedules'}>
          <Plus size={14} /> Add {tab === 'guides' ? 'Guide' : tab === 'vehicles' ? 'Vehicle' : ''}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Tours',  value: schedules.filter(b => new Date(b.fromDate) > new Date()).length, bg: 'bg-primary text-white' },
          { label: 'Active Guides',   value: guides.filter(g => g.status === 'Available').length,             bg: 'bg-emerald-50 text-emerald-700' },
          { label: 'Vehicles',        value: vehicles.length,                                                  bg: 'bg-blue-50 text-blue-700' },
          { label: 'Total Bookings',  value: bookings.length,                                                  bg: 'bg-amber-50 text-amber-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.bg}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <p className="text-2xl font-serif font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Schedules — from real bookings */}
      {tab === 'schedules' && (
        <div className="space-y-3">
          {schedules.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-sm text-gray-400">No upcoming tours scheduled</p>
            </div>
          ) : schedules.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary flex flex-col items-center justify-center text-white flex-shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {new Date(b.fromDate).toLocaleString('en', { month: 'short' })}
                </span>
                <span className="text-xl font-serif font-bold leading-none">{new Date(b.fromDate).getDate()}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary text-[14px] mb-1">{b.packageName || b.tour?.title || 'Custom Package'}</p>
                <div className="flex flex-wrap gap-4 text-[12px] text-gray-400">
                  <span className="flex items-center gap-1"><User size={11} /> {b.guestName}</span>
                  <span className="flex items-center gap-1"><User size={11} /> {b.guestsCount || 1} guests</span>
                  {b.referenceId && <span className="font-mono text-[11px]">{b.referenceId}</span>}
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${STATUS_STYLE[b.workflowStatus] || 'bg-gray-100 text-gray-500'}`}>
                {b.workflowStatus || 'NEW'}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Guides */}
      {tab === 'guides' && (
        guides.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <User size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400 mb-4">No guides added yet</p>
            <button onClick={() => setModal('add-guide')} className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
              Add First Guide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {guides.map((g, i) => (
              <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-accent font-bold text-lg">{g.name.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-primary text-[14px]">{g.name}</p>
                      <p className="text-[11px] text-gray-400">{g.speciality}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_STYLE[g.status]}`}>{g.status}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(Array.isArray(g.languages) ? g.languages : [g.languages]).map(l => (
                    <span key={l} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded-lg">{l}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">{g.phone}</span>
                  <button onClick={() => saveGuides(guides.filter(x => x.id !== g.id))}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Vehicles */}
      {tab === 'vehicles' && (
        vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Car size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400 mb-4">No vehicles added yet</p>
            <button onClick={() => setModal('add-vehicle')} className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
              Add First Vehicle
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Registration', 'Type', 'Capacity', 'Driver', 'Condition', 'Last Service', ''].map(h => (
                    <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vehicles.map((v, i) => (
                  <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-primary text-[13px]">{v.reg}</td>
                    <td className="px-5 py-4 text-[13px] text-primary/70">{v.type}</td>
                    <td className="px-5 py-4 text-[13px] text-primary/70">{v.capacity} pax</td>
                    <td className="px-5 py-4 text-[13px] text-primary/70">{v.driver}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${v.condition === 'Excellent' ? 'bg-emerald-50 text-emerald-600' : v.condition === 'Good' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{v.condition}</span>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray-400">{v.lastService || '—'}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => saveVehicles(vehicles.filter(x => x.id !== v.id))}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <AnimatePresence>
        {modal === 'add-guide' && (
          <Modal onClose={() => setModal(null)} title="Add Guide">
            <form onSubmit={addGuide} className="space-y-4">
              {[['name','Full Name','text'],['phone','Phone','tel'],['email','Email','email'],['speciality','Speciality','text'],['languages','Languages (comma separated)','text']].map(([k,l,t]) => (
                <div key={k}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{l}</label>
                  <input type={t} required={k !== 'email'} value={guideForm[k]} onChange={e => setGuideForm({...guideForm,[k]:e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Status</label>
                <select value={guideForm.status} onChange={e => setGuideForm({...guideForm, status: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none cursor-pointer">
                  <option>Available</option><option>On Tour</option><option>Off Duty</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">Add Guide</button>
            </form>
          </Modal>
        )}

        {modal === 'add-vehicle' && (
          <Modal onClose={() => setModal(null)} title="Add Vehicle">
            <form onSubmit={addVehicle} className="space-y-4">
              {[['reg','Registration Plate','text'],['driver','Driver Name','text'],['lastService','Last Service Date','date']].map(([k,l,t]) => (
                <div key={k}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{l}</label>
                  <input type={t} required={k !== 'lastService'} value={vehicleForm[k]} onChange={e => setVehicleForm({...vehicleForm,[k]:e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Type</label>
                  <select value={vehicleForm.type} onChange={e => setVehicleForm({...vehicleForm, type: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none cursor-pointer">
                    <option>Land Cruiser</option><option>Safari Van</option><option>Minibus</option><option>4x4 SUV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Capacity</label>
                  <input type="number" min="1" max="30" value={vehicleForm.capacity} onChange={e => setVehicleForm({...vehicleForm, capacity: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Condition</label>
                <select value={vehicleForm.condition} onChange={e => setVehicleForm({...vehicleForm, condition: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none cursor-pointer">
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Maintenance</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">Add Vehicle</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TourOperations;
