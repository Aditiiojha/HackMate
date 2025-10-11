import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This tells Vite to listen on the standard localhost address
    host: 'localhost',
    port: 5173,
    hmr: {
      // This forces the HMR client to connect to the correct address
      host: 'localhost',
      protocol: 'ws',
    },
  },
})