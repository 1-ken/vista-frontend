import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.PORT) || 5173
  const previewPort = Number(env.PREVIEW_PORT) || port

  const BACKEND = env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  const TASK_API = env.VITE_TASK_API_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: false,
      proxy: {
        '/api': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: previewPort,
      strictPort: false,
    },
  }
})
