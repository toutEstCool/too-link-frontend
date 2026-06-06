import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { useLogout } from '@/features/logout';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useAdmin } from '@/entities/admin';
import { Shield, RefreshCw, UserPlus, Sun, Moon, Monitor, ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface HeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
  showBackButton?: boolean;
  hideAddButton?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  hideAddButton = false,
  onRefresh,
  isRefreshing = false,
}) => {
  const navigate = useNavigate();
  const { logout, isPending } = useLogout();
  const admin = useAdmin();
  const { theme, setTheme } = useTheme();

  // Состояние открытия выпадающего списка
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Закрытие выпадающего списка при клике вовне
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 relative">
      <div className="flex flex-row items-center gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-border hover:bg-muted text-foreground gap-2 text-xs uppercase tracking-wider font-bold h-9 px-3.5 rounded-lg cursor-pointer flex items-center"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Назад
          </Button>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              {admin.role === 'SUPER_ADMIN' ? 'Главный администратор' : 'Техник'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-brand">{title || 'Панель управления Too-Link'}</h1>
          <p className="text-sm text-muted-foreground">
            {subtitle || (
              <>
                Приветствуем, <span className="text-foreground font-semibold">{admin.fullName}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center">
        {admin.role === 'SUPER_ADMIN' && !hideAddButton && (
          <Button
            onClick={() => navigate('/subscribers/create')}
            className="flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-bold uppercase tracking-wider text-[11px] h-9 px-4 rounded-lg cursor-pointer transition-all active:scale-[0.99]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Добавить абонента
          </Button>
        )}

        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            size="default"
            disabled={isRefreshing}
            className="flex items-center gap-2 border-border hover:bg-muted text-foreground font-medium h-9 px-4 rounded-lg cursor-pointer text-[12px]"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
            <span>Обновить</span>
          </Button>
        )}

        {/* Выпадающее меню профиля и аватара */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative w-9 h-9 rounded-full overflow-hidden border border-border focus:outline-none hover:ring-2 hover:ring-indigo-500/50 transition-all cursor-pointer select-none flex items-center justify-center bg-muted"
            aria-label="Профиль"
          >
            {/* Градиентный аватар с инициалами в качестве заглушки */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-72 rounded-xl bg-card border border-border p-3 shadow-xl z-50 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Информация профиля */}
              <div className="flex flex-col gap-0.5">
                <div className="text-sm font-semibold text-foreground">
                  Привет, {admin.fullName ? admin.fullName.split(' ')[0] : 'Администратор'}!
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {admin.username || 'admin'}@too-link.ru
                </div>
              </div>

              <div className="h-px bg-border -mx-3" />

              {/* Переключатель темы */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Тема</span>
                <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'p-1.5 rounded-md transition-all cursor-pointer',
                      theme === 'light' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                    title="Светлая тема"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'p-1.5 rounded-md transition-all cursor-pointer',
                      theme === 'dark' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                    title="Темная тема"
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={cn(
                      'p-1.5 rounded-md transition-all cursor-pointer',
                      theme === 'system' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                    title="Системная тема"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="h-px bg-border -mx-3" />

              {/* Выход из системы */}
              <button
                onClick={() => logout()}
                disabled={isPending}
                className="w-full text-left text-sm font-semibold text-red-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50 py-1"
              >
                {isPending ? 'Выход...' : 'Выйти'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
