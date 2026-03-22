import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // Yeh line Vite ko batati hai ki is Replit link par app dikhana safe hai
    allowedHosts: [
      'fe7d6d59-8ab0-401a-9e2c-77d96523cbf8-00-3d1po2uf9c2nf.sisko.replit.dev'
    ]
  }
})