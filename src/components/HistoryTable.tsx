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
import { CheckCircle2, XCircle, Trash2, Droplet, DollarSign, CalendarDays } from "lucide-react";
import { Reading, Neighbor } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { motion, AnimatePresence } from "motion/react";

interface HistoryTableProps {
  readings: Reading[];
  neighbors: Neighbor[];
  onTogglePaid: (readingId: string) => void;
  onDeleteReading: (readingId: string) => void;
}

export function HistoryTable({ readings, neighbors, onTogglePaid, onDeleteReading }: HistoryTableProps) {
  const getNeighborName = (id: string) => neighbors.find(n => n.id === id)?.name || "Unknown";

  const sortedReadings = [...readings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex justify-between items-center z-10">
        <h3 className="font-bold text-slate-700 uppercase text-[11px] tracking-widest flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-indigo-500" />
          Recent Activity History
        </h3>
        <span className="text-[10px] text-slate-400 font-bold tracking-tighter bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Tiered Pricing: $1.00 | $1.50 | $2.00
        </span>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md shadow-sm">
            <TableRow className="border-b-2 border-slate-100">
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] p-4 tracking-wider"><div className="flex items-center gap-1.5"><CalendarDays className="w-3 h-3"/> Date</div></TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] p-4 tracking-wider">Neighbor</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] p-4 tracking-wider"><div className="flex items-center gap-1.5"><Droplet className="w-3 h-3"/> Reading</div></TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] p-4 tracking-wider"><div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3"/> Amount</div></TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] p-4 tracking-wider">Status</TableHead>
              <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] p-4 tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {sortedReadings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-400 font-medium bg-slate-50/30">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                      <Droplet className="w-10 h-10" />
                      <p>No reading history recorded yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedReadings.map((reading, idx) => (
                  <motion.tr
                    key={reading.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="group border-b border-slate-50 hover:bg-indigo-50/30 transition-colors"
                  >
                    <TableCell className="p-4 text-xs font-semibold text-slate-500">
                      {new Date(reading.date).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="p-4 text-sm font-bold text-slate-800">
                      {getNeighborName(reading.neighborId)}
                    </TableCell>
                    <TableCell className="p-4 text-sm font-semibold text-slate-600">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">
                        {reading.volume.toLocaleString()}m³
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-sm font-bold text-slate-800">
                      ${reading.totalCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="p-4">
                      <StatusBadge isPaid={reading.isPaid} />
                    </TableCell>
                    <TableCell className="p-4 text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant={reading.isPaid ? "outline" : "default"}
                        className={`h-8 text-[10px] font-bold uppercase tracking-wider ${
                          !reading.isPaid 
                            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 shadow-md' 
                            : 'text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                        onClick={() => onTogglePaid(reading.id)}
                      >
                        {reading.isPaid ? (
                          <><XCircle className="w-3 h-3 mr-1.5" /> Undo</>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3 mr-1.5" /> Pay</>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        onClick={() => onDeleteReading(reading.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Temporary icon component for activity
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
  )
}
