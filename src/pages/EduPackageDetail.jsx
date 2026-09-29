import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Users, BookOpen, CheckCircle2, ArrowRight,
  ChevronLeft, Star, Plane, Hotel, Utensils, Shield, Bus, FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PACKAGES = {
  'south-africa-edu': {
    title: 'South Africa Educational Experience',
    country: 'South Africa', city: 'Cape Town',
    duration: '7 Days', ageGroup: '13–18',
    priceFrom: 'KES 185,000', minStudents: 15, maxStudents: 45,
    category: 'Geography & Environment',
    description: 'An immersive 7-day educational journey through Cape Town and surroundings, combining world-class geography, history, and environmental science with unforgettable experiences at iconic South African landmarks.',
    subjects: ['Geography', 'History', 'Environmental Science', 'Tourism Studies'],
    highlights: ['Table Mountain', 'Robben Island', 'Two Oceans Aquarium', 'Cape Point', 'Kirstenbosch Botanical Gardens', 'University of Cape Town Campus Tour'],
    outcomes: ['Understand plate tectonics and geological formations', 'Study biodiversity in fynbos ecosystems', 'Explore marine ecosystems at Two Oceans Aquarium', 'Learn South African history and the legacy of apartheid', 'Understand sustainable tourism practices'],
    inclusions: ['Return flights', 'Hotel accommodation (twin share)', 'All meals (full board)', 'Educational guides', 'Museum & attraction tickets', 'Airport transfers', 'Travel insurance', 'Pre-departure learning pack'],
    exclusions: ['Personal spending money', 'Optional activities', 'Visa fees (if applicable)'],
    itinerary: [
      { day: 1, title: 'Arrival & Orientation', activities: ['Arrive Cape Town International Airport', 'Hotel check-in and orientation briefing', 'Welcome dinner and program overview'] },
      { day: 2, title: 'Table Mountain & Geology', activities: ['Table Mountain cable car ascent', 'Geology field study with educational guide', 'Fynbos ecosystem walk', 'Evening debrief and journaling'] },
      { day: 3, title: 'Robben Island & History', activities: ['Ferry to Robben Island', 'Guided tour with former political prisoner', 'Nelson Mandela cell visit', 'History reflection session'] },
      { day: 4, title: 'Marine Biology', activities: ['Two Oceans Aquarium educational program', 'Marine biologist presentation', 'Cape Point Nature Reserve', 'Penguin colony at Boulders Beach'] },
      { day: 5, title: 'Kirstenbosch & Biodiversity', activities: ['Kirstenbosch National Botanical Garden', 'Biodiversity workshop', 'Canopy walkway', 'Plant identification exercise'] },
      { day: 6, title: 'University of Cape Town', activities: ['UCT campus guided tour', 'Academic faculty presentation', 'Student life panel discussion', 'Farewell dinner'] },
      { day: 7, title: 'Departure', activities: ['Morning free time', 'Airport transfer', 'Departure'] },
    ],
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80',
  },
  'kenya-conservation': {
    title: 'Kenya Wildlife Conservation Program',
    country: 'Kenya', city: 'Nairobi & Maasai Mara',
    duration: '5 Days', ageGroup: '14–18',
    priceFrom: 'KES 95,000', minStudents: 10, maxStudents: 30,
    category: 'Wildlife Conservation',
    description: 'A hands-on conservation program combining game drives, research station visits, and expert-led workshops on wildlife conservation in Kenya\'s most iconic ecosystems.',
    subjects: ['Biology', 'Environmental Science', 'Geography'],
    highlights: ['Maasai Mara National Reserve', 'Rhino Sanctuary', 'David Sheldrick Elephant Orphanage', 'Nairobi National Park', 'Conservation Research Station'],
    outcomes: ['Understand ecosystem dynamics and food chains', 'Learn conservation ethics and wildlife law', 'Practice wildlife research and observation methods', 'Understand human-wildlife conflict resolution'],
    inclusions: ['Return transport', 'Lodge accommodation', 'All meals', 'Park entry fees', 'Conservation expert guides', 'Research materials', 'Travel insurance'],
    exclusions: ['Personal spending', 'Optional souvenirs'],
    itinerary: [
      { day: 1, title: 'Nairobi Arrival', activities: ['Arrive Nairobi', 'David Sheldrick Elephant Orphanage', 'Giraffe Centre', 'Conservation briefing'] },
      { day: 2, title: 'Nairobi National Park', activities: ['Morning game drive', 'Wildlife research workshop', 'Ranger-led bush walk', 'Evening lecture'] },
      { day: 3, title: 'Transfer to Mara', activities: ['Drive to Maasai Mara', 'Afternoon game drive', 'Maasai village cultural visit'] },
      { day: 4, title: 'Maasai Mara Research', activities: ['Dawn game drive', 'Research station visit', 'Rhino tracking exercise', 'Conservation workshop'] },
      { day: 5, title: 'Departure', activities: ['Final game drive', 'Return to Nairobi', 'Departure'] },
    ],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  },
  'east-africa-debate': {
    title: 'East Africa Debate Championship',
    country: 'Kenya', city: 'Nairobi',
    duration: '4 Days', ageGroup: '13–19',
    priceFrom: 'KES 65,000', minStudents: 4, maxStudents: 20,
    category: 'Academic Competitions',
    description: 'The premier inter-school debate competition in East Africa, hosted by Debate Circle Kenya. Schools compete in structured rounds while experiencing Nairobi\'s vibrant culture.',
    subjects: ['English', 'Social Studies', 'Critical Thinking', 'Public Speaking'],
    highlights: ['Championship debate rounds', 'Professional debate coaching', 'Nairobi city tour', 'Networking dinner with alumni', 'Certificate ceremony'],
    outcomes: ['Master public speaking and argumentation', 'Develop critical analysis and research skills', 'Build confidence and leadership', 'Network with peers across East Africa'],
    inclusions: ['Registration fees', 'Hotel accommodation', 'All meals', 'Transport', 'Debate coaching sessions', 'City tour', 'Certificates and trophies'],
    exclusions: ['Personal spending', 'Optional activities'],
    itinerary: [
      { day: 1, title: 'Arrival & Coaching', activities: ['Arrive Nairobi', 'Registration and team briefing', 'Debate coaching workshop', 'Practice rounds'] },
      { day: 2, title: 'Preliminary Rounds', activities: ['Morning preliminary debates', 'Afternoon preliminary debates', 'Judges feedback session', 'Networking dinner'] },
      { day: 3, title: 'Semi-Finals & City Tour', activities: ['Quarter-final rounds', 'Semi-final rounds', 'Nairobi city tour', 'Gala dinner'] },
      { day: 4, title: 'Finals & Departure', activities: ['Grand final debate', 'Awards ceremony', 'Certificate presentation', 'Departure'] },
    ],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
  },
  'tanzania-serengeti': {
    title: 'Tanzania Serengeti Migration Study',
    country: 'Tanzania', city: 'Serengeti & Ngorongoro',
    duration: '6 Days', ageGroup: '15–18',
    priceFrom: 'KES 145,000', minStudents: 12, maxStudents: 35,
    category: 'Geography & Environment',
    description: 'Witness the world\'s greatest wildlife spectacle while conducting field studies in geography, biology, and environmental science across Tanzania\'s most iconic landscapes.',
    subjects: ['Geography', 'Biology', 'Environmental Science', 'History'],
    highlights: ['Serengeti National Park', 'Ngorongoro Crater', 'Olduvai Gorge', 'Maasai Village', 'Migration viewing'],
    outcomes: ['Understand the Great Migration ecosystem', 'Study geological history at Olduvai Gorge', 'Learn about human evolution and early man', 'Understand crater ecosystem dynamics'],
    inclusions: ['Flights', 'Lodge accommodation', 'All meals', 'Park fees', 'Educational guides', 'Field study materials', 'Insurance'],
    exclusions: ['Personal spending', 'Optional activities'],
    itinerary: [
      { day: 1, title: 'Arrival Arusha', activities: ['Arrive Kilimanjaro Airport', 'Transfer to Arusha', 'Program briefing and orientation'] },
      { day: 2, title: 'Ngorongoro Crater', activities: ['Drive to Ngorongoro', 'Crater descent game drive', 'Ecosystem study workshop'] },
      { day: 3, title: 'Olduvai Gorge', activities: ['Olduvai Gorge museum visit', 'Paleoanthropology lecture', 'Fossil site walk', 'Maasai village visit'] },
      { day: 4, title: 'Serengeti Arrival', activities: ['Drive to Serengeti', 'Afternoon game drive', 'Migration briefing'] },
      { day: 5, title: 'Migration Study', activities: ['Full day Serengeti game drives', 'Migration observation and recording', 'Field study completion'] },
      { day: 6, title: 'Departure', activities: ['Morning game drive', 'Return to Arusha', 'Departure'] },
    ],
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
  },
};

const INCLUSIONS_ICONS = {
  'Return flights': Plane, 'Return transport': Bus, 'Hotel accommodation (twin share)': Hotel,
  'Lodge accommodation': Hotel, 'All meals (full board)': Utensils, 'All meals': Utensils,
  'Travel insurance': Shield, 'Museum & attraction tickets': FileText,
};

const EduPackageDetail = () => {
  const { id } = useParams();
  const pkg = PACKAGES[id];
  const [activeDay, setActiveDay] = useState(1);

  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-primary/40 text-lg mb-4">Program not found</p>
        <Link to="/educational-travel" className="text-accent font-bold">← Back to EduTravel</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden pt-20">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-6xl mx-auto">
          <Link to="/educational-travel"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-4 transition-colors">
            <ChevronLeft size={14} />EduTravel
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-accent text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              {pkg.category}
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
              {pkg.country}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">{pkg.title}</h1>
          <div className="flex flex-wrap gap-5 text-white/70 text-sm font-bold">
            <span className="flex items-center gap-1.5"><Clock size={14} />{pkg.duration}</span>
            <span className="flex items-center gap-1.5"><Users size={14} />Ages {pkg.ageGroup}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} />{pkg.city}</span>
            <span className="flex items-center gap-1.5"><Users size={14} />{pkg.minStudents}–{pkg.maxStudents} students</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Description */}
            <div>
              <h2 className="text-2xl font-serif text-primary mb-4">About This Program</h2>
              <p className="text-primary/60 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Subjects */}
            <div>
              <h2 className="text-2xl font-serif text-primary mb-4">Subjects Covered</h2>
              <div className="flex flex-wrap gap-2">
                {pkg.subjects.map((s, i) => (
                  <span key={i} className="px-4 py-2 bg-primary/5 text-primary text-sm font-bold rounded-xl uppercase tracking-wider">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-serif text-primary mb-4">Program Highlights</h2>
              <div className="grid grid-cols-2 gap-3">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
                    <Star size={14} className="text-accent flex-shrink-0" />
                    <span className="text-sm text-primary font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h2 className="text-2xl font-serif text-primary mb-4">Learning Outcomes</h2>
              <div className="space-y-3">
                {pkg.outcomes.map((o, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-primary/70">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-serif text-primary mb-6">Day-by-Day Itinerary</h2>
              <div className="flex gap-2 flex-wrap mb-6">
                {pkg.itinerary.map(d => (
                  <button key={d.day} onClick={() => setActiveDay(d.day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeDay === d.day ? 'bg-primary text-white' : 'bg-slate-100 text-primary/50 hover:bg-slate-200'
                    }`}>
                    Day {d.day}
                  </button>
                ))}
              </div>
              {pkg.itinerary.filter(d => d.day === activeDay).map(day => (
                <motion.div key={day.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 rounded-3xl p-6">
                  <h3 className="text-lg font-serif text-primary mb-4">Day {day.day}: {day.title}</h3>
                  <div className="space-y-3">
                    {day.activities.map((act, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-black text-primary">{i + 1}</span>
                        </div>
                        <span className="text-sm text-primary/70">{act}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-3xl p-6">
                <h3 className="text-base font-serif text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />What's Included
                </h3>
                <div className="space-y-2.5">
                  {pkg.inclusions.map((item, i) => {
                    const Icon = INCLUSIONS_ICONS[item] || CheckCircle2;
                    return (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-primary/70">
                        <Icon size={14} className="text-emerald-500 flex-shrink-0" />
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-red-50 rounded-3xl p-6">
                <h3 className="text-base font-serif text-primary mb-4">Not Included</h3>
                <div className="space-y-2.5">
                  {pkg.exclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-primary/70">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-red-300 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-luxury p-6">
                <p className="text-xs font-black text-primary/40 uppercase tracking-widest mb-1">Starting From</p>
                <p className="text-3xl font-serif text-primary mb-1">{pkg.priceFrom}</p>
                <p className="text-xs text-primary/40 mb-6">per student (min. {pkg.minStudents} students)</p>

                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Duration', value: pkg.duration },
                    { label: 'Age Group', value: `Ages ${pkg.ageGroup}` },
                    { label: 'Group Size', value: `${pkg.minStudents}–${pkg.maxStudents} students` },
                    { label: 'Destination', value: pkg.city },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs font-bold text-primary/40 uppercase tracking-wider">{label}</span>
                      <span className="text-sm font-semibold text-primary">{value}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/educational-travel/quote?program=${id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all mb-3">
                  Request School Quote
                  <ArrowRight size={14} />
                </Link>
                <Link to="/educational-travel/portal"
                  className="flex items-center justify-center gap-2 w-full py-3.5 border border-primary/20 text-primary rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-primary/5 transition-all">
                  Teacher Portal
                </Link>
              </div>

              <div className="bg-primary rounded-3xl p-6 text-white">
                <p className="text-xs font-black text-accent uppercase tracking-widest mb-2">Need Help?</p>
                <p className="text-sm text-white/70 mb-4">Talk to an Education Travel Specialist</p>
                <Link to="/contact"
                  className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Contact Us <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EduPackageDetail;
