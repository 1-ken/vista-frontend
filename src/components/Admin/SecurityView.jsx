import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Smartphone, Monitor, AlertTriangle, CheckCircle2, Clock, MapPin, Trash2, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

const SecurityView = () => {
  const [tab, setTab] = useState('overview');
  const [twoFA, setTwoFA] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [auditLog, setAuditLog] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, sRes] = await Promise.all([
        api.get('/admin/activity').catch(() => ({ data: [] })),
        api.get('/admin/staff').catch(() => ({ data: [] })),
      ]);
      setAuditLog(Array.isArray(aRes.data) ? aRes.data : []);
      setStaff(Array.isArray(sRes.data) ? sRes.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Build login history from staff lastActivity
  const loginHistory = staff.map(s => ({
    id: s._id,
    user: s.name || s.email,
    device: 'Browser / Unknown',
    location: 'Kenya',
    ip: '—',
    time: s.lastActivity ? new Date(s.lastActivity).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
    status: s.status === 'offline' ? 'Offline' : 'Success',
  }));

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Security Center</h2>
          <p className="text-[11px] text-primary/40 uppercase tracking-widest font-bold mt-0.5">Authentication, access control & audit trail</p>
        </div>
        <button onClick={fetchData} className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Security Score */}
      <div className="bg-primary rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #c8a248 0%, transparent 55%)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-accent text-[11px] font-black uppercase tracking-[0.3em] mb-1">Security Score</p>
            <h3 className="text-white font-serif text-3xl mb-1">{twoFA ? '95' : '78'} / 100</h3>
            <p className="text-white/40 text-sm">{twoFA ? 'Excellent security posture' : 'Enable 2FA to reach 95+'}</p>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-accent/30 flex items-center justify-center">
            <Shield size={32} className="text-accent" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit">
        {['overview', 'login history', 'audit trail', 'devices'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                  <Smartphone size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary text-[14px]">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[12px] text-gray-400">Add an extra layer of security to all staff accounts</p>
                </div>
              </div>
              <button onClick={() => setTwoFA(!twoFA)}
                className={`w-12 h-6 rounded-full transition-all relative ${twoFA ? 'bg-primary' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${twoFA ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            {twoFA && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <p className="text-[12px] font-bold text-primary mb-2">Authenticator App Setup</p>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">QR Code</div>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 mb-2">Scan with Google Authenticator or Authy</p>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-primary">
                        {showKey ? 'JBSWY3DPEHPK3PXP' : '••••••••••••••••'}
                      </code>
                      <button onClick={() => setShowKey(!showKey)} className="p-1.5 text-gray-400 hover:text-primary transition-all">
                        {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="font-serif text-lg text-primary mb-4">Security Checklist</h4>
            <div className="space-y-3">
              {[
                { label: 'SSL Certificate Active',       done: true },
                { label: 'Role-Based Access Control',    done: true },
                { label: 'Two-Factor Authentication',    done: twoFA },
                { label: 'Login Attempt Monitoring',     done: true },
                { label: 'Session Timeout (30 min)',     done: true },
                { label: 'Password Policy Enforced',     done: false },
                { label: 'IP Whitelist Configured',      done: false },
                { label: 'Audit Trail Enabled',          done: auditLog.length > 0 },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${item.done ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                  {item.done
                    ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    : <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />}
                  <span className={`text-[13px] font-semibold ${item.done ? 'text-emerald-700' : 'text-gray-500'}`}>{item.label}</span>
                  {!item.done && <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-amber-500">Action Required</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Login History */}
      {tab === 'login history' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h4 className="font-serif text-lg text-primary">Staff Login Activity</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">{loginHistory.length} staff members tracked</p>
          </div>
          {loginHistory.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-400">No login history available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['User', 'Device', 'Location', 'Last Active', 'Status'].map(h => (
                      <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loginHistory.map((l, i) => (
                    <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 text-[13px] font-semibold text-primary">{l.user}</td>
                      <td className="px-5 py-4 text-[12px] text-gray-400 flex items-center gap-2"><Monitor size={12} /> {l.device}</td>
                      <td className="px-5 py-4 text-[12px] text-gray-400"><span className="flex items-center gap-1"><MapPin size={11} /> {l.location}</span></td>
                      <td className="px-5 py-4 text-[12px] text-gray-400"><span className="flex items-center gap-1"><Clock size={11} /> {l.time}</span></td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${l.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{l.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Audit Trail */}
      {tab === 'audit trail' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h4 className="font-serif text-lg text-primary">Audit Trail</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">{auditLog.length} actions logged</p>
          </div>
          {auditLog.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-400">No audit records yet</p>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
              {auditLog.map((a, i) => (
                <motion.div key={a._id || i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-accent text-sm font-bold flex-shrink-0">
                    {(a.staffId?.name || a.action || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-primary">{a.action || 'System Action'}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {a.staffId?.name || 'System'}
                      {a.metadata && Object.keys(a.metadata).length > 0 && ` · ${JSON.stringify(a.metadata).slice(0, 60)}`}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 whitespace-nowrap">
                    {a.timestamp ? new Date(a.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Devices */}
      {tab === 'devices' && (
        <div className="space-y-3">
          {staff.filter(s => s.status !== 'offline').map((s, i) => (
            <div key={s._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <Monitor size={18} className="text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-primary">{s.name}</p>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-lg">{s.status}</span>
                </div>
                <p className="text-[12px] text-gray-400 mt-0.5">{s.email} · Last active {s.lastActivity ? new Date(s.lastActivity).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
              </div>
            </div>
          ))}
          {staff.filter(s => s.status !== 'offline').length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-sm text-gray-400">No staff currently online</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityView;
