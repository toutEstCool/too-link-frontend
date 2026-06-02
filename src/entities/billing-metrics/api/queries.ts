import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import type { BillingStats } from '../model/types';

export const useBillingMetricsQuery = () => {
  return useQuery<BillingStats>({
    queryKey: ['billingMetrics'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};
