/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#000000',
          200: '#0A0A0A',
          300: '#171717',
          400: '#262626',
          500: '#373737',
          600: '#525252',
          650: '#404040',
          700: '#737373',
          800: '#A3A3A3',
        },
        primary: {
          50: '#A3A3A3',
          100: '#737373',
          200: '#525252',
          300: '#404040',
          400: '#373737',
          500: '#262626',
          600: '#171717',
          700: '#0A0A0A',
          800: '#000000',
          900: '#000000',
        },
        accent: {
          100: '#404040',
          200: '#525252',
          300: '#737373',
          400: '#A3A3A3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}