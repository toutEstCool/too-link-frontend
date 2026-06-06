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
    <Card className="border-border bg-card/40 backdrop-blur-md text-foreground rounded-xl">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Оперативный статус инфраструктуры
        </CardTitle>
        <CardDescription className="text-muted-foreground text-[10px] uppercase tracking-wider">
          Мониторинг биллинг-крона и сетевых шлюзов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-muted-foreground text-sm">Движок тарификации (Billing Cron)</span>
          <span className="text-success text-sm font-semibold">🟢 Активен (00:01 ежедневно)</span>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-muted-foreground text-sm">Сетевой мост (PostgreSQL СoA Views)</span>
          <span className="text-success text-sm font-semibold">🟢 Синхронизирован</span>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-muted-foreground text-sm">Активные клиенты (Доступ разрешен)</span>
          <span className="text-foreground text-sm font-semibold">{activeSubscribers}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-muted-foreground text-sm">Заблокированные (Доступ закрыт)</span>
          <span className="text-destructive text-sm font-semibold">{suspendedSubscribers}</span>
        </div>
      </CardContent>
    </Card>
  );
};
