/** Formatters with no dependency on routes (safe from page files, minis and the engine side). */
import { formatMoney, formatNumber } from './format';
/** $1,234 (no cents by default, RECETTE §4.1). */
export const usd = (n: number, d = 0) => formatMoney(n, d);
/** A rate written as the states write it, in percent: 6.25 → "6.25%", 4.225 → "4.225%", 6 → "6%". */
export const rate = (p: number) => `${formatNumber(p, Math.min(4, String(p).split('.')[1]?.length ?? 0))}%`;
/** An effective property tax rate given as a ratio: 0.01312 → "1.31%". */
export const eff = (ratio: number) => `${formatNumber(ratio * 100, 2)}%`;
export const num = (n: number, d = 0) => formatNumber(n, d);
/** "August 7, 2026" from an ISO date. */
export const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
/** "August 7" (no year) from an ISO date. */
export const dayShort = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
