import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ShieldCheck, CheckCircle2, 
  ArrowLeft, CreditCard as CardIcon,
  PhoneCall, Wallet, Smartphone
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

import api from '../api/axios';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const tourData = location.state?.tourData;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingData) {
      navigate('/tours');
    }
    window.scrollTo(0, 0);
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Here we would normally integrate with a payment gateway (Stripe, M-Pesa API, etc.)
      // For now, we simulate a successful payment and then save the booking
      
      const response = await api.post('/bookings', {
        ...bookingData,
        paymentStatus: 'PAID',
        paymentMethod: paymentMethod
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-10"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <h1 className="text-5xl font-serif text-primary mb-6">Booking Confirmed!</h1>
          <p className="text-primary/60 text-lg max-w-lg mb-12">
            Your payment was successful and your luxury experience is now reserved. 
            A confirmation email with your itinerary has been sent to {bookingData.guestEmail}.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="btn-primary">Return Home</Link>
            <Link to="/tours" className="btn-outline">Browse More</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-full text-primary hover:text-accent transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-serif text-primary">Secure Checkout</h1>
            <p className="text-primary/40 text-[10px] uppercase tracking-widest font-bold mt-1">Finalize your global travel experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-8">
            <Reveal>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-serif text-primary mb-10">Select Payment Method</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CardIcon },
                    { id: 'mpesa', label: 'M-Pesa', icon: Smartphone },
                    { id: 'paypal', label: 'PayPal', icon: Wallet },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                        paymentMethod === method.id 
                          ? 'border-accent bg-accent/5 text-accent' 
                          : 'border-slate-50 hover:border-slate-200 text-slate-400'
                      }`}
                    >
                      <method.icon size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{method.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {paymentMethod === 'card' && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Card Number</label>
                        <div className="relative">
                          <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            type="text" 
                            placeholder="**** **** **** ****"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM / YY"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">CVV</label>
                          <input 
                            type="text" 
                            placeholder="***"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'mpesa' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
                        <div>
                          <p className="text-sm font-bold text-emerald-900">Lipa na M-Pesa</p>
                          <p className="text-[10px] text-emerald-600 font-medium">A push request will be sent to your phone</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">M-Pesa Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="+254 700 000 000"
                          defaultValue={bookingData.guestPhone}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-accent/40 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="py-12 text-center space-y-4 animate-fade-in">
                      <Wallet size={48} className="mx-auto text-blue-500 opacity-20" />
                      <p className="text-slate-500 text-sm">You will be redirected to PayPal to complete your purchase safely.</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-rose-50 text-rose-500 rounded-xl text-xs font-bold uppercase tracking-widest">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-accent text-white py-6 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-70 mt-8"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing Secure Payment...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Complete Secure Payment
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-8 pt-8 opacity-40">
                    <div className="flex flex-col items-center gap-1">
                      <ShieldCheck size={24} />
                      <span className="text-[8px] uppercase tracking-tighter font-bold">SSL Secured</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CreditCard size={24} />
                      <span className="text-[8px] uppercase tracking-tighter font-bold">PCI Compliant</span>
                    </div>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <Reveal delay={0.2}>
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-lg font-serif text-primary">Order Summary</h3>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex gap-4">
                      {tourData?.image && (
                        <img 
                          src={tourData.image.startsWith('http') ? tourData.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tourData.image}`} 
                          alt="" 
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-bold text-primary">{tourData?.title || 'Custom Adventure'}</p>
                        <p className="text-[10px] text-primary/40 uppercase tracking-widest mt-1">{tourData?.location || 'Global'}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Guest Name</span>
                        <span className="text-primary font-bold">{bookingData.guestName}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Guests</span>
                        <span className="text-primary font-bold">{bookingData.guestsCount} Persons</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Travel Dates</span>
                        <span className="text-primary font-bold text-right">
                          {new Date(bookingData.fromDate).toLocaleDateString()} to<br/>
                          {new Date(bookingData.toDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Subtotal</span>
                        <span className="text-primary font-bold">KSH {bookingData.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Taxes & Fees</span>
                        <span className="text-emerald-500 font-bold">Inclusive</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-slate-900/5">
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Total Investment</span>
                        <span className="text-2xl font-serif text-accent">KSH {bookingData.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="p-8 bg-primary rounded-[2rem] text-white">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <PhoneCall size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1">Need Assistance?</p>
                    <p className="text-[10px] text-white/60">Our 24/7 concierge is available for immediate support.</p>
                    <p className="text-sm font-serif mt-3 text-accent">+254 700 000 000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
