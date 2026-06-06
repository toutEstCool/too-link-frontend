import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import type { Subscriber } from '../../model/types';

interface SubscriberStatusBadgeProps {
  status: Subscriber['status'];
}

export const SubscriberStatusBadge: React.FC<SubscriberStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/10 gap-1 rounded-full px-2 py-0.5">
          <Wifi className="h-3 w-3" /> Активен
        </Badge>
      );
    case 'SUSPENDED':
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10 gap-1 rounded-full px-2 py-0.5">
          <WifiOff className="h-3 w-3" /> Блокирован
        </Badge>
      );
    case 'GRACE':
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/10 gap-1 rounded-full px-2 py-0.5">
          <AlertCircle className="h-3 w-3" /> Grace
        </Badge>
      );
    default:
      return null;
  }
};
