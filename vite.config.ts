import { defineConfig } from "vite";
import { createManifestGenerator } from "./plugins/manifestGenerator";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createManifestGenerator()],
});
