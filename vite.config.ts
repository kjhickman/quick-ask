import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/postcss';
import manifest from './manifest.json';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    crx({
      manifest,
    }),
  ],
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
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: mode === 'production',
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5174,
    },
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
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  define: {
    __DEV__: mode === 'development',
  },
}));
