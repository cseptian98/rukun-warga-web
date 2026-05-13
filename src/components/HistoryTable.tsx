import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Reading, Neighbor } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";

interface HistoryTableProps {
  readings: Reading[];
  neighbors: Neighbor[];
  onTogglePaid: (readingId: string) => void;
  onDeleteReading: (readingId: string) => void;
}

export function HistoryTable({ readings, neighbors, onTogglePaid, onDeleteReading }: HistoryTableProps) {
  const getNeighborName = (id: string) => neighbors.find(n => n.id === id)?.name || "Unknown";

  // Sort readings by date descending
  const sortedReadings = [...readings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Recent Activity History</h3>
        <span className="text-[10px] text-slate-400 font-bold tracking-tighter">Tiered Pricing: $1.00 | $1.50 | $2.00</span>
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-white border-b-2 border-slate-100">
            <TableRow>
              <TableHead className="text-slate-400 font-black uppercase text-[10px] p-4">Date</TableHead>
              <TableHead className="text-slate-400 font-black uppercase text-[10px] p-4">Neighbor</TableHead>
              <TableHead className="text-slate-400 font-black uppercase text-[10px] p-4 text-right">Usage</TableHead>
              <TableHead className="text-slate-400 font-black uppercase text-[10px] p-4 text-right">Total Due</TableHead>
              <TableHead className="text-slate-400 font-black uppercase text-[10px] p-4 text-center">Status</TableHead>
              <TableHead className="text-slate-400 font-black uppercase text-[10px] p-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {sortedReadings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-bold italic">
                  No records found for this period.
                </TableCell>
              </TableRow>
            ) : (
              sortedReadings.map((reading) => (
                <TableRow key={reading.id} className="text-sm group">
                  <TableCell className="p-4 font-medium text-slate-500">
                    {new Date(reading.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="p-4 font-bold text-slate-700">
                    {getNeighborName(reading.neighborId)}
                  </TableCell>
                  <TableCell className="p-4 text-right font-mono text-slate-600">
                    {reading.usage.toFixed(1)} m³
                  </TableCell>
                  <TableCell className="p-4 text-right font-mono font-bold text-slate-900">
                    ${reading.cost.toFixed(2)}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <StatusBadge paid={reading.paid} />
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <button
                        onClick={() => onTogglePaid(reading.id)}
                        className={reading.paid 
                          ? "text-amber-600 hover:text-amber-700 font-bold uppercase tracking-tighter" 
                          : "text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-tighter"
                        }
                      >
                        {reading.paid ? "Mark Pending" : "Mark Paid"}
                      </button>
                      <button
                        onClick={() => onDeleteReading(reading.id)}
                        className="text-slate-300 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
