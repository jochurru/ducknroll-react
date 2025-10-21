/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nueva paleta Duck'n Roll
        primary: '#FFD700',      // Amarillo pato (dorado)
        'primary-dark': '#FFC700', // Amarillo más oscuro para hover
        secondary: '#1A1A1A',    // Negro profundo
        dark: '#000000',         // Negro puro
        'gray-custom': '#4A4A4A', // Gris medio
        'gray-light': '#E5E5E5',  // Gris claro
        accent: '#FFFFFF',       // Blanco
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