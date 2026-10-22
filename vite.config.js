import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    // src/foto dan tools bukan bagian build. Watcher-nya cuma bikin reload
    // dan pernah bikin server mati waktu file foto sedang ditulis.
    watch: { ignored: ['**/src/foto/**', '**/tools/**'] },
  },
})
