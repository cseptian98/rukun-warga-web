import { BILLING_TIERS } from '@/config/constants';

/**
 * Calculates the water bill based on tiered usage.
 * Usage <= 10m³: $1.00/m³
 * 11m³ - 20m³: $1.50/m³
 * > 20m³: $2.00/m³
 * 
 * @param usage The amount of water used in m³
 * @returns The total cost calculated based on the tiers
 */
export function calculateWaterCost(usage: number): number {
  if (usage <= 0) return 0;
  
  let cost = 0;
  
  if (usage <= 10) {
    cost = usage * 1.00;
  } else if (usage <= 20) {
    cost = (10 * 1.00) + ((usage - 10) * 1.50);
  } else {
    cost = (10 * 1.00) + (10 * 1.50) + ((usage - 20) * 2.00);
  }
  
  return cost;
}
