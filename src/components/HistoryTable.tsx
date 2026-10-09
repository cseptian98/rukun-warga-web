import React, { useState, useMemo } from 'react';
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
  DollarSign, 
  CalendarDays,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  FilterX,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Reading, Neighbor } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { motion, AnimatePresence } from "motion/react";

interface HistoryTableProps {
  readings: Reading[];
  neighbors: Neighbor[];
  onTogglePaid: (readingId: string) => void;
  onDeleteReading: (readingId: string) => void;
}

export interface EnrichedReading extends Reading {
  neighborName: string;
}

export function HistoryTable({ readings, neighbors, onTogglePaid, onDeleteReading }: HistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const getNeighborName = (id: string) => neighbors.find(n => n.id === id)?.name || "Unknown";

  // Enriched reading records for easier sorting and filtering
  const tableData = useMemo<EnrichedReading[]>(() => {
    return readings
      .map(r => ({
        ...r,
        neighborName: getNeighborName(r.neighborId),
      }))
      .filter(r => {
        if (statusFilter === 'paid') return r.isPaid;
        if (statusFilter === 'unpaid') return !r.isPaid;
        return true;
      });
  }, [readings, neighbors, statusFilter]);

  const hasActiveFiltersOrSort = 
    globalFilter.trim().length > 0 || 
    statusFilter !== 'all' || 
    sorting.length > 0;

  const handleClearFiltersAndSort = () => {
    setGlobalFilter('');
    setStatusFilter('all');
    setSorting([]);
  };

  const columns = useMemo<ColumnDef<EnrichedReading>[]>(() => [
    {
      accessorKey: 'date',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors uppercase tracking-wider text-[10px] font-bold"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Date
            {isSorted === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-indigo-600" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="w-3 h-3 text-indigo-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-60" />
            )}
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-slate-500">
          {new Date(row.original.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
    },
    {
      accessorKey: 'neighborName',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors uppercase tracking-wider text-[10px] font-bold"
          >
            Neighbor
            {isSorted === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-indigo-600" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="w-3 h-3 text-indigo-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-60" />
            )}
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm font-bold text-slate-800">
          {row.original.neighborName}
        </span>
      ),
    },
    {
      accessorKey: 'volume',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors uppercase tracking-wider text-[10px] font-bold"
          >
            <Droplet className="w-3.5 h-3.5" />
            Reading
            {isSorted === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-indigo-600" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="w-3 h-3 text-indigo-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-60" />
            )}
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono text-xs font-semibold">
          {(row.original.volume ?? 0).toLocaleString()}m³
        </span>
      ),
    },
    {
      accessorKey: 'totalCost',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors uppercase tracking-wider text-[10px] font-bold"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Amount
            {isSorted === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-indigo-600" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="w-3 h-3 text-indigo-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-60" />
            )}
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm font-bold text-slate-800">
          ${(row.original.totalCost ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'isPaid',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors uppercase tracking-wider text-[10px] font-bold"
          >
            Status
            {isSorted === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-indigo-600" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="w-3 h-3 text-indigo-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-60" />
            )}
          </button>
        );
      },
      cell: ({ row }) => <StatusBadge isPaid={row.original.isPaid} />,
    },
    {
      id: 'actions',
      header: () => (
        <span className="text-right block uppercase tracking-wider text-[10px] font-bold">
          Actions
        </span>
      ),
      cell: ({ row }) => {
        const reading = row.original;
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button 
              size="sm" 
              variant={reading.isPaid ? "outline" : "default"}
              className={`h-7 text-[10px] font-bold uppercase tracking-wider ${
                !reading.isPaid 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200 shadow-sm' 
                  : 'text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
              onClick={() => onTogglePaid(reading.id)}
            >
              {reading.isPaid ? (
                <><XCircle className="w-3 h-3 mr-1" /> Undo</>
              ) : (
                <><CheckCircle2 className="w-3 h-3 mr-1" /> Pay</>
              )}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              onClick={() => onDeleteReading(reading.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
  ], [neighbors, onTogglePaid, onDeleteReading]);

  const table = useReactTable<EnrichedReading>({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex flex-wrap gap-3 justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-indigo-500" />
          <h3 className="font-bold text-slate-700 uppercase text-[11px] tracking-widest">
            Recent Activity History
          </h3>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full ml-1">
            {table.getFilteredRowModel().rows.length} records
          </span>
        </div>

        {/* Search, Filter & Clear Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search activity..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white w-40 sm:w-48 transition-all"
            />
          </div>

          {/* Status Segmented Filter */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                statusFilter === 'all' 
                  ? 'bg-white text-indigo-600 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                statusFilter === 'paid' 
                  ? 'bg-emerald-500 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                statusFilter === 'unpaid' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unpaid
            </button>
          </div>

          {/* Clear Filter & Sort Button */}
          {hasActiveFiltersOrSort && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFiltersAndSort}
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all rounded-lg"
              title="Reset search, filters and column sorting"
            >
              <FilterX className="w-3 h-3 mr-1" />
              Clear
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
                  <TableHead key={header.id} className="text-slate-400 p-3.5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-400 font-medium bg-slate-50/20">
                    <div className="flex flex-col items-center gap-2 opacity-60">
                      <Droplet className="w-8 h-8 text-slate-300" />
                      <p className="text-xs">No activity matching your search or filters.</p>
                      {hasActiveFiltersOrSort && (
                        <button
                          onClick={handleClearFiltersAndSort}
                          className="text-[11px] font-bold text-indigo-600 hover:underline mt-1"
                        >
                          Clear filters and sorting
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, idx) => (
                  <motion.tr
                    key={row.original.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.2 }}
                    className="group border-b border-slate-50 hover:bg-indigo-50/25 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="p-3.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] font-medium">
          Page <span className="font-bold text-slate-700">{table.getState().pagination.pageIndex + 1}</span> of{' '}
          <span className="font-bold text-slate-700">{Math.max(1, table.getPageCount())}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-7 px-2 text-xs rounded-md border-slate-200"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-7 px-2 text-xs rounded-md border-slate-200"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
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
