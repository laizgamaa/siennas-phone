import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Example plugin

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});
