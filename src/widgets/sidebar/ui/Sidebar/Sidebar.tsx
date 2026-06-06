import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ChevronLeft, ChevronRight, Shield, Users } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAdmin } from '@/entities/admin';
import type { Admin } from '@/entities/admin';
import { cn } from '@/shared/lib/utils';

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

interface MenuItem {
  to: string;
  label: string;
  icon: React.ElementType;
  roles: Admin['role'][];
  end: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, isOpen, onToggle }) => {
  const admin = useAdmin();
  const isSuperAdmin = admin.role === 'SUPER_ADMIN';

  const menuItems: MenuItem[] = [
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

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(admin.role));

  const handleLinkClick = () => {
    // On mobile, close sidebar on nav link click
    if (window.innerWidth < 768) {
      onToggle(false);
    }
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-50 h-screen border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between text-sidebar-foreground select-none',
        'w-[270px] md:w-16',
        isOpen ? 'translate-x-0 md:w-[270px]' : '-translate-x-full md:translate-x-0',
        className
      )}
    >
      <div className="flex flex-col gap-8 py-6 px-3">
        {/* Logo area */}
        <div className={cn('flex items-center justify-between px-2', !isOpen && 'md:justify-center')}>
          {(isOpen || window.innerWidth < 768) ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold tracking-[0.2em] text-xs text-foreground uppercase">
                TOO-LINK BILLING
              </span>
            </div>
          ) : (
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>

        {/* Navigation */}
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
                    'flex items-center gap-3.5 px-3 py-3 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                      : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/60'
                  )
                }
              >
                <Icon className="w-3 h-3 shrink-0" />
                {(isOpen || window.innerWidth < 768) && <span className="truncate text-[12px]">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: role badge + collapse button */}
      <div className="p-3 border-t border-sidebar-border flex flex-col gap-4">
        {(isOpen || window.innerWidth < 768) && (
          <div className="flex items-center gap-2.5 px-2.5 py-1">
            <Shield className="w-3 h-3 text-muted-foreground shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] uppercase tracking-wider text-muted-foreground font-bold truncate">
                {isSuperAdmin ? 'Главный администратор' : 'Техник'}
              </span>
            </div>
          </div>
        )}
        <Button
          onClick={() => onToggle(!isOpen)}
          variant="outline"
          className="w-full flex items-center justify-center border-sidebar-border hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground h-10 rounded-lg shrink-0 cursor-pointer"
        >
          {isOpen ? (
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider">
              <ChevronLeft className="w-3 h-3 md:block hidden shrink-0" />
              <span className="md:inline hidden">Свернуть</span>
              <span className="md:hidden block">Закрыть меню</span>
            </div>
          ) : (
            <ChevronRight className="w-3 h-3 shrink-0" />
          )}
        </Button>
      </div>
    </aside>
  );
};
