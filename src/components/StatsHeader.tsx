import React from 'react';
import { Droplets, Coins, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface StatsHeaderProps {
  totalUsageThisMonth: number;
  totalUnpaidBalance: number;
  unpaidCount: number;
}

export function StatsHeader({ totalUsageThisMonth, totalUnpaidBalance, unpaidCount }: StatsHeaderProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 print:hidden">
      {/* Unpaid Balance */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
          <Coins className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider">Total Tagihan Tertunda</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight truncate block">
            {formatCurrency(totalUnpaidBalance)}
          </span>
        </div>
      </div>

      {/* Monthly Usage */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
          <Droplets className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider">Total Penggunaan Air</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight truncate block">
            {totalUsageThisMonth.toFixed(1)} <span className="text-xs font-semibold text-slate-400">m³</span>
          </span>
        </div>
      </div>

      {/* Pending Bills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
        <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider">Tagihan Belum Lunas</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight truncate block">
            {unpaidCount} <span className="text-xs font-semibold text-slate-400">tagihan</span>
          </span>
        </div>
      </div>
    </div>
  );
}
