import { defineConfig } from 'vite'; // Fix the typo: 'vite' instead of 'vitae'
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
