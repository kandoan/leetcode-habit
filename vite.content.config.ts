import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/content",

    emptyOutDir: false,

    lib: {
      entry: "src/content/index.ts",
      name: "content-script",
      formats: ["iife"],
    },

    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        extend: true,
      },
    },
  },
});
