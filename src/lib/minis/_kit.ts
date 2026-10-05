/**
 * Shared tools for the mini-simulators (ignored by the registry: "_" prefix).
 * RULE: a mini never imports engine/states.ts (51 facts files with long texts would ship to the
 * browser). State figures arrive through `arg` (JSON written by the page from the facts).
 */
import { formatMoney, formatNumber } from '../format';
export { rate, eff } from '../fmt';
export const usd = (x: number, d = 0) => formatMoney(x, d);
export const num = (x: number, d = 0) => formatNumber(x, d);
export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export function parseArg<T>(arg: string | undefined, fallback: T): T {
  if (!arg) return fallback;
  try { return JSON.parse(arg) as T; } catch { return fallback; }
}
