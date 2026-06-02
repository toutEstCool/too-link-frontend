import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/pages/login';
import { DashboardPage } from '@/pages/dashboard';
import CreateSubscriberPage from '@/pages/create-subscriber';
import SubscribersPage from '@/pages/subscribers';
import { Sidebar } from '@/widgets/sidebar';
import { cn } from '@/shared/lib/utils';
import { Menu } from 'lucide-react';


// Создаем инстанс QueryClient для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Предотвращает автоматический перезапрос при переключении вкладок/страниц
    }
  }
});

// Компонент защиты роутов на клиенте
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasUser = !!localStorage.getItem('admin_user');
  
  if (!hasUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Компонент для доступных только гостям роутов (например, страница логина)
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasUser = !!localStorage.getItem('admin_user');
  
  if (hasUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Компонент общего макета для авторизованных страниц с боковой панелью
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-open');
    // На мобильных по умолчанию закрыт, на десктопе берется сохраненное значение
    if (window.innerWidth < 768) {
      return false;
    }
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleToggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    if (window.innerWidth >= 768) {
      localStorage.setItem('sidebar-open', JSON.stringify(open));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans flex relative overflow-hidden">
      {/* Световые эффекты заднего плана */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Верхний мобильный бар с кнопкой бургера */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-950/90 border-b border-neutral-900/60 backdrop-blur-xl flex items-center justify-between px-4 z-40">
        <button
          onClick={() => handleToggleSidebar(true)}
          className="p-2 -ml-2 text-neutral-400 hover:text-neutral-100 focus:outline-none cursor-pointer"
          aria-label="Открыть меню"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-[0.2em] text-[11px] text-white uppercase">
            TOO-LINK BILLING
          </span>
        </div>
        <div className="w-6" />
      </div>

      {/* Оверлей для мобильного сайдбара */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => handleToggleSidebar(false)}
        />
      )}

      {/* Сайдбар */}
      <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />

      {/* Основной контент */}
      <div 
        className={cn(
          "flex-1 min-w-0 min-h-screen transition-all duration-300 relative z-10 pt-16 md:pt-0 pl-0 md:pl-16",
          isSidebarOpen && "md:pl-64"
        )}
      >
        {children}
      </div>
    </div>
  );
};


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <DashboardPage />
                </ProtectedLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscribers" 
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <SubscribersPage />
                </ProtectedLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscribers/create" 
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <CreateSubscriberPage />
                </ProtectedLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
