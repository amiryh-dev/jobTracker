import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In development, send /api calls to the Express server
    proxy: { '/api': 'http://localhost:5001' },
  },
});
