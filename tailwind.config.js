/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1A1A2E',
          DEFAULT: '#16213E',
          light: '#0F3460',
        },
        accent: {
          blue: '#00B4D8',
          pink: '#E94560',
        },
        text: {
          white: '#FFFFFF',
          light: '#F5F5F5',
          dark: '#333333',
        },
        card: {
          dark: 'rgba(22, 33, 62, 0.7)',
          light: 'rgba(255, 255, 255, 0.85)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      },
      spacing: {
        '128': '32rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 180, 216, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #1A1A2E, #16213E)',
        'gradient-accent': 'linear-gradient(to right, #00B4D8, #90E0EF)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}; 