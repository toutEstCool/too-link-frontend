import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { Button } from '@/shared/ui/button';
import { 
  Users, 
  CreditCard, 
  Activity, 
  LogOut, 
  Shield, 
  RefreshCw, 
  TrendingUp,
  Radio
} from 'lucide-react';

interface DashboardStats {
  subscribers: {
    total: number;
    active: number;
    suspended: number;
    grace: number;
  };
  financials: {
    currentPoolSom: number;
    totalCollectedSom: number;
  };
  network: {
    activeSessions: number;
  };
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Получаем данные админа из localStorage
  const adminData = localStorage.getItem('admin_user');
  const admin = adminData ? JSON.parse(adminData) : { username: 'Admin', role: 'TECHNICIAN', fullName: 'Администратор' };

  // Используем React Query useQuery для получения статистики
  const { 
    data: stats, 
    isLoading, 
    error, 
    refetch, 
    isFetching 
  } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    },
    refetchOnWindowFocus: false, // Отключаем автоматический рефетч при фокусе окна для стабильности
  });

  const handleLogout = async () => {
    try {
      // Отправляем запрос на логаут для удаления HttpOnly куки
      await api.post('/admin/auth/logout');
    } catch (err) {
      console.error('Ошибка при выходе из системы на бэкенде:', err);
    } finally {
      // В любом случае чистим локальные данные и перенаправляем на вход
      localStorage.removeItem('admin_user');
      navigate('/login', { replace: true });
    }
  };

  const apiError = error ? ((error as any).response?.data?.error || 'Не удалось загрузить данные дашборда') : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans p-6 relative overflow-hidden">
      {/* Световые эффекты заднего плана */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Шапка дашборда */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                {admin.role === 'SUPER_ADMIN' ? 'Главный администратор' : 'Техник'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Панель управления Too-Link</h1>
            <p className="text-sm text-neutral-400">Приветствуем, <span className="text-neutral-200 font-semibold">{admin.fullName}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="default"
              disabled={isLoading || isFetching}
              className="flex items-center gap-2 border-neutral-800 hover:bg-neutral-900 text-neutral-300 font-medium cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="default"
              className="flex items-center gap-2 border-red-950/40 hover:bg-red-950/20 text-red-400 font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </header>

        {/* Секция ошибок при загрузке */}
        {apiError && (
          <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 flex items-center justify-between text-sm text-red-400">
            <span>{apiError}</span>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="border-red-900/50 hover:bg-red-950/40">
              Повторить попытку
            </Button>
          </div>
        )}

        {/* Главная сетка метрик */}
        {isLoading && !stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-neutral-900/40 border border-neutral-900 rounded-xl" />
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Карточки верхнего уровня */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Карточка: Абоненты */}
              <div className="backdrop-blur-md bg-neutral-900/40 border border-neutral-900 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-neutral-800/80">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Всего Абонентов</p>
                    <h3 className="text-3xl font-extrabold text-neutral-100">{stats.subscribers.total}</h3>
                  </div>
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 border-t border-neutral-900/60 pt-4">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Активные: {stats.subscribers.active}</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Grace: {stats.subscribers.grace}</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Приостановлено: {stats.subscribers.suspended}</span>
                </div>
              </div>

              {/* Карточка: Финансы */}
              <div className="backdrop-blur-md bg-neutral-900/40 border border-neutral-900 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-neutral-800/80">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Собрано Кассы</p>
                    <h3 className="text-3xl font-extrabold text-neutral-100">{stats.financials.totalCollectedSom.toLocaleString()} сом</h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-900/60 pt-4">
                  <span>Текущий баланс пула:</span>
                  <span className="font-semibold text-neutral-200">{stats.financials.currentPoolSom.toLocaleString()} сом</span>
                </div>
              </div>

              {/* Карточка: Сеть */}
              <div className="backdrop-blur-md bg-neutral-900/40 border border-neutral-900 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-neutral-800/80">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Сетевые Сессии</p>
                    <h3 className="text-3xl font-extrabold text-neutral-100">{stats.network.activeSessions} сессий</h3>
                  </div>
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 border-t border-neutral-900/60 pt-4">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Стабильная интеграция с RADIUS-сервером</span>
                </div>
              </div>

            </div>

            {/* Дополнительный блок визуализации */}
            <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-neutral-100">Мониторинг Статуса Сети</h3>
                  <p className="text-xs text-neutral-400">Синхронизация RADIUS БД и IPTV биллинга</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  Active Sync
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-900 flex flex-col justify-between h-24">
                  <span className="text-xs text-neutral-400">Starlink API</span>
                  <span className="text-sm font-semibold text-neutral-200">Подключено (Ok)</span>
                </div>
                <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-900 flex flex-col justify-between h-24">
                  <span className="text-xs text-neutral-400">Finik.kg Webhook</span>
                  <span className="text-sm font-semibold text-neutral-200">Идемпотентный (Слушает)</span>
                </div>
                <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-900 flex flex-col justify-between h-24">
                  <span className="text-xs text-neutral-400">IPTV Billing Engine</span>
                  <span className="text-sm font-semibold text-neutral-200">Cron 00:00 (Активен)</span>
                </div>
                <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-900 flex flex-col justify-between h-24">
                  <span className="text-xs text-neutral-400">Database Adapter</span>
                  <span className="text-sm font-semibold text-neutral-200">Prisma Client (Pooling)</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-neutral-400">
            Нет данных для отображения. Обновите страницу.
          </div>
        )}

      </div>
    </div>
  );
};
