import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';

interface SystemStatusProps {
  activeSubscribers: number;
  suspendedSubscribers: number;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  activeSubscribers,
  suspendedSubscribers,
}) => {
  return (
    <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md text-zinc-50 rounded-xl">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Оперативный статус инфраструктуры
        </CardTitle>
        <CardDescription className="text-zinc-500 text-[10px] uppercase tracking-wider">
          Мониторинг биллинг-крона и сетевых шлюзов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between border-b border-zinc-800 pb-2">
          <span className="text-zinc-400 text-sm">Движок тарификации (Billing Cron)</span>
          <span className="text-emerald-400 text-sm font-semibold">🟢 Активен (00:01 ежедневно)</span>
        </div>
        <div className="flex justify-between border-b border-zinc-800 pb-2">
          <span className="text-zinc-400 text-sm">Сетевой мост (PostgreSQL СoA Views)</span>
          <span className="text-emerald-400 text-sm font-semibold">🟢 Синхронизирован</span>
        </div>
        <div className="flex justify-between border-b border-zinc-800 pb-2">
          <span className="text-zinc-400 text-sm">Активные клиенты (Доступ разрешен)</span>
          <span className="text-zinc-100 text-sm font-semibold">{activeSubscribers}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-zinc-400 text-sm">Заблокированные (Доступ закрыт)</span>
          <span className="text-rose-450 text-sm font-semibold text-rose-400">{suspendedSubscribers}</span>
        </div>
      </CardContent>
    </Card>
  );
};
