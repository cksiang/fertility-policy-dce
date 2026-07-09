import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        name: '生育政策研究实验 (Fertility DCE Study)',
        short_name: '生育政策研究',
        description: 'Discrete Choice Experiment on Fertility Decisions',
        theme_color: '#0070f3',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f476.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/512x512/1f476.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})