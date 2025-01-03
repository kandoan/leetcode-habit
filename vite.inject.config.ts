import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/inject",

    emptyOutDir: false,

    lib: {
      entry: "src/inject/index.ts",
      name: "inject-script",
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
