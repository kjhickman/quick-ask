import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import manifest from './manifest.json';

export default defineConfig(({ mode }) => ({
  plugins: [react(), crx({ manifest })],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'src/pages/popup/popup.html',
        response: 'src/pages/response/response.html',
        background: 'src/background/background.ts',
      },
    },
    minify: mode === 'production',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@services': '/src/services',
      '@utils': '/src/utils',
      '@config': '/src/config',
      '@shared': '/src/shared',
      '@hooks': '/src/hooks',
    },
  },
  define: {
    __DEV__: mode === 'development',
  },
}));
