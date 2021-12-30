import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths({ root: '../..' })],
  build: {
    outDir: 'ui-dist',
    target: ['chrome90'],
  },
  define: {
    global: {
      Uint8Array,
    },
  },
})
