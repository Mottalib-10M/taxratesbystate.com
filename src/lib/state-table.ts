/** The 51 jurisdictions in one table, generated from the facts and the Census file (never typed). */
import { STATES, CENSUS, type State } from './engine/states';
import { STATE_PAGES } from './pages';
import { route } from '../i18n/routes';
import { usd, rate, eff, day } from './fmt';

export type TableCols = 'all' | 'sales' | 'property' | 'groceries' | 'clothing';
export type TableSort = 'name' | 'rate' | 'eff' | 'bill';

const name = (s: State) => (STATE_PAGES.some((p) => p.slug === s.slug) ? `<a href="${route(s.slug, 'en')}">${s.name}</a>` : s.name);
export const grocLabel = (s: State) => !s.sales.hasStateSalesTax ? 'no state tax' : s.sales.groceries.treatment === 'exempt' ? 'exempt' : s.sales.groceries.treatment === 'reduced' ? `reduced, ${rate(s.sales.groceries.rate ?? 0)}` : `taxed, ${rate(s.sales.groceries.rate ?? s.sales.stateRate)}`;
export const clothLabel = (s: State) => !s.sales.hasStateSalesTax ? 'no state tax' : s.sales.clothing.treatment === 'exempt' ? 'exempt' : s.sales.clothing.treatment === 'exempt-under-threshold' ? `exempt under ${usd(s.sales.clothing.threshold ?? 0)}` : 'taxed';

export function stateTable(cols: TableCols = 'all', sortBy: TableSort = 'name', filter?: (s: State) => boolean, caption?: string): string {
  const rows = STATES.filter(filter ?? (() => true)).sort((a, b) => sortBy === 'rate' ? b.sales.stateRate - a.sales.stateRate || a.name.localeCompare(b.name)
    : sortBy === 'eff' ? b.census.effectiveRate - a.census.effectiveRate : sortBy === 'bill' ? b.census.medianTax - a.census.medianTax : a.name.localeCompare(b.name));
  const verified = STATES.reduce((m, s) => (s.verified > m ? s.verified : m), '');
  const H: Array<[string, 'l' | 'r']> = [['State', 'l']];
  if (cols === 'all' || cols === 'sales') H.push(['State rate', 'r'], ['Local taxes', 'l'], ['Groceries', 'l'], ['Clothing', 'l']);
  if (cols === 'groceries') H.push(['State rate', 'r'], ['Groceries', 'l'], ['Local tax on groceries', 'l']);
  if (cols === 'clothing') H.push(['State rate', 'r'], ['Clothing', 'l']);
  if (cols === 'all' || cols === 'property') H.push(['Median bill', 'r'], ['Effective rate', 'r']);
  if (cols === 'property') H.push(['Median value', 'r']);
  const td = (x: string, a: 'l' | 'r' = 'l') => `<td class="${a === 'r' ? 'tabular-nums text-right' : ''} px-3 py-2 text-navy-800">${x}</td>`;
  const body = rows.map((s) => {
    const c = [`<th scope="row" class="px-3 py-2 text-left font-medium text-navy-900">${name(s)}</th>`];
    const sr = s.sales.hasStateSalesTax ? rate(s.sales.stateRate) : 'none';
    if (cols === 'all' || cols === 'sales') c.push(td(sr, 'r'), td(s.sales.local.allowed ? 'yes' : 'no'), td(grocLabel(s)), td(clothLabel(s)));
    if (cols === 'groceries') c.push(td(sr, 'r'), td(grocLabel(s)), td(!s.sales.local.allowed ? 'no local tax' : s.sales.groceries.treatment !== 'exempt' || s.sales.local.groceriesTaxedLocally ? 'may apply' : 'no'));
    if (cols === 'clothing') c.push(td(sr, 'r'), td(clothLabel(s)));
    if (cols === 'all' || cols === 'property') c.push(td(usd(s.census.medianTax), 'r'), td(eff(s.census.effectiveRate), 'r'));
    if (cols === 'property') c.push(td(usd(s.census.medianValue), 'r'));
    return `<tr class="border-b border-navy-100">${c.join('')}</tr>`;
  }).join('');
  const cap = caption ?? (cols === 'property' ? `Census Bureau, American Community Survey ${CENSUS.year} 1-year estimates, read on ${day(CENSUS.retrieved_at)}.` : `Statewide rates and rules read on each state's official pages, latest on ${day(verified)}${cols === 'all' ? `; property tax: Census ACS ${CENSUS.year}` : ''}.`);
  const id = `st-${cols}-${sortBy}-${rows.length}`;
  return `<p id="${id}" class="not-prose mb-2 mt-0 text-sm text-navy-600">${cap}</p><div class="not-prose mb-6 max-h-[36rem] overflow-auto rounded-lg border border-navy-200"><table class="journal w-full text-sm" aria-describedby="${id}"><thead class="sticky top-0 bg-white"><tr>${H.map(([h, a]) => `<th scope="col" class="px-3 py-2 ${a === 'r' ? 'text-right' : 'text-left'} text-navy-900">${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
}
