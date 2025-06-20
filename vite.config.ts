import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 3001,       // Use port 3001 (or any free port)
    strictPort: true, // Fail if port is taken, don't auto-increment
  },
});
