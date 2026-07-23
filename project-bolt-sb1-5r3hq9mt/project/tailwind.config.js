/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: 'rgb(var(--color-primary-rgb) / 0.05)',
          100: 'rgb(var(--color-primary-rgb) / 0.1)',
          200: 'rgb(var(--color-primary-rgb) / 0.2)',
          300: 'rgb(var(--color-primary-rgb) / 0.3)',
          400: 'rgb(var(--color-primary-rgb) / 0.4)',
          500: 'rgb(var(--color-primary-rgb) / 0.5)',
          600: 'rgb(var(--color-primary-rgb) / 0.6)',
          700: 'rgb(var(--color-primary-rgb) / 0.7)',
          800: 'rgb(var(--color-primary-rgb) / 0.8)',
          900: 'rgb(var(--color-primary-rgb) / 0.9)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          50: 'rgb(var(--color-accent-rgb) / 0.05)',
          100: 'rgb(var(--color-accent-rgb) / 0.1)',
          200: 'rgb(var(--color-accent-rgb) / 0.2)',
          300: 'rgb(var(--color-accent-rgb) / 0.3)',
          400: 'rgb(var(--color-accent-rgb) / 0.4)',
          500: 'rgb(var(--color-accent-rgb) / 0.5)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
