import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** A short, honest build stamp. No git is run here; the date is the fact. */
const stamp = new Date().toISOString().slice(0, 10);

export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    __BUILD_STAMP__: JSON.stringify(stamp),
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: true,
  },
});
