import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import npmPackage from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'vite.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/wf-noctua-hub/index.html',
        navigateFallbackDenylist: [/^\/wf-noctua-hub\/assets\/.*$/]
      },
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'NoctuaHub',
        short_name: 'NoctuaHub',
        description: 'Warframe Status & Info Hub',
        theme_color: '#286A56',
        background_color: '#F6FAF6',
        display: 'standalone',
        scope: '/wf-noctua-hub/',
        start_url: '/wf-noctua-hub/index.html',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/wf-noctua-hub/',
  define: {
    __APP_VERSION__: JSON.stringify(npmPackage.version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['swr'],
        }
      }
    }
  },
  server: {
    host: true,
  },
})