import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5000000,
      },
      manifest: {
        id: '/',
        name: 'Velvet OS',
        short_name: 'Velvet OS',
        description: 'Premium frontier privacy-first agentic operating system for PWA, Android, iOS, Windows, and Linux. Built on Astryx Design System with tri-color blue/black/white palette.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#000000',
        background_color: '#ffffff',
        icons: [
          {
            src: '/velvet-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/velvet-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/velvet-icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/velvet-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/velvet-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/velvet-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/velvet-icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/velvet-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['productivity', 'utilities', 'developer', 'security'],
        lang: 'en',
        dir: 'ltr',
        scope: '/'
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5174,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})
