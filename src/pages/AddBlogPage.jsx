import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { FileText, Image as ImageIcon, Tag, Send, Loader2, ArrowLeft } from 'lucide-react';

const AddBlogPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Mock logged-in user
  const user = { name: "John Doe", email: "john@example.com" };

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    tags: '',
    author: user.name,
    authorEmail: user.email
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Split tags by comma
    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };

    try {
      const response = await fetch('http://localhost:5000/api/blogs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });

      if (response.ok) {
        setSubmitted(true);
        window.scrollTo(0, 0);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <section className="pt-40 pb-20">
          <div className="container mx-auto px-6 text-center">
            <Reveal>
              <div className="max-w-2xl mx-auto bg-surface p-12 rounded-[3rem] shadow-sm">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Send className="text-accent" size={40} />
                </div>
                <h2 className="text-4xl font-serif text-primary mb-6">Story Submitted!</h2>
                <p className="text-primary/60 mb-10 leading-relaxed">
                  Thank you for sharing your travel experience. Our editors will review your blog 
                  and it will be visible on the site once approved.
                </p>
                <button 
                  onClick={() => navigate('/blogs')}
                  className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all"
                >
                  Back to Blogs
                </button>
              </div>
            </Reveal>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-surface">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => navigate('/blogs')}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-primary/40 hover:text-accent mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Stories
            </button>
            
            <Reveal>
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Share Your <span className="italic text-accent">Story</span></h1>
              <p className="text-primary/60 mb-12">Submit your travel experiences and inspire others to explore.</p>
            </Reveal>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-primary/5 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Article Title *</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-serif text-xl"
                  placeholder="e.g. A Sunset to Remember in Santorini"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Featured Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input 
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Tags (Comma separated)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input 
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium"
                    placeholder="Adventure, Luxury, Europe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 ml-1">Your Story *</label>
                <textarea 
                  required
                  rows="12"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all font-medium leading-relaxed resize-none"
                  placeholder="Tell us everything about your experience..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-accent text-white rounded-[2rem] font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Review
                    <FileText size={24} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AddBlogPage;
