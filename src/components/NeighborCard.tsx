import React from 'react';
import { Button } from "@/components/ui/button";
import { User, MapPin, Calendar, PlusCircle, Droplets } from "lucide-react";
import { Neighbor } from "@/types";
import { usePermission } from "@/hooks/usePermission";

interface NeighborCardProps {
  neighbor: Neighbor;
  onAddReading: (neighborId: string) => void;
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

export const NeighborCard: React.FC<NeighborCardProps> = ({ neighbor, onAddReading }) => {
  const { can, isAdmin } = usePermission();
  const canManageWater = can('water:manage') || isAdmin;
  const rtStyle = getRtBadgeStyle(neighbor.rt);

  return (
    <div className="bg-white p-4 border border-slate-100 hover:border-indigo-100 rounded-xl hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-800 text-[15px] leading-tight group-hover:text-indigo-900 transition-colors">{neighbor.name}</p>
            {neighbor.rt && (
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${rtStyle.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${rtStyle.dot}`} />
                {neighbor.rt}
              </span>
            )}
          </div>
          {neighbor.address && (
            <p className="text-[12px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {neighbor.address}
            </p>
          )}
        </div>
        {canManageWater && (
          <Button 
            onClick={() => onAddReading(neighbor.id)}
            size="sm"
            className="bg-indigo-50 text-indigo-700 text-[10px] px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-none flex items-center gap-1 uppercase tracking-wider"
          >
            <Droplets className="w-3 h-3" />
            Read
          </Button>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] relative z-10">
        <p className="text-slate-400 font-semibold flex items-center gap-1">
          <Calendar className="w-3 h-3 opacity-50" />
          Last: {neighbor.lastReadingDate ? new Date(neighbor.lastReadingDate).toLocaleDateString() : 'No data'}
        </p>
        {neighbor.totalUnpaid !== undefined && neighbor.totalUnpaid > 0 && (
          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-bold tracking-wide flex items-center gap-1">
            DUE: ${neighbor.totalUnpaid.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
