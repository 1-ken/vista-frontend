import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';

// Jamal Labeled Image
import culture1 from '../assets/JAMAL LABELED IMAGES/CULTURE SHOT 1.jpg'
import giraffe1 from '../assets/JAMAL LABELED IMAGES/GIRAFFE CENTRE SHOT.jpg'
import giraffe2 from '../assets/JAMAL LABELED IMAGES/GIRAFFE CENTRE SHOT 2.jpg'
import giraffe3 from '../assets/JAMAL LABELED IMAGES/GIRAFFE CENTRE SHOT 3.jpg'
import mara1 from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 1.jpg'
import mara2 from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 2.jpg'
import mara3 from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 3.jpg'
import mara4 from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 4.jpg'
import mara5 from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 5.jpg'
import mara6 from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 6.jpg'
import mara7 from '../assets/JAMAL LABELED IMAGES/MASAI MARA SAFARI SHOT 7.jpg'
import safariShot1 from '../assets/JAMAL LABELED IMAGES/SAFARI SHOT.jpg'
import safariShot2 from '../assets/JAMAL LABELED IMAGES/SAFARI SHOT 2.jpg'
import safariShot3 from '../assets/JAMAL LABELED IMAGES/SAFARI SHOT 3.jpg'
import oleleshwaBedroom from '../assets/JAMAL LABELED IMAGES/OLELESHWA BEDROOM SHOT.jpg'
import oleleshwaPoolside from '../assets/JAMAL LABELED IMAGES/OLELESHWA POOLSIDE SHOT.jpg'
import oleleshwaBreakfast from '../assets/JAMAL LABELED IMAGES/OLELESHWA BREAKFAST SHOT.jpg'
import oleleshwaLobby from '../assets/JAMAL LABELED IMAGES/OLELESHWA LOBBY SHOT.jpg'
import oleleshwaMainLobby from '../assets/JAMAL LABELED IMAGES/OLELESHWA MAIN LOBBY SHOT.jpg'
import oleleshwaTub from '../assets/JAMAL LABELED IMAGES/OLELESHWA OUTDOOR VALENTINE TUB SHOT.jpg'
import oleleshwaLandscape from '../assets/JAMAL LABELED IMAGES/OLELESHWA VIEW FROM BALCONY SHOT.jpg'
import rubiPool from '../assets/JAMAL LABELED IMAGES/RUBI RANCH POOL SHOT.jpg'
import rubiTub from '../assets/JAMAL LABELED IMAGES/RUBI RANCH OUTDOOR TUB SHOT.jpg'
import rubiLiving from '../assets/JAMAL LABELED IMAGES/RUBI RANCH LIVING ROOM SHOT.jpg'
import rubiHorses from '../assets/JAMAL LABELED IMAGES/RUBI RANCH HORSES SHOT.jpg'

const galleryImages = [
  { id: 1, src: mara1, category: 'Safari', title: 'The Great Migration' },
  { id: 2, src: mara2, category: 'Safari', title: 'Wild Horizons' },
  { id: 3, src: mara3, category: 'Safari', title: 'Savannah Life' },
  { id: 4, src: mara4, category: 'Safari', title: 'Safari Pride' },
  { id: 5, src: giraffe1, category: 'Wildlife', title: 'Giraffe Centre' },
  { id: 6, src: giraffe2, category: 'Wildlife', title: 'Gentle Giants' },
  { id: 7, src: safariShot1, category: 'Safari', title: 'Safari Adventures' },
  { id: 8, src: culture1, category: 'Culture', title: 'Heritage & Traditions' },
  { id: 9, src: oleleshwaBedroom, category: 'Luxury', title: 'Oleleshwa Suite' },
  { id: 10, src: oleleshwaPoolside, category: 'Luxury', title: 'Poolside Bliss' },
  { id: 11, src: oleleshwaBreakfast, category: 'Luxury', title: 'Bush Breakfast' },
  { id: 12, src: oleleshwaLobby, category: 'Luxury', title: 'Elegance Redefined' },
  { id: 13, src: rubiPool, category: 'Luxury', title: 'Rubi Ranch Pool' },
  { id: 14, src: rubiTub, category: 'Luxury', title: 'Outdoor Relaxation' },
  { id: 15, src: rubiLiving, category: 'Luxury', title: 'Ranch Living' },
  { id: 16, src: rubiHorses, category: 'Culture', title: 'Equestrian Spirit' },
  { id: 17, src: mara5, category: 'Safari', title: 'Hidden Treasures' },
  { id: 18, src: mara6, category: 'Safari', title: 'Plains of Gold' },
  { id: 19, src: safariShot2, category: 'Safari', title: 'Untamed Beauty' },
  { id: 20, src: safariShot3, category: 'Safari', title: 'Wilderness Pulse' },
  { id: 21, src: giraffe3, category: 'Wildlife', title: 'Tower of Giraffes' },
  { id: 22, src: oleleshwaMainLobby, category: 'Luxury', title: 'Grand Welcome' },
  { id: 23, src: oleleshwaTub, category: 'Luxury', title: 'Valentine Escape' },
  { id: 24, src: oleleshwaLandscape, category: 'Luxury', title: 'Balcony Views' },
  { id: 25, src: mara7, category: 'Safari', title: 'African Sunset' }
];

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(galleryImages.map(img => img.category))];
  const filteredImages = filter === 'All' ? galleryImages : galleryImages.filter(img => img.category === filter);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img 
            src={oleleshwaLandscape} 
            alt="Gallery Header" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Reveal>
            <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">
              Visual Chronicles
            </span>
            <h1 className="text-4xl md:text-7xl font-serif text-white mb-8">
              Our Visual <span className="italic text-accent">Gallery</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] uppercase tracking-ultra-wide font-bold px-8 py-3 rounded-full border transition-all duration-500 ${
                  filter === cat 
                    ? 'bg-primary text-white border-primary' 
                    : 'border-primary/10 text-primary hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="relative group cursor-pointer rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 aspect-square"
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100">
                    <span className="text-accent text-[8px] uppercase tracking-widest font-bold mb-2">{image.category}</span>
                    <h4 className="text-white text-xl font-serif">{image.title}</h4>
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-accent transition-colors">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
            <div className="absolute bottom-10 left-10 text-white">
              <span className="text-accent text-[10px] uppercase tracking-widest font-bold mb-2 block">{selectedImage.category}</span>
              <h3 className="text-2xl md:text-4xl font-serif">{selectedImage.title}</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GalleryPage;