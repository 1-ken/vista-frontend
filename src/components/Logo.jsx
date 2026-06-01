import React from 'react';
import logo from '../assets/vvl.png';
import logoInverted from '../assets/Untitled design (1).png';

const Logo = ({ width = 350, height = 110, className = '', inverted = false }) => {
  return (
    <img
      src={inverted ? logoInverted : logo}
      alt="VistaVoyage Logo"
      className={className}
      draggable={false}
      fetchPriority="high"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'block',
        objectFit: 'contain',
        backgroundColor: 'transparent',
        userSelect: 'none',
        filter: inverted ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  );
};

export default Logo;