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
          50: '#f9f6f3',
          100: '#f3ede6',
          200: '#e6dfd4',
          300: '#d9cfc0',
          400: '#c9b4a3',
          500: '#b89486',
          600: '#a77a66',
          700: '#8f5f4f',
          800: '#6f4436',
          900: '#503025',
        },
        earth: {
          50: '#faf9f7',
          100: '#f3efe7',
          200: '#e8e0d0',
          300: '#d7c8b3',
          400: '#c6b099',
          500: '#b39a7f',
          600: '#98755f',
          700: '#7a563f',
          800: '#5b3b2b',
          900: '#412815',
        },
      },
    },
  },
  plugins: [],
};
