import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import type { Subscriber } from '../model/types';

export const useSubscribersQuery = () => {
  return useQuery<Subscriber[]>({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const response = await api.get('/admin/subscribers');
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};
