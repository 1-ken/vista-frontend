import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatDrawer from './components/ChatDrawer';
import ScrollToTop from './components/ScrollToTop';
import RouteFallback from './components/RouteFallback';
import { ArrowUp, MessageSquare } from 'lucide-react';
import './App.css';

// Auto-reload on chunk load failure (stale deployment cache)
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CorporateServices = lazy(() => import('./pages/CorporateServices'));
const BecomePartner = lazy(() => import('./pages/BecomePartner'));
const PartnerApplyPage = lazy(() => import('./pages/PartnerApplyPage'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const AddBlogPage = lazy(() => import('./pages/AddBlogPage'));
const ToursPage = lazy(() => import('./pages/ToursPage'));
const TrendsPage = lazy(() => import('./pages/TrendsPage'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCRM = lazy(() => import('./pages/AdminCRM'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const StaffLogin = lazy(() => import('./pages/StaffLogin'));

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/corporate" element={<CorporateServices />} />
          <Route path="/partners" element={<BecomePartner />} />
          <Route path="/partners/apply" element={<PartnerApplyPage />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/add" element={<AddBlogPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/travel/:id" element={<TourDetails />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/crm" element={<AdminCRM />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin/login" element={<StaffLogin />} />
          <Route path="/staff/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-10 left-10 z-[90] flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-full shadow-2xl hover:bg-secondary transition-all duration-500 group animate-fade-in border border-white/10"
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
          <MessageSquare size={16} className="text-black" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">Chat With Us</span>
      </button>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[90] w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-secondary transition-all duration-500 group animate-fade-in-up"
        >
          <ArrowUp className="group-hover:-translate-y-1 transition-transform" size={24} />
        </button>
      )}
    </Router>
  );
}

export default App;
