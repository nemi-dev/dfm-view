import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const vendors = ['react', 'styled-components', 'redux-persist', 'redux']

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        "view" : resolve(__dirname, "view.html"),
        "index" : resolve(__dirname, "index.html")
      },
      output: {
        manualChunks (id) {
          const find = vendors.find(n => id.includes(n))
          if (find) return find
          if (id.startsWith(__dirname + '/data/') && id.endsWith('.json')) return 'data'
        }
      }
    }
  },
  server: {
    port: 3240
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    IS_DEV: process.env.NODE_ENV === 'development'
  }
})
