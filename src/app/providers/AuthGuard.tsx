import React from 'react';
import { Navigate } from 'react-router-dom';

/** Safely checks whether admin_user record exists in localStorage. */
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
 * Allows access only to authenticated users.
 * Redirects to /login when admin_user is absent from localStorage.
 */
export const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  if (!hasAdminUser()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/**
 * Allows access only to guests (unauthenticated users).
 * Redirects to / when admin_user is present in localStorage.
 */
export const PublicOnlyRoute: React.FC<GuardProps> = ({ children }) => {
  if (hasAdminUser()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
