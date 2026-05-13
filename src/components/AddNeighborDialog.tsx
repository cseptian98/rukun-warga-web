import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddNeighborDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, address: string) => void;
}

export function AddNeighborDialog({ isOpen, onClose, onSubmit }: AddNeighborDialogProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name, address);
    setName("");
    setAddress("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white border-none sm:max-w-[425px] text-slate-900 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-blue-800 p-6 text-white">
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">Add New Neighbor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest">Neighbor Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border-2 border-slate-200 h-12 px-4 font-bold text-slate-700 focus:border-blue-500 rounded-lg outline-none"
              placeholder="e.g. Arthur Morgan"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-black text-slate-400 uppercase tracking-widest">Address / Unit (Optional)</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-slate-50 border-2 border-slate-200 h-12 px-4 font-bold text-slate-700 focus:border-blue-500 rounded-lg outline-none"
              placeholder="e.g. 102 Blackwater Creek Ln."
            />
          </div>

          <DialogFooter className="pt-2 gap-3 sm:gap-0">
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg shadow-blue-100 rounded-lg"
            >
              Add Neighbor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
