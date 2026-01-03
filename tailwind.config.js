/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#fbf7f3',
          100: '#f5efe6',
          200: '#eadbc8',
          300: '#dac3a3',
          400: '#c5a37d',
          500: '#b0865e',
          600: '#956b4a',
          700: '#78543d',
          800: '#634536',
          900: '#513930',
        },
        leaf: {
          50: '#f2f9f3',
          100: '#e1f2e3',
          200: '#c3e3c8',
          300: '#97ca9f',
          400: '#68aa75',
          500: '#468b55',
          600: '#346f41',
          700: '#2b5836',
          800: '#26462e',
          900: '#203a27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}