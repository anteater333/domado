/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        domadoRed: '#f14d30',
        domadoGreen: '#2e922c',
        domadoSkyTop: '#188bff',
        domadoSkyBottom: '#54d7ff',
        /** use this with random alpha */
        domadoCloud: '#faf2ef',
      },
      fontFamily: {
        santokki: ['HS-Regular'],
      },
    },
  },
  plugins: [],
};
