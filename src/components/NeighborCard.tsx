import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Calendar, PlusCircle } from "lucide-react";
import { Neighbor } from "@/types";

interface NeighborCardProps {
  neighbor: Neighbor;
  onAddReading: (neighborId: string) => void;
}

export const NeighborCard: React.FC<NeighborCardProps> = ({ neighbor, onAddReading }) => {
  return (
    <div className="bg-white p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-slate-900 text-lg leading-tight">{neighbor.name}</p>
          {neighbor.address && (
            <p className="text-sm text-slate-500 font-medium">{neighbor.address}</p>
          )}
        </div>
        <Button 
          onClick={() => onAddReading(neighbor.id)}
          size="sm"
          className="bg-blue-100 text-blue-700 text-[11px] px-3 py-1 rounded font-bold hover:bg-blue-600 hover:text-white transition-all shadow-none"
        >
          + READ
        </Button>
      </div>
      <div className="mt-2 flex justify-between items-center text-[11px]">
        <p className="text-slate-400 font-medium italic">
          Last: {neighbor.lastReadingDate ? new Date(neighbor.lastReadingDate).toLocaleDateString() : 'No data'}
        </p>
        {neighbor.totalUnpaid !== undefined && neighbor.totalUnpaid > 0 && (
          <span className="text-rose-600 font-black tracking-wide">
            DUE: ${neighbor.totalUnpaid.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};
