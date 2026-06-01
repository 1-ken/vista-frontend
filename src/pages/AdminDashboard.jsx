import React, { useState, useEffect } from 'react';
import AdminLayout        from '../components/Admin/AdminLayout';
import DashboardHome      from '../components/Admin/DashboardHome';
import BillingView        from '../components/Admin/BillingView';
import ToursManagement    from '../components/Admin/ToursManagement';
import BookingsManagement from '../components/Admin/BookingsManagement';
import MessagesView       from '../components/Admin/MessagesView';
import PackagesImport     from '../components/Admin/PackagesImport';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) setActiveTab(hash);
  }, []);

  const render = () => {
    switch (activeTab) {
      case 'dashboard':    return <DashboardHome />;
      case 'socials':      return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Socials Management Coming Soon</div>;
      case 'messages':     return <MessagesView />;
      case 'career':       return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Career Management Coming Soon</div>;
      case 'packages':     return <ToursManagement />;
      case 'import':       return <PackagesImport onImportDone={() => {}} />;
      case 'calender':     return <BookingsManagement initialType="APPOINTMENT" />;
      case 'bookings':     return <BookingsManagement initialType="ALL" />;
      case 'faqs':         return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">FAQs Management Coming Soon</div>;
      case 'va':           return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Virtual Assistance Management Coming Soon</div>;
      case 'partners':     return <div className="p-10 text-white/50 uppercase tracking-widest text-xs">Partners Management Coming Soon</div>;
      case 'invoice':      return <BillingView />;
      default:             return <DashboardHome />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {render()}
    </AdminLayout>
  );
};

export default AdminDashboard;
