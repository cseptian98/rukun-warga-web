import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isPaid: boolean;
}

export function StatusBadge({ isPaid }: StatusBadgeProps) {
  return (
    <Badge 
      variant="secondary"
      className={isPaid 
        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2.5 py-0.5 font-bold uppercase text-[9px] tracking-widest shadow-sm shadow-emerald-100 transition-colors" 
        : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-2.5 py-0.5 font-bold uppercase text-[9px] tracking-widest shadow-sm shadow-amber-100 transition-colors"
      }
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
      {isPaid ? "PAID" : "UNPAID"}
    </Badge>
  );
}
