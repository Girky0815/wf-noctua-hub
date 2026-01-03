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
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // 実在する index.html をフォールバック先に指定
        navigateFallback: '/wf-noctua-hub/index.html',
        navigateFallbackDenylist: [/^\/wf-noctua-hub\/assets\/.*$/]
      },
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Noctua Hub',
        short_name: 'NoctuaHub',
        description: 'Warframe ステータスと情報ハブアプリ',
        theme_color: '#286A56',
        background_color: '#F6FAF6',
        display: 'standalone',

        // ↓↓↓ ここを修正 ↓↓↓
        // 以前: scope: '/wf-noctua-hub/',
        scope: './',

        // 以前: start_url: '/wf-noctua-hub/?pwa=true',
        // クエリパラメータ(?pwa=true)を一旦外し、実ファイルを指すことで確実性を高めます
        start_url: './index.html',
      },
    }),
  ],
  base: '/wf-noctua-hub/',
  define: {
    __APP_VERSION__: JSON.stringify(npmPackage.version),
  },
  server: {
    host: true,
  },
})
