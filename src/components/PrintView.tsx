import React from 'react';
import { Reading, Neighbor } from "@/types";

interface PrintViewProps {
  readings: Reading[];
  neighbors: Neighbor[];
  monthName: string;
}

export function PrintView({ readings, neighbors, monthName }: PrintViewProps) {
  const getNeighborName = (id: string) => neighbors.find(n => n.id === id)?.name || "Unknown";
  
  // Only show unpaid readings or all for the current month summary
  const unpaidReadings = readings.filter(r => !r.paid);

  return (
    <div className="hidden print:block p-8 bg-white text-black min-h-screen">
      <div className="text-center mb-8 border-b-4 border-black pb-4">
        <h1 className="text-4xl font-black uppercase">Neighborhood Water Report</h1>
        <p className="text-xl font-bold mt-2">Summary for: {monthName}</p>
        <p className="text-sm italic mt-1 italic">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black border-l-8 border-black pl-3 uppercase">Outstanding Balances</h2>
        {unpaidReadings.length === 0 ? (
          <p className="italic text-lg">All accounts are currently paid in full. Good job neighborhood!</p>
        ) : (
          <table className="w-full border-collapse border-2 border-black">
            <thead>
              <tr className="bg-slate-200 border-b-2 border-black">
                <th className="border-r-2 border-black p-2 text-left font-black">Neighbor</th>
                <th className="border-r-2 border-black p-2 text-right font-black">Usage</th>
                <th className="p-2 text-right font-black">Amount Due</th>
              </tr>
            </thead>
            <tbody>
              {unpaidReadings.map(reading => (
                <tr key={reading.id} className="border-b-2 border-black">
                  <td className="border-r-2 border-black p-2 font-bold">{getNeighborName(reading.neighborId)}</td>
                  <td className="border-r-2 border-black p-2 text-right font-mono">{reading.usage.toFixed(2)}m³</td>
                  <td className="p-2 text-right font-black">${reading.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100">
                <th colSpan={2} className="border-r-2 border-black p-2 text-right font-black uppercase">Total Outstanding:</th>
                <th className="p-2 text-right font-black text-2xl">
                  ${unpaidReadings.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className="mt-12 pt-8 border-t-2 border-dashed border-black">
        <p className="text-center font-bold">Please facilitate payment as soon as possible. Thank you!</p>
      </div>
    </div>
  );
}
