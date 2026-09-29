import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Loader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 1.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] bg-dark flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-jungle/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex items-center justify-center"
          >
            <Logo height={110} width={350} inverted />
          </motion.div>

        {/* Animated Line */}
        <div className="relative w-48 md:w-64 overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {/* Loading Dots */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 rounded-full bg-accent"
            />
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-8"
        >
          Navigating Dreams
        </motion.p>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-white/10"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/10"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10"></div>
    </motion.div>
  );
};

export default Loader;
