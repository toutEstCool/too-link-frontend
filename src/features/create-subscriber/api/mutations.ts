import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import type { SubscriberFormValues } from '../model/types';

export const useCreateSubscriberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: SubscriberFormValues) => {
      // Очищаем пустые строки, чтобы они не падали на валидации бэкенда/Prisma
      const cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value === '' ? undefined : value])
      );

      const response = await api.post('/admin/subscribers', cleanedValues);
      return response.data;
    },
    onSuccess: () => {
      // Инвалидируем кэш списка абонентов и метрик дашборда при успешном создании
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['billing-metrics'] });
    }
  });
};
