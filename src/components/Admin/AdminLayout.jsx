import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, Settings, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const pageNames = {
  dashboard: 'Dashboard', tables: 'Tables', billing: 'Billing',
  tours: 'Tours', flights: 'Flights', packages: 'Tour Packages',
  appointments: 'Appointments', bookings: 'Bookings',
  customers: 'Customers', staff: 'Staff', messages: 'Messages',
  reviews: 'Reviews', reports: 'Reports', settings: 'Settings',
  itinerary: 'Itinerary', trend: 'Trend',
};

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif]         = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);

  useEffect(() => {
    api.get('/bookings?limit=20&page=1').then((r) => {
      const items = listItemsFromResponse(r);
      setNotifications(items.slice(0, 4));
    }).catch(() => {});
  }, []);

  const pageName = pageNames[activeTab] || activeTab;

  return (
    <div className="flex min-h-screen bg-[#f5f5f3]">
      {/* Desktop sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden p-3">
              <Sidebar activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setMobileOpen(false); }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Topbar with modern glass effect */}
        <header className="px-4 lg:px-6 pt-4 lg:pt-6">
          <div className="flex items-center justify-between rounded-2xl px-5 py-3 border border-primary/10 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-primary/60 hover:bg-primary/5 rounded-xl transition-all">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-[10px] text-primary/40 font-medium uppercase tracking-widest">Pages / {pageName}</p>
                <h6 className="text-lg font-bold text-primary">{pageName}</h6>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center rounded-xl px-3 py-2.5 gap-2 border border-primary/10 bg-primary/5">
                <Search size={14} className="text-primary/40" />
                <input placeholder="Search..." className="bg-transparent outline-none text-sm text-primary/70 w-32 placeholder:text-primary/30" />
              </div>

              <button onClick={() => setActiveTab('settings')}
                className="p-2.5 text-primary/50 hover:bg-primary/5 rounded-xl transition-all hover:text-primary">
                <Settings size={18} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)}
                  className="p-2.5 text-primary/50 hover:bg-primary/5 rounded-xl transition-all hover:text-primary relative">
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full ring-2 ring-primary" />
                  )}
                </button>
                <AnimatePresence>
                  {showNotif && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
                      <div className="px-5 py-4 border-b border-primary/5 flex justify-between items-center">
                        <span className="text-sm font-semibold text-primary">Notifications</span>
                        <button onClick={() => setShowNotif(false)}><X size={16} className="text-primary/40" /></button>
                      </div>
                      {notifications.length === 0
                        ? <p className="px-5 py-8 text-sm text-primary/40 text-center">No new notifications</p>
                        : notifications.map((n, i) => (
                          <div key={i} onClick={() => { setActiveTab('bookings'); setShowNotif(false); }}
                            className="px-5 py-4 hover:bg-primary/5 cursor-pointer border-b border-primary/5 last:border-0 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                              <Bell size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-primary">{n.guestName || 'New booking'}</p>
                              <p className="text-xs text-primary/40 mt-0.5">New booking request</p>
                            </div>
                          </div>
                        ))
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-3 pl-3 border-l border-primary/10">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary shadow-lg shadow-accent/20">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-primary hidden sm:block">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 pt-4 lg:pt-4">
          {children}
        </main>

        <footer className="px-6 pb-6">
          <p className="text-center text-xs text-primary/30">© 2025 VistaVoyage Travel Group. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
