import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // MediaPipe is loaded via CDN <script> tags and exposed as browser globals.
});
