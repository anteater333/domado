/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        domadoRed: '#f14d30',
        domadoGreen: '#2eb42e',
        domadoSky: '#26c6f8',
        /** use this with random alpha */
        domadoCloud: '#faf2ef',
      },
    },
  },
  plugins: [],
};
