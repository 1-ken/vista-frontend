import React, { useState } from 'react';
import { 
  Settings, Shield, Bell, Globe, Mail, 
  Lock, Save, Database, Server, User, Key
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsView = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Executive Profile', icon: User },
    { id: 'company', label: 'Company Details', icon: Database },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'payments', label: 'Payment Methods', icon: Lock },
    { id: 'notifications', label: 'Communications', icon: Bell },
    { id: 'permissions', label: 'User Permissions', icon: Key },
    { id: 'api', label: 'API Integrations', icon: Server },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-sm text-white/40 mt-1">Manage your account and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-white/5 p-3 sticky top-6" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  activeSection === s.id 
                    ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/20' 
                    : 'hover:bg-white/5'
                }`}
              >
                {activeSection === s.id && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-r-full" />
                )}
                <s.icon size={18} className={activeSection === s.id ? 'text-violet-400' : 'text-white/40'} />
                <span className={`text-sm font-medium ${activeSection === s.id ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 rounded-3xl border border-white/5 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          {activeSection === 'profile' && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Executive Profile</h3>
                  <p className="text-sm text-white/40">Global ID: #VST-8842A</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Full Legal Name</label>
                  <input type="text" defaultValue="Erick Anjiri Ochieng" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Official Email</label>
                  <input type="email" defaultValue="admin@vistavoyage.travel" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Position / Role</label>
                  <input type="text" disabled defaultValue="PLATFORM ADMINISTRATOR" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Contact Phone</label>
                  <input type="tel" defaultValue="+254 700 000 000" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all" />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end">
                <button className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-violet-500/25">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Security & Access</h3>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Lock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-white/40 mt-1">Recommended for high-level access</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end p-1">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                        <Key size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">API Access Token</p>
                        <p className="text-xs text-white/40 mt-1">Active: VST-X94-K92-P10</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-violet-400 hover:text-violet-300">Rotate Key</button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-sm font-medium text-white/60 mb-4 px-1">Active Sessions</h4>
                <div className="space-y-3">
                  {[
                    { os: 'macOS Sonoma', browser: 'Safari 17.1', location: 'Nairobi, Kenya', status: 'Current Session' },
                    { os: 'Windows 11', browser: 'Chrome 122', location: 'London, UK', status: 'Last active 2h ago' },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                          <Server size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{session.os} • {session.browser}</p>
                          <p className="text-xs text-white/40">{session.location}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-emerald-400">{session.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'company' && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Database size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Company Identity</h3>
                  <p className="text-sm text-white/40">Enterprise Branding & Legal Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Company Name', val: 'VistaVoyage Travel & Tours' },
                  { label: 'Registration Number', val: 'VST-2024-K92' },
                  { label: 'Headquarters Address', val: 'Westlands, Nairobi, Kenya' },
                  { label: 'Primary Domain', val: 'vistavoyage.travel' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">{item.label}</label>
                    <input type="text" defaultValue={item.val} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Lock size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Payment Gateways</h3>
                  <p className="text-sm text-white/40">Configure financial processing & settlement rules</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Stripe (Credit/Debit)', status: 'Active', icon: '💳' },
                  { name: 'PayPal Express', status: 'Standby', icon: '🅿️' },
                  { name: 'M-Pesa Business', status: 'Active', icon: '📱' }
                ].map((gateway, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{gateway.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{gateway.name}</p>
                        <p className="text-xs text-white/40 mt-1">Status: {gateway.status}</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-violet-400 hover:text-violet-300">Configure</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'permissions' && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Key size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Access Control</h3>
                  <p className="text-sm text-white/40">Role-Based Access Control (RBAC)</p>
                </div>
              </div>

              <div className="space-y-4">
                {['SUPER ADMIN', 'MANAGER', 'STAFF / AGENT'].map((role, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-white">{role}</span>
                      <span className="text-xs text-white/40">4 active users</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Write Access', 'Delete Records', 'View Financials', 'Manage Users'].map((perm, j) => (
                        <span key={j} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Server size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">External Integrations</h3>
                  <p className="text-sm text-white/40">Third-party service synchronization</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Google Maps API', status: 'Connected', usage: 80 },
                  { label: 'AWS S3 Storage', status: 'Connected', usage: 20 },
                  { label: 'SendGrid SMTP', status: 'Maintenance', usage: 0 },
                  { label: 'Twilio SMS Gateway', status: 'Standby', usage: 0 }
                ].map((api, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm font-semibold text-white">{api.label}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        api.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-400' : 
                        api.status === 'Maintenance' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-white/10 text-white/40'
                      }`}>{api.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-violet-500 to-indigo-500 ${api.status === 'Connected' ? '' : 'bg-white/20'}`} 
                        style={{ width: api.status === 'Connected' ? `${api.usage}%` : '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/30">
                <Bell size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Communication Channels</h3>
                <p className="text-sm text-white/40 mt-2 max-w-xs">Configure how the platform interacts with staff and clients.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
