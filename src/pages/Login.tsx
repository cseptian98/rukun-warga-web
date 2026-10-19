import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LogIn,
  Shield,
  ArrowLeft,
  Key,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DEMO_PERSONAS } from '@/contexts/AuthContext';
import { RoleName } from '@/types';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // Preset configuration for 1-click cards
  const presetCards = [
    {
      role: 'admin' as RoleName,
      persona: DEMO_PERSONAS.admin,
      title: 'Bapak Hartono',
      roleBadge: 'Ketua RW 05 / Admin',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      cardHover: 'hover:border-indigo-300 hover:shadow-indigo-100/50',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      description: 'Akses penuh administrasi kas RW, verifikasi tagihan air KSM, dan publikasi pengumuman.',
      credentialsHint: 'admin / admin123',
    },
    {
      role: 'treasurer' as RoleName,
      persona: DEMO_PERSONAS.treasurer,
      title: 'Ibu Ratna',
      roleBadge: 'Bendahara RW',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      cardHover: 'hover:border-amber-300 hover:shadow-amber-100/50',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      description: 'Akses pencatatan iuran warga, rekapitulasi buku kas, pencatatan pengeluaran, dan penagihan air.',
      credentialsHint: 'treasurer / bendahara123',
    },
    {
      role: 'resident' as RoleName,
      persona: DEMO_PERSONAS.resident,
      title: 'Mas Budi Santoso',
      roleBadge: 'Warga RT 02',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cardHover: 'hover:border-emerald-300 hover:shadow-emerald-100/50',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      description: 'Akses transparansi publik kas, status iuran pribadi KK, dan riwayat meter air warga.',
      credentialsHint: 'resident / warga123',
    },
  ];

  const handlePresetLogin = async (role: RoleName) => {
    setIsLoading(true);
    try {
      await login(role);
      const persona = DEMO_PERSONAS[role];
      toast.success(`Selamat datang, ${persona.name}!`, {
        description: `Berhasil masuk dengan peran ${role.toUpperCase()}.`,
      });
      navigate(destination, { replace: true });
    } catch (err: any) {
      toast.error('Gagal masuk: ' + (err?.message || 'Terjadi kesalahan sistem.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Silakan isi Email atau Username terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    try {
      await login({
        username: identifier.trim(),
        email: identifier.trim(),
        password: password,
      });
      toast.success('Login berhasil!', {
        description: 'Selamat datang kembali di Kampung Melati SuperApp.',
      });
      navigate(destination, { replace: true });
    } catch (err: any) {
      toast.error('Gagal masuk', {
        description: err?.message || 'Kredensial tidak valid. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-amber-200/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="pt-8 pb-4 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-white/80 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Kembali ke Portal
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sistem Otentikasi RW 05</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 relative z-10 flex flex-col justify-center my-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Portal Masuk Terpusat
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight"
          >
            Masuk ke <span className="text-indigo-600">Kampung Melati</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-2 text-sm sm:text-base font-medium"
          >
            Pilih persona pengujian cepat 1-klik di bawah ini atau masuk menggunakan kredensial terdaftar Anda.
          </motion.p>
        </div>

        {/* 1-Click Persona Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <span>⚡</span> Pilihan Cepat Persona Pengujian (1-Click Login)
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">Pilih salah satu peran</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {presetCards.map((preset) => (
              <motion.div
                key={preset.role}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs ${preset.cardHover} transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-inner">
                      {preset.persona.avatar || '👤'}
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${preset.badgeColor}`}
                    >
                      {preset.roleBadge}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-800 leading-tight">
                    {preset.persona.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {preset.persona.unitNumber} &bull; {preset.persona.email}
                  </p>

                  <p className="text-xs text-slate-600 mt-4 leading-relaxed font-normal bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <Button
                    onClick={() => handlePresetLogin(preset.role)}
                    disabled={isLoading}
                    className={`w-full font-bold rounded-2xl py-2.5 text-xs shadow-sm flex items-center justify-center gap-2 ${preset.btnColor}`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Masuk Cepat ({preset.title})
                  </Button>
                  <div className="text-[11px] text-center text-slate-400">
                    Kredensial: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">{preset.credentialsHint}</code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Standard Credential Form */}
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative">
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold text-slate-800">
                Masuk dengan Kredensial
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan email atau username terdaftar beserta kata sandi Anda.
              </p>
            </div>

            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email atau Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: admin atau rw05.hartono@kampungmelati.id"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl py-2.5 text-sm shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? 'Memproses...' : 'Masuk ke Sistem'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 relative z-10 border-t border-slate-200/50">
        &copy; 2026 Rukun Warga 05 &bull; Kampung Melati SuperApp &bull; Sistem Terpadu
      </footer>
    </div>
  );
}
