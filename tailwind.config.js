/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        glow: '0 0 20px rgb(14 165 233 / 0.3)',
      },
    },
  },
  safelist: [
    'bg-emerald-500', 'bg-emerald-400', 'bg-emerald-500/10', 'bg-emerald-500/20',
    'text-emerald-600', 'text-emerald-400', 'text-emerald-700',
    'border-emerald-500', 'border-emerald-200', 'border-l-emerald-500',
    'ring-emerald-500', 'from-emerald-500', 'to-emerald-400',
    'bg-amber-500', 'bg-amber-400', 'bg-amber-500/10', 'bg-amber-500/20',
    'text-amber-600', 'text-amber-400', 'text-amber-700',
    'border-amber-500', 'border-amber-200', 'border-l-amber-500',
    'ring-amber-500', 'from-amber-500', 'to-amber-400',
    'bg-rose-500', 'bg-rose-400', 'bg-rose-500/10', 'bg-rose-500/20',
    'text-rose-600', 'text-rose-400', 'text-rose-700',
    'border-rose-500', 'border-rose-200', 'border-l-rose-500',
    'ring-rose-500', 'from-rose-500', 'to-rose-400',
    'bg-brand-500', 'bg-brand-500/10', 'text-brand-600', 'text-brand-400', 'border-brand-500',
    'bg-violet-500', 'bg-violet-500/10', 'text-violet-600', 'text-violet-400', 'border-violet-500',
    'bg-sky-500', 'bg-sky-500/10', 'text-sky-600', 'text-sky-400',
    'bg-orange-500', 'bg-orange-500/10', 'text-orange-600', 'text-orange-400',
    'bg-pink-500', 'bg-pink-500/10', 'text-pink-600', 'text-pink-400',
    'bg-teal-500', 'bg-teal-500/10', 'text-teal-600', 'text-teal-400',
    'bg-indigo-500', 'bg-indigo-500/10', 'text-indigo-600', 'text-indigo-400',
  ],
  plugins: [],
}
