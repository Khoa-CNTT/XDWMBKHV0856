import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  base: "/",
  server: {
    historyApiFallback: true,
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: false,
      ignored: ["**/node_modules/**", "**/dist/**"],
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
    target: "esnext",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: ["@vitejs/plugin-react"],
  },
});
