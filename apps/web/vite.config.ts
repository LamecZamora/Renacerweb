import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    // Separa las librerías grandes en chunks propios: cachean aparte (rara vez cambian)
    // y se descargan en paralelo, así la app abre más rápido y las actualizaciones pesan menos.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
});
