import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/dynamic-model-var-docs/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // The subgraph-viz SPA experiment (docs/EXPLORE_VIZ.md) — a separate
        // page sharing src/ (DataService, models) with the main app.
        explore: resolve(__dirname, 'explore.html'),
      },
    },
  },
})
