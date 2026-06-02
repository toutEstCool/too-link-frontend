import type { Tariff } from '@/entities/tariff';

export interface Subscriber {
  id: string;
  fullName: string;
  phone: string;
  village: string;
  address: string;
  paymentCode: string;
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'GRACE';
  tariff: Tariff;
  macAddress?: string;
  ipAddress?: string;
  mikrotikComment?: string;
  radiusUsername?: string;
  radiusPassword?: string;
  speedLimit?: string;
  telegramId?: string;
  telegramUsername?: string;
  billingDay: number;
  createdAt: string;
  updatedAt: string;
}
