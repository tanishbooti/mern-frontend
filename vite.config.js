import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  plugins: [react(),
    tailwindcss()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
