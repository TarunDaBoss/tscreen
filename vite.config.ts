import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' makes the build work from any path: Vercel, GitHub Pages (/repo-name/), or an iframe.
export default defineConfig({
  base: './',
  plugins: [react()],
})
