import React, { useState } from 'react';
import { 
  LayoutDashboard, Package as PackageIcon, MessageSquare, BarChart3, 
  Settings, LogOut, Bell, Plus, Search, Filter 
} from 'lucide-react';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'packages', label: 'My Packages', icon: <PackageIcon size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-primary text-white flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-2xl font-serif tracking-tighter uppercase italic text-accent">VistaVoyage</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mt-1 text-white">Partner Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-accent text-primary font-black shadow-lg shadow-accent/20 translate-x-2' 
                : 'hover:bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={activeTab === item.id ? 'text-primary' : 'text-accent'}>{item.icon}</span>
                <span className="text-xs uppercase tracking-widest">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-red-500/10 text-red-400 transition-all group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-bold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-10 py-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif text-primary capitalize">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-8">
            <button className="p-3 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all">
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-4 bg-gray-50 pl-2 pr-6 py-2 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black text-primary shadow-lg shadow-accent/20">
                GP
              </div>
              <div>
                <p className="text-xs font-black text-primary leading-none">Grand Palace Hotel</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verified Partner</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Active Packages', value: '12', icon: <PackageIcon />, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Views', value: '1,284', icon: <Search />, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Avg. Rating', value: '4.9', icon: <BarChart3 />, color: 'text-accent', bg: 'bg-accent/10' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-serif text-primary">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-serif text-primary">Recent Performance</h3>
                  <button className="text-xs font-bold text-accent hover:underline">View Detailed Report</button>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] text-gray-300 text-[10px] uppercase font-bold tracking-widest">
                  Performance Chart Placeholder
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                  <Search size={18} className="text-gray-400" />
                  <input type="text" placeholder="Search packages..." className="bg-transparent border-none outline-none text-sm font-medium w-64" />
                </div>
                <button className="flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-accent/20 transition-all">
                  <Plus size={18} />
                  Add New Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-black text-primary">Luxury Suite Package</h4>
                        <p className="text-xs font-black text-accent">KSH 450</p>
                      </div>
                      <p className="text-[10px] text-gray-400 mb-6">Full Board • 2 Guests</p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-3 bg-gray-50 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Edit</button>
                        <button className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">Promote</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
