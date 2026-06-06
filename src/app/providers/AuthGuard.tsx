import React from 'react';
import { Navigate } from 'react-router-dom';

/** Безопасно проверяет наличие записи admin_user в localStorage. */
function hasAdminUser(): boolean {
  try {
    const raw = localStorage.getItem('admin_user');
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    return parsed !== null && typeof parsed === 'object';
  } catch {
    return false;
  }
}

interface GuardProps {
  children: React.ReactNode;
}

/**
 * Предоставляет доступ только аутентифицированным пользователям.
 * Перенаправляет на /login, если admin_user отсутствует в localStorage.
 */
export const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  if (!hasAdminUser()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/**
 * Предоставляет доступ только гостям (неаутентифицированным пользователям).
 * Перенаправляет на /, если admin_user присутствует в localStorage.
 */
export const PublicOnlyRoute: React.FC<GuardProps> = ({ children }) => {
  if (hasAdminUser()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
