import React from 'react';
import { motion } from 'framer-motion';

const Reveal = ({ 
  children, 
  delay = 0, 
  y = 40,
  x = 0,
  duration = 0.8,
  once = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: "-100px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: duration * 0.6 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide reveal variants
Reveal.fromLeft = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  once = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-100px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

Reveal.fromRight = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  once = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-100px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

Reveal.fromBottom = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  once = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-100px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

Reveal.scale = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  once = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: "-100px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

Reveal.blur = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  once = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once, margin: "-100px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
