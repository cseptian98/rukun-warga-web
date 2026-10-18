import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Droplet, 
  CalendarDays,
  Calendar,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  FilterX,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { Reading, Neighbor } from "@/types";
import { RT_LIST } from "@/data/initialResidents";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/utils/formatters";
import { motion, AnimatePresence } from "motion/react";
import { usePermission } from "@/hooks/usePermission";

interface HistoryTableProps {
  readings: Reading[];
  neighbors: Neighbor[];
  onTogglePaid: (readingId: string) => void;
  onDeleteReading: (readingId: string) => void;
  onOpenAddReading?: () => void;
}

export interface EnrichedReading extends Reading {
  neighborName: string;
  neighborRt?: string;
  neighborAddress?: string;
  neighborPhone?: string;
}

function getRtBadgeStyle(rt?: string) {
  switch (rt) {
    case 'RT 01':
      return { badge: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500' };
    case 'RT 02':
      return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500' };
    case 'RT 03':
      return { badge: 'bg-purple-50 text-purple-700 border-purple-200/60', dot: 'bg-purple-500' };
    case 'RT 04':
      return { badge: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500' };
    case 'RT 05':
      return { badge: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500' };
    case 'RT 06':
      return { badge: 'bg-cyan-50 text-cyan-700 border-cyan-200/60', dot: 'bg-cyan-500' };
    default:
      return { badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  }
}

export function HistoryTable({ 
  readings, 
  neighbors, 
  onTogglePaid, 
  onDeleteReading,
  onOpenAddReading 
}: HistoryTableProps) {
  const { can, isAdmin } = usePermission();
  const canManageWater = can('water:manage') || isAdmin;

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [selectedRt, setSelectedRt] = useState<string>('all');

  // Date Range Popover Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activePreset, setActivePreset] = useState<'today' | '7days' | 'month' | 'custom' | null>(null);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const datePopoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePopoverRef.current && !datePopoverRef.current.contains(event.target as Node)) {
        setIsDatePopoverOpen(false);
      }
    };
    if (isDatePopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePopoverOpen]);

  // Date Preset Handlers
  const handlePresetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setActivePreset('today');
  };

  const handlePreset7Days = () => {
    const now = new Date();
    const past = new Date(Date.now() - 6 * 86400000);
    setStartDate(past.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
    setActivePreset('7days');
  };

  const handlePresetMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
    setActivePreset('month');
  };

  const handleResetDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setActivePreset(null);
  };

  const neighborMap = useMemo(() => {
    return new Map<string, Neighbor>(neighbors.map(n => [n.id, n]));
  }, [neighbors]);

  // Enriched reading records for easier sorting and filtering
  const tableData = useMemo<EnrichedReading[]>(() => {
    return readings
      .map(r => {
        const neighbor = neighborMap.get(r.neighborId);
        return {
          ...r,
          neighborName: neighbor?.name || "Warga Tidak Dikenal",
          neighborRt: neighbor?.rt,
          neighborAddress: neighbor?.address,
          neighborPhone: neighbor?.phone,
        };
      })
      .filter(r => {
        // Status filter
        if (statusFilter === 'paid' && !r.isPaid) return false;
        if (statusFilter === 'unpaid' && r.isPaid) return false;

        // RT filter
        if (selectedRt !== 'all' && r.neighborRt !== selectedRt) return false;

        // Date range filter
        if (startDate || endDate) {
          const effectiveStart = startDate && endDate && startDate > endDate ? endDate : startDate;
          const effectiveEnd = startDate && endDate && startDate > endDate ? startDate : endDate;

          const startTime = effectiveStart ? new Date(`${effectiveStart}T00:00:00`).getTime() : null;
          const endTime = effectiveEnd ? new Date(`${effectiveEnd}T23:59:59.999`).getTime() : null;

          const readingTime = new Date(r.date).getTime();
          if (!isNaN(readingTime)) {
            if (startTime !== null && readingTime < startTime) return false;
            if (endTime !== null && readingTime > endTime) return false;
          }
        }

        // Global search filter (name, address, phone, volume)
        if (globalFilter.trim()) {
          const q = globalFilter.toLowerCase().trim();
          const matchName = r.neighborName.toLowerCase().includes(q);
          const matchAddress = (r.neighborAddress || '').toLowerCase().includes(q);
          const matchRt = (r.neighborRt || '').toLowerCase().includes(q);
          const matchCost = r.totalCost.toString().includes(q);
          return matchName || matchAddress || matchRt || matchCost;
        }

        return true;
      });
  }, [readings, neighborMap, statusFilter, selectedRt, startDate, endDate, globalFilter]);

  const isDateFiltered = !!startDate || !!endDate;

  const hasActiveFiltersOrSort = 
    globalFilter.trim().length > 0 || 
    statusFilter !== 'all' || 
    selectedRt !== 'all' ||
    isDateFiltered ||
    sorting.length > 0;

  const handleClearFiltersAndSort = () => {
    setGlobalFilter('');
    setStatusFilter('all');
    setSelectedRt('all');
    setStartDate('');
    setEndDate('');
    setActivePreset(null);
    setSorting([]);
  };

  const columns = useMemo<ColumnDef<EnrichedReading>[]>(() => [
    {
      accessorKey: 'neighborName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-slate-100 text-slate-500 font-bold p-0 text-[11px] uppercase tracking-wider h-auto"
        >
          Warga / Pelanggan
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3 text-indigo-600" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-1 h-3 w-3 text-indigo-600" />
          ) : (
            <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const rtStyle = getRtBadgeStyle(item.neighborRt);
        return (
          <div className="flex flex-col py-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                {item.neighborName}
              </span>
              {item.neighborRt && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${rtStyle.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${rtStyle.dot}`} />
                  {item.neighborRt}
                </span>
              )}
            </div>
            {item.neighborAddress && (
              <span className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs mt-0.5">
                {item.neighborAddress}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-slate-100 text-slate-500 font-bold p-0 text-[11px] uppercase tracking-wider h-auto"
        >
          Tanggal Catat
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3 text-indigo-600" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-1 h-3 w-3 text-indigo-600" />
          ) : (
            <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'));
        return (
          <span className="text-slate-600 text-xs font-medium">
            {date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        );
      },
    },
    {
      accessorKey: 'volume',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-slate-100 text-slate-500 font-bold p-0 text-[11px] uppercase tracking-wider h-auto"
        >
          Meteran
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3 text-indigo-600" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-1 h-3 w-3 text-indigo-600" />
          ) : (
            <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const volume = parseFloat(row.getValue('volume'));
        return (
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
            <Droplet className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
            <span>{volume.toFixed(1)} m³</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'totalCost',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-slate-100 text-slate-500 font-bold p-0 text-[11px] uppercase tracking-wider h-auto"
        >
          Biaya Tagihan
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3 text-indigo-600" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-1 h-3 w-3 text-indigo-600" />
          ) : (
            <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const cost = parseFloat(row.getValue('totalCost'));
        return (
          <span className="font-bold text-slate-800 text-xs sm:text-sm font-mono">
            {formatCurrency(cost)}
          </span>
        );
      },
    },
    {
      accessorKey: 'isPaid',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-slate-100 text-slate-500 font-bold p-0 text-[11px] uppercase tracking-wider h-auto"
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3 text-indigo-600" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-1 h-3 w-3 text-indigo-600" />
          ) : (
            <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const isPaid = row.getValue('isPaid') as boolean;
        return <StatusBadge isPaid={isPaid} />;
      },
    },
    {
      id: 'actions',
      header: () => <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Aksi</span>,
      cell: ({ row }) => {
        const reading = row.original;
        return (
          <div className="flex items-center gap-1.5">
            {canManageWater && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePaid(reading.id)}
                  className={`h-7 px-2.5 text-[10px] font-bold rounded-lg transition-all ${
                    reading.isPaid 
                      ? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700' 
                      : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                  title={reading.isPaid ? "Tandai Belum Lunas" : "Tandai Lunas"}
                >
                  {reading.isPaid ? (
                    <>
                      <XCircle className="w-3.5 h-3.5 mr-1 text-amber-500" />
                      Batal
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      Lunas
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteReading(reading.id)}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ], [canManageWater, onTogglePaid, onDeleteReading]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
      {/* Header toolbar */}
      <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex flex-wrap gap-3 justify-between items-center z-10">
        
        {/* Left: Title, Counter & Primary Add Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
              Riwayat Aktivitas Meteran Air
            </h3>
            <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full ml-1">
              {tableData.length} catatan
            </span>
          </div>

          {canManageWater && onOpenAddReading && (
            <Button
              onClick={onOpenAddReading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8 px-3.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Penggunaan Air</span>
            </Button>
          )}
        </div>

        {/* Right: Search & Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, alamat, RT..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white w-36 sm:w-48 transition-all"
            />
          </div>

          {/* RT Filter Dropdown */}
          <select
            value={selectedRt}
            onChange={(e) => setSelectedRt(e.target.value)}
            className="h-8 bg-slate-50 border border-slate-200 rounded-xl px-2.5 text-[11px] font-semibold text-slate-700 outline-none focus:border-indigo-400 cursor-pointer"
          >
            <option value="all">Semua RT</option>
            {RT_LIST.map(rt => (
              <option key={rt} value={rt}>{rt}</option>
            ))}
          </select>

          {/* Status Segmented Filter */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                statusFilter === 'all' 
                  ? 'bg-white text-indigo-600 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                statusFilter === 'paid' 
                  ? 'bg-emerald-500 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lunas
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                statusFilter === 'unpaid' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tertunda
            </button>
          </div>

          {/* Date Range Popover Filter Button beside Paid/Unpaid filter */}
          <div className="relative" ref={datePopoverRef}>
            <button
              type="button"
              onClick={() => setIsDatePopoverOpen(!isDatePopoverOpen)}
              className={`h-8 px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                isDateFiltered 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs' 
                  : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className={`w-3.5 h-3.5 ${isDateFiltered ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>
                {activePreset === 'today' ? 'Hari Ini' :
                 activePreset === '7days' ? '7 Hari Terakhir' :
                 activePreset === 'month' ? 'Bulan Ini' :
                 isDateFiltered ? `${startDate || '...'} s/d ${endDate || '...'}` :
                 'Rentang Tanggal'}
              </span>
              {isDateFiltered && (
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetDateFilter();
                  }}
                  className="hover:bg-indigo-200/70 p-0.5 rounded-full transition-colors ml-0.5"
                >
                  <X className="w-3 h-3 text-indigo-700" />
                </span>
              )}
            </button>

            {/* Date Range Popover Card */}
            <AnimatePresence>
              {isDatePopoverOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-slate-800"
                >
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pilih Rentang Tanggal</span>
                    </div>
                    <button
                      onClick={() => setIsDatePopoverOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Presets */}
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <button
                      type="button"
                      onClick={handlePresetToday}
                      className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        activePreset === 'today'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Hari Ini
                    </button>
                    <button
                      type="button"
                      onClick={handlePreset7Days}
                      className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        activePreset === '7days'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      7 Hari Terakhir
                    </button>
                    <button
                      type="button"
                      onClick={handlePresetMonth}
                      className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        activePreset === 'month'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Bulan Ini
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDateFilter}
                      className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        !isDateFiltered
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Semua Waktu
                    </button>
                  </div>

                  {/* Custom Date Pickers */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Dari Tanggal
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setActivePreset('custom');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Sampai Tanggal
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setActivePreset('custom');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResetDateFilter}
                      className="h-7 px-2.5 text-[11px] font-bold text-slate-500 hover:text-rose-600"
                    >
                      Reset
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsDatePopoverOpen(false)}
                      className="h-7 px-3 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                    >
                      Terapkan
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clear Filter & Sort Button */}
          {hasActiveFiltersOrSort && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFiltersAndSort}
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all rounded-xl"
              title="Reset search, filters and column sorting"
            >
              <FilterX className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>
      
      {/* Table Content */}
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/70 sticky top-0 z-10 backdrop-blur-md shadow-xs">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-b border-slate-100">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="h-10 px-4 py-2 text-slate-500 font-bold text-[11px]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="hover:bg-indigo-50/30 transition-colors border-b border-slate-50 group"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center p-6 space-y-2">
                    <FilterX className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">Tidak ada data aktivitas meteran yang sesuai filter.</p>
                    {hasActiveFiltersOrSort && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFiltersAndSort}
                        className="text-xs h-7 text-indigo-600 border-indigo-200 mt-1"
                      >
                        Reset Semua Filter
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2 justify-between items-center text-xs text-slate-500 shrink-0">
        <div className="flex items-center gap-1 font-medium">
          <span>Halaman</span>
          <span className="font-bold text-slate-700">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <span>dari</span>
          <span className="font-bold text-slate-700">
            {table.getPageCount() || 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-7 px-2.5 text-xs rounded-xl border-slate-200 font-medium"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-7 px-2.5 text-xs rounded-xl border-slate-200 font-medium"
          >
            Berikutnya
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2" />
    </svg>
  );
}
