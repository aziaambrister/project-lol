import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173, // Vite will try this port first, but will use the next available if it's busy
    // strictPort: true, // <-- removed to allow automatic port selection
  },
});
