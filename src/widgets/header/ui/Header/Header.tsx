import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { LogoutButton } from '@/features/logout';
import { Shield, RefreshCw, UserPlus } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing }) => {
  const navigate = useNavigate();
  // Получаем данные админа из localStorage
  const adminData = localStorage.getItem('admin_user');
  const admin = adminData ? JSON.parse(adminData) : { username: 'Admin', role: 'TECHNICIAN', fullName: 'Администратор' };

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-900 pb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            {admin.role === 'SUPER_ADMIN' ? 'Главный администратор' : 'Техник'}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Панель управления Too-Link</h1>
        <p className="text-sm text-neutral-400">
          Приветствуем, <span className="text-neutral-200 font-semibold">{admin.fullName}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {admin.role === 'SUPER_ADMIN' && (
          <Button
            onClick={() => navigate('/subscribers/create')}
            className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs h-9 px-4 rounded-sm cursor-pointer transition-all active:scale-[0.99]"
          >
            <UserPlus className="w-4 h-4" />
            Добавить абонента
          </Button>
        )}
        <Button
          onClick={onRefresh}
          variant="outline"
          size="default"
          disabled={isRefreshing}
          className="flex items-center gap-2 border-neutral-800 hover:bg-neutral-900 text-neutral-300 font-medium cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
        <LogoutButton />
      </div>
    </header>
  );
};
