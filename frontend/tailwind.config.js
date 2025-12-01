/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f2',
          100: '#ffe8df',
          200: '#ffd4c4',
          300: '#ffb69d',
          400: '#ff8c66',
          500: '#ff6b35',
          600: '#e55a2b',
          700: '#cc4a1f',
          800: '#a63d1a',
          900: '#863316',
        },
        secondary: {
          50: '#e6f2f7',
          100: '#cce5ef',
          200: '#99cbdf',
          300: '#66b1cf',
          400: '#3397bf',
          500: '#004e89',
          600: '#003e6e',
          700: '#002f53',
          800: '#001f38',
          900: '#00101d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
