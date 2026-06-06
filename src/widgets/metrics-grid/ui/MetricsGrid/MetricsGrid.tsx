import React from 'react';
import type { BillingStats } from '@/entities/billing-metrics';
import { Users, Wifi, Wallet, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

interface MetricsGridProps {
  stats: BillingStats | undefined;
  isLoading: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats, isLoading }) => {
  if (isLoading && !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-neutral-900/40 border border-neutral-900 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Карточка 1: Всего абонентов */}
      <Card className="border-border bg-card/40 backdrop-blur-md text-foreground rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Всего подключений</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground font-brand">{stats.subscribers.total}</div>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Домохозяйств в горных селах</p>
        </CardContent>
      </Card>

      {/* Карточка 2: Активные сессии FreeRADIUS */}
      <Card className="border-border bg-card/40 backdrop-blur-md text-foreground rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Сессии FreeRADIUS</CardTitle>
          <Wifi className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-success font-brand">{stats.network.activeSessions}</div>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Активные PPPoE линки на MikroTik</p>
        </CardContent>
      </Card>

      {/* Карточка 3: Баланс лицевых счетов */}
      <Card className="border-border bg-card/40 backdrop-blur-md text-foreground rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Баланс лицевых счетов</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-extrabold font-brand ${stats.financials.currentPoolSom < 0 ? 'text-destructive' : 'text-foreground'}`}>
            {stats.financials.currentPoolSom.toLocaleString()} сом
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Агрегированное состояние кассы</p>
        </CardContent>
      </Card>

      {/* Карточка 4: Собрано через Finik */}
      <Card className="border-border bg-card/40 backdrop-blur-md text-foreground rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Собрано через Finik</CardTitle>
          <CreditCard className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-primary font-brand">
            {stats.financials.totalCollectedSom.toLocaleString()} сом
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Исторический объем терминалов</p>
        </CardContent>
      </Card>
    </div>
  );
};
