import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // IMPORTANTE: Se il tuo repository si chiama diversamente da "sek-comix-studio",
    // cambia la riga qui sotto con il nome esatto del tuo repo (es. "/mio-progetto/")
    base: '/sek-comix-studio/', 
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY)
    }
  }
})
