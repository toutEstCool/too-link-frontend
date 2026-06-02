import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из .env
  const env = loadEnv(mode, process.cwd(), '');
  
  // Определяем базовый URL бэкенда для проксирования
  let backendUrl = 'http://localhost:3000';
  if (env.VITE_API_URL && env.VITE_API_URL.startsWith('http')) {
    try {
      backendUrl = new URL(env.VITE_API_URL).origin;
    } catch {
      // Игнорируем некорректный URL
    }
  }

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false, // Разрешает проксирование на HTTPS бэкенд
        },
      },
    },
  };
})
