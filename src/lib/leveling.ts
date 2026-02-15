/**
 * Tiered BP curve: first level is cheap (50 BP), then each level costs more.
 * Total BP to reach level L (L >= 2) = 10 * (L - 1) * (L + 3).
 * Level 1 = 0 BP, Level 2 = 50, Level 3 = 120, Level 4 = 210, ...
 * Must stay in sync with DB trigger calculate_level_and_maqam().
 */

const MAX_LEVEL = 16;

/** Total BP required to reach this level (minimum total_bp to be at this level). */
export function totalBPForLevel(level: number): number {
  if (level <= 1) return 0;
  return 10 * (level - 1) * (level + 3);
}

/** Compute level from total BP. Returns 1..MAX_LEVEL. */
export function levelFromTotalBP(totalBP: number): number {
  const bp = Math.max(0, totalBP);
  const level = Math.floor((-20 + Math.sqrt(1600 + 40 * bp)) / 20);
  return Math.max(1, Math.min(MAX_LEVEL, level));
}
