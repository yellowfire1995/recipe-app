import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["cbcdev.wfhomelocal.com"],
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling: true, // Enables polling for file changes (essential for Docker on some OSes)
      interval: 100, // Polling interval in milliseconds
    },
    proxy: {
      "/api": {
        target: "http://api:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
