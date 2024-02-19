import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default ({ mode }) => {
  // add Vite envs to the Node level envs.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      react(),
      process.env.VITE_DEV_SERVER_HTTPS_MODE === 'https' ? mkcert() : undefined,
    ],
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
    },
  });
};
