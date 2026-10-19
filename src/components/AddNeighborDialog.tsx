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
import { RT_LIST, RTUnit } from '@/data/initialResidents';

export interface AddNeighborFormData {
  name: string;
  rt: RTUnit | string;
  address?: string;
  phone?: string;
  nik?: string;
}

interface AddNeighborDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddNeighborFormData) => void;
}

export function AddNeighborDialog({ isOpen, onClose, onSubmit }: AddNeighborDialogProps) {
  const [name, setName] = useState("");
  const [rt, setRt] = useState<RTUnit | string>("RT 01");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      rt,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      nik: nik.trim() || undefined,
    });
    setName("");
    setRt("RT 01");
    setAddress("");
    setPhone("");
    setNik("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white border-none sm:max-w-[460px] text-slate-900 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">Add New Neighbor</DialogTitle>
          <p className="text-xs text-indigo-100 font-medium mt-1">Register neighbor to Water System & Master Resident Directory</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Neighbor Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border border-slate-200 h-11 px-3.5 font-medium text-slate-800 focus:border-indigo-500 rounded-xl outline-none"
              placeholder="e.g. Budi Santoso"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rt-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wilayah RT *</Label>
              <select
                id="rt-select"
                value={rt}
                onChange={(e) => setRt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 h-11 px-3 font-semibold text-slate-800 focus:border-indigo-500 rounded-xl outline-none text-sm"
              >
                {RT_LIST.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone / WhatsApp</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-50 border border-slate-200 h-11 px-3.5 font-medium text-slate-800 focus:border-indigo-500 rounded-xl outline-none text-sm"
                placeholder="0812xxxx"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nik" className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIK (Optional)</Label>
            <Input
              id="nik"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              className="bg-slate-50 border border-slate-200 h-11 px-3.5 font-medium text-slate-800 focus:border-indigo-500 rounded-xl outline-none text-sm"
              placeholder="16-digit NIK"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address / Unit (Optional)</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-slate-50 border border-slate-200 h-11 px-3.5 font-medium text-slate-800 focus:border-indigo-500 rounded-xl outline-none text-sm"
              placeholder="e.g. Blok C No. 12"
            />
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="font-semibold text-slate-500 hover:bg-slate-100 rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-md shadow-indigo-100 rounded-xl"
            >
              Add Neighbor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
