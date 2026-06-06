import { useMemo } from 'react';
import type { Admin } from './types';

const DEFAULT_ADMIN: Admin = {
  id: '',
  username: 'admin',
  fullName: 'Администратор',
  role: 'TECHNICIAN',
};

function parseAdmin(raw: string | null): Admin {
  if (!raw) return DEFAULT_ADMIN;
  try {
    const parsed = JSON.parse(raw) as Admin;
    // Basic type-guard: ensure required shape is present
    if (typeof parsed.role !== 'string') return DEFAULT_ADMIN;
    return parsed;
  } catch {
    return DEFAULT_ADMIN;
  }
}

export function useAdmin(): Admin {
  return useMemo(
    () => parseAdmin(localStorage.getItem('admin_user')),
    // Note: localStorage is read once on mount (no reactivity needed for session data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}
