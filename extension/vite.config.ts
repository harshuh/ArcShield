
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config'
 
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
         input: {
        start: 'start.html',
        lock: 'lock.html',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
 