import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // MODIFICA CRITICA: Usa './' per far funzionare il sito su qualsiasi percorso
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY)
    }
  }
})
