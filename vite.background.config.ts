import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist/background',

    emptyOutDir: false,

    lib: {
      entry: 'src/background/index.ts',
      name: "background-script",
      formats: ['iife'],
    },

    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        extend: true,
      },
    },
  }
})
