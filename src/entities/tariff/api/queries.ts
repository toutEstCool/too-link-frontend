import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import type { Tariff } from '../model/types';

export const useTariffsQuery = () => {
  return useQuery<Tariff[]>({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const response = await api.get('/admin/tariffs');
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};
