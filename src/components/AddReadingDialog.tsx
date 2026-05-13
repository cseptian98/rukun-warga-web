import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateWaterCost } from "@/lib/billing";

// Fixed imports
import { 
  Dialog as ShadDialog, 
  DialogContent as ShadDialogContent, 
  DialogHeader as ShadDialogHeader, 
  DialogTitle as ShadDialogTitle, 
  DialogFooter as ShadDialogFooter 
} from "@/components/ui/dialog";

interface AddReadingDialogProps {
  neighborName: string;
  neighborId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (usage: number, cost: number) => void;
}

export function AddReadingDialog({ neighborName, neighborId, isOpen, onClose, onSubmit }: AddReadingDialogProps) {
  const [usage, setUsage] = useState<string>("");

  const usageNum = parseFloat(usage) || 0;
  const cost = calculateWaterCost(usageNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usageNum <= 0) return;
    onSubmit(usageNum, cost);
    setUsage("");
    onClose();
  };

  return (
    <ShadDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ShadDialogContent className="bg-white border-none sm:max-w-[450px] text-slate-900 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <ShadDialogHeader className="bg-blue-800 p-6 text-white">
          <ShadDialogTitle className="text-xl font-bold uppercase tracking-tight">Meter Reading: {neighborName}</ShadDialogTitle>
        </ShadDialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="usage" className="text-xs font-black text-slate-400 uppercase tracking-widest">Water Usage (m³)</Label>
            <Input
              id="usage"
              type="number"
              step="0.01"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              className="bg-slate-50 border-2 border-blue-200 h-16 px-4 text-2xl font-mono font-bold text-blue-900 focus:border-blue-500 rounded-lg outline-none"
              placeholder="0.00"
              required
              autoFocus
            />
          </div>
          
          <div className="bg-blue-50 p-4 border-2 border-blue-100 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-blue-500 text-xs font-black uppercase tracking-widest">Tiered Estimate</span>
              <span className="text-2xl font-mono font-black text-blue-700">${cost.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-[10px] text-blue-400 font-bold uppercase tracking-tighter">
               Dynamic tiers applied: $1.00 - $1.50 - $2.00
            </div>
          </div>

          <ShadDialogFooter className="pt-2 gap-3 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="font-bold text-slate-500 hover:bg-slate-100 px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 h-12 shadow-lg shadow-blue-100 rounded-lg"
              disabled={usageNum <= 0}
            >
              Save Monthly Reading
            </Button>
          </ShadDialogFooter>
        </form>
      </ShadDialogContent>
    </ShadDialog>
  );
}
