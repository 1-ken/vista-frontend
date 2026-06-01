import api from '../api/axios';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-[#f6f5f2] min-h-screen text-black">
      <Navbar />
      
      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1488646015629-49bd81139f29?q=80&w=1973&auto=format&fit=crop" 
            alt="Travel Stories" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 px-6 text-center max-w-5xl mx-auto">
          <Reveal>
            <span className="uppercase tracking-[0.6em] text-white/70 text-[11px] font-medium block mb-8">
              The VistaVoyage Journal
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1] tracking-tight uppercase">
              Travel <span className="italic">Stories</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mt-8 leading-relaxed font-light">
              Explore the world through the eyes of our community. Discover hidden gems, 
              travel tips, and unforgettable experiences.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
            <Reveal>
              <div>
                <span className="uppercase tracking-[0.5em] text-black/35 text-[11px] font-semibold block mb-5">
                  Latest Articles
                </span>
                <h2 className="text-4xl md:text-6xl font-serif leading-[1] tracking-tight">
                  Perspectives from <span className="italic">the Wild.</span>
                </h2>
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <Link 
                to="/blogs/add" 
                className="px-10 py-4 bg-black text-white rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent transition-all duration-500 shadow-xl"
              >
                Share Your Story
              </Link>
            </Reveal>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog, idx) => (
                <Reveal key={blog._id} delay={idx * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                      <img 
                        src={blog.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80'} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={blog.title}
                      />
                      <div className="absolute top-6 left-6 flex gap-2">
                        {blog.tags?.map(tag => (
                          <span key={tag} className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase text-black tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.25em] font-bold text-black/40">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          {blog.author}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-serif text-black leading-tight group-hover:text-accent transition-colors duration-500 uppercase">
                        {blog.title}
                      </h3>
                      
                      <p className="text-black/60 text-sm line-clamp-2 leading-relaxed font-light">
                        {blog.content}
                      </p>
                      
                      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-black group/btn pt-4 hover:text-accent transition-colors">
                        Read Full Story
                        <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
              {blogs.length === 0 && (
                <div className="col-span-full py-24 text-center">
                   <p className="text-black/30 uppercase tracking-[0.4em] text-sm">No stories found yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
