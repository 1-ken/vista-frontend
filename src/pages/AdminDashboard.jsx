import React, { useState, useEffect } from 'react';
import AdminLayout          from '../components/Admin/AdminLayout';
import DashboardHome        from '../components/Admin/DashboardHome';
import BillingView          from '../components/Admin/BillingView';
import ToursManagement      from '../components/Admin/ToursManagement';
import BookingsManagement   from '../components/Admin/BookingsManagement';
import MessagesView         from '../components/Admin/MessagesView';
import PackagesImport       from '../components/Admin/PackagesImport';
import EduAdminView         from '../components/Admin/EduAdminView';
import CareersAdminView     from '../components/Admin/CareersAdminView';
import QuoteManagement      from '../components/Admin/QuoteManagement';
import CustomerManagement   from '../components/Admin/CustomerManagement';
import StaffManagement      from '../components/Admin/StaffManagement';
import DocumentsView        from '../components/Admin/DocumentsView';
import EmailCenter          from '../components/Admin/EmailCenter';
import NotificationsCenter  from '../components/Admin/NotificationsCenter';
import TourOperations       from '../components/Admin/TourOperations';
import SupplierManagement   from '../components/Admin/SupplierManagement';
import GalleryAdminView    from '../components/Admin/GalleryAdminView';
import PropertiesManagement from '../components/Admin/PropertiesManagement';
import SecurityView         from '../components/Admin/SecurityView';
import SettingsView         from '../components/Admin/SettingsView';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) setActiveTab(hash);
  }, []);

  const render = () => {
    switch (activeTab) {
      case 'dashboard':     return <DashboardHome />;
      case 'bookings':      return <BookingsManagement initialType="ALL" />;
      case 'quotes':        return <QuoteManagement />;
      case 'customers':     return <CustomerManagement />;
      case 'packages':      return <ToursManagement />;
      case 'import':        return <PackagesImport onImportDone={() => {}} />;
      case 'calender':      return <BookingsManagement initialType="APPOINTMENT" />;
      case 'messages':      return <MessagesView />;
      case 'email':         return <EmailCenter />;
      case 'notifications': return <NotificationsCenter />;
      case 'documents':     return <DocumentsView />;
      case 'operations':    return <TourOperations />;
      case 'properties':    return <PropertiesManagement />;
      case 'suppliers':     return <SupplierManagement />;
      case 'staff':         return <StaffManagement />;
      case 'career':        return <CareersAdminView />;
      case 'edutravel':     return <EduAdminView />;
      case 'invoice':       return <BillingView />;
      case 'gallery':       return <GalleryAdminView />;
      case 'reports':       return <ComingSoon label="Reports" />;
      case 'security':      return <SecurityView />;
      case 'settings':      return <SettingsView />;
      case 'socials':       return <ComingSoon label="Socials Management" />;
      case 'faqs':          return <ComingSoon label="FAQs Management" />;
      case 'va':            return <ComingSoon label="Virtual Assistance" />;
      case 'partners':      return <ComingSoon label="Partners Management" />;
      default:              return <DashboardHome />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {render()}
    </AdminLayout>
  );
};

const ComingSoon = ({ label }) => (
  <div className="flex items-center justify-center h-[50vh]">
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <p className="text-primary font-serif text-xl mb-1">{label}</p>
      <p className="text-primary/35 text-sm uppercase tracking-widest font-bold">Coming Soon</p>
    </div>
  </div>
);

export default AdminDashboard;
