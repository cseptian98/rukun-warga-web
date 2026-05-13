import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Droplet, DollarSign, AlertCircle } from "lucide-react";

interface StatsHeaderProps {
  totalUsageThisMonth: number;
  totalUnpaidBalance: number;
  unpaidCount: number;
}

export function StatsHeader({ totalUsageThisMonth, totalUnpaidBalance, unpaidCount }: StatsHeaderProps) {
  return (
    <div className="flex gap-4 print:hidden">
      <div className="bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-700">
        <span className="block text-[10px] uppercase font-bold text-blue-300">Total Unpaid Balance</span>
        <span className="text-xl font-mono text-orange-300">${totalUnpaidBalance.toFixed(2)}</span>
      </div>
      <div className="bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-700">
        <span className="block text-[10px] uppercase font-bold text-blue-300">Total Usage</span>
        <span className="text-xl font-mono text-white">{totalUsageThisMonth.toFixed(1)} m³</span>
      </div>
      <div className="hidden md:block bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-700">
        <span className="block text-[10px] uppercase font-bold text-blue-300">Pending Bills</span>
        <span className="text-xl font-mono text-white">{unpaidCount}</span>
      </div>
    </div>
  );
}
