import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// TEMPORARY (2026-09-09), dev-server only — see scripts/elkTimingPlugin.ts.
import { elkTimingPlugin } from './scripts/elkTimingPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), elkTimingPlugin()],
  base: '/dynamic-model-var-docs/',
  build: {
    rollupOptions: {
      input: {
        // The default app: the Explorer SPA (docs/EXPLORE_VIZ.md), shell
        // under src/explore/, sharing src/ (DataService, models) with the
        // previous app.
        main: resolve(__dirname, 'index.html'),
        // The previous app (Nested Tabular / Kitchen Sink / Focus views).
        previous: resolve(__dirname, 'previous.html'),
      },
    },
  },
})
