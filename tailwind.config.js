// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#4299E1',
          600: '#3182CE',
        },
        teal: {
          400: '#38B2AC',
        },
        red: {
          500: '#F56565',
          600: '#E53E3E',
        },
        gray: {
          700: '#636161',
        },
        shadows: {
          sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        spacing: {
          '8': '2rem',
        },
        fontFamily: {
          sans: ['Inter', 'Arial', 'sans-serif'],
        },
        fontSize: {
          '3xl': '3rem',
        },
      },
    },
  },
  plugins: [],
}