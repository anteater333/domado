import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  cacheDir: './.vite',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        sw: './sw.js',
      },
    },
  },
  server: {
    host: true,
    https: true,
  },
});
