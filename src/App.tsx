/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Printer, Users, History, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { Neighbor, Reading } from "./types";
import { StatsHeader } from "@/components/StatsHeader";
import { NeighborCard } from "@/components/NeighborCard";
import { HistoryTable } from "@/components/HistoryTable";
import { AddNeighborDialog } from "@/components/AddNeighborDialog";
import { AddReadingDialog } from "@/components/AddReadingDialog";
import { PrintView } from "@/components/PrintView";

const STORAGE_KEY_NEIGHBORS = 'water_system_neighbors';
const STORAGE_KEY_READINGS = 'water_system_readings';

export default function App() {
  // State
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddNeighborOpen, setIsAddNeighborOpen] = useState(false);
  const [selectedNeighborId, setSelectedNeighborId] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedNeighbors = localStorage.getItem(STORAGE_KEY_NEIGHBORS);
    const savedReadings = localStorage.getItem(STORAGE_KEY_READINGS);
    
    if (savedNeighbors) setNeighbors(JSON.parse(savedNeighbors));
    if (savedReadings) setReadings(JSON.parse(savedReadings));
  }, []);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NEIGHBORS, JSON.stringify(neighbors));
  }, [neighbors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_READINGS, JSON.stringify(readings));
  }, [readings]);

  // Derived State
  const enrichedNeighbors = useMemo(() => {
    return neighbors.map(neighbor => {
      const neighborReadings = readings.filter(r => r.neighborId === neighbor.id);
      const totalUnpaid = neighborReadings
        .filter(r => !r.paid)
        .reduce((sum, r) => sum + r.cost, 0);
      
      const lastReading = neighborReadings.length > 0 
        ? neighborReadings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : null;

      return {
        ...neighbor,
        totalUnpaid,
        lastReadingDate: lastReading?.date
      };
    });
  }, [neighbors, readings]);

  const filteredNeighbors = enrichedNeighbors.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyReadings = readings.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalUsage = monthlyReadings.reduce((sum, r) => sum + r.usage, 0);
    const unpaidReadings = readings.filter(r => !r.paid);
    const totalUnpaidBalance = unpaidReadings.reduce((sum, r) => sum + r.cost, 0);

    return {
      totalUsage,
      totalUnpaidBalance,
      unpaidCount: unpaidReadings.length
    };
  }, [readings]);

  // Handlers
  const handleAddNeighbor = (name: string, address: string) => {
    const newNeighbor: Neighbor = {
      id: crypto.randomUUID(),
      name,
      address,
    };
    setNeighbors([...neighbors, newNeighbor]);
    toast.success(`Neighbor ${name} added successfully!`);
  };

  const handleAddReading = (usage: number, cost: number) => {
    if (!selectedNeighborId) return;

    const newReading: Reading = {
      id: crypto.randomUUID(),
      neighborId: selectedNeighborId,
      usage,
      cost,
      paid: false,
      date: new Date().toISOString()
    };

    setReadings([...readings, newReading]);
    toast.success("Reading recorded successfully!");
  };

  const handleTogglePaid = (readingId: string) => {
    setReadings(readings.map(r => 
      r.id === readingId ? { ...r, paid: !r.paid } : r
    ));
    toast.info("Payment status updated.");
  };

  const handleDeleteReading = (readingId: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setReadings(readings.filter(r => r.id !== readingId));
      toast.error("Record deleted.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentNeighborForReading = neighbors.find(n => n.id === selectedNeighborId);

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans overflow-hidden selection:bg-blue-100">
      {/* Header (Inspired by blue Henderson branding) */}
      <header className="bg-blue-800 text-white p-6 shadow-md shrink-0 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Neighborhood Water Ledger</h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-0.5">Admin Management Dashboard</p>
        </div>
        
        <div className="flex items-center gap-4">
          <StatsHeader 
            totalUsageThisMonth={stats.totalUsage} 
            totalUnpaidBalance={stats.totalUnpaidBalance}
            unpaidCount={stats.unpaidCount}
          />
          <Button 
            onClick={handlePrint}
            className="bg-white text-blue-800 px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-blue-50 border-none h-auto w-auto"
          >
            <Printer className="w-4 h-4" />
            Print Reports
          </Button>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="flex flex-1 overflow-hidden p-6 gap-6 print:hidden">
        
        {/* Sidebar/Directory column (1/3) */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Search Neighbors</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Name or Address..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-lg font-bold placeholder:font-normal"
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
              <span className="uppercase text-xs tracking-widest">Neighbor Directory</span>
              <button 
                onClick={() => setIsAddNeighborOpen(true)}
                className="text-blue-600 text-xs font-black uppercase hover:underline"
              >
                + Add New
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50">
              {filteredNeighbors.map(neighbor => (
                <NeighborCard 
                  key={neighbor.id} 
                  neighbor={neighbor} 
                  onAddReading={(id) => setSelectedNeighborId(id)}
                />
              ))}
              {filteredNeighbors.length === 0 && (
                <div className="p-12 text-center text-slate-400 italic">No neighbors found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Content/History column (2/3) */}
        <div className="w-2/3 flex flex-col gap-6 h-full">
           <HistoryTable 
              readings={readings} 
              neighbors={neighbors} 
              onTogglePaid={handleTogglePaid}
              onDeleteReading={handleDeleteReading}
            />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 p-4 shrink-0 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase print:hidden">
        <div className="flex gap-6">
          <span>Session: {new Date().toLocaleDateString('default', { month: 'short', year: 'numeric' })}</span>
          <span>Database: Local Storage Active</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
            System Active
          </span>
          <span>v1.2.0 Stable</span>
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

      {/* Print-Only View */}
      <PrintView 
        readings={readings} 
        neighbors={enrichedNeighbors} 
        monthName={new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}
      />

      <Toaster position="top-right" richColors />
    </div>
  );
}
