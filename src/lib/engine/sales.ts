/**
 * Sales tax engine. Pure functions, no network. The state part comes from the official facts of
 * the state; the local part is ALWAYS entered by the visitor (cities, counties and districts change
 * their rates during the year, and we only publish a local rate an official source dates).
 */
import type { StateFacts } from './types';

export type Category = 'general' | 'groceries' | 'clothing' | 'prescription';
export const CATEGORIES: Category[] = ['general', 'groceries', 'clothing', 'prescription'];

export interface SalesInput {
  /** Pre-tax price of one item (clothing thresholds are per item). */
  price: number;
  state: StateFacts;
  /** Combined local rate in percent (county + city + district), as found on the state's lookup tool. */
  localRate?: number;
  category?: Category;
}

export interface SalesResult {
  price: number;
  /** Rates actually applied, in percent. */
  stateRate: number;
  localRate: number;
  /** Part of the price the state rate applies to (lower than the price above a clothing threshold). */
  stateBase: number;
  localBase: number;
  stateTax: number;
  localTax: number;
  tax: number;
  total: number;
  /** tax / price, in percent. */
  effectiveRate: number;
  /** Plain-English name of the rule the engine applied. */
  rule: string;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const clamp0 = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);

/** State rate applied to a category, in percent, and the rule's name. */
export function stateRateFor(s: StateFacts, category: Category = 'general'): { rate: number; rule: string } {
  const S = s.sales;
  if (!S.hasStateSalesTax) return { rate: 0, rule: `${s.name} has no statewide sales tax` };
  if (category === 'groceries') {
    const g = S.groceries;
    if (g.treatment === 'exempt') return { rate: 0, rule: 'groceries exempt from the state rate' };
    if (g.treatment === 'reduced') return { rate: g.rate ?? S.stateRate, rule: 'reduced state rate on groceries' };
    return { rate: g.rate ?? S.stateRate, rule: 'groceries taxed at the state rate' };
  }
  if (category === 'prescription') {
    return S.prescriptionDrugs.treatment === 'exempt' ? { rate: 0, rule: 'prescription drugs exempt' } : { rate: S.prescriptionDrugs.rate ?? S.stateRate, rule: S.prescriptionDrugs.rate != null && S.prescriptionDrugs.rate !== S.stateRate ? 'reduced state rate on prescription drugs' : 'prescription drugs taxed' };
  }
  if (category === 'clothing') {
    const c = S.clothing;
    if (c.treatment === 'exempt') return { rate: 0, rule: 'clothing exempt' };
    if (c.treatment === 'exempt-under-threshold') return { rate: S.stateRate, rule: 'clothing threshold' };
    return { rate: S.stateRate, rule: 'clothing taxed like other goods' };
  }
  return { rate: S.stateRate, rule: 'general state rate' };
}

/** Does the visitor's local rate apply to this category? */
export function localApplies(s: StateFacts, category: Category = 'general'): boolean {
  const S = s.sales;
  if (!S.local.allowed) return false;
  if (category === 'groceries') return S.groceries.treatment !== 'exempt' || !!S.local.groceriesTaxedLocally;
  if (category === 'prescription') return S.prescriptionDrugs.treatment !== 'exempt' && S.prescriptionDrugs.localTaxed !== false;
  if (category === 'clothing') return S.clothing.treatment !== 'exempt';
  return true;
}

export function salesTax(i: SalesInput): SalesResult {
  const price = clamp0(i.price);
  const category = i.category ?? 'general';
  const s = i.state;
  const { rate: sr, rule: baseRule } = stateRateFor(s, category);
  const L = s.sales.local;
  const typed = clamp0(i.localRate ?? 0);
  let lr = localApplies(s, category) ? typed : 0;
  // A fixed local grocery rate replaces the general local rate on food (Illinois where adopted, Virginia everywhere).
  if (category === 'groceries' && L.groceriesLocalRate != null) lr = L.groceriesLocalAlways || typed > 0 ? L.groceriesLocalRate : 0;
  let stateBase = price, localBase = price, rule = baseRule;
  if (category === 'groceries' && L.groceriesLocalRate != null && lr > 0) rule += `; local tax on groceries is ${L.groceriesLocalRate}%${L.groceriesLocalAlways ? ' everywhere in the state' : ' where the locality adopted it'}`;
  const c = s.sales.clothing;
  if (category === 'clothing' && c.treatment === 'exempt-under-threshold' && c.threshold) {
    const T = c.threshold;
    if (c.thresholdMode === 'excess') {
      stateBase = Math.max(0, price - T);
      localBase = stateBase;
      rule = `only the part of the price above $${T} is taxed`;
    } else if (price < T) {
      stateBase = 0;
      localBase = c.localFollows === false ? price : 0;
      rule = c.localFollows === false ? `items under $${T} are exempt from the state tax; local tax may still apply` : `items under $${T} are exempt`;
    } else {
      rule = `items of $${T} or more are taxed in full`;
    }
  }
  const stateTax = r2((stateBase * sr) / 100);
  const localTax = r2((localBase * lr) / 100);
  const tax = r2(stateTax + localTax);
  return {
    price, stateRate: sr, localRate: lr, stateBase, localBase, stateTax, localTax, tax,
    total: r2(price + tax), effectiveRate: price > 0 ? (tax / price) * 100 : 0, rule,
  };
}

/**
 * Reverse sales tax: from a receipt total (tax included) back to the pre-tax price.
 * Solved on the forward function, so thresholds are handled exactly like the forward calculation.
 */
export function preTaxFromTotal(total: number, i: Omit<SalesInput, 'price'>): SalesResult {
  const t = clamp0(total);
  let lo = 0, hi = t;
  for (let k = 0; k < 80; k++) {
    const mid = (lo + hi) / 2;
    if (salesTax({ ...i, price: mid }).price + salesTax({ ...i, price: mid }).tax < t) lo = mid; else hi = mid;
  }
  return salesTax({ ...i, price: r2(hi) });
}

/** Plain combined-rate arithmetic for any rate (no state rules): price × rate and the reverse. */
export const addTax = (price: number, ratePct: number) => r2(clamp0(price) * (1 + clamp0(ratePct) / 100));
export const removeTax = (total: number, ratePct: number) => r2(clamp0(total) / (1 + clamp0(ratePct) / 100));
