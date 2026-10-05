/**
 * Property tax engine. Two ways to estimate a bill:
 *  - from an effective rate (median tax ÷ median value, Census ACS) — what a typical owner pays;
 *  - from the bill's own mechanics: market value × assessment ratio = assessed value,
 *    minus exemptions = taxable value, × mill rate ÷ 1,000 = tax.
 */
export interface PropertyInput {
  marketValue: number;
  /** Share of market value that is assessed, in percent (100 when the state assesses at full value). */
  assessmentRatio?: number;
  /** Dollar exemption taken off the assessed value (homestead, senior, veteran…). */
  exemption?: number;
  /** Total levy in mills: dollars of tax per $1,000 of taxable value. */
  millRate: number;
  /** Dollar credit taken off the tax itself (some states give a credit, not an exemption). */
  credit?: number;
}
export interface PropertyResult {
  marketValue: number;
  assessedValue: number;
  exemption: number;
  taxableValue: number;
  grossTax: number;
  credit: number;
  tax: number;
  monthly: number;
  /** tax / market value, in percent. */
  effectiveRate: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const pos = (x: number | undefined) => (x && Number.isFinite(x) && x > 0 ? x : 0);

export function propertyTax(i: PropertyInput): PropertyResult {
  const mv = pos(i.marketValue);
  const ratio = i.assessmentRatio === undefined ? 100 : pos(i.assessmentRatio);
  const assessedValue = r2((mv * ratio) / 100);
  const exemption = Math.min(pos(i.exemption), assessedValue);
  const taxableValue = r2(assessedValue - exemption);
  const grossTax = r2((taxableValue * pos(i.millRate)) / 1000);
  const credit = Math.min(pos(i.credit), grossTax);
  const tax = r2(grossTax - credit);
  return { marketValue: mv, assessedValue, exemption, taxableValue, grossTax, credit, tax, monthly: r2(tax / 12), effectiveRate: mv > 0 ? (tax / mv) * 100 : 0 };
}

/** Typical bill at an effective rate given as a ratio (0.0131 = 1.31%). */
export const taxAtEffectiveRate = (value: number, ratio: number) => r2(pos(value) * pos(ratio));

/** Mills ↔ percent: 1 mill = $1 per $1,000 = 0.1%. */
export const millsToPercent = (mills: number) => pos(mills) / 10;
export const percentToMills = (pct: number) => pos(pct) * 10;

/** Mill rate that reproduces a given effective rate on full market value (used as a starting value). */
export const millsFromEffective = (ratio: number, assessmentRatio = 100) => (assessmentRatio > 0 ? (pos(ratio) * 1000 * 100) / assessmentRatio : 0);
