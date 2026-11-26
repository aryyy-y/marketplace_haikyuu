import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El frontend llama a /api/* y Vite lo reenvía al backend (puerto 3000).
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
})
