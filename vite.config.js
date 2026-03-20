import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'CAE Mastery System',
        short_name: 'CAE Mastery',
        description: 'Sistema de preparación CAE — 27 semanas → 26 Sept 2026',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    open: true,       // abre el navegador automáticamente al arrancar
    strictPort: true, // si el puerto 5173 ya está ocupado, falla en lugar de cambiar
    port: 5173,
  },
})