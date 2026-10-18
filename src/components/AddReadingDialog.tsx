import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateWaterCost } from "@/utils/billing";
import { formatCurrency } from "@/utils/formatters";
import { Neighbor } from "@/types";
import { RT_LIST } from "@/data/initialResidents";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Droplets, Calendar, User, Info, ArrowRight } from "lucide-react";

interface AddReadingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  neighbors: Neighbor[];
  initialNeighborId?: string | null;
  onSubmit: (data: { neighborId: string; volume: number; date: string }) => void;
}

export function AddReadingDialog({ 
  isOpen, 
  onClose, 
  neighbors, 
  initialNeighborId, 
  onSubmit 
}: AddReadingDialogProps) {
  const [selectedNeighborId, setSelectedNeighborId] = useState<string>("");
  const [readingDate, setReadingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentMeter, setCurrentMeter] = useState<string>("");
  const [filterRt, setFilterRt] = useState<string>("all");
  const [searchResident, setSearchResident] = useState<string>("");

  // Initialize or reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setReadingDate(new Date().toISOString().split('T')[0]);
      if (initialNeighborId && neighbors.some(n => n.id === initialNeighborId)) {
        setSelectedNeighborId(initialNeighborId);
        const n = neighbors.find(n => n.id === initialNeighborId);
        if (n?.lastReadingVolume !== undefined) {
          setCurrentMeter((n.lastReadingVolume + 5).toFixed(1));
        } else {
          setCurrentMeter("");
        }
      } else if (neighbors.length > 0 && !selectedNeighborId) {
        setSelectedNeighborId(neighbors[0].id);
        if (neighbors[0].lastReadingVolume !== undefined) {
          setCurrentMeter((neighbors[0].lastReadingVolume + 5).toFixed(1));
        } else {
          setCurrentMeter("");
        }
      }
    }
  }, [isOpen, initialNeighborId, neighbors]);

  // Selected neighbor details
  const activeNeighbor = useMemo(() => {
    return neighbors.find(n => n.id === selectedNeighborId) || null;
  }, [neighbors, selectedNeighborId]);

  // When neighbor selection changes, update meter pre-fill intelligently
  const handleSelectNeighbor = (id: string) => {
    setSelectedNeighborId(id);
    const n = neighbors.find(item => item.id === id);
    if (n && n.lastReadingVolume !== undefined) {
      // Suggest realistic delta of +5 m³ from last reading
      setCurrentMeter((n.lastReadingVolume + 5).toFixed(1));
    } else {
      setCurrentMeter("");
    }
  };

  // Filtered neighbors list for selection dropdown/search
  const availableNeighbors = useMemo(() => {
    return neighbors.filter(n => {
      if (filterRt !== "all" && n.rt !== filterRt) return false;
      if (searchResident.trim()) {
        const q = searchResident.toLowerCase().trim();
        const matchName = (n.name || "").toLowerCase().includes(q);
        const matchAddr = (n.address || "").toLowerCase().includes(q);
        const matchNik = (n.nik || "").toLowerCase().includes(q);
        return matchName || matchAddr || matchNik;
      }
      return true;
    });
  }, [neighbors, filterRt, searchResident]);

  const previousVolume = activeNeighbor?.lastReadingVolume || 0;
  const currentMeterNum = parseFloat(currentMeter) || 0;
  const usage = Math.max(0, currentMeterNum - previousVolume);
  const cost = calculateWaterCost(usage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNeighborId || currentMeterNum <= 0) return;
    
    onSubmit({
      neighborId: selectedNeighborId,
      volume: currentMeterNum,
      date: new Date(readingDate + "T12:00:00").toISOString()
    });

    setCurrentMeter("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white border-none sm:max-w-[520px] text-slate-900 shadow-2xl rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold uppercase tracking-tight">Catat Penggunaan Air</DialogTitle>
              <p className="text-xs text-indigo-100 font-medium mt-0.5">Input angka meteran air warga & hitung tagihan otomatis</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* SECTION 1: WHO (Pilih Warga) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                1. Pilih Warga / Pelanggan *
              </Label>
              {activeNeighbor && (
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                  {activeNeighbor.rt || 'RT 01'}
                </span>
              )}
            </div>

            {/* Quick RT filter & search for resident */}
            <div className="grid grid-cols-3 gap-2">
              <select
                value={filterRt}
                onChange={(e) => setFilterRt(e.target.value)}
                className="bg-slate-50 border border-slate-200 h-9 px-2 rounded-lg text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">Semua RT</option>
                {RT_LIST.map(rt => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Cari nama/alamat..."
                value={searchResident}
                onChange={(e) => setSearchResident(e.target.value)}
                className="col-span-2 bg-slate-50 border border-slate-200 h-9 px-3 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
              />
            </div>

            {/* Resident Select Dropdown */}
            <select
              value={selectedNeighborId}
              onChange={(e) => handleSelectNeighbor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 h-11 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
              required
            >
              {availableNeighbors.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.rt || 'RT 01'}] {n.name} — {n.address || 'Alamat -'} (Meteran Lalu: {n.lastReadingVolume ?? 0} m³)
                </option>
              ))}
              {availableNeighbors.length === 0 && (
                <option disabled>Tidak ada warga sesuai pencarian</option>
              )}
            </select>
          </div>

          {/* SECTION 2: WHEN (Tanggal Pencatatan) */}
          <div className="space-y-1.5">
            <Label htmlFor="readingDate" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              2. Tanggal Pencatatan *
            </Label>
            <Input
              id="readingDate"
              type="date"
              value={readingDate}
              onChange={(e) => setReadingDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 h-10 px-3.5 text-xs sm:text-sm font-medium text-slate-800 focus:border-indigo-500 rounded-xl outline-none"
              required
            />
          </div>

          {/* SECTION 3: HOW MUCH (Angka Meteran Air) */}
          <div className="space-y-1.5">
            <Label htmlFor="currentMeter" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-indigo-600" />
              3. Angka Meteran Baru (m³) *
            </Label>
            <div className="relative">
              <Input
                id="currentMeter"
                type="number"
                step="0.1"
                min="0"
                value={currentMeter}
                onChange={(e) => setCurrentMeter(e.target.value)}
                className="bg-slate-50 border-2 border-indigo-200 h-14 pl-4 pr-14 text-xl sm:text-2xl font-mono font-bold text-indigo-900 focus:border-indigo-600 rounded-xl outline-none transition-all"
                placeholder="0.0"
                required
                autoFocus
              />
              <span className="absolute right-4 top-4 text-sm font-bold text-slate-400">m³</span>
            </div>
          </div>

          {/* DETAIL SUMMARY CALCULATION CARD */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Meteran Sebelumnya:</span>
              <span className="font-mono font-bold text-slate-700">{previousVolume.toFixed(1)} m³</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Meteran Baru:</span>
              <span className="font-mono font-bold text-indigo-700">{currentMeterNum > 0 ? `${currentMeterNum.toFixed(1)} m³` : '-'}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold pt-1.5 border-t border-slate-200">
              <span className="text-slate-700">Jumlah Pemakaian:</span>
              <span className="font-mono text-indigo-900 text-sm">
                {usage > 0 ? `+${usage.toFixed(1)} m³` : '0.0 m³'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimasi Tagihan Air</span>
                <span className="text-[10px] text-slate-400">Tarif KSM bertingkat (Rp 2.500 - Rp 5.000/m³)</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-600">
                {formatCurrency(cost)}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="font-bold text-slate-500 hover:bg-slate-100 rounded-xl px-5"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 h-11 shadow-md shadow-indigo-100 rounded-xl transition-all"
              disabled={currentMeterNum <= 0 || !selectedNeighborId}
            >
              Simpan Catatan Meteran
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
