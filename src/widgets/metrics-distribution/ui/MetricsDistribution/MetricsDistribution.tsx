import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface MetricsDistributionProps {
  active: number;
  suspended: number;
  grace: number;
  isLoading: boolean;
}

export const MetricsDistribution: React.FC<MetricsDistributionProps> = ({
  active,
  suspended,
  grace,
  isLoading,
}) => {
  // Подготовка данных для диаграммы статусов recharts
  const chartData = [
    { name: 'Активные', value: active, color: '#10b981' },
    { name: 'Блокированные', value: suspended, color: '#ef4444' },
    { name: 'Grace-период', value: grace, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  return (
    <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-md text-zinc-50 rounded-xl">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Состояние базы доступа
        </CardTitle>
        <CardDescription className="text-zinc-500 text-[10px] uppercase tracking-wider">
          Соотношение активных и должников
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center">
        {isLoading ? (
          <div className="text-sm text-zinc-500 animate-pulse uppercase tracking-wider">Генерация диаграммы...</div>
        ) : chartData.length === 0 ? (
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Нет данных для отображения</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                itemStyle={{ color: '#fafafa' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
