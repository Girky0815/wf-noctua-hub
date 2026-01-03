import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import npmPackage from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'vite.svg'],
      // ▼ 追加: 真っ白になる問題を解決するための設定
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/wf-noctua-hub/index.html',
        navigateFallbackDenylist: [/^\/wf-noctua-hub\/assets\/.*$/]
      },
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Noctua Hub',
        short_name: 'Noctua',
        description: 'Warframe Status & Info Hub',
        theme_color: '#286A56',
        background_color: '#F6FAF6',
        display: 'standalone',
        scope: '/wf-noctua-hub/',
        // ▼ 修正: 明示的に index.html を指定
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
  server: {
    host: true,
  },
})