import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    //host: "mbp.sergazin.kz",
    host: "0.0.0.0",
    port: 3001,
    proxy: {
      "/api": {
        target: "http://0.0.0.0:3000",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    //https: { key: "/Users/a1/secrets/ssl/letsencrypt/mbp.sergazin.kz/privkey.pem", cert: "/Users/a1/secrets/ssl/letsencrypt/mbp.sergazin.kz/fullchain.pem", },
  },
});
