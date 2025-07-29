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
        popup: 'src/popup/index.html',
        response: 'src/response/index.html',
        background: 'src/background/background.ts',
      },
    },
    minify: mode === 'production',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@popup': '/src/popup',
      '@response': '/src/response',
      '@shared': '/src/shared',
      '@components': '/src/shared/components',
      '@services': '/src/shared/services',
      '@utils': '/src/shared/utils',
      '@config': '/src/shared/config',
    },
  },
  define: {
    __DEV__: mode === 'development',
  },
}));
