import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, formData);
      
      const { token, role, name, _id } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, role, _id }));

      if (role === 'ADMIN' || role === 'MANAGER' || role === 'AGENT') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-surface rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Left Side - Info */}
            <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between">
              <div>
                <Reveal>
                  <h2 className="text-4xl font-serif mb-6">{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
                  <p className="text-white/70 mb-8 leading-relaxed">
                    {isLogin 
                      ? 'Login to access your personalized travel dashboard, manage bookings, and share your stories.' 
                      : 'Create an account to start your journey with VistaVoyage and join a community of elite travelers.'}
                  </p>
                </Reveal>
                
                <div className="space-y-6">
                  {[
                    "Personalized travel recommendations",
                    "Exclusive member-only rates",
                    "Easy booking management",
                    "Share travel stories & tips"
                  ].map((benefit, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <span className="text-sm font-medium text-white/80">{benefit}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">VistaVoyage Exclusive</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-1/2 p-12">
              <Reveal>
                <div className="flex gap-4 mb-10 bg-white p-1 rounded-2xl shadow-sm">
                  <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isLogin ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'
                    }`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      !isLogin ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'
                    }`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                  {error && <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-xl">{error}</div>}
                  {!isLogin && (
                    <div className="relative">
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium text-primary shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium text-primary shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                      <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium text-primary shadow-sm"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-5 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent/90 transition-all shadow-xl shadow-accent/30 group disabled:opacity-50">
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="pt-6 text-center">
                    <p className="text-sm text-primary/60">
                      {isLogin ? "Don't have an account?" : "Already have an account?"} <br />
                      <button 
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-accent font-bold hover:underline mt-2"
                      >
                        {isLogin ? 'Create one now' : 'Login here'}
                      </button>
                    </p>
                  </div>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoginPage;
