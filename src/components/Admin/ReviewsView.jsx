import React, { useState } from 'react';
import { 
  Star, Search, MessageSquare, Trash2, ShieldCheck, 
  MoreVertical, Star as StarIcon, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewsView = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [reviews, setReviews] = useState([
    { id: 1, author: 'Sarah Mitchell', rating: 5, content: 'The Masai Mara safari was absolutely breathtaking. Every detail was curated for luxury and comfort.', date: '2026-03-05', status: 'Approved', platform: 'Direct' },
    { id: 2, author: 'James Henderson', rating: 4, content: 'Excellent service and flight arrangements. The corporate lounge access made a huge difference.', date: '2026-03-02', status: 'Pending', platform: 'Google' },
    { id: 3, author: 'Mary Walters', rating: 5, content: 'A truly bespoke experience. Our travel consultant went above and beyond for our anniversary.', date: '2026-02-28', status: 'Approved', platform: 'Direct' },
    { id: 4, author: 'Robert Chen', rating: 3, content: 'Good experience overall, but the airport transfer was slightly delayed. The tour itself was fantastic.', date: '2026-02-25', status: 'Flagged', platform: 'TripAdvisor' },
  ]);

  const filteredReviews = reviews.filter(r => 
    r.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          <p className="text-sm text-white/40 mt-1">Client testimonials and feedback</p>
        </div>
        <div className="flex gap-2 p-1 rounded-xl border border-white/10 bg-white/5">
          {['all', 'pending', 'flagged'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-white/5 p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <StarIcon size={20} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Global Rating</p>
            <h3 className="text-xl font-bold text-white">4.92 / 5.0</h3>
          </div>
        </div>
        <div className="rounded-3xl border border-white/5 p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Total Reviews</p>
            <h3 className="text-xl font-bold text-white">{reviews.length}</h3>
          </div>
        </div>
        <div className="rounded-3xl border border-white/5 p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
            <ArrowUpRight size={20} />
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">This Month</p>
            <h3 className="text-xl font-bold text-white">+12%</h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-3xl border border-white/5 p-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input 
            type="text" 
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/5 p-5" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{review.author}</p>
                  <p className="text-xs text-white/40">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={12} fill={i < review.rating ? '#fbbf24' : 'transparent'} className={i < review.rating ? 'text-amber-400' : 'text-white/20'} />
                ))}
              </div>
            </div>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">{review.content}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                review.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                review.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>{review.status}</span>
              <span className="text-xs text-white/40">{review.platform}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsView;
