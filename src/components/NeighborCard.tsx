import React from 'react';
import { Button } from "@/components/ui/button";
import { User, MapPin, Calendar, PlusCircle, Droplets } from "lucide-react";
import { Neighbor } from "@/types";

interface NeighborCardProps {
  neighbor: Neighbor;
  onAddReading: (neighborId: string) => void;
}

export const NeighborCard: React.FC<NeighborCardProps> = ({ neighbor, onAddReading }) => {
  return (
    <div className="bg-white p-4 border border-slate-100 hover:border-indigo-100 rounded-xl hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="font-bold text-slate-800 text-[15px] leading-tight group-hover:text-indigo-900 transition-colors">{neighbor.name}</p>
          {neighbor.address && (
            <p className="text-[12px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {neighbor.address}
            </p>
          )}
        </div>
        <Button 
          onClick={() => onAddReading(neighbor.id)}
          size="sm"
          className="bg-indigo-50 text-indigo-700 text-[10px] px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-none flex items-center gap-1 uppercase tracking-wider"
        >
          <Droplets className="w-3 h-3" />
          Read
        </Button>
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
