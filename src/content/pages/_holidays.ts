/** Holiday calendar computed from the facts files (helper of sales-tax-holidays.ts; "_" files are not pages). */
import { STATES, rate, listOf, day, dayShort } from '../../lib/kit';
const rows = STATES.flatMap((s) => (s.sales.holidays2026 ?? []).map((x) => ({ s, ...x }))).sort((a, b) => a.start.localeCompare(b.start) || a.s.name.localeCompare(b.s.name));
const withH = STATES.filter((s) => (s.sales.holidays2026 ?? []).length > 0);
export const LAST = {
  rows,
  count: withH.length,
  total: rows.length,
  first: rows[0]?.start,
  lastEnd: rows.reduce((m, r) => (r.end > m ? r.end : m), ''),
  without: STATES.filter((s) => s.sales.hasStateSalesTax && !(s.sales.holidays2026 ?? []).length),
  arg: JSON.stringify(rows.map((r) => [`${r.s.name}: ${r.name}`, r.s.sales.stateRate])),
};
export { STATES, rate, listOf, day, dayShort };
