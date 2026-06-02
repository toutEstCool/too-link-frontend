import { z } from 'zod';

export const subscriberSchema = z.object({
  fullName: z.string().min(3, { message: 'Укажите полное ФИО абонента (минимум 3 символа)' }),
  phone: z.string().min(9, { message: 'Некорректный формат номера телефона' }),
  village: z.string().min(2, { message: 'Укажите село (например: Кара-Суу)' }),
  address: z.string().min(3, { message: 'Укажите улицу и номер дома' }),
  tariffId: z.string().uuid({ message: 'Выберите тарифный план из списка' }),
  // Необязательные поля для ручной конфигурации сети инженером
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, { message: 'Неверный формат IPv4 адреса' }).or(z.string().length(0)).optional(),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, { message: 'Формат MAC-адреса: AA:BB:CC:DD:EE:FF' }).or(z.string().length(0)).optional(),
  speedLimit: z.string().regex(/^\d+[M|G|k]\/\d+[M|G|k]$/, { message: 'Формат скорости MikroTik: 50M/50M' }).or(z.string().length(0)).optional(),
  mikrotikComment: z.string().optional(),
});

export type SubscriberFormValues = z.infer<typeof subscriberSchema>;
