import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Mail, Send, 
  Phone, User, CheckCircle2, MoreVertical, Paperclip,
  Clock, Trash2, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const MessagesView = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/bookings?limit=500&page=1');
      const messageData = listItemsFromResponse(response)
        .filter(b => b.metadata?.message || b.metadata?.consultationType)
        .map(b => ({
          id: b._id,
          sender: b.guestName,
          email: b.guestEmail,
          phone: b.guestPhone,
          subject: b.type === 'APPOINTMENT' ? `Consultation: ${b.metadata?.consultationType}` : `Package Interest: ${b.tour?.title || 'Adventure'}`,
          message: b.metadata?.message || 'New booking inquiry received.',
          date: b.createdAt,
          status: b.status === 'PENDING' ? 'New' : 'Processed',
          type: b.type
        }));
      setMessages(messageData);
      if (messageData.length > 0) setSelectedMessage(messageData[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.sender?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <p className="text-sm text-white/40 mt-1">Client communications and inquiries</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-indigo-600 transition-all">
          <Mail size={14} />
          Compose
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[65vh]">
        {/* Inbox Sidebar */}
        <div className="lg:col-span-4 rounded-3xl border border-white/5 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Inbox</h3>
            <span className="bg-violet-500/20 text-violet-400 px-2.5 py-1 rounded-lg text-xs font-medium">{messages.length}</span>
          </div>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
              <input 
                type="text" 
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredMessages.map((m) => (
              <div 
                key={m.id}
                onClick={() => setSelectedMessage(m)}
                className={`p-4 cursor-pointer transition-all border-l-2 ${
                  selectedMessage?.id === m.id ? 'bg-white/5 border-violet-500' : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-white truncate pr-4">{m.sender}</p>
                  <span className="text-xs text-white/40 whitespace-nowrap">{new Date(m.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
                <p className="text-xs text-violet-400 mb-1 truncate">{m.subject}</p>
                <p className="text-xs text-white/40 truncate line-clamp-1">{m.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-8 rounded-3xl border border-white/5 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          {selectedMessage ? (
            <>
              <div className="p-5 border-b border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedMessage.subject}</h3>
                    <p className="text-sm text-white/40 mt-1">From: {selectedMessage.sender} ({selectedMessage.email})</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${selectedMessage.status === 'New' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-sm text-white/70 leading-relaxed">{selectedMessage.message}</p>
              </div>
              <div className="p-5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <Phone size={16} />
                  </button>
                  <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <Mail size={16} />
                  </button>
                  <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-indigo-600 transition-all">
                  <Send size={14} />
                  Reply
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-white/40">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
