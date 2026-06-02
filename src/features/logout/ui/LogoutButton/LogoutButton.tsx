import React from 'react';
import { Button } from '@/shared/ui/button';
import { LogOut } from 'lucide-react';
import { useLogout } from '../../model/useLogout';

interface LogoutButtonProps {
  className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const { logout, isPending } = useLogout();

  return (
    <Button
      onClick={() => logout()}
      disabled={isPending}
      variant="outline"
      size="default"
      className={`flex items-center gap-2 border-red-950/40 hover:bg-red-950/20 text-red-400 font-medium cursor-pointer ${className}`}
    >
      <LogOut className="w-4 h-4" />
      <span>{isPending ? 'Выход...' : 'Выйти'}</span>
    </Button>
  );
};
