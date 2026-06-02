import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ChevronLeft, ChevronRight, Shield, Users } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, isOpen, onToggle }) => {
  // Получаем роль администратора
  const adminData = localStorage.getItem('admin_user');
  const admin = adminData ? JSON.parse(adminData) : { role: 'TECHNICIAN' };
  const isSuperAdmin = admin.role === 'SUPER_ADMIN';

  const menuItems = [
    {
      to: '/',
      label: 'Панель управления',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'TECHNICIAN'],
      end: true,
    },
    {
      to: '/subscribers',
      label: 'Список абонентов',
      icon: Users,
      roles: ['SUPER_ADMIN', 'TECHNICIAN'],
      end: true,
    },
    {
      to: '/subscribers/create',
      label: 'Добавить абонента',
      icon: UserPlus,
      roles: ['SUPER_ADMIN'],
      end: true,
    },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(admin.role));

  const handleLinkClick = () => {
    // При клике на ссылку на мобилках автоматически закрываем сайдбар
    if (window.innerWidth < 768) {
      onToggle(false);
    }
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-screen border-r border-neutral-900 bg-neutral-950/95 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between text-neutral-200 select-none",
        "w-64 md:w-16",
        isOpen ? "translate-x-0 md:w-64" : "-translate-x-full md:translate-x-0",
        className
      )}
    >
      <div className="flex flex-col gap-8 py-6 px-3">
        {/* Верхняя часть с логотипом */}
        <div className={cn("flex items-center justify-between px-2", !isOpen && "md:justify-center")}>
          {(isOpen || window.innerWidth < 768) ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold tracking-[0.2em] text-xs text-white uppercase">
                TOO-LINK BILLING
              </span>
            </div>
          ) : (
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>

        {/* Навигационное меню */}
        <nav className="flex flex-col gap-1.5">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3.5 px-3 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-white text-neutral-950 font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                      : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60"
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {(isOpen || window.innerWidth < 768) && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Нижняя часть с кнопкой сворачивания/закрытия */}
      <div className="p-3 border-t border-neutral-900/60 flex flex-col gap-4">
        {(isOpen || window.innerWidth < 768) && (
          <div className="flex items-center gap-2.5 px-2.5 py-1">
            <Shield className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold truncate">
                {isSuperAdmin ? 'Главный администратор' : 'Техник'}
              </span>
            </div>
          </div>
        )}
        <Button
          onClick={() => onToggle(!isOpen)}
          variant="outline"
          className="w-full flex items-center justify-center border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100 h-10 rounded-lg shrink-0 cursor-pointer"
        >
          {isOpen ? (
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <ChevronLeft className="w-4 h-4 md:block hidden shrink-0" />
              <span className="md:inline hidden">Свернуть</span>
              <span className="md:hidden block">Закрыть меню</span>
            </div>
          ) : (
            <ChevronRight className="w-4 h-4 shrink-0" />
          )}
        </Button>
      </div>
    </aside>
  );
};
