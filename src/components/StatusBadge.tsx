import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  paid: boolean;
}

export function StatusBadge({ paid }: StatusBadgeProps) {
  return (
    <Badge 
      variant="secondary"
      className={paid 
        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 font-black uppercase text-[10px] tracking-widest" 
        : "bg-rose-100 text-rose-700 hover:bg-rose-200 border-none px-3 py-1 font-black uppercase text-[10px] tracking-widest"
      }
    >
      {paid ? "PAID" : "PENDING"}
    </Badge>
  );
}
