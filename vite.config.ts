import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Minify with esbuild (fastest) — removes dead code, whitespace, shortens names
    minify: "esbuild",
    // Strip console.log and debugger in production
    esbuild:
      mode === "production"
        ? {
            drop: ["console", "debugger"],
          }
        : undefined,
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-tabs", "@radix-ui/react-tooltip"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    // Enable source maps for debugging (won't ship to users)
    sourcemap: mode !== "production",
    // Target modern browsers
    target: "es2020",
  },
}));
