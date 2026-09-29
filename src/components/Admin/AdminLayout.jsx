import React, { useState, useEffect } from 'react';
import TopNav from './TopNav';
import IconRail from './IconRail';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../api/axios';
import { listItemsFromResponse } from '../../utils/apiList';

const AdminLayout = ({ children, activeTab, setActiveTab, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    api.get('/bookings?limit=20&page=1')
      .then(r => setNotifications(listItemsFromResponse(r).slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        notifications={notifications}
        onMobileMenu={() => setMobileOpen(true)}
      />

      <div className="flex flex-1 pt-[68px]">
        {/* Desktop Icon Rail */}
        <IconRail activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />
              <motion.div initial={{ x: -80 }} animate={{ x: 0 }} exit={{ x: -80 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden pt-[68px]">
                <IconRail activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setMobileOpen(false); }} mobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 lg:ml-[72px] p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      <footer className="lg:ml-[72px] pb-4">
        <p className="text-center text-[11px] text-primary/25 tracking-widest uppercase">
          © 2025 VistaVoyage Travel Group
        </p>
      </footer>
    </div>
  );
};

export default AdminLayout;
