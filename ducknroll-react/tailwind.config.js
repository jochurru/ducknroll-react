/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        'primary-dark': '#FFC700',
        secondary: '#1A1A1A',
        dark: '#000000',
        'gray-custom': '#4A4A4A',
        'gray-light': '#E5E5E5',
        accent: '#FFFFFF',
      },
      fontFamily: {
        'retro': ['"Press Start 2P"', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'progress': 'progress 3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}