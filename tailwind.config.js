/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b3d2e",
        dark: "#000000",
        "dark-2": "#111111",
        "dark-3": "#1A1A1A",
        secondary: "#c8a248",
        accent: "#c8a248",
        "accent-dark": "#a8894f",
        surface: "#F5F5F5",
        light: "#FFFFFF",
        jungle: "#0b3d2e",
        "accent-light": "#d4bc8a",
        "accent-glow": "rgba(200, 162, 72, 0.3)",
      },
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.4em',
        'wider': '0.2em',
        'wide': '0.1em',
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.08)',
        'luxury-hover': '0 40px 80px rgba(0, 0, 0, 0.15)',
        'accent': '0 10px 30px rgba(197, 163, 88, 0.25)',
        'glow': '0 0 40px rgba(197, 163, 88, 0.3)',
        'inner-glow': 'inset 0 0 30px rgba(197, 163, 88, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'blur-in': 'blur-in 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blur-in': {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(197, 163, 88, 0.1) 50%, transparent 100%)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'luxury': '2.5rem',
        'xluxe': '3rem',
      },
    },
  },
  plugins: [],
}
