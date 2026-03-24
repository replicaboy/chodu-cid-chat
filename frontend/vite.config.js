import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Yeh 0.0.0.0 jaisa hi kaam karta hai, par zyada safe hai
    strictPort: true,
  }
})