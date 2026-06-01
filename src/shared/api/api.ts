import axios from 'axios';
import type { AxiosResponse } from 'axios';

// Базовый URL бэкенда. В режиме разработки принудительно используем относительный путь для корректного проксирования кук
const API_BASE_URL: string = import.meta.env.DEV 
  ? '/api/v1' 
  : (import.meta.env.VITE_API_URL || '/api/v1');

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 секунд на таймаут запроса
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Разрешает автоматический прием и отправку защищенных кук (HttpOnly)
});

/**
 * РЕСПОНС-ПЕРЕХВАТЧИК (Response Interceptor)
 * Перехватывает ответы от сервера. Если бэкенд вернул 401 (Unauthorized), 
 * автоматически разлогинивает администратора и перенаправляет на страницу входа.
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown) => {
    // Проверяем, что ошибка вызвана именно ответом сервера
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn('⚠️ Сессия администратора истекла или невалидна. Перенаправление на вход.');
        
        // Очищаем локальные данные пользователя, если они есть
        localStorage.removeItem('admin_user');

        // Если мы не на странице логина, принудительно редиректим пользователя
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);
