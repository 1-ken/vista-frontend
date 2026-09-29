import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, School, Users, BookOpen, Plus, Search,
  ChevronRight, MapPin, Clock, CheckCircle2, AlertCircle,
  Mail, Phone, Building2, FileText, CreditCard, Eye
} from 'lucide-react';

const SCHOOLS = [
  { id: 1, name: 'Alliance High School', contact: 'Mr. James Kariuki', email: 'jkariuki@alliancehigh.ac.ke', phone: '+254 722 111 222', county: 'Kiambu', students: 28, trips: 2, status: 'active', coordinator: 'Grace Wanjiku', outstanding: 2380000 },
  { id: 2, name: 'Brookhouse School', contact: 'Ms. Sarah Njeri', email: 'snjeri@brookhouse.ac.ke', phone: '+254 733 222 333', county: 'Nairobi', students: 35, trips: 1, status: 'active', coordinator: 'Brian Ochieng', outstanding: 0 },
  { id: 3, name: "St. Mary's School", contact: 'Fr. Patrick Mwangi', email: 'pmwangi@stmarys.ac.ke', phone: '+254 711 333 444', county: 'Nairobi', students: 20, trips: 1, status: 'pending', coordinator: 'Grace Wanjiku', outstanding: 1900000 },
  { id: 4, name: 'Hillcrest International', contact: 'Mrs. Anne Waweru', email: 'awaweru@hillcrest.ac.ke', phone: '+254 700 444 555', county: 'Nairobi', students: 42, trips: 3, status: 'active', coordinator: 'David Njoroge', outstanding: 0 },
  { id: 5, name: 'Braeburn School', contact: 'Mr. Tom Odhiambo', email: 'todhiambo@braeburn.ac.ke', phone: '+254 722 555 666', county: 'Nairobi', students: 18, trips: 1, status: 'inquiry', coordinator: null, outstanding: 0 },
];

const EDU_PACKAGES = [
  { id: 1, title: 'South Africa Educational Experience', country: 'South Africa', duration: '7 Days', category: 'Geography & Environment', ageGroup: '13–18', price: 185000, status: 'active', bookings: 3 },
  { id: 2, title: 'Kenya Wildlife Conservation Program', country: 'Kenya', duration: '5 Days', category: 'Wildlife Conservation', ageGroup: '14–18', price: 95000, status: 'active', bookings: 5 },
  { id: 3, title: 'East Africa Debate Championship', country: 'Kenya', duration: '4 Days', category: 'Academic Competitions', ageGroup: '13–19', price: 65000, status: 'active', bookings: 8 },
  { id: 4, title: 'Tanzania Serengeti Migration Study', country: 'Tanzania', duration: '6 Days', category: 'Geography & Environment', ageGroup: '15–18', price: 145000, status: 'active', bookings: 2 },
];

const QUOTES = [
  { id: 1, school: 'Nairobi Academy', contact: 'Mrs. Grace Otieno', program: 'South Africa Educational Experience', students: 25, dates: 'Aug 2026', status: 'new', submitted: '2025-07-01' },
  { id: 2, school: 'Aga Khan Academy', contact: 'Mr. Ali Hassan', program: 'Kenya Wildlife Conservation Program', students: 30, dates: 'Oct 2026', status: 'reviewed', submitted: '2025-06-28' },
  { id: 3, school: 'Strathmore School', contact: 'Ms. Wanjiku Mwangi', program: 'Custom Program', students: 40, dates: 'Nov 2026', status: 'quoted', submitted: '2025-06-25' },
];

const statusBadge = (s) => ({
  active:   'bg-emerald-50 text-emerald-600',
  pending:  'bg-amber-50 text-amber-600',
  inquiry:  'bg-blue-50 text-blue-600',
  new:      'bg-blue-50 text-blue-600',
  reviewed: 'bg-amber-50 text-amber-600',
  quoted:   'bg-emerald-50 text-emerald-600',
}[s] || 'bg-slate-100 text-slate-500');

const EduAdminView = () => {
  const [tab, setTab] = useState('schools');
  const [search, setSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);

  const filteredSchools = SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = SCHOOLS.reduce((a, s) => a + s.students, 0);
  const totalOutstanding = SCHOOLS.reduce((a, s) => a + s.outstanding, 0);

  const tabs = [
    { id: 'schools',  icon: School,        label: 'Schools' },
    { id: 'packages', icon: BookOpen,      label: 'Packages' },
    { id: 'quotes',   icon: FileText,      label: 'Quote Requests' },
    { id: 'reports',  icon: GraduationCap, label: 'Reports' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Partner Schools', value: SCHOOLS.length, icon: School, color: '#0b3d2e' },
          { label: 'Total Students', value: totalStudents, icon: Users, color: '#c8a248' },
          { label: 'Active Packages', value: EDU_PACKAGES.filter(p => p.status === 'active').length, icon: BookOpen, color: '#3b82f6' },
          { label: 'Outstanding (KES)', value: `${(totalOutstanding / 1000000).toFixed(1)}M`, icon: CreditCard, color: totalOutstanding > 0 ? '#f59e0b' : '#10b981' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-primary/40 mb-1">{label}</p>
                <p className="text-3xl font-serif text-primary">{value}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-50 px-2 pt-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all ${
                tab === t.id ? 'bg-primary text-white' : 'text-primary/40 hover:text-primary hover:bg-primary/5'
              }`}>
              <t.icon size={13} />{t.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* Schools */}
          {tab === 'schools' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <Search size={14} className="text-primary/30" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search schools..." className="bg-transparent outline-none text-sm text-primary/70 flex-1 placeholder:text-primary/30" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                  <Plus size={13} />Add School
                </button>
              </div>

              {selectedSchool ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button onClick={() => setSelectedSchool(null)}
                    className="flex items-center gap-2 text-xs font-bold text-primary/40 hover:text-primary uppercase tracking-widest mb-4 transition-colors">
                    ← All Schools
                  </button>
                  <div className="bg-slate-50 rounded-3xl p-6 space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-serif text-primary">{selectedSchool.name}</h3>
                        <p className="text-sm text-primary/50 mt-1">{selectedSchool.county} County</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${statusBadge(selectedSchool.status)}`}>
                        {selectedSchool.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Contact', value: selectedSchool.contact },
                        { label: 'Email', value: selectedSchool.email },
                        { label: 'Phone', value: selectedSchool.phone },
                        { label: 'Coordinator', value: selectedSchool.coordinator || 'Unassigned' },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white rounded-2xl p-3">
                          <p className="text-[10px] uppercase tracking-widest font-black text-primary/30 mb-1">{label}</p>
                          <p className="text-xs font-semibold text-primary">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-2xl p-4 text-center">
                        <p className="text-2xl font-serif text-primary">{selectedSchool.trips}</p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-primary/30">Trips</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 text-center">
                        <p className="text-2xl font-serif text-primary">{selectedSchool.students}</p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-primary/30">Students</p>
                      </div>
                      <div className={`rounded-2xl p-4 text-center ${selectedSchool.outstanding > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                        <p className={`text-lg font-serif ${selectedSchool.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {selectedSchool.outstanding > 0 ? `KES ${(selectedSchool.outstanding / 1000).toFixed(0)}K` : 'Paid'}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-primary/30">Outstanding</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredSchools.map(school => (
                    <div key={school.id} onClick={() => setSelectedSchool(school)}
                      className="flex items-center gap-4 py-4 cursor-pointer hover:bg-primary/[0.02] rounded-2xl px-3 -mx-3 transition-all group">
                      <div className="w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <School size={18} className="text-primary/40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary">{school.name}</p>
                        <p className="text-xs text-primary/40 mt-0.5">{school.contact} • {school.county}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-4 text-xs text-primary/40 font-bold">
                        <span>{school.students} students</span>
                        <span>{school.trips} trips</span>
                        {school.outstanding > 0 && (
                          <span className="text-amber-500">KES {(school.outstanding / 1000).toFixed(0)}K due</span>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusBadge(school.status)}`}>
                        {school.status}
                      </span>
                      <ChevronRight size={14} className="text-primary/20 group-hover:text-primary/50 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Packages */}
          {tab === 'packages' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                  <Plus size={13} />Add Package
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {EDU_PACKAGES.map(pkg => (
                  <div key={pkg.id} className="flex items-center gap-4 py-4">
                    <div className="w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-primary/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{pkg.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-primary/40 flex items-center gap-1"><MapPin size={10} />{pkg.country}</span>
                        <span className="text-xs text-primary/40 flex items-center gap-1"><Clock size={10} />{pkg.duration}</span>
                        <span className="text-xs text-primary/40 flex items-center gap-1"><Users size={10} />Ages {pkg.ageGroup}</span>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-bold text-primary">KES {pkg.price.toLocaleString()}</p>
                      <p className="text-xs text-primary/30">{pkg.bookings} bookings</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusBadge(pkg.status)}`}>
                      {pkg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quote Requests */}
          {tab === 'quotes' && (
            <div className="space-y-3">
              {QUOTES.map(q => (
                <div key={q.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-primary">{q.school}</p>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${statusBadge(q.status)}`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-primary/50">{q.contact} • {q.program}</p>
                    <p className="text-xs text-primary/30 mt-0.5">{q.students} students • {q.dates} • Submitted {q.submitted}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-accent hover:text-primary transition-all">
                    <Eye size={12} />Review
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Reports */}
          {tab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Total Schools', value: SCHOOLS.length, sub: `${SCHOOLS.filter(s => s.status === 'active').length} active` },
                { label: 'Total Students Travelled', value: totalStudents, sub: 'across all programs' },
                { label: 'Total Packages', value: EDU_PACKAGES.length, sub: `${EDU_PACKAGES.filter(p => p.status === 'active').length} active` },
                { label: 'Quote Requests', value: QUOTES.length, sub: `${QUOTES.filter(q => q.status === 'new').length} new` },
              ].map(({ label, value, sub }, i) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-6">
                  <p className="text-[10px] uppercase tracking-widest font-black text-primary/30 mb-2">{label}</p>
                  <p className="text-4xl font-serif text-primary mb-1">{value}</p>
                  <p className="text-xs text-primary/40">{sub}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EduAdminView;
