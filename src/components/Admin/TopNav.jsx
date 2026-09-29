import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Search, LogOut, User, X, Menu,
  LayoutDashboard, ShoppingBag, Package,
  MessageSquare, FileText, Settings, GraduationCap,
  Briefcase, Calendar, FileCheck, Users, Mail,
  BarChart3, Shield, FolderOpen, Building2, Image
} from 'lucide-react';
import Logo from '../Logo';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Overview',      icon: LayoutDashboard },
  { id: 'bookings',     label: 'Bookings',      icon: ShoppingBag },
  { id: 'quotes',       label: 'Quotes',        icon: FileCheck },
  { id: 'customers',    label: 'Customers',     icon: Users },
  { id: 'packages',     label: 'Packages',      icon: Package },
  { id: 'gallery',      label: 'Media Gallery', icon: Image },
  { id: 'calender',     label: 'Calendar',      icon: Calendar },
  { id: 'messages',     label: 'Messages',      icon: MessageSquare },
  { id: 'email',        label: 'Email',         icon: Mail },
  { id: 'documents',    label: 'Documents',     icon: FolderOpen },
  { id: 'suppliers',    label: 'Suppliers',     icon: Building2 },
  { id: 'staff',        label: 'Staff',         icon: Users },
  { id: 'career',       label: 'Careers',       icon: Briefcase },
  { id: 'invoice',      label: 'Finance',       icon: FileText },
  { id: 'reports',      label: 'Reports',       icon: BarChart3 },
  { id: 'security',     label: 'Security',      icon: Shield },
];

const ALL_TABS = [
  { id: 'dashboard',     label: 'Overview' },
  { id: 'bookings',      label: 'Bookings' },
  { id: 'quotes',        label: 'Quotes' },
  { id: 'customers',     label: 'Customers' },
  { id: 'packages',      label: 'Packages' },
  { id: 'gallery',       label: 'Media Gallery' },
  { id: 'calender',      label: 'Calendar' },
  { id: 'messages',      label: 'Messages' },
  { id: 'email',         label: 'Email Center' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'documents',     label: 'Documents' },
  { id: 'operations',    label: 'Tour Operations' },
  { id: 'suppliers',     label: 'Suppliers' },
  { id: 'staff',         label: 'Staff' },
  { id: 'career',        label: 'Careers' },
  { id: 'invoice',       label: 'Finance' },
  { id: 'reports',       label: 'Reports' },
  { id: 'security',      label: 'Security' },
  { id: 'settings',      label: 'Settings' },
  { id: 'edutravel',     label: 'Educational Travel' },
  { id: 'socials',       label: 'Socials' },
  { id: 'faqs',          label: 'FAQs' },
];

const TopNav = ({ activeTab, setActiveTab, onLogout, notifications = [], onMobileMenu }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch]         = useState('');

  const go = (id) => { setActiveTab(id); window.location.hash = id; };

  const searchResults = search.trim().length > 0
    ? ALL_TABS.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSearchSelect = (id) => {
    go(id);
    setSearch('');
    setShowSearch(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center h-[68px] px-4 lg:px-6 gap-4">

        {/* Mobile menu button */}
        <button onClick={onMobileMenu} className="lg:hidden p-2 text-primary/50 hover:bg-primary/5 rounded-xl transition-all">
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo height={80} width={220} />
        </div>

        {/* Nav Links — desktop */}
        <nav className="hidden lg:flex items-center gap-1 ml-6 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(11,61,46,0.15) transparent' }}>
          {NAV_ITEMS.map(item => {
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-primary/50 hover:text-primary hover:bg-primary/5'
                }`}>
                <item.icon size={13} />
                {item.label}
                {active && (
                  <motion.div layoutId="nav-pill"
                    className="absolute inset-0 bg-primary rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">

          {/* Search */}
          <AnimatePresence>
            {showSearch && (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-visible relative">
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl px-3 py-2">
                  <Search size={13} className="text-primary/40 flex-shrink-0" />
                  <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search sections..."
                    onKeyDown={e => { if (e.key === 'Escape') { setShowSearch(false); setSearch(''); } }}
                    className="bg-transparent outline-none text-sm text-primary placeholder:text-primary/30 w-full" />
                  {search && <button onClick={() => setSearch('')}><X size={12} className="text-primary/30" /></button>}
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                    {searchResults.map(r => (
                      <button key={r.id} onMouseDown={() => handleSearchSelect(r.id)}
                        className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-all flex items-center gap-2">
                        <Search size={11} className="text-primary/30" />{r.label}
                      </button>
                    ))}
                  </div>
                )}
                {search.trim() && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 px-4 py-3">
                    <p className="text-xs text-primary/30">No sections found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => { setShowSearch(!showSearch); setSearch(''); }}
            className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <Search size={17} />
          </button>

          {/* Settings */}
          <button onClick={() => go('settings')}
            className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <Settings size={17} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => go('notifications')}
              className="p-2.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative">
              <Bell size={17} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <User size={15} className="text-accent" />
            </div>
            <div className="hidden sm:block">
              {(() => {
                const u = JSON.parse(localStorage.getItem('adminUser') || '{}');
                return (
                  <>
                    <p className="text-[12px] font-bold text-primary leading-tight">{u.name || 'Admin'}</p>
                    <p className="text-[10px] text-primary/35 uppercase tracking-widest">{u.role || 'Admin'}</p>
                  </>
                );
              })()}
            </div>
          </div>

          <button onClick={onLogout} title="Logout"
            className="p-2.5 text-primary/30 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
