import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import npmPackage from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wf-noctua-hub/',
  define: {
    __APP_VERSION__: JSON.stringify(npmPackage.version),
  },
  server: {
    host: true,
  },
})
