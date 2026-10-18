import React, { useState, useMemo } from 'react';
import { Printer, Activity, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Reading } from "@/types";
import { HistoryTable } from "@/components/HistoryTable";
import { AddReadingDialog } from "@/components/AddReadingDialog";
import { StatsHeader } from "@/components/StatsHeader";
import { PrintView } from "@/components/PrintView";
import { useWaterSystem } from "@/hooks/useWaterSystem";
import { calculateWaterCost } from "@/utils/billing";
import { formatCurrency } from "@/utils/formatters";
import { usePermission } from "@/hooks/usePermission";
import { UserNav } from "@/components/UserNav";

export default function WaterSystem() {
  const { can, isAdmin } = usePermission();
  const canManageWater = can('water:manage') || isAdmin;
  const { neighbors, setNeighbors, readings, setReadings } = useWaterSystem();
  
  const [isAddReadingOpen, setIsAddReadingOpen] = useState(false);

  const handleAddReading = (data: { neighborId: string; volume: number; date: string }) => {
    const neighbor = neighbors.find(n => n.id === data.neighborId);
    if (!neighbor) return;

    const previousVolume = neighbor.lastReadingVolume || 0;
    const usage = Math.max(0, data.volume - previousVolume);
    const totalCost = calculateWaterCost(usage);

    const reading: Reading = {
      id: `r-${Date.now()}`,
      neighborId: data.neighborId,
      volume: data.volume,
      totalCost,
      isPaid: false,
      date: data.date,
    };

    setReadings([reading, ...readings]);
    
    setNeighbors(neighbors.map(n => {
      if (n.id === data.neighborId) {
        return {
          ...n,
          lastReadingDate: data.date,
          lastReadingVolume: data.volume,
          totalUnpaid: (n.totalUnpaid || 0) + totalCost,
        };
      }
      return n;
    }));

    toast.success(`Catatan meteran ${neighbor.name} berhasil disimpan (${data.volume.toFixed(1)} m³ — ${formatCurrency(totalCost)})`);
  };

  const handleTogglePaid = (readingId: string) => {
    const reading = readings.find(r => r.id === readingId);
    if (!reading) return;

    const newPaidStatus = !reading.isPaid;

    setReadings(readings.map(r => 
      r.id === readingId ? { ...r, isPaid: newPaidStatus } : r
    ));

    setNeighbors(neighbors.map(n => {
      if (n.id === reading.neighborId) {
        return {
          ...n,
          totalUnpaid: Math.max(0, (n.totalUnpaid || 0) + (newPaidStatus ? -reading.totalCost : reading.totalCost)),
        };
      }
      return n;
    }));
    
    toast.info(`Status pembayaran berhasil ditandai ${newPaidStatus ? 'Lunas' : 'Belum Lunas'}`);
  };

  const handleDeleteReading = (readingId: string) => {
    const reading = readings.find(r => r.id === readingId);
    if (!reading) return;

    setReadings(readings.filter(r => r.id !== readingId));

    if (!reading.isPaid) {
      setNeighbors(neighbors.map(n => {
        if (n.id === reading.neighborId) {
          return {
            ...n,
            totalUnpaid: Math.max(0, (n.totalUnpaid || 0) - reading.totalCost),
          };
        }
        return n;
      }));
    }
    toast.success("Catatan meteran air berhasil dihapus");
  };

  // Aggregate stats for StatsHeader in Rupiah
  const totalUnpaidBalance = useMemo(() => {
    return readings
      .filter(r => !r.isPaid)
      .reduce((sum, r) => sum + (r.totalCost || 0), 0);
  }, [readings]);

  const totalUsageThisMonth = useMemo(() => {
    return readings.reduce((acc, curr) => acc + (curr.volume || 0), 0);
  }, [readings]);

  const unpaidCount = useMemo(() => {
    return readings.filter(r => !r.isPaid).length;
  }, [readings]);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Navbar */}
      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-200/80 shadow-xs print:hidden"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 rounded-2xl shadow-md shadow-indigo-200/50">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
                KSM<span className="text-indigo-600"> Suka Jernih</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Sistem Meteran & Tagihan Air RW 05
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 items-center">
            <Link to="/">
              <Button variant="ghost" className="hidden md:flex text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-xl font-semibold text-xs h-9 transition-all">
                &larr; Portal
              </Button>
            </Link>

            <Button 
              onClick={() => window.print()} 
              variant="outline"
              className="hidden sm:flex border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-xs transition-all rounded-xl font-semibold text-xs h-9"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Cetak Laporan
            </Button>

            <UserNav />
          </div>
        </div>
      </motion.header>

      {/* Main Full-Width Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 print:hidden">
        
        {/* 1. Summary Data (StatsHeader on top) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatsHeader 
            totalUsageThisMonth={totalUsageThisMonth}
            totalUnpaidBalance={totalUnpaidBalance}
            unpaidCount={unpaidCount}
          />
        </motion.div>

        {/* 2. Full-Page History Table */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col min-h-[560px]"
        >
          <HistoryTable 
            readings={readings} 
            neighbors={neighbors} 
            onTogglePaid={handleTogglePaid}
            onDeleteReading={handleDeleteReading}
            onOpenAddReading={() => setIsAddReadingOpen(true)}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 p-3.5 shrink-0 flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest print:hidden mt-auto border-t border-slate-800">
        <div className="max-w-[1600px] w-full mx-auto flex justify-between items-center px-4 sm:px-6">
          <div className="flex gap-6 items-center">
            <span>Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="hidden sm:inline">Tarif: Bertingkat (Rp 2.500 - Rp 5.000 / m³)</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> 
              Sistem Aktif (18 Riwayat Awal)
            </span>
          </div>
        </div>
      </footer>

      {/* Pop-up Dialog: Catat Penggunaan Air */}
      <AddReadingDialog 
        isOpen={isAddReadingOpen} 
        onClose={() => setIsAddReadingOpen(false)}
        neighbors={neighbors}
        onSubmit={handleAddReading}
      />

      {/* Print View for Printing Report */}
      <PrintView 
        readings={readings} 
        neighbors={neighbors} 
        monthName={new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
      />

      <Toaster position="top-center" richColors theme="light" />
    </div>
  );
}
