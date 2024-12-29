import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Correct configuration without invalid `postcss` property
export default defineConfig({
  plugins: [react()],
});
