import { BILLING_TIERS } from '@/config/constants';

/**
 * Calculates the water bill based on tiered usage in Rupiah (IDR).
 * Usage <= 10m³: Rp 2.500/m³
 * 11m³ - 20m³: Rp 3.500/m³
 * > 20m³: Rp 5.000/m³
 * 
 * @param usage The amount of water used in m³
 * @returns The total cost in Rupiah calculated based on the tiers
 */
export function calculateWaterCost(usage: number): number {
  if (usage <= 0) return 0;
  
  const tier1Rate = BILLING_TIERS[0]?.rate || 2500;
  const tier2Rate = BILLING_TIERS[1]?.rate || 3500;
  const tier3Rate = BILLING_TIERS[2]?.rate || 5000;
  
  let cost = 0;
  if (usage <= 10) {
    cost = usage * tier1Rate;
  } else if (usage <= 20) {
    cost = (10 * tier1Rate) + ((usage - 10) * tier2Rate);
  } else {
    cost = (10 * tier1Rate) + (10 * tier2Rate) + ((usage - 20) * tier3Rate);
  }
  
  return Math.round(cost);
}
