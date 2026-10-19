import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface UserNavProps {
  className?: string;
}

export function UserNav({ className = '' }: UserNavProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Anda telah keluar dari sistem.', { id: 'logout-toast' });
    navigate('/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link to="/login">
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-sm transition-all text-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </Button>
        </Link>
      </div>
    );
  }

  const roleConfigs: Record<string, { label: string; badgeClass: string }> = {
    admin: {
      label: 'Ketua RW (Admin)',
      badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    treasurer: {
      label: 'Bendahara RW',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    resident: {
      label: 'Warga RW 05',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  };

  const currentRoleConfig = roleConfigs[user.role] || {
    label: user.role,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div
      className={`flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs ${className}`}
    >
      {/* User Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-lg select-none shadow-inner">
          {user.avatar || '👤'}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">
            {user.name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${currentRoleConfig.badgeClass}`}
            >
              {currentRoleConfig.label}
            </span>
          </div>
        </div>
      </div>

      <div className="h-5 w-px bg-slate-200 mx-0.5" />

      {/* Logout Action */}
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl px-2.5 py-1 text-xs font-bold transition-all flex items-center gap-1.5"
        title="Keluar dari sesi ini"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Keluar</span>
      </Button>
    </div>
  );
}
