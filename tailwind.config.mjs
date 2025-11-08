// Tailwind configuration with extended clay & earth palettes
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#fdf9f6',
          100: '#f7ede5',
          200: '#e9d3c3',
          300: '#dbb9a2',
          400: '#cfa182',
          500: '#c38963',
          600: '#a96f4a',
          700: '#85543a',
          800: '#5d3a28',
          900: '#3b2419',
        },
        earth: {
          50: '#f5f7f2',
          100: '#e4ebe0',
          200: '#c8d6c2',
          300: '#a9c0a1',
          400: '#8aa982',
          500: '#6d8f66',
          600: '#54724f',
          700: '#3c5239',
          800: '#273724',
          900: '#141e13',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
