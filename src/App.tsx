import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Receipt,
  User,
  Shield,
  CreditCard,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Transaction, ResidentDue, TreasurySummary } from '@/types';

import Portal from './pages/Portal';
import WaterSystem from './pages/WaterSystem';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import { UserNav } from '@/components/UserNav';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const INITIAL_SUMMARY: TreasurySummary = {
  kasRwBalance: 42750000,
  monthlyInflow: 8450000,
  monthlyOutflow: 3200000,
  duesComplianceRate: 91.5,
  totalResidents: 64,
  paidResidentsCount: 58,
  pendingDuesCount: 6,
  lastUpdated: '12 Okt 2026, 10:00 WIB',
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    transactionNumber: 'TRX-202610-001',
    date: '2026-10-11',
    type: 'dues',
    direction: 'income',
    category: 'Iuran Bulanan',
    amount: 150000,
    status: 'completed',
    description: 'Iuran RW 05 periode Oktober 2026',
    residentName: 'Mas Budi Santoso (Blok C2 No. 08)',
    recordedBy: 'Ibu Ratna (Bendahara RW)',
    paymentMethod: 'Transfer BCA',
    month: 'Oktober 2026',
  },
  {
    id: 'tx-002',
    transactionNumber: 'TRX-202610-002',
    date: '2026-10-10',
    type: 'expenditure',
    direction: 'expense',
    category: 'Keamanan',
    amount: 1200000,
    status: 'completed',
    description: 'Honor 4 Petugas Satpam & Ronda Malam RW 05',
    recordedBy: 'Bapak Hartono (Ketua RW 05)',
    paymentMethod: 'Tunai',
  },
  {
    id: 'tx-003',
    transactionNumber: 'TRX-202610-003',
    date: '2026-10-09',
    type: 'water_billing',
    direction: 'income',
    category: 'Tagihan Air KSM',
    amount: 2450000,
    status: 'completed',
    description: 'Setoran Kolektif Tagihan Air KSM Suka Jernih RW 05',
    recordedBy: 'Ibu Ratna (Bendahara RW)',
    paymentMethod: 'Transfer Mandiri',
    month: 'Oktober 2026',
  },
  {
    id: 'tx-004',
    transactionNumber: 'TRX-202610-004',
    date: '2026-10-08',
    type: 'expenditure',
    direction: 'expense',
    category: 'Kebersihan',
    amount: 850000,
    status: 'completed',
    description: 'Biaya Pengangkutan Sampah & Pengelolaan TPS Melati',
    recordedBy: 'Ibu Ratna (Bendahara RW)',
    paymentMethod: 'Transfer BCA',
  },
  {
    id: 'tx-005',
    transactionNumber: 'TRX-202610-005',
    date: '2026-10-07',
    type: 'expenditure',
    direction: 'expense',
    category: 'Perbaikan Fasilitas',
    amount: 650000,
    status: 'completed',
    description: 'Perbaikan Lampu PJU Blok B dan Pengecatan Pos Satpam',
    recordedBy: 'Bapak Hartono (Ketua RW 05)',
    paymentMethod: 'Tunai',
  },
  {
    id: 'tx-006',
    transactionNumber: 'TRX-202610-006',
    date: '2026-10-05',
    type: 'dues',
    direction: 'income',
    category: 'Iuran Bulanan',
    amount: 150000,
    status: 'completed',
    description: 'Iuran RW 05 periode Oktober 2026',
    residentName: 'Ibu Siti Aminah (Blok A3 No. 04)',
    recordedBy: 'Ibu Ratna (Bendahara RW)',
    paymentMethod: 'QRIS',
    month: 'Oktober 2026',
  },
  {
    id: 'tx-007',
    transactionNumber: 'TRX-202610-007',
    date: '2026-10-04',
    type: 'dues',
    direction: 'income',
    category: 'Iuran Bulanan',
    amount: 150000,
    status: 'completed',
    description: 'Iuran RW 05 periode Oktober 2026',
    residentName: 'Pak Joko Susilo (Blok B1 No. 07)',
    recordedBy: 'Ibu Ratna (Bendahara RW)',
    paymentMethod: 'Tunai',
    month: 'Oktober 2026',
  },
  {
    id: 'tx-008',
    transactionNumber: 'TRX-202610-008',
    date: '2026-10-02',
    type: 'other_income',
    direction: 'income',
    category: 'Donasi Swadaya',
    amount: 500000,
    status: 'completed',
    description: 'Donasi Swadaya Warga untuk Pengadaan Tempat Sampah Terpilah',
    recordedBy: 'Bapak Hartono (Ketua RW 05)',
    paymentMethod: 'Transfer BCA',
  },
];

const INITIAL_RESIDENT_DUES: ResidentDue[] = [
  {
    id: 'res-01',
    residentName: 'Mas Budi Santoso',
    unitNumber: 'Blok C2 No. 08',
    monthlyDuesAmount: 150000,
    status: 'paid',
    lastPaymentDate: '2026-10-11',
    arrearsMonths: 0,
    totalArrears: 0,
    phone: '+62 856-1122-3344',
    period: 'Oktober 2026',
  },
  {
    id: 'res-02',
    residentName: 'Ibu Siti Aminah',
    unitNumber: 'Blok A3 No. 04',
    monthlyDuesAmount: 150000,
    status: 'paid',
    lastPaymentDate: '2026-10-05',
    arrearsMonths: 0,
    totalArrears: 0,
    phone: '+62 812-4455-6677',
    period: 'Oktober 2026',
  },
  {
    id: 'res-03',
    residentName: 'Pak Joko Susilo',
    unitNumber: 'Blok B1 No. 07',
    monthlyDuesAmount: 150000,
    status: 'paid',
    lastPaymentDate: '2026-10-04',
    arrearsMonths: 0,
    totalArrears: 0,
    phone: '+62 818-7788-9900',
    period: 'Oktober 2026',
  },
  {
    id: 'res-04',
    residentName: 'Ir. Hendra Wijaya',
    unitNumber: 'Blok A1 No. 05',
    monthlyDuesAmount: 150000,
    status: 'paid',
    lastPaymentDate: '2026-10-02',
    arrearsMonths: 0,
    totalArrears: 0,
    phone: '+62 811-2233-4455',
    period: 'Oktober 2026',
  },
  {
    id: 'res-05',
    residentName: 'Agus Pratama',
    unitNumber: 'Blok B2 No. 10',
    monthlyDuesAmount: 150000,
    status: 'unpaid',
    arrearsMonths: 1,
    totalArrears: 150000,
    phone: '+62 878-3344-5566',
    period: 'Oktober 2026',
  },
  {
    id: 'res-06',
    residentName: 'Dewi Lestari',
    unitNumber: 'Blok C1 No. 03',
    monthlyDuesAmount: 150000,
    status: 'overdue',
    arrearsMonths: 2,
    totalArrears: 300000,
    phone: '+62 821-6677-8899',
    period: 'September - Oktober 2026',
  },
];

export function TreasuryDashboard() {
  const { user } = useAuth();
  const { can, isAdmin, isTreasurer, isResident } = usePermission();

  const canWrite = can('treasury:write');

  const [summary, setSummary] = useState<TreasurySummary>(INITIAL_SUMMARY);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [residentDues, setResidentDues] = useState<ResidentDue[]>(INITIAL_RESIDENT_DUES);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'dues'>('all');

  // Modals
  const [isDuesModalOpen, setIsDuesModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form states - Catat Iuran
  const [duesForm, setDuesForm] = useState({
    residentName: '',
    unitNumber: '',
    amount: '150000',
    month: 'Oktober 2026',
    paymentMethod: 'Transfer BCA',
    notes: '',
  });

  // Form states - Catat Pengeluaran
  const [expenseForm, setExpenseForm] = useState({
    category: 'Keamanan',
    amount: '',
    description: '',
    paymentMethod: 'Transfer BCA',
    recipient: '',
  });

  // Handlers for recording transactions
  const handleSaveDues = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      toast.error('Akses Ditolak: Hanya Admin atau Bendahara yang dapat mencatat iuran.');
      return;
    }
    const numAmount = parseFloat(duesForm.amount) || 0;
    if (!duesForm.residentName || numAmount <= 0) {
      toast.error('Mohon isi nama warga dan nominal dengan benar.');
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'dues',
      direction: 'income',
      category: 'Iuran Bulanan',
      amount: numAmount,
      status: 'completed',
      description: `Iuran RW 05 periode ${duesForm.month} (${duesForm.notes || 'Lunas'})`,
      residentName: `${duesForm.residentName} (${duesForm.unitNumber || 'Blok C'})`,
      recordedBy: user?.name || 'Petugas RW',
      paymentMethod: duesForm.paymentMethod,
      month: duesForm.month,
    };

    setTransactions([newTx, ...transactions]);

    // Update financial summary
    setSummary((prev) => ({
      ...prev,
      kasRwBalance: prev.kasRwBalance + numAmount,
      monthlyInflow: prev.monthlyInflow + numAmount,
      paidResidentsCount: (prev.paidResidentsCount || 0) + 1,
      pendingDuesCount: Math.max(0, (prev.pendingDuesCount || 1) - 1),
      duesComplianceRate: Math.min(100, Math.round((((prev.paidResidentsCount || 0) + 1) / (prev.totalResidents || 64)) * 1000) / 10),
    }));

    // Mark resident as paid if matches
    setResidentDues((prev) =>
      prev.map((r) => {
        if (
          r.residentName.toLowerCase().includes(duesForm.residentName.toLowerCase()) ||
          (duesForm.unitNumber && r.unitNumber.toLowerCase().includes(duesForm.unitNumber.toLowerCase()))
        ) {
          return {
            ...r,
            status: 'paid',
            lastPaymentDate: new Date().toISOString().split('T')[0],
            arrearsMonths: 0,
            totalArrears: 0,
          };
        }
        return r;
      })
    );

    setIsDuesModalOpen(false);
    setDuesForm({
      residentName: '',
      unitNumber: '',
      amount: '150000',
      month: 'Oktober 2026',
      paymentMethod: 'Transfer BCA',
      notes: '',
    });
    toast.success(`Pembayaran iuran dari ${duesForm.residentName} berhasil dicatat.`);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      toast.error('Akses Ditolak: Hanya Admin atau Bendahara yang dapat mencatat pengeluaran.');
      return;
    }
    const numAmount = parseFloat(expenseForm.amount) || 0;
    if (!expenseForm.description || numAmount <= 0) {
      toast.error('Mohon lengkapi deskripsi dan nominal pengeluaran.');
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'expenditure',
      direction: 'expense',
      category: expenseForm.category,
      amount: numAmount,
      status: 'completed',
      description: expenseForm.description,
      recordedBy: user?.name || 'Petugas RW',
      paymentMethod: expenseForm.paymentMethod,
    };

    setTransactions([newTx, ...transactions]);

    // Update financial summary
    setSummary((prev) => ({
      ...prev,
      kasRwBalance: prev.kasRwBalance - numAmount,
      monthlyOutflow: prev.monthlyOutflow + numAmount,
    }));

    setIsExpenseModalOpen(false);
    setExpenseForm({
      category: 'Keamanan',
      amount: '',
      description: '',
      paymentMethod: 'Transfer BCA',
      recipient: '',
    });
    toast.success(`Pengeluaran sebesar ${formatRupiah(numAmount)} berhasil dicatat.`);
  };

  const handleMarkResidentPaid = (resident: ResidentDue) => {
    if (!canWrite) {
      toast.error('Akses Ditolak: Hanya Admin atau Bendahara.');
      return;
    }

    setResidentDues((prev) =>
      prev.map((r) =>
        r.id === resident.id
          ? {
              ...r,
              status: 'paid',
              lastPaymentDate: new Date().toISOString().split('T')[0],
              arrearsMonths: 0,
              totalArrears: 0,
            }
          : r
      )
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'dues',
      direction: 'income',
      category: 'Iuran Bulanan',
      amount: resident.monthlyDuesAmount,
      status: 'completed',
      description: `Pelunasan iuran ${resident.period || 'Oktober 2026'}`,
      residentName: `${resident.residentName} (${resident.unitNumber})`,
      recordedBy: user?.name || 'Petugas RW',
      paymentMethod: 'Transfer Tunai / Cepat',
      month: resident.period || 'Oktober 2026',
    };

    setTransactions((prev) => [newTx, ...prev]);

    setSummary((prev) => ({
      ...prev,
      kasRwBalance: prev.kasRwBalance + resident.monthlyDuesAmount,
      monthlyInflow: prev.monthlyInflow + resident.monthlyDuesAmount,
      paidResidentsCount: (prev.paidResidentsCount || 0) + 1,
      pendingDuesCount: Math.max(0, (prev.pendingDuesCount || 1) - 1),
    }));

    toast.success(`Iuran untuk ${resident.residentName} ditandai lunas.`);
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const baseTransactions = !canWrite
      ? transactions.filter(
          (tx) =>
            tx.type === 'dues' &&
            (tx.residentName?.toLowerCase().includes('budi') ||
              (user?.name && tx.residentName?.toLowerCase().includes(user.name.toLowerCase())) ||
              tx.residentName?.toLowerCase().includes('c2 no. 08'))
        )
      : transactions;

    return baseTransactions.filter((tx) => {
      if (filterType === 'income' && tx.direction !== 'income') return false;
      if (filterType === 'expense' && tx.direction !== 'expense') return false;
      if (filterType === 'dues' && tx.type !== 'dues') return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchDesc = tx.description?.toLowerCase().includes(query);
        const matchCategory = tx.category?.toLowerCase().includes(query);
        const matchResident = tx.residentName?.toLowerCase().includes(query);
        const matchRecorded = tx.recordedBy?.toLowerCase().includes(query);
        return matchDesc || matchCategory || matchResident || matchRecorded;
      }

      return true;
    });
  }, [transactions, filterType, searchQuery, canWrite, user]);

  // Current logged in resident's personal dues record
  const currentResidentDue = useMemo(() => {
    return residentDues.find((r) => r.residentName.includes('Budi Santoso')) || residentDues[0];
  }, [residentDues]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900 pb-16">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[350px] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[300px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Portal
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl text-white shadow-md shadow-amber-200">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">
                  Kas &amp; Iuran <span className="text-amber-600 font-extrabold">RW 05</span>
                </h1>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Kampung Melati SuperApp &bull; Treasury Module
                </p>
              </div>
            </div>
          </div>

          {/* Global User Status & Logout */}
          <UserNav />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 space-y-8 flex-1">
        {/* Banner with Active Persona Context */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl border border-slate-200/60 shadow-inner">
              {user?.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-800">{user?.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-indigo-100 text-indigo-700'
                      : isTreasurer
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">
                {user?.unitNumber} &bull; {user?.email}
              </p>
            </div>
          </div>

          {/* Conditional Admin Action Buttons (only visible with treasury:write) */}
          {canWrite ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setIsDuesModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 px-5 py-2.5"
              >
                <Plus className="w-4 h-4" />
                Catat Iuran Warga
              </Button>
              <Button
                onClick={() => setIsExpenseModalOpen(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 px-5 py-2.5"
              >
                <Receipt className="w-4 h-4" />
                Catat Pengeluaran
              </Button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-2 rounded-2xl border border-emerald-200/80">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Akses Warga: Transparansi publik aktif. Pencatatan transaksi dibatasi untuk Pengurus RW.</span>
            </div>
          )}
        </div>

        {/* Financial Metrics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Saldo Kas RW */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Saldo Kas RW
              </span>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
              {formatRupiah(summary.kasRwBalance)}
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Surplus Kas Terkelola Aman</span>
            </div>
          </div>

          {/* Pemasukan Bulan Ini */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pemasukan Bulan Ini
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
              {formatRupiah(summary.monthlyInflow)}
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-slate-500 gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{summary.paidResidentsCount} KK telah membayar</span>
            </div>
          </div>

          {/* Pengeluaran Bulan Ini */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-rose-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pengeluaran Bulan Ini
              </span>
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
              {formatRupiah(summary.monthlyOutflow)}
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-slate-500 gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-rose-500" />
              <span>Keamanan, Kebersihan &amp; PJU</span>
            </div>
          </div>

          {/* Tingkat Kepatuhan Iuran */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tingkat Kepatuhan Iuran
              </span>
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
              {summary.duesComplianceRate}%
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${summary.duesComplianceRate}%` }}
              />
            </div>
          </div>
        </section>

        {/* Section: Resident Personal Dues (For Resident) or Full Management (For Admin/Treasurer) */}
        {!canWrite ? (
          /* Resident Personal View */
          <section className="bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-200/70 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-emerald-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white p-1.5 rounded-xl">
                    <User className="w-4 h-4" />
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    Status Iuran Anda ({currentResidentDue.period || 'Oktober 2026'})
                  </h3>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  Transparansi status kepatuhan iuran RW pribadi untuk kepala keluarga terdaftar.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {currentResidentDue.status === 'paid' ? 'LUNAS (Terverifikasi)' : 'BELUM LUNAS'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nominal Iuran Bulanan
                </span>
                <span className="text-xl font-extrabold text-slate-800 mt-1 block">
                  {formatRupiah(currentResidentDue.monthlyDuesAmount)}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">Iuran Warga + Keamanan + Sampah</span>
              </div>

              <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pembayaran Terakhir
                </span>
                <span className="text-xl font-extrabold text-slate-800 mt-1 block">
                  {currentResidentDue.lastPaymentDate || '11 Okt 2026'}
                </span>
                <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Tercatat di Buku Kas RW</span>
              </div>

              <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tunggakan
                </span>
                <span className="text-xl font-extrabold text-slate-800 mt-1 block">
                  {formatRupiah(currentResidentDue.totalArrears)}
                </span>
                <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Tidak ada tunggakan aktif</span>
              </div>
            </div>
          </section>
        ) : (
          /* Admin/Treasurer Full Dues Management View */
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-600 text-white p-1.5 rounded-xl">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    Rekapitulasi Iuran Warga RW 05
                  </h3>
                </div>
                <p className="text-slate-500 text-sm mt-0.5">
                  Kelola dan verifikasi status pembayaran iuran seluruh warga RT 01 - RT 04.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                Total Terdaftar: <span className="font-extrabold text-slate-800">{residentDues.length} KK Contoh</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Kepala Keluarga</th>
                    <th className="py-3 px-4">Unit / Blok</th>
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tunggakan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {residentDues.map((resident) => (
                    <tr key={resident.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {resident.residentName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {resident.unitNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {formatRupiah(resident.monthlyDuesAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            resident.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : resident.status === 'unpaid'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {resident.status === 'paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {resident.status === 'unpaid' && <Clock className="w-3.5 h-3.5" />}
                          {resident.status === 'overdue' && <AlertCircle className="w-3.5 h-3.5" />}
                          {resident.status === 'paid' ? 'LUNAS' : resident.status === 'unpaid' ? 'BELUM LUNAS' : 'MENUNGGAK'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {resident.totalArrears > 0 ? (
                          <span className="text-rose-600 font-bold">{formatRupiah(resident.totalArrears)}</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">Rp 0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {resident.status !== 'paid' ? (
                          <Button
                            size="sm"
                            onClick={() => handleMarkResidentPaid(resident)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-3 py-1"
                          >
                            Tandai Lunas
                          </Button>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">Terbayar</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Transaction History Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-amber-600 text-white p-1.5 rounded-xl">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  {canWrite ? 'Riwayat & Buku Kas Keuangan RW' : 'Riwayat Pembayaran Iuran Pribadi'}
                </h3>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">
                {canWrite
                  ? 'Audit trail lengkap seluruh pemasukan dan pengeluaran kas masyarakat.'
                  : 'Catatan riwayat pembayaran iuran yang telah terverifikasi untuk akun Anda.'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterType === 'income' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterType === 'expense' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setFilterType('dues')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterType === 'dues' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Iuran Warga
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Cari transaksi berdasarkan deskripsi, warga, kategori, atau pencatat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4">Dicatat Oleh</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                      Tidak ada transaksi yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            tx.direction === 'income'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{tx.description}</div>
                        {tx.residentName && (
                          <div className="text-xs text-slate-500 font-medium">
                            Warga: {tx.residentName}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium text-xs">
                        {tx.recordedBy}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium text-xs whitespace-nowrap">
                        {tx.paymentMethod || 'Transfer'}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-extrabold text-sm ${
                            tx.direction === 'income' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tx.direction === 'income' ? '+ ' : '- '}
                          {formatRupiah(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal: Catat Iuran Warga */}
      <AnimatePresence>
        {isDuesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-600 text-white p-2 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800">Catat Iuran Warga</h3>
                </div>
                <button
                  onClick={() => setIsDuesModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDues} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Nama Warga / Kepala Keluarga *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mas Budi Santoso"
                    value={duesForm.residentName}
                    onChange={(e) => setDuesForm({ ...duesForm, residentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Unit / Blok Rumah
                    </label>
                    <input
                      type="text"
                      placeholder="Blok C2 No. 08"
                      value={duesForm.unitNumber}
                      onChange={(e) => setDuesForm({ ...duesForm, unitNumber: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Periode Iuran
                    </label>
                    <input
                      type="text"
                      placeholder="Oktober 2026"
                      value={duesForm.month}
                      onChange={(e) => setDuesForm({ ...duesForm, month: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Nominal (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="150000"
                      value={duesForm.amount}
                      onChange={(e) => setDuesForm({ ...duesForm, amount: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Metode Pembayaran
                    </label>
                    <select
                      value={duesForm.paymentMethod}
                      onChange={(e) => setDuesForm({ ...duesForm, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                    >
                      <option value="Transfer BCA">Transfer BCA</option>
                      <option value="Transfer Mandiri">Transfer Mandiri</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Tunai">Tunai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Catatan Tambahan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Titip lewat Pak RT 02"
                    value={duesForm.notes}
                    onChange={(e) => setDuesForm({ ...duesForm, notes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDuesModalOpen(false)}
                    className="rounded-xl text-slate-600"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5"
                  >
                    Simpan Pembayaran
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Catat Pengeluaran RW */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-rose-600 text-white p-2 rounded-xl">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800">Catat Pengeluaran RW</h3>
                </div>
                <button
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExpense} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Kategori *
                    </label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-400 outline-none"
                    >
                      <option value="Keamanan">Keamanan &amp; Hansip</option>
                      <option value="Kebersihan">Kebersihan &amp; Sampah</option>
                      <option value="Perbaikan Fasilitas">Perbaikan Fasilitas &amp; PJU</option>
                      <option value="Kegiatan Warga">Kegiatan Warga &amp; Sosial</option>
                      <option value="Operasional">Operasional RW</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Nominal (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 500000"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Deskripsi Pengeluaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Beli kabel dan bola lampu PJU gang B"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Metode Pembayaran
                    </label>
                    <select
                      value={expenseForm.paymentMethod}
                      onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-400 outline-none"
                    >
                      <option value="Transfer BCA">Transfer BCA</option>
                      <option value="Transfer Mandiri">Transfer Mandiri</option>
                      <option value="Tunai">Tunai</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Penerima / Toko
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Toko Listrik Berkah"
                      value={expenseForm.recipient}
                      onChange={(e) => setExpenseForm({ ...expenseForm, recipient: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-400 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsExpenseModalOpen(false)}
                    className="rounded-xl text-slate-600"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-5"
                  >
                    Catat Pengeluaran
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portal />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/water-system"
            element={
              <ProtectedRoute requiredPermission="water:read">
                <WaterSystem />
              </ProtectedRoute>
            }
          />
          <Route path="/announcements" element={<Announcements />} />
          <Route
            path="/treasury"
            element={
              <ProtectedRoute requiredPermission="treasury:read">
                <TreasuryDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

