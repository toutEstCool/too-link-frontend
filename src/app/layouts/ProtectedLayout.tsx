import React, { useState } from 'react';
import { Sidebar } from '@/widgets/sidebar';
import { cn } from '@/shared/lib/utils';
import { Menu } from 'lucide-react';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    // On mobile default to closed; on desktop restore persisted value
    if (window.innerWidth < 768) {
      return false;
    }
    const saved = localStorage.getItem('sidebar-open');
    return saved !== null ? (JSON.parse(saved) as boolean) : true;
  });

  const handleToggleSidebar = (open: boolean): void => {
    setIsSidebarOpen(open);
    if (window.innerWidth >= 768) {
      localStorage.setItem('sidebar-open', JSON.stringify(open));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile top bar with burger button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/90 border-b border-border backdrop-blur-xl flex items-center justify-between px-4 z-40">
        <button
          onClick={() => handleToggleSidebar(true)}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
          aria-label="Открыть меню"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-[0.2em] text-[11px] text-foreground uppercase">
            TOO-LINK BILLING
          </span>
        </div>
        <div className="w-6" />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/65 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => handleToggleSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />

      {/* Main content */}
      <div
        className={cn(
          'flex-1 min-w-0 min-h-screen transition-all duration-300 relative z-10 pt-16 md:pt-0 pl-0 md:pl-16',
          isSidebarOpen && 'md:pl-[270px]',
        )}
      >
        {children}
      </div>
    </div>
  );
};
