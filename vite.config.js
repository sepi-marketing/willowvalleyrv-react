import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH lets the site live in a sub-folder, e.g. GitHub Pages project sites (/willowvalleyrv-react/).
// Leave it unset (or "/") when serving from a domain root such as willowvalleyrv.com.
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 900,
  },
  ssr: {
    noExternal: ['framer-motion', 'lucide-react'],
  },
});
