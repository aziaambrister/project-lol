import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Listen on all addresses (LAN, localhost, etc.)
    port: 3000,       // Use port 3000
    strictPort: true, // Fail if port 3000 is taken instead of auto-incrementing
  },
});
