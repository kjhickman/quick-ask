import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig(({ mode }) => ({
  plugins: [
    crx({
      manifest,
    }),
  ],
  css: {
    postcss: './postcss.config.js',
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
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  define: {
    __DEV__: mode === 'development',
  },
}));
