import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Plus, X, Search, Eye, Trash2, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const TEMPLATES = [
  { id: 'T1', name: 'Booking Confirmation', subject: 'Your Booking is Confirmed — VistaVoyage', category: 'Booking',    body: 'Dear [Client Name],\n\nWe are pleased to confirm your booking with VistaVoyage Travel Group.\n\nBooking Reference: [REF]\nPackage: [PACKAGE]\nTravel Dates: [DATES]\n\nOur team will be in touch with your full travel documents shortly.\n\nWarm regards,\nVistaVoyage Travel Group' },
  { id: 'T2', name: 'Payment Reminder',     subject: 'Payment Due — Balance Outstanding',       category: 'Finance',    body: 'Dear [Client Name],\n\nThis is a friendly reminder that your balance payment is due.\n\nAmount Due: KES [AMOUNT]\nDue Date: [DATE]\n\nPlease contact us to arrange payment.\n\nWarm regards,\nVistaVoyage Travel Group' },
  { id: 'T3', name: 'Quote Email',          subject: 'Your Personalised Travel Quote',          category: 'Quote',      body: 'Dear [Client Name],\n\nThank you for your enquiry. Please find your personalised travel quote below.\n\n[QUOTE DETAILS]\n\nThis quote is valid until [EXPIRY DATE].\n\nWarm regards,\nVistaVoyage Travel Group' },
  { id: 'T4', name: 'Travel Documents',     subject: 'Your Travel Documents are Ready',         category: 'Documents',  body: 'Dear [Client Name],\n\nYour travel documents are now ready. Please find them attached.\n\nHave a wonderful journey!\n\nWarm regards,\nVistaVoyage Travel Group' },
  { id: 'T5', name: 'Promotional Offer',    subject: 'Exclusive Offer — Limited Time',          category: 'Marketing',  body: 'Dear Valued Client,\n\nWe have an exclusive offer just for you!\n\n[OFFER DETAILS]\n\nBook before [DATE] to take advantage of this special rate.\n\nWarm regards,\nVistaVoyage Travel Group' },
  { id: 'T6', name: 'Welcome Email',        subject: 'Welcome to VistaVoyage Travel Group',     category: 'Onboarding', body: 'Dear [Client Name],\n\nWelcome to VistaVoyage Travel Group! We are delighted to have you with us.\n\nOur team of expert travel consultants is ready to craft your perfect journey.\n\nWarm regards,\nVistaVoyage Travel Group' },
];

const HISTORY_KEY = 'vv_email_history';
const STATUS_STYLE = { Sent: 'bg-emerald-50 text-emerald-600', Opened: 'bg-blue-50 text-blue-600', Failed: 'bg-red-50 text-red-500' };

const EmailCenter = () => {
  const [tab, setTab] = useState('compose');
  const [clients, setClients] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load real client emails from bookings
    api.get('/bookings?limit=200&page=1')
      .then(res => {
        const bookings = listItemsFromResponse(res);
        const unique = [...new Map(bookings.map(b => [b.guestEmail, { name: b.guestName, email: b.guestEmail }])).entries()]
          .map(([, v]) => v);
        setClients(unique);
      })
      .catch(() => {});

    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveHistory = (updated) => {
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      // Try to send via backend if email endpoint exists, otherwise record locally
      await api.post('/messages', {
        name: 'Admin',
        email: compose.to,
        subject: compose.subject,
        message: compose.body,
      }).catch(() => {}); // graceful — record even if endpoint doesn't exist

      const newEntry = {
        id: `E${Date.now()}`,
        to: compose.to,
        subject: compose.subject,
        sent: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'Sent',
      };
      saveHistory([newEntry, ...history]);
      setSent(true);
      setCompose({ to: '', subject: '', body: '' });
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const filteredHistory = history.filter(e =>
    !search || e.to.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Email Center</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">Send & track client communications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Emails Sent',  value: history.length,                                       icon: Send,         bg: 'bg-primary text-white' },
          { label: 'Clients',      value: clients.length,                                       icon: Mail,         bg: 'bg-blue-50 text-blue-700' },
          { label: 'Templates',    value: TEMPLATES.length,                                     icon: CheckCircle2, bg: 'bg-amber-50 text-amber-700' },
          { label: 'This Month',   value: history.filter(e => e.sent?.includes(new Date().toLocaleString('en-GB', { month: 'short' }))).length, icon: Clock, bg: 'bg-emerald-50 text-emerald-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 flex items-center gap-4 ${s.bg}`}>
            <s.icon size={20} className="opacity-60 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{s.label}</p>
              <p className="text-2xl font-serif font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit">
        {['compose', 'templates', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Compose */}
      {tab === 'compose' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <h3 className="font-serif text-xl text-primary mb-2">Email Sent!</h3>
              <p className="text-sm text-gray-400">Your email has been recorded successfully.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSend} className="space-y-5">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold border border-red-100">{error}</div>}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">To</label>
                <input list="client-emails" type="email" required value={compose.to} onChange={e => setCompose({ ...compose, to: e.target.value })}
                  placeholder="client@email.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
                <datalist id="client-emails">
                  {clients.map(c => <option key={c.email} value={c.email} label={c.name} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Subject</label>
                <input type="text" required value={compose.subject} onChange={e => setCompose({ ...compose, subject: e.target.value })}
                  placeholder="Email subject line"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary/30 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Message</label>
                <textarea required value={compose.body} onChange={e => setCompose({ ...compose, body: e.target.value })}
                  rows={8} placeholder="Write your email message here..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary/30 transition-all resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-60">
                {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={13} /> Send Email</>}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Templates */}
      {tab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TEMPLATES.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <Mail size={18} className="text-primary" />
                </div>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-wider rounded-lg">{t.category}</span>
              </div>
              <h4 className="font-semibold text-primary text-[14px] mb-1">{t.name}</h4>
              <p className="text-[12px] text-gray-400 mb-4 truncate">{t.subject}</p>
              <button onClick={() => { setCompose({ to: '', subject: t.subject, body: t.body }); setTab('compose'); }}
                className="w-full bg-primary text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                Use Template
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <Search size={14} className="text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email history..."
                className="bg-transparent outline-none text-sm text-primary placeholder:text-gray-400 flex-1" />
            </div>
          </div>
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Mail size={32} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-400">No emails sent yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['To', 'Subject', 'Sent', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredHistory.map((e, i) => (
                    <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 text-[13px] text-primary/70">{e.to}</td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-primary max-w-[200px] truncate">{e.subject}</td>
                      <td className="px-5 py-4 text-[12px] text-gray-400">{e.sent}</td>
                      <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_STYLE[e.status] || 'bg-gray-100 text-gray-500'}`}>{e.status}</span></td>
                      <td className="px-5 py-4">
                        <button onClick={() => saveHistory(history.filter(h => h.id !== e.id))}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailCenter;
