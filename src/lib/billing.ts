export function calculateWaterCost(usage: number): number {
  if (usage <= 0) return 0;

  let total = 0;
  let remainingUsage = usage;

  // Tier 1: 0-10m3
  const tier1Amount = Math.min(remainingUsage, 10);
  total += tier1Amount * 1.00;
  remainingUsage -= tier1Amount;

  if (remainingUsage > 0) {
    // Tier 2: 11-20m3 (next 10m3)
    const tier2Amount = Math.min(remainingUsage, 10);
    total += tier2Amount * 1.50;
    remainingUsage -= tier2Amount;
  }

  if (remainingUsage > 0) {
    // Tier 3: >20m3
    total += remainingUsage * 2.00;
  }

  return Number(total.toFixed(2));
}
