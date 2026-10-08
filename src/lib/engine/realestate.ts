/**
 * Real estate engine: tax on a home sale (Section 121), 1031 exchange (boot, deferred gain, new basis),
 * transfer taxes and closing costs, federal and state estate and inheritance taxes.
 * Pure functions, no import of the 51 facts files: the federal figures come from
 * `data/realestate-federal-2026.json` (small), the state figures are passed in by the caller.
 */
import F from '../../data/realestate-federal-2026.json';

export type Filing = 'single' | 'joint' | 'hoh' | 'separate';
export const FED = F;
type Bracket = { from: number; to: number | null; ratePct: number };

/** Tax on an amount under brackets [[upTo|null, ratePct], …] (ordinary income tables). */
export function bracketTax(x: number, table: Array<Array<number | null>>): number {
  let tax = 0, lo = 0;
  for (const [hi, r] of table) {
    const top = hi ?? Infinity;
    if (x > lo) tax += (Math.min(x, top) - lo) * (r as number) / 100;
    lo = top;
    if (x <= top) break;
  }
  return tax;
}
export const ordinaryTax = (taxable: number, f: Filing) => bracketTax(Math.max(0, taxable), F.ordinary[f]);

/** Marginal or whole-price brackets (transfer taxes, state estate taxes). */
export function brackets(x: number, bs: Bracket[], mode: 'marginal' | 'whole' = 'marginal'): number {
  if (x <= 0 || !bs.length) return 0;
  if (mode === 'whole') {
    const b = bs.find((k) => x > k.from && (k.to === null || x <= k.to)) ?? bs[bs.length - 1];
    return (x * b.ratePct) / 100;
  }
  return bs.reduce((t, b) => (x > b.from ? t + ((Math.min(x, b.to ?? Infinity) - b.from) * b.ratePct) / 100 : t), 0);
}

export interface GainTaxIn { filing: Filing; otherTaxable: number; ltcg: number; unrecaptured: number; shortTerm?: number; niitBase?: number }
export interface GainTaxOut { federalOnGain: number; on1250: number; onLtcg: number; onShort: number; niit: number; at0: number; at15: number; at20: number }
/**
 * Federal tax caused by a gain, stacked on top of the other taxable income (Schedule D logic):
 * ordinary income first, then unrecaptured section 1250 gain at ordinary rates capped at 25%,
 * then long-term gain at 0 / 15 / 20% by the 2026 thresholds. NIIT 3.8% on the lesser of the
 * taxable gain and the income above the threshold (MAGI approximated by taxable income + gain).
 */
export function federalGainTax({ filing, otherTaxable, ltcg, unrecaptured, shortTerm = 0, niitBase }: GainTaxIn): GainTaxOut {
  const o = Math.max(0, otherTaxable), u = Math.max(0, unrecaptured), g = Math.max(0, ltcg), s = Math.max(0, shortTerm);
  const base = ordinaryTax(o, filing);
  const onShort = ordinaryTax(o + s, filing) - base;
  const ord1250 = ordinaryTax(o + s + u, filing) - ordinaryTax(o + s, filing);
  const on1250 = Math.min(ord1250, (u * F.ltcg.unrecaptured1250MaxPct) / 100);
  const below = o + s + u;
  const z = F.ltcg.zeroMax[filing], f = F.ltcg.fifteenMax[filing];
  const at0 = Math.max(0, Math.min(g, z - below));
  const at15 = Math.max(0, Math.min(g - at0, f - Math.max(below, z)));
  const at20 = g - at0 - at15;
  const onLtcg = at15 * 0.15 + at20 * 0.2;
  const nb = niitBase ?? g + u + s;
  const magi = o + g + u + s;
  const niit = (Math.max(0, Math.min(nb, magi - F.niit.threshold[filing])) * F.niit.ratePct) / 100;
  return { federalOnGain: onShort + on1250 + onLtcg, on1250, onLtcg, onShort, niit, at0, at15, at20 };
}

/** State income tax side: what the site knows of each state for a capital gain. */
export interface StateGain { slug: string; name: string; topRatePct: number; taxesCapitalGains: boolean; cgExclusionPct: number | null; surtax: { ratePct: number; threshold: number } | null }
/** State tax on a gain at a given rate (the state's top rate by default), after any statutory exclusion share. */
export function stateGainTax(gain: number, st: StateGain | undefined, ratePct?: number, otherIncome = 0): number {
  if (!st || !st.taxesCapitalGains || gain <= 0) return 0;
  const taxed = gain * (1 - (st.cgExclusionPct ?? 0) / 100);
  let t = (taxed * (ratePct ?? st.topRatePct)) / 100;
  if (st.surtax) t += (st.surtax.ratePct / 100) * (Math.max(0, otherIncome + taxed - st.surtax.threshold) - Math.max(0, otherIncome - st.surtax.threshold));
  return t;
}

export interface Sec121In { filing: Filing; price: number; sellingCosts: number; basis: number; monthsOwned: number; monthsUsed: number; usedExclusionLast2y: boolean; partialReason: boolean; depreciationAfter1997: number; nonqualifiedMonths: number }
export interface Sec121Out { gain: number; maxExclusion: number; full: boolean; eligible: boolean; exclusion: number; taxableGain: number; recapture: number; nonqualifiedGain: number }
/**
 * Section 121 (IRS Pub. 523): $250,000 / $500,000 if owned and used 24 of the last 60 months and no
 * exclusion in the last 2 years; otherwise, with a qualifying reason (work, health, unforeseen event),
 * the reduced maximum = $250,000 or $500,000 × shortest of (months owned, months used, months since
 * the last exclusion) ÷ 24. Depreciation after May 6, 1997 and gain on nonqualified use stay taxable.
 * Joint: both spouses are assumed to meet the use test (the $500,000 requires it).
 */
export function sec121(i: Sec121In): Sec121Out {
  const gain = Math.max(0, i.price - i.sellingCosts - i.basis);
  const cap = i.filing === 'joint' ? F.sec121.joint : F.sec121.single;
  const own = Math.min(i.monthsOwned, F.sec121.windowMonths), use = Math.min(i.monthsUsed, F.sec121.windowMonths, i.monthsOwned);
  const full = own >= F.sec121.ownMonths && use >= F.sec121.useMonths && !i.usedExclusionLast2y;
  const eligible = full || i.partialReason;
  const share = full ? 1 : Math.min(1, Math.min(own, use) / F.sec121.partialDivisorMonths);
  const maxExclusion = eligible ? cap * share : 0;
  const recapture = Math.min(gain, Math.max(0, i.depreciationAfter1997));
  const nq = i.monthsOwned > 0 ? Math.min(1, Math.max(0, i.nonqualifiedMonths) / i.monthsOwned) : 0;
  const nonqualifiedGain = (gain - recapture) * nq;
  const exclusion = Math.min(maxExclusion, Math.max(0, gain - recapture - nonqualifiedGain));
  return { gain, maxExclusion, full, eligible, exclusion, taxableGain: gain - exclusion, recapture, nonqualifiedGain };
}

export interface X1031In { salePrice: number; costs: number; adjustedBasis: number; depreciation: number; oldDebt: number; replacementPrice: number; newDebt: number }
export interface X1031Out { realized: number; netEquity: number; equityNeeded: number; cashBoot: number; debtBoot: number; boot: number; recognized: number; deferred: number; newBasis: number; recognized1250: number; recognizedCapital: number; deferred1250: number; fullyDeferred: boolean }
/**
 * 1031 exchange (Form 8824 instructions): realized gain = price − exchange costs − adjusted basis;
 * boot = cash left over after buying the replacement + net debt relief not offset by cash added;
 * recognized gain = smaller of boot and realized gain; deferred = the rest; basis of the replacement
 * = its price − deferred gain. Recognized gain is unrecaptured section 1250 gain first, up to the
 * depreciation taken.
 */
export function exchange1031(i: X1031In): X1031Out {
  const realized = Math.max(0, i.salePrice - i.costs - i.adjustedBasis);
  const netEquity = i.salePrice - i.costs - i.oldDebt;
  const equityNeeded = i.replacementPrice - i.newDebt;
  const cashBoot = Math.max(0, netEquity - equityNeeded);
  const cashAdded = Math.max(0, equityNeeded - netEquity);
  const debtBoot = Math.max(0, i.oldDebt - i.newDebt - cashAdded);
  const boot = cashBoot + debtBoot;
  const recognized = Math.min(boot, realized);
  const deferred = realized - recognized;
  const recognized1250 = Math.min(recognized, Math.max(0, i.depreciation));
  return { realized, netEquity, equityNeeded, cashBoot, debtBoot, boot, recognized, deferred, newBasis: i.replacementPrice - deferred, recognized1250, recognizedCapital: recognized - recognized1250, deferred1250: Math.min(Math.max(0, i.depreciation), realized) - recognized1250, fullyDeferred: boot <= 0 && realized > 0 };
}

/**
 * Statewide transfer tax facts. `low`: a separate schedule for prices up to `max` (New Jersey under
 * $350,000). `extra`: whole-price surcharges set by law on one party (New York's 1% mansion tax on the
 * buyer, New Jersey's graduated percent fee on the seller), outside the negotiable split.
 */
export interface TransferExtra { from: number; to: number | null; ratePct: number; who: 'buyer' | 'seller'; name: string }
export interface TransferFacts { has: boolean; brackets: Bracket[]; mode: 'marginal' | 'whole'; low?: { max: number; brackets: Bracket[] } | null; extra?: TransferExtra[] | null }
export function transferTax(price: number, t: TransferFacts | undefined): number {
  if (!t || !t.has) return 0;
  if (t.low && price <= t.low.max) return brackets(price, t.low.brackets, t.mode);
  return brackets(price, t.brackets, t.mode);
}
/** Surcharges that apply to this price, with the party the law puts them on. */
export const transferExtras = (price: number, t: TransferFacts | undefined) =>
  (t?.extra ?? []).filter((e) => price >= e.from && (e.to === null || price < e.to)).map((e) => ({ who: e.who, name: e.name, ratePct: e.ratePct, amount: (price * e.ratePct) / 100 }));

/** Federal estate tax: unified schedule on the taxable estate, minus the tentative tax on the basic exclusion (+ DSUE). */
export function unifiedTax(x: number): number {
  if (x <= 0) return 0;
  const row = F.estate.schedule.find(([lo, hi]) => x > (lo as number) && (hi === null || x <= (hi as number))) ?? F.estate.schedule[F.estate.schedule.length - 1];
  return (row[2] as number) + ((x - (row[0] as number)) * (row[3] as number)) / 100;
}
export function federalEstateTax(taxableEstate: number, adjustedGifts = 0, dsue = 0): number {
  const base = taxableEstate + adjustedGifts;
  return Math.max(0, unifiedTax(base) - unifiedTax(F.estate.basicExclusion + dsue));
}

/** State estate tax facts (src/data/realestate-states-2026.json > estate). */
export interface EstateState { slug: string; name: string; exemption: number; brackets: Bracket[]; method: 'excess' | 'whole' | 'cliff' | 'credit' | 'illinois'; cliffPct?: number; cap?: number; offset?: number; credit?: number }
/**
 * State estate tax. Methods: "excess": brackets applied from $0 to the amount above the exemption
 * (Hawaii, Minnesota); "whole": brackets on the whole taxable estate, the first band at 0% up to the
 * exemption (Connecticut, DC, Maine, Maryland, Oregon, Vermont); "credit": the old federal state death
 * tax credit table on the estate less `offset` ($60,000), minus a fixed state `credit` (Massachusetts,
 * Rhode Island); "cliff" (New York): table on the whole estate minus a credit equal to
 * the table tax on exclusion × (1 − excess ÷ (5% × exclusion)), so no credit above 105%; "illinois": the
 * interrelated calculation of the Attorney General (tax = T(estate − tax − $60,000)), capped at
 * 40% × (estate − tax − exemption). `cap` limits the total (Connecticut).
 */
export function stateEstateTax(estate: number, s: EstateState | undefined): number {
  if (!s || estate <= s.exemption) return 0;
  const T = (x: number) => brackets(x, s.brackets);
  let t: number;
  if (s.method === 'excess') t = T(estate - s.exemption);
  else if (s.method === 'whole') t = T(estate);
  else if (s.method === 'credit') t = Math.max(0, T(Math.max(0, estate - (s.offset ?? 0))) - (s.credit ?? T(s.exemption - (s.offset ?? 0))));
  else if (s.method === 'illinois') {
    let x = 0;
    for (let k = 0; k < 200; k++) x = T(Math.max(0, estate - x - 60000));
    t = Math.min(x, (0.4 * (estate - s.exemption)) / 1.4);
  } else {
    const band = (s.exemption * ((s.cliffPct ?? 105) - 100)) / 100;
    const f = Math.max(0, 1 - (estate - s.exemption) / band);
    t = Math.max(0, T(estate) - T(s.exemption * f));
  }
  return s.cap ? Math.min(t, s.cap) : t;
}

/** Inheritance tax on one heir's share under the class brackets (exemption first, then brackets on the rest). */
export interface InhClass { who: string; exemption: number | null; brackets: Bracket[]; mode?: 'marginal' | 'whole' }
/** Inheritance tax: `exemption` is subtracted first when the brackets do not already start with a 0% band;
 *  mode "whole" (Maryland) applies the rate to the whole share once it passes the first band. */
export function inheritanceTax(share: number, c: InhClass | undefined): number {
  if (!c) return 0;
  const x = Math.max(0, share - (c.exemption ?? 0));
  return brackets(x, c.brackets, c.mode ?? 'marginal');
}
