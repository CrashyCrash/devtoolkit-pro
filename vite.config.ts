import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/devtoolkit-pro/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
