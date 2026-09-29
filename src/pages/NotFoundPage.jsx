import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/seo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  // Explicitly noindex 404 pages
  React.useEffect(() => {
    let el = document.querySelector('meta[name="robots"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'robots');
      document.head.appendChild(el);
    }
    el.setAttribute('content', 'noindex, nofollow');
    document.title = '404 — Page Not Found | VistaVoyage Travel Group';
    return () => {
      if (el) el.setAttribute('content', 'index, follow');
    };
  }, []);

  const quickLinks = [
    { label: 'Safari Packages',    path: '/tours' },
    { label: 'Kenya Safaris',      path: '/tours?search=kenya' },
    { label: 'Maasai Mara',        path: '/tours?search=maasai+mara' },
    { label: 'Tanzania Safaris',   path: '/tours?search=tanzania' },
    { label: 'Dubai Luxury Tours', path: '/tours?search=dubai' },
    { label: 'About VistaVoyage',  path: '/about' },
    { label: 'Contact Us',         path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-32 text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-8">
          <Compass size={36} className="text-accent/50" />
        </div>

        <span className="text-accent text-[10px] uppercase tracking-[0.5em] font-semibold mb-4 block">
          404 — Not Found
        </span>

        <h1 className="font-serif text-5xl md:text-7xl text-primary leading-tight mb-4">
          Lost in the Wild
        </h1>

        <p className="text-primary/40 text-base max-w-md mx-auto mb-10 leading-relaxed">
          This path hasn't been charted yet. Let us guide you back to an extraordinary journey.
        </p>

        <Link
          to="/tours"
          className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.25em] hover:bg-accent transition-all duration-500 group mb-16 shadow-xl"
        >
          Explore All Safaris
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="border-t border-black/8 pt-10 w-full max-w-lg">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary/25 font-semibold mb-6">
            Popular Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="px-4 py-2 rounded-full border border-black/10 text-xs text-primary/50 hover:border-accent hover:text-accent transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
