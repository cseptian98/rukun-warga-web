import React, { useState, useMemo } from 'react';
import { Plus, Search, Printer, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

import { Neighbor, Reading } from "@/types";
import { NeighborCard } from "@/components/NeighborCard";
import { HistoryTable } from "@/components/HistoryTable";
import { AddNeighborDialog } from "@/components/AddNeighborDialog";
import { AddReadingDialog } from "@/components/AddReadingDialog";
import { PrintView } from "@/components/PrintView";
import { useWaterSystem } from "@/hooks/useWaterSystem";
import { calculateWaterCost } from "@/utils/billing";

export default function WaterSystem() {
  const { neighbors, setNeighbors, readings, setReadings } = useWaterSystem();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddNeighborOpen, setIsAddNeighborOpen] = useState(false);
  const [selectedNeighborId, setSelectedNeighborId] = useState<string | null>(null);

  const handleAddNeighbor = (data: { name: string; address?: string }) => {
    const neighbor: Neighbor = {
      ...data,
      id: crypto.randomUUID(),
      joinDate: new Date().toISOString(),
      lastReadingDate: undefined,
      lastReadingVolume: undefined,
      totalUnpaid: 0,
    };
    setNeighbors([...neighbors, neighbor]);
    toast.success("Neighbor added successfully");
  };

  const handleAddReading = (newReading: Omit<Reading, "id" | "totalCost" | "isPaid">) => {
    const neighbor = neighbors.find(n => n.id === newReading.neighborId);
    if (!neighbor) return;

    const previousVolume = neighbor.lastReadingVolume || 0;
    const usage = Math.max(0, newReading.volume - previousVolume);
    
    const totalCost = calculateWaterCost(usage);

    const reading: Reading = {
      ...newReading,
      id: crypto.randomUUID(),
      totalCost,
      isPaid: false,
    };

    setReadings([...readings, reading]);
    
    setNeighbors(neighbors.map(n => {
      if (n.id === newReading.neighborId) {
        return {
          ...n,
          lastReadingDate: newReading.date,
          lastReadingVolume: newReading.volume,
          totalUnpaid: (n.totalUnpaid || 0) + totalCost,
        };
      }
      return n;
    }));

    toast.success("Reading recorded successfully");
  };

  const handleTogglePaid = (readingId: string) => {
    const reading = readings.find(r => r.id === readingId);
    if (!reading) return;

    setReadings(readings.map(r => 
      r.id === readingId ? { ...r, isPaid: !r.isPaid } : r
    ));

    setNeighbors(neighbors.map(n => {
      if (n.id === reading.neighborId) {
        return {
          ...n,
          totalUnpaid: (n.totalUnpaid || 0) + (reading.isPaid ? reading.totalCost : -reading.totalCost),
        };
      }
      return n;
    }));
    
    toast.info(`Payment marked as ${!reading.isPaid ? 'paid' : 'unpaid'}`);
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
    toast.success("Reading deleted");
  };

  const filteredNeighbors = useMemo(() => {
    return (neighbors || []).filter(n => 
      (n?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n?.address ? n.address.toLowerCase().includes(searchTerm.toLowerCase()) : false)
    );
  }, [neighbors, searchTerm]);

  const currentNeighborForReading = selectedNeighborId 
    ? neighbors.find(n => n.id === selectedNeighborId) 
    : undefined;

  const enrichedNeighbors = neighbors.map(n => {
    const nReadings = readings.filter(r => r.neighborId === n.id);
    const usageThisMonth = nReadings.reduce((sum, r) => sum + (r.volume - (n.lastReadingVolume || 0)), 0); 
    return {
      ...n,
      readings: nReadings,
      usageThisMonth
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-200 shadow-sm print:hidden"
      >
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200/50">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">KSM<span className="text-indigo-600 font-extrabold"> Suka Jernih</span></h1>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Water System Manager</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Link to="/">
              <Button variant="ghost" className="hidden sm:flex text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-xl font-semibold transition-all mr-2">
                &larr; Back to Portal
              </Button>
            </Link>
            <Button 
              onClick={() => window.print()} 
              variant="outline"
              className="hidden sm:flex border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all rounded-xl font-semibold"
            >
              <Printer className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6 print:hidden overflow-hidden h-[calc(100vh-80px)]">
        
        {/* Sidebar/Directory column (1/3) */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "circOut" }}
          className="w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-4 h-full"
        >
          {/* Search Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-3 relative z-10">Search Directory</label>
            <div className="relative z-10">
              <input 
                type="text" 
                placeholder="Name or Address..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-sm font-medium transition-all"
              />
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Directory List */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm z-10">
              <span className="uppercase text-[11px] font-bold text-slate-600 tracking-wider">Neighbors <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full ml-2">{filteredNeighbors.length}</span></span>
              <button 
                onClick={() => setIsAddNeighborOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wide">Add</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 relative scrollbar-thin scrollbar-thumb-slate-200">
              <AnimatePresence mode="popLayout">
                {filteredNeighbors.map((neighbor, index) => (
                  <motion.div
                    key={neighbor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <NeighborCard 
                      neighbor={neighbor} 
                      onAddReading={(id) => setSelectedNeighborId(id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredNeighbors.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center"
                >
                  <Search className="w-8 h-8 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No neighbors found matching "{searchTerm}"</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content/History column (2/3) */}
        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "circOut" }}
          className="w-full lg:w-[65%] xl:w-[70%] flex flex-col h-full overflow-hidden"
        >
           <HistoryTable 
              readings={readings} 
              neighbors={neighbors} 
              onTogglePaid={handleTogglePaid}
              onDeleteReading={handleDeleteReading}
            />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 p-3 shrink-0 flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest print:hidden mt-auto">
        <div className="max-w-[1600px] w-full mx-auto flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span>Session: {new Date().toLocaleDateString('default', { month: 'short', year: 'numeric' })}</span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="hidden sm:inline">Database: Local Storage Active</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> 
              System Active
            </span>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <AddNeighborDialog 
        isOpen={isAddNeighborOpen} 
        onClose={() => setIsAddNeighborOpen(false)} 
        onSubmit={handleAddNeighbor} 
      />
      
      <AddReadingDialog 
        isOpen={!!selectedNeighborId} 
        neighborId={selectedNeighborId || ""}
        neighborName={currentNeighborForReading?.name || ""}
        onClose={() => setSelectedNeighborId(null)}
        onSubmit={handleAddReading}
      />

      <PrintView 
        readings={readings} 
        neighbors={enrichedNeighbors} 
        monthName={new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}
      />

      <Toaster position="top-center" richColors theme="light" />
    </div>
  );
}
