import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/api';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/auth/logout');
    },
    onSettled: () => {
      // Очищаем кэш запросов, локальные данные пользователя и перенаправляем на страницу логина
      queryClient.clear();
      localStorage.removeItem('admin_user');
      navigate('/login', { replace: true });
    }
  });

  return {
    logout: mutation.mutate,
    isPending: mutation.isPending,
  };
};
