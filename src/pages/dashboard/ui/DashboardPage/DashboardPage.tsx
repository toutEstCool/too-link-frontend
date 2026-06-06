import React from 'react';
import axios from 'axios';
import { useBillingMetricsQuery } from '@/entities/billing-metrics';
import { Header } from '@/widgets/header';
import { MetricsGrid } from '@/widgets/metrics-grid';
import { MetricsDistribution } from '@/widgets/metrics-distribution';
import { SystemStatus } from '@/widgets/system-status';
import { Button } from '@/shared/ui/button';

export const DashboardPage: React.FC = () => {
  // Получаем хук из сущности billing-metrics
  const { 
    data: stats, 
    isLoading, 
    error, 
    refetch, 
    isFetching 
  } = useBillingMetricsQuery();

  const apiError = error 
    ? (axios.isAxiosError<{ error?: string }>(error)
      ? (error.response?.data?.error || 'Не удалось загрузить данные дашборда') 
      : 'Не удалось загрузить данные дашборда')
    : null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1760px] mx-auto relative z-10">
        
        {/* Шапка дашборда (Виджет) */}
        <Header 
          onRefresh={() => refetch()} 
          isRefreshing={isLoading || isFetching} 
        />

        {/* Секция ошибок при загрузке */}
        {apiError && (
          <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 flex items-center justify-between text-sm text-red-400">
            <span>{apiError}</span>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm" 
              className="border-red-900/50 hover:bg-red-950/40"
            >
              Повторить попытку
            </Button>
          </div>
        )}

        {/* Сетка метрик биллинга (Виджет + Загрузка/Кэш) */}
        <MetricsGrid 
          stats={stats} 
          isLoading={isLoading} 
        />

        {/* Слой графиков и распределения */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {/* Диаграмма долей абонентов по статусам (Виджет) */}
            <div className="lg:col-span-1">
              <MetricsDistribution
                active={stats.subscribers.active}
                suspended={stats.subscribers.suspended}
                grace={stats.subscribers.grace}
                isLoading={isLoading}
              />
            </div>

            {/* Оперативный статус инфраструктуры (Виджет) */}
            <div className="lg:col-span-2">
              <SystemStatus
                activeSubscribers={stats.subscribers.active}
                suspendedSubscribers={stats.subscribers.suspended}
              />
            </div>
          </div>
        )}
    </div>
  );
};
