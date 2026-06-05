import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CheckoutPage = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-10">
        <CheckCircle2 size={48} />
      </div>
      <h1 className="text-5xl font-serif text-primary mb-6">Quote Request Received!</h1>
      <p className="text-primary/60 text-lg max-w-lg mb-4">
        Thank you for your interest. Our team will review your request and send your personalised quote within 24 hours.
      </p>
      <p className="text-primary/40 text-sm mb-12">You will be contacted shortly via email or WhatsApp.</p>
      <div className="flex gap-6">
        <Link to="/" className="btn-primary">Return Home</Link>
        <Link to="/tours" className="btn-outline">Browse More Packages</Link>
      </div>
    </div>
    <Footer />
  </div>
);

export default CheckoutPage;
