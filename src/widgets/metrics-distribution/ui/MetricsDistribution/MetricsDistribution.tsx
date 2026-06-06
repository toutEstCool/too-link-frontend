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
    { name: 'Активные', value: active, fill: 'var(--color-success)' },
    { name: 'Блокированные', value: suspended, fill: 'var(--color-destructive)' },
    { name: 'Grace-период', value: grace, fill: 'var(--color-warning)' },
  ].filter(item => item.value > 0);

  return (
    <Card className="border-border bg-card/40 backdrop-blur-md text-foreground rounded-xl">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Состояние базы доступа
        </CardTitle>
        <CardDescription className="text-muted-foreground text-[10px] uppercase tracking-wider">
          Соотношение активных и должников
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center">
        {isLoading ? (
          <div className="text-sm text-muted-foreground animate-pulse uppercase tracking-wider">Генерация диаграммы...</div>
        ) : chartData.length === 0 ? (
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Нет данных для отображения</div>
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
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
