import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, Edit2, Trash2, X, Info, PlusCircle, MinusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const SeasonsManagement = () => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeason, setEditingSeason] = useState(null);
  
  // Default seasons template
  const defaultSeasons = [
    { name: 'Low Season', startDate: '', endDate: '', rate: 0, image: '', imageFile: null, description: '' },
    { name: 'High Season', startDate: '', endDate: '', rate: 0, image: '', imageFile: null, description: '' },
    { name: 'Peak Season', startDate: '', endDate: '', rate: 0, image: '', imageFile: null, description: '' },
    { name: 'Mid Season', startDate: '', endDate: '', rate: 0, image: '', imageFile: null, description: '' }
  ];

  const [formData, setFormData] = useState([
    { name: '', startDate: '', endDate: '', rate: 0, image: '', imageFile: null, description: '' }
  ]);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await api.get('/seasons');
      setSeasons(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching seasons:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      
      if (editingSeason) {
        // Update single season
        const item = formData[0];
        formDataToSubmit.append('name', item.name);
        formDataToSubmit.append('startDate', item.startDate);
        formDataToSubmit.append('endDate', item.endDate);
        formDataToSubmit.append('rate', item.rate);
        formDataToSubmit.append('description', item.description || '');
        
        if (item.imageFile) {
          formDataToSubmit.append('image', item.imageFile);
        } else if (item.image) {
          formDataToSubmit.append('image', item.image);
        }
        
        await api.patch(`/seasons/${editingSeason._id}`, formDataToSubmit);
      } else {
        // Bulk creation
        const validSeasons = formData.filter(s => {
          return s && s.name && s.name.trim() !== '' && 
                 s.startDate && s.startDate.trim() !== '' && 
                 s.endDate && s.endDate.trim() !== '';
        });
        
        if (validSeasons.length === 0) {
          return alert('Please fill in at least one season with a Name, Start Date, and End Date.');
        }
        
        // Prepare data without files for JSON field
        const seasonsData = validSeasons.map((s, idx) => {
          const { imageFile, ...rest } = s;
          if (imageFile) {
            rest.imageRef = idx; // Backend uses this to match files
          }
          return rest;
        });

        // CRITICAL: Append data fields BEFORE files
        formDataToSubmit.append('data', JSON.stringify(seasonsData));
        
        // Append images in order they appear in validSeasons
        validSeasons.forEach((s) => {
          if (s.imageFile) {
            formDataToSubmit.append('images', s.imageFile);
          }
        });
        
        await api.post('/seasons', formDataToSubmit);
      }
      setShowModal(false);
      setEditingSeason(null);
      setFormData([{ name: '', startDate: '', endDate: '', rate: 0, description: '', image: '', imageFile: null }]);
      fetchSeasons();
    } catch (error) {
      console.error('Error saving:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert('Error saving season: ' + errorMsg);
    }
  };

  const addSeasonRow = () => {
    setFormData([...formData, { name: '', startDate: '', endDate: '', rate: 0, image: '', imageFile: null, description: '' }]);
  };

  const removeSeasonRow = (index) => {
    if (formData.length === 1) return;
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this season? This may affect pricing for tours using it.')) {
      try {
        await api.delete(`/seasons/${id}`);
        fetchSeasons();
      } catch (error) {
        alert('Error deleting season');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Concept Info Card */}
      <div className="bg-primary text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
              <Info className="text-accent" size={24} />
            </div>
            <h2 className="text-2xl font-serif">Season-Based Pricing Policy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 text-white/70 text-sm leading-relaxed">
              <p>
                <strong>Season-Based Pricing with Effective Dates:</strong> All tour packages and hotel services are priced based on predefined seasons rather than the booking date.
              </p>
              <p>
                When a customer books a tour for a specific travel period, the system automatically applies the rates assigned to that season (e.g. Low, High, Peak), even if the booking is made months in advance.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 self-center">
              <p className="text-accent text-[10px] uppercase tracking-widest font-black mb-3">Core Logic</p>
              <p className="text-white font-serif italic text-lg leading-tight">
                "Rates depend on the travel dates, not today’s date. Booking today does NOT determine price; travel date DOES."
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif text-slate-900">Define Seasons</h3>
        <button 
          onClick={() => {
            setEditingSeason(null);
            setFormData([...defaultSeasons]); // Load 4 seasons at once for creation
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-accent/10"
        >
          <PlusCircle size={18} />
          Create All Seasons
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {seasons.map((season) => (
          <motion.div 
            key={season._id}
            className="bg-white border border-slate-100 p-8 rounded-[2rem] hover:shadow-luxury transition-all duration-500 group relative overflow-hidden"
          >
            {season.image && (
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <img 
                  src={season.image.startsWith('http') ? season.image : `http://localhost:5000${season.image}`} 
                  alt={season.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Calendar size={20} />
                </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingSeason(season);
                    setFormData([{
                      name: season.name,
                      startDate: season.startDate.split('T')[0],
                      endDate: season.endDate.split('T')[0],
                      rate: season.rate || 0,
                      image: season.image || '',
                      imageFile: null,
                      description: season.description || ''
                    }]);
                    setShowModal(true);
                  }}
                  className="p-2 text-slate-400 hover:text-accent transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(season._id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-serif text-slate-900">{season.name}</h4>
              <p className="text-accent font-bold text-lg">${season.rate || 0}</p>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
              {new Date(season.startDate).toLocaleDateString()} — {new Date(season.endDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {season.description || 'No description provided.'}
            </p>
          </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`relative bg-white w-full ${editingSeason ? 'max-w-lg' : 'max-w-4xl'} rounded-[2.5rem] shadow-luxury p-8 max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-2">
                <h3 className="text-xl font-serif text-slate-900">{editingSeason ? 'Edit Season' : 'Create All Seasons'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {formData.map((season, idx) => (
                  <div key={idx} className={`p-6 rounded-3xl border ${editingSeason ? 'border-transparent' : 'border-slate-100 bg-slate-50/30'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">Season #{idx + 1}</h4>
                      {!editingSeason && formData.length > 1 && (
                        <button type="button" onClick={() => removeSeasonRow(idx)} className="text-rose-400 hover:text-rose-600">
                          <MinusCircle size={18} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                      <div className="md:col-span-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Name</label>
                        <input 
                          type="text" 
                          required
                          value={season.name}
                          onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent"
                          placeholder="e.g. Low Season"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Start</label>
                        <input 
                          type="date" 
                          required
                          value={season.startDate}
                          onChange={(e) => handleInputChange(idx, 'startDate', e.target.value)}
                          className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">End</label>
                        <input 
                          type="date" 
                          required
                          value={season.endDate}
                          onChange={(e) => handleInputChange(idx, 'endDate', e.target.value)}
                          className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Rate ($)</label>
                        <input 
                          type="number" 
                          required
                          value={season.rate}
                          onChange={(e) => handleInputChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Package Image</label>
                        <label className="flex flex-col items-center justify-center gap-1 bg-slate-50 border border-dashed border-slate-200 rounded-xl h-[46px] cursor-pointer hover:border-accent/40 transition-all overflow-hidden group/img relative">
                          {season.imageFile || season.image ? (
                            <div className="relative w-full h-full">
                              {season.imageFile ? (
                                <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-accent px-2 truncate w-full text-center">{season.imageFile.name}</span>
                                </div>
                              ) : (
                                <img src={season.image.startsWith('http') ? season.image : `http://localhost:5000${season.image}`} className="w-full h-full object-cover opacity-50" />
                              )}
                              <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                <PlusCircle size={14} className="text-accent" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <PlusCircle size={14} className="text-slate-300 group-hover/img:text-accent transition-colors" />
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Add Space</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleInputChange(idx, 'imageFile', e.target.files[0])}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Description (Optional)</label>
                      <textarea 
                        value={season.description}
                        onChange={(e) => handleInputChange(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent min-h-[80px]"
                        placeholder="Describe the season details..."
                      />
                    </div>
                  </div>
                ))}

                {!editingSeason && (
                  <button 
                    type="button" 
                    onClick={addSeasonRow}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Another Season Row
                  </button>
                )}

                <button 
                  type="submit"
                  className="w-full bg-accent text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {editingSeason ? 'Save Changes' : `Save ${formData.length} Seasons`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeasonsManagement;
