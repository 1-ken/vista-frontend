import React from 'react';
import Logo from '../Logo';
import {
  LayoutDashboard, MessageSquare, Compass, Package, ShoppingBag, 
  LogOut, Share2, Briefcase, Calendar, HelpCircle, Headset, 
  Handshake, FileText, FileSpreadsheet
} from 'lucide-react';

const groups = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'socials',   icon: Share2,          label: 'socials'   },
      { id: 'messages',  icon: MessageSquare,   label: 'Messages'  },
      { id: 'career',    icon: Briefcase,       label: 'Career'    },
    ],
  },
  {
    label: 'Travel',
    items: [
      { id: 'packages',     icon: Package,          label: 'Packages'     },
      { id: 'import',       icon: FileSpreadsheet,  label: 'Import Excel' },
      { id: 'calender',     icon: Calendar,         label: 'Calendar'     },
      { id: 'bookings',     icon: ShoppingBag,      label: 'Bookings'     },
    ],
  },
  {
    label: 'Support & Finance',
    items: [
      { id: 'faqs',      icon: HelpCircle, label: 'FAQs' },
      { id: 'va',        icon: Headset,    label: 'virtual Assistance' },
      { id: 'partners',  icon: Handshake,  label: 'partners' },
      { id: 'invoice',   icon: FileText,   label: 'Invoice' },
    ],
  },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const go = (id) => { setActiveTab(id); window.location.hash = id; };

  return (
    <aside className="fixed inset-y-0 left-0 w-72 z-50 hidden lg:flex flex-col p-3">
      <div className="flex-1 flex flex-col rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
        style={{ background: 'linear-gradient(180deg, #0b3d2e 0%, #072a1f 100%)' }}>
        
          {/* Logo */}
          <div className="px-5 py-5 border-b border-white/10 flex items-center justify-center">
          <Logo height={110} width={350} inverted />
          </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const active = activeTab === item.id;
                  return (
                    <button key={item.id} onClick={() => go(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                        active ? 'bg-accent/15' : 'hover:bg-white/5'
                      }`}>
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" />
                      )}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        active
                          ? 'bg-accent text-primary shadow-lg shadow-accent/30'
                          : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70'
                      }`}>
                        <item.icon size={16} />
                      </div>
                      <span className={`text-[13px] font-medium ${active ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-4">
          <button onClick={() => { window.location.href = '/'; }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-red-500/10 transition-all group">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all">
              <LogOut size={16} />
            </div>
            <span className="text-[13px] font-medium text-white/50 group-hover:text-red-400">Logout</span>
          </button>

          {/* User card */}
          <div className="mt-4 rounded-2xl p-4 bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">Admin User</p>
                <p className="text-white/40 text-[11px]">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
