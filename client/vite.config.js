import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {//added to enable port forwarding
    host: true,
    port: 5173,
    proxy: {//allows react (port 5173) to connect to the api (port 8080)
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js"
  }
});
