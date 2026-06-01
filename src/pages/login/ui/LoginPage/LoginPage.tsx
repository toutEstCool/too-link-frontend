import React from 'react';
import { LoginForm } from '@/features/auth-by-username';

export const LoginPage: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans p-4">
      {/* Фоновое изображение со спутниковой тарелкой в горах */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="/mountain_satellite_bg.png" 
          alt="Satellite dish in the mountains" 
          className="w-full h-full object-cover opacity-35 scale-105 animate-[pulse_10s_infinite_alternate]"
        />
        {/* Комбинированные градиенты для эффекта глубины и легкой читаемости */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/30 to-neutral-950/90" />
      </div>

      {/* Дополнительные фоновые свечения в стиле Glassmorphism */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-md z-10">
        <LoginForm />
      </div>
    </div>
  );
};
