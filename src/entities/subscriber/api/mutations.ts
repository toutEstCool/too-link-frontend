import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import type { Subscriber } from '../model/types';

interface UpdateSubscriberStatusPayload {
  subscriberId: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export const useUpdateSubscriberStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; subscriber: Subscriber }, Error, UpdateSubscriberStatusPayload>({
    mutationFn: async ({ subscriberId, status }) => {
      const response = await api.patch(`/admin/subscribers/${subscriberId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['billing-metrics'] });
    },
  });
};
