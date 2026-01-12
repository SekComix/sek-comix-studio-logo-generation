
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Mapping flessibile della chiave API: accetta sia il nome standard che quello specifico VITE_
  const apiKey = process.env.API_KEY || env.API_KEY || env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  return {
    base: './', 
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Sek + Comix Studio',
          short_name: 'SekStudio',
          description: 'AI Creator Studio powered by Gemini 2.5',
          theme_color: '#0f0c29',
          background_color: '#0f0c29',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './index.html',
          scope: './',
          icons: [
            {
              src: 'https://cdn-icons-png.flaticon.com/512/11519/11519448.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://cdn-icons-png.flaticon.com/512/11519/11519448.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 5000000,
          navigateFallback: null
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})
