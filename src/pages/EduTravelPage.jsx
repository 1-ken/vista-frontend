import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Globe, Leaf, Users, Trophy, BookOpen,
  ArrowRight, MapPin, Clock, Star, ChevronDown, School
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSEO, ORGANIZATION_SCHEMA, buildBreadcrumbSchema } from '../utils/seo';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'competitions',
    icon: Trophy,
    title: 'Academic Competitions',
    desc: 'Debate championships, MUN, robotics, STEM camps, science fairs and olympiads.',
    color: '#c8a248',
    programs: ['Debate Championships', 'Model United Nations', 'Robotics Competitions', 'STEM Camps', 'Science Fairs', 'Mathematics Olympiads'],
  },
  {
    id: 'geography',
    icon: Globe,
    title: 'Geography & Environment',
    desc: 'Field studies at iconic African landscapes — from Table Mountain to the Serengeti.',
    color: '#0b3d2e',
    programs: ['Table Mountain', 'Victoria Falls', 'Maasai Mara Ecosystem', 'Ngorongoro Crater', 'Serengeti Migration', 'Mount Kilimanjaro'],
  },
  {
    id: 'conservation',
    icon: Leaf,
    title: 'Wildlife Conservation',
    desc: 'Hands-on conservation research, marine biology, and national park studies.',
    color: '#3b82f6',
    programs: ['Rhino Conservation', 'Elephant Research', 'Marine Biology', 'National Parks', 'Bird Watching', 'Conservation Workshops'],
  },
  {
    id: 'leadership',
    icon: Users,
    title: 'Leadership & Culture',
    desc: 'Leadership camps, cultural exchange, community service, and historical sites.',
    color: '#8b5cf6',
    programs: ['Leadership Camps', 'Cultural Exchange', 'Community Service', 'Historical Sites', 'Museums', 'Indigenous Communities'],
  },
  {
    id: 'university',
    icon: GraduationCap,
    title: 'University Visits',
    desc: 'Guided tours and academic sessions at leading African universities.',
    color: '#ec4899',
    programs: ['University of Cape Town', 'Stellenbosch University', 'University of Pretoria', 'Makerere University', 'University of Nairobi'],
  },
  {
    id: 'debate',
    icon: BookOpen,
    title: 'Debate Programs',
    desc: 'Structured debate competitions and coaching programs across East Africa.',
    color: '#f59e0b',
    programs: ['East Africa Debate Championship', 'Inter-School Debates', 'Public Speaking Workshops', 'MUN Conferences'],
  },
];

const FEATURED = [
  {
    id: 'south-africa-edu',
    title: 'South Africa Educational Experience',
    country: 'South Africa',
    duration: '7 Days',
    ageGroup: '13–18',
    priceFrom: 'KES 185,000',
    category: 'Geography & Environment',
    subjects: ['Geography', 'History', 'Environmental Science', 'Tourism Studies'],
    highlights: ['Table Mountain', 'Robben Island', 'Two Oceans Aquarium', 'Cape Point', 'Kirstenbosch', 'UCT Campus'],
    outcomes: ['Plate tectonics', 'Biodiversity', 'Marine ecosystems', 'South African history', 'Sustainable tourism'],
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
    featured: true,
  },
  {
    id: 'kenya-conservation',
    title: 'Kenya Wildlife Conservation Program',
    country: 'Kenya',
    duration: '5 Days',
    ageGroup: '14–18',
    priceFrom: 'KES 95,000',
    category: 'Wildlife Conservation',
    subjects: ['Biology', 'Environmental Science', 'Geography'],
    highlights: ['Maasai Mara', 'Rhino Sanctuary', 'Elephant Orphanage', 'Nairobi National Park'],
    outcomes: ['Ecosystem dynamics', 'Conservation ethics', 'Wildlife research methods'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    featured: true,
  },
  {
    id: 'east-africa-debate',
    title: 'East Africa Debate Championship',
    country: 'Kenya',
    duration: '4 Days',
    ageGroup: '13–19',
    priceFrom: 'KES 65,000',
    category: 'Academic Competitions',
    subjects: ['English', 'Social Studies', 'Critical Thinking'],
    highlights: ['Debate coaching', 'Championship rounds', 'Nairobi city tour', 'Networking dinner'],
    outcomes: ['Public speaking', 'Critical analysis', 'Research skills', 'Confidence'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    featured: true,
  },
  {
    id: 'tanzania-serengeti',
    title: 'Tanzania Serengeti Migration Study',
    country: 'Tanzania',
    duration: '6 Days',
    ageGroup: '15–18',
    priceFrom: 'KES 145,000',
    category: 'Geography & Environment',
    subjects: ['Geography', 'Biology', 'Environmental Science'],
    highlights: ['Serengeti National Park', 'Ngorongoro Crater', 'Olduvai Gorge', 'Maasai Village'],
    outcomes: ['Migration patterns', 'Geological history', 'Human evolution', 'Ecosystem balance'],
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    featured: false,
  },
];

const STATS = [
  { value: '120+', label: 'Schools Served' },
  { value: '8,500+', label: 'Students Travelled' },
  { value: '15', label: 'African Countries' },
  { value: '98%', label: 'Satisfaction Rate' },
];

// ─── Components ───────────────────────────────────────────────────────────────
const PackageCard = ({ pkg }) => (
  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}
    className="bg-white rounded-3xl overflow-hidden shadow-luxury border border-gray-100 group">
    <div className="relative h-52 overflow-hidden">
      <img src={pkg.image} alt={pkg.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-accent text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
          {pkg.category}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div>
          <p className="text-white/70 text-xs font-bold flex items-center gap-1">
            <MapPin size={10} />{pkg.country}
          </p>
        </div>
        <span className="text-white font-serif text-lg">{pkg.priceFrom}<span className="text-white/60 text-xs">/student</span></span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-base font-serif text-primary mb-2 leading-snug">{pkg.title}</h3>
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1 text-xs text-primary/50 font-bold">
          <Clock size={11} />{pkg.duration}
        </span>
        <span className="flex items-center gap-1 text-xs text-primary/50 font-bold">
          <Users size={11} />Ages {pkg.ageGroup}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {pkg.subjects.slice(0, 3).map((s, i) => (
          <span key={i} className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">
            {s}
          </span>
        ))}
      </div>
      <Link to={`/educational-travel/package/${pkg.id}`}
        className="flex items-center justify-between w-full px-5 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all group/btn">
        View Program
        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const EduTravelPage = () => {
  useSEO(
    'Educational Travel Programs Africa | School Tours & Field Trips',
    'VistaVoyage EduTravel organises curriculum-aligned educational tours across Africa for schools — wildlife conservation, geography field trips, debate championships and leadership programs.',
    '/educational-travel',
    undefined,
    [ORGANIZATION_SCHEMA, buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Educational Travel', path: '/educational-travel' }])]
  );
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80"
            alt="Educational Travel" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,61,46,0.92) 0%, rgba(11,61,46,0.75) 50%, rgba(0,0,0,0.5) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* EduTravel badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/20 border border-accent/30 rounded-full mb-8">
            <GraduationCap size={14} className="text-accent" />
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">VistaVoyage EduTravel</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
            Learning Beyond<br />
            <span className="text-accent italic">the Classroom</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Educational tours across Africa designed to inspire curiosity, leadership, conservation, and global citizenship.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/educational-travel/programs"
              className="px-8 py-4 bg-accent text-primary font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-lg">
              Browse Programs
            </Link>
            <Link to="/educational-travel/quote"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-all backdrop-blur-sm">
              Request School Quotation
            </Link>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40">
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* Tagline strip */}
      <div className="bg-primary py-5">
        <p className="text-center text-accent font-serif text-xl italic">
          Where Education Meets Exploration
        </p>
      </div>

      {/* Stats */}
      <section className="py-16 bg-[#f9f7f4]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <p className="text-4xl font-serif text-primary mb-1">{s.value}</p>
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black text-accent uppercase tracking-[0.3em] mb-3">Our Programs</p>
            <h2 className="text-4xl font-serif text-primary">Organized by Educational Purpose</h2>
            <p className="text-primary/50 mt-4 max-w-xl mx-auto">
              Every program is curriculum-aligned and designed with teachers, for teachers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-luxury transition-all group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ background: `${cat.color}15` }}>
                  <cat.icon size={22} style={{ color: cat.color }} />
                </div>
                <h3 className="text-base font-serif text-primary mb-2">{cat.title}</h3>
                <p className="text-sm text-primary/50 leading-relaxed mb-4">{cat.desc}</p>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {cat.programs.map((p, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-primary/60">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      {p}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 px-6 bg-[#f9f7f4]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-black text-accent uppercase tracking-[0.3em] mb-3">Featured Programs</p>
              <h2 className="text-4xl font-serif text-primary">Popular Educational Tours</h2>
            </div>
            <Link to="/educational-travel/programs"
              className="hidden md:flex items-center gap-2 text-xs font-bold text-primary/50 hover:text-primary uppercase tracking-widest transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED.slice(0, 3).map((pkg, i) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <PackageCard pkg={pkg} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why EduTravel */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-black text-accent uppercase tracking-[0.3em] mb-4">Why VistaVoyage EduTravel</p>
              <h2 className="text-4xl font-serif text-primary mb-6 leading-tight">
                More Than a Trip.<br />A Structured Learning Experience.
              </h2>
              <p className="text-primary/60 leading-relaxed mb-8">
                Schools don't just buy a trip — they buy a structured learning experience aligned with curriculum goals. Every program includes pre-departure learning materials, on-site educational guides, and post-trip assessment resources.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Curriculum Aligned', desc: 'Every program maps to national and international curriculum standards.' },
                  { title: 'Dedicated Education Coordinators', desc: 'A VistaVoyage education specialist assigned to every school group.' },
                  { title: 'Full Risk Management', desc: 'Comprehensive safety protocols, insurance, and emergency procedures.' },
                  { title: 'Annual Programs', desc: 'Build recurring annual trips that become a school tradition.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{item.title}</p>
                      <p className="text-sm text-primary/50 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-luxury">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
                  alt="Students studying together" className="w-full h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-6 shadow-luxury border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <School size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-serif text-primary">120+</p>
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Partner Schools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EduTravelPage;
