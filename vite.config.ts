import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        "view" : resolve(__dirname, "view.html")
      },
      output: {
        manualChunks (id) {
          if (id.includes('react')) return 'react'
          if (id.includes('redux')) return 'redux'
          if (id.startsWith(__dirname + '/data/') && id.endsWith('.json')) return 'data'
        }
      }
    }
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  }
})
