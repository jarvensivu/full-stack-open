import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/weather': {
          target: 'https://api.openweathermap.org/data/2.5/weather',
          changeOrigin: true,
          rewrite: (path) => `${path.replace('/api/weather', '')}&appid=${env.OPENWEATHER_API_KEY}`,
        },
      },
    },
  }
})
