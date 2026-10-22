/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080807',
        gold: {
          300: '#f7d477',
          400: '#e9b83f',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
