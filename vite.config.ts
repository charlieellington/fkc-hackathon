// Vite build/dev configuration for the Nami web app.
// Wires React, Tailwind CSS v4 (via its Vite plugin), and the "@" -> "src" path
// alias that shadcn/ui components import from. Plain front-end SPA, no backend.
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
