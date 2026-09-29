import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Package, Calendar,
  MessageSquare, Briefcase, GraduationCap, FileText,
  FileSpreadsheet, HelpCircle, Headset, Handshake,
  Share2, Settings, FileCheck, Users, FolderOpen,
  Mail, Bell, Map, BarChart3, Shield, UserCog, Building2, Image
} from 'lucide-react';

const ALL_ITEMS = [
  { id: 'dashboard',     icon: LayoutDashboard, label: 'Overview'      },
  { id: 'bookings',      icon: ShoppingBag,     label: 'Bookings'      },
  { id: 'quotes',        icon: FileCheck,       label: 'Quotes'        },
  { id: 'customers',     icon: Users,           label: 'Customers'     },
  { id: 'packages',      icon: Package,         label: 'Packages'      },
  { id: 'gallery',       icon: Image,           label: 'Media Gallery' },
  { id: 'properties',    icon: Building2,       label: 'Properties'    },
  { id: 'import',        icon: FileSpreadsheet, label: 'Import'        },
  { id: 'calender',      icon: Calendar,        label: 'Calendar'      },
  { id: 'messages',      icon: MessageSquare,   label: 'Messages'      },
  { id: 'email',         icon: Mail,            label: 'Email Center'  },
  { id: 'notifications', icon: Bell,            label: 'Notifications' },
  { id: 'documents',     icon: FolderOpen,      label: 'Documents'     },
  { id: 'operations',    icon: Map,             label: 'Operations'    },
  { id: 'suppliers',     icon: Building2,       label: 'Suppliers'     },
  { id: 'staff',         icon: UserCog,         label: 'Staff'         },
  { id: 'career',        icon: Briefcase,       label: 'Careers'       },
  { id: 'edutravel',     icon: GraduationCap,   label: 'EduTravel'     },
  { id: 'invoice',       icon: FileText,        label: 'Finance'       },
  { id: 'reports',       icon: BarChart3,       label: 'Reports'       },
  { id: 'security',      icon: Shield,          label: 'Security'      },
  { id: 'socials',       icon: Share2,          label: 'Socials'       },
  { id: 'faqs',          icon: HelpCircle,      label: 'FAQs'          },
  { id: 'va',            icon: Headset,         label: 'VA'            },
  { id: 'partners',      icon: Handshake,       label: 'Partners'      },
  { id: 'settings',      icon: Settings,        label: 'Settings'      },
];

const IconRail = ({ activeTab, setActiveTab, mobile }) => {
  const go = (id) => { setActiveTab(id); window.location.hash = id; };

  return (
    <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col w-[72px] bg-white border-r border-gray-100 fixed left-0 top-[68px] bottom-0 z-40 overflow-y-auto scrollbar-hide`}>
      <div className="flex flex-col items-center py-4 gap-1">
        {ALL_ITEMS.map(item => {
          const active = activeTab === item.id;
          return (
            <div key={item.id} className="relative group w-full flex justify-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => go(item.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  active
                    ? 'bg-primary text-accent shadow-lg shadow-primary/20'
                    : 'text-primary/30 hover:bg-primary/8 hover:text-primary'
                }`}>
                <item.icon size={18} />
              </motion.button>

              {active && (
                <motion.div layoutId="rail-indicator"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-l-full"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }} />
              )}

              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                <div className="bg-primary text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default IconRail;
