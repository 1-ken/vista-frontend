import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, MapPin, 
  Clock, DollarSign, Tag, Image as ImageIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const EMPTY_FORM = {
  title: '', description: '', price: '', duration: '',
  location: '', tag: '', image: null,
  seasonalPrices: [], itinerary: [], inclusions: [], exclusions: []
};

const ToursManagement = () => {
  const [tours, setTours] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchTours();
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await api.get('/seasons');
      setSeasons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await api.get('/tours?limit=500&page=1');
      setTours(listItemsFromResponse(response));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (['seasonalPrices', 'itinerary', 'inclusions', 'exclusions'].includes(key)) {
        data.append(key, JSON.stringify(formData[key]));
      } else if (key === 'image' && formData[key]) {
        data.append(key, formData[key]);
      } else if (formData[key] !== null && key !== 'image') {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingTour) {
        await api.patch(`/tours/${editingTour._id}`, data);
      } else {
        await api.post('/tours', data);
      }
      setShowModal(false);
      setEditingTour(null);
      setFormData(EMPTY_FORM);
      fetchTours();
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save tour';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to decommission this experience?')) {
      try {
        await api.delete(`/tours/${id}`);
        fetchTours();
      } catch (error) {
        alert('Error deleting tour');
      }
    }
  };

  const filteredTours = tours.filter(t => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 rounded-3xl border border-primary/10 bg-white shadow-sm p-5">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30" size={16} />
          <input 
            type="text" 
            placeholder="Search experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary/5 border border-primary/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-accent/50"
          />
        </div>
        <button 
          onClick={() => {
            setEditingTour(null);
            setFormData(EMPTY_FORM);
            setFormError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-accent/10 whitespace-nowrap"
        >
          <Plus size={18} />
          Launch New Experience
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredTours.map((tour) => (
            <motion.div 
              key={tour._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-luxury transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={tour.image?.startsWith('http') ? tour.image : `${import.meta.env.VITE_API_URL?.split('/api')[0] || 'http://localhost:5000'}${tour.image}`} 
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {/^[a-f\d]{24}$/i.test(tour._id) && (<>
                  <button 
                    onClick={() => {
                      setEditingTour(tour);
                      setFormData({ 
                        ...tour, 
                        image: null,
                        seasonalPrices: tour.seasonalPrices?.map(sp => ({
                          season: sp.season?._id || sp.season,
                          price: sp.price
                        })) || [],
                        itinerary: tour.itinerary || [],
                        inclusions: tour.inclusions || [],
                        exclusions: tour.exclusions || []
                      });
                      setFormError('');
                      setShowModal(true);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-accent transition-colors shadow-sm"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(tour._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-rose-500 transition-colors shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                  </>)}
                </div>
                {tour.tag && (
                  <div className="absolute bottom-4 left-4 bg-accent text-white px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest shadow-lg">
                    {tour.tag}
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest mb-3">
                  <MapPin size={12} />
                  {tour.location}
                </div>
                <h3 className="text-xl font-serif text-slate-900 mb-4 group-hover:text-accent transition-colors line-clamp-1">{tour.title}</h3>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">From</span>
                    <span className="text-lg font-serif text-slate-900">KSH {tour.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-luxury flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 bg-primary flex justify-between items-center rounded-t-[2.5rem] flex-shrink-0">
                <div>
                  <h3 className="text-xl font-serif text-white">{editingTour ? 'Edit Package' : 'Add New Package'}</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1">Fill in the details below and save</p>
                </div>
                <button 
                  onClick={() => { setShowModal(false); setFormError(''); }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6 overflow-y-auto flex-1">
                <div className="col-span-2 space-y-4">
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                    <input 
                      type="text" 
                      placeholder="Experience Title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <textarea 
                    placeholder="Describe the experience in detail..."
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium h-24 resize-none"
                  />
                </div>

                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                  <input 
                    type="number" 
                    placeholder="Investment (KSH)"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                  <input 
                    type="text" 
                    placeholder="Duration (e.g. 5 Days)"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                  <input 
                    type="text" 
                    placeholder="Global Location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                  <input 
                    type="text" 
                    placeholder="Status Tag (e.g. Best Seller)"
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Seasonal Rates Section */}
                <div className="col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Seasonal Rates</h4>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, seasonalPrices: [...formData.seasonalPrices, { season: '', price: '' }]})}
                      className="text-[9px] text-accent font-bold uppercase tracking-widest hover:underline"
                    >+ Add Rate</button>
                  </div>
                  {formData.seasonalPrices.map((sp, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 items-center animate-fade-in">
                      <div className="col-span-7">
                        <select 
                          required
                          value={sp.season}
                          onChange={(e) => {
                            const newRates = [...formData.seasonalPrices];
                            newRates[idx].season = e.target.value;
                            setFormData({...formData, seasonalPrices: newRates});
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="">Select Season</option>
                          {seasons.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-4">
                        <input 
                          type="number" 
                          placeholder="Price"
                          required
                          value={sp.price}
                          onChange={(e) => {
                            const newRates = [...formData.seasonalPrices];
                            newRates[idx].price = e.target.value;
                            setFormData({...formData, seasonalPrices: newRates});
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="col-span-1">
                        <button 
                          type="button"
                          onClick={() => {
                            const newRates = formData.seasonalPrices.filter((_, i) => i !== idx);
                            setFormData({...formData, seasonalPrices: newRates});
                          }}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        ><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Itinerary Section */}
                <div className="col-span-2 space-y-4 border-t border-slate-50 pt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Daily Itinerary</h4>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', description: '' }]})}
                      className="text-[9px] text-accent font-bold uppercase tracking-widest hover:underline"
                    >+ Add Day</button>
                  </div>
                  {formData.itinerary.map((day, idx) => (
                    <div key={idx} className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                      <button 
                        type="button"
                        onClick={() => {
                          const newItinerary = formData.itinerary.filter((_, i) => i !== idx).map((d, i) => ({...d, day: i + 1}));
                          setFormData({...formData, itinerary: newItinerary});
                        }}
                        className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      ><Trash2 size={14}/></button>
                      <div className="flex gap-4">
                        <span className="text-[10px] font-bold text-accent min-w-[3rem]">Day {day.day}</span>
                        <input 
                          type="text" 
                          placeholder="Day Title"
                          value={day.title}
                          onChange={(e) => {
                            const newItinerary = [...formData.itinerary];
                            newItinerary[idx].title = e.target.value;
                            setFormData({...formData, itinerary: newItinerary});
                          }}
                          className="w-full bg-transparent border-b border-slate-200 py-1 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <textarea 
                        placeholder="Detailed description for this day..."
                        value={day.description}
                        onChange={(e) => {
                          const newItinerary = [...formData.itinerary];
                          newItinerary[idx].description = e.target.value;
                          setFormData({...formData, itinerary: newItinerary});
                        }}
                        className="w-full bg-transparent text-xs focus:outline-none h-16 resize-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-2 gap-6 col-span-2 border-t border-slate-50 pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Inclusions</h4>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, inclusions: [...formData.inclusions, '']})}
                        className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest hover:underline"
                      >+ Add</button>
                    </div>
                    {formData.inclusions.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="What's included?"
                          value={item}
                          onChange={(e) => {
                            const newInclusions = [...formData.inclusions];
                            newInclusions[idx] = e.target.value;
                            setFormData({...formData, inclusions: newInclusions});
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs focus:outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, inclusions: formData.inclusions.filter((_, i) => i !== idx)})}
                          className="text-slate-300 hover:text-rose-500"
                        ><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Exclusions</h4>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, exclusions: [...formData.exclusions, '']})}
                        className="text-[9px] text-rose-500 font-bold uppercase tracking-widest hover:underline"
                      >+ Add</button>
                    </div>
                    {formData.exclusions.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="What's NOT included?"
                          value={item}
                          onChange={(e) => {
                            const newExclusions = [...formData.exclusions];
                            newExclusions[idx] = e.target.value;
                            setFormData({...formData, exclusions: newExclusions});
                          }}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs focus:outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, exclusions: formData.exclusions.filter((_, i) => i !== idx)})}
                          className="text-slate-300 hover:text-rose-500"
                        ><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 cursor-pointer hover:border-accent/40 transition-all">
                    <ImageIcon size={18} className="text-accent" />
                    <span className="text-xs font-medium text-slate-400">
                      {formData.image ? 'Image Selected: ' + formData.image.name : 'Upload Experience Cover Image'}
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    />
                  </label>
                </div>

                {formError && (
                  <div className="col-span-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest">
                    ⚠ {formError}
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={saving}
                  className="col-span-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20 mt-2 flex items-center justify-center gap-3"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    editingTour ? 'Save Changes' : 'Add Package'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToursManagement;
