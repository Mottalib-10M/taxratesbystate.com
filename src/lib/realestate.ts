/**
 * Real estate facts of the 51 jurisdictions (src/data/realestate-states-2026.json): transfer and
 * mortgage taxes, state income tax on a capital gain, estate and inheritance taxes. Each fact carries
 * the official URL where it was read. The calculators receive the small compact lists built here.
 */
import raw from '../data/realestate-states-2026.json';
import { STATES } from './engine/states';
import type { StateGain, TransferFacts, EstateState, InhClass } from './engine/realestate';

type Bracket = { from: number; to: number | null; ratePct: number };
export interface TransferRow {
  has: boolean; name: string | null; brackets: Bracket[]; mode: 'marginal' | 'whole'; rateText: string; local: string | null;
  low?: TransferFacts['low']; extra?: TransferFacts['extra'];
  payer: string | null; payerNote: string | null; mortgageTax: { has: boolean; ratePct: number | null; name: string | null; note: string | null };
  notes: string | null; url: string | null; url2?: string | null;
}
export interface IncomeRow {
  hasIncomeTax: boolean; taxesCapitalGains: boolean; topRatePct: number; year: number; flat: boolean;
  topBracketStart: { single: number | null; joint: number | null }; cgExclusionPct: number | null; cgNote: string | null; cgShort: string;
  surtax: { ratePct: number; threshold: number; note?: string } | null; url: string | null;
}
export interface EstateRow extends EstateState { year: number; notes: string; urls: string[]; portability?: boolean }
export interface InhRow { slug: string; name: string; year: number; classes: Array<InhClass & { ratePct?: number | null; note?: string }>; notes: string; urls: string[] }
interface Raw { retrieved_at: string; states: Record<string, { transfer: TransferRow; income: IncomeRow; uncertain: string[] }>; estate: EstateRow[]; inheritance: InhRow[] }
export const RE = raw as unknown as Raw;
export const RE_RETRIEVED = RE.retrieved_at;

const name = (slug: string) => STATES.find((s) => s.slug === slug)?.name ?? slug;
export const reFacts = (slug: string) => {
  const r = RE.states[slug];
  if (!r) throw new Error(`No real estate facts for ${slug}`);
  return { slug, name: name(slug), ...r };
};
export const RE_STATES = STATES.map((s) => reFacts(s.slug));

/** Compact list for the home sale and 1031 calculators. */
export const gainStates = (): Array<StateGain & { flat: boolean; note: string | null }> => RE_STATES.map((s) => ({
  slug: s.slug, name: s.name, topRatePct: s.income.taxesCapitalGains ? s.income.topRatePct : 0, taxesCapitalGains: s.income.taxesCapitalGains,
  cgExclusionPct: s.income.cgExclusionPct, surtax: s.income.surtax ? { ratePct: s.income.surtax.ratePct, threshold: s.income.surtax.threshold } : null,
  flat: s.income.flat, note: s.income.cgNote,
}));

export interface TransferCompact { slug: string; name: string; t: TransferFacts; payer: string | null; mortgagePct: number; rateText: string }
/** Compact list for the closing costs calculator. */
export const transferStates = (): TransferCompact[] => RE_STATES.map((s) => ({
  slug: s.slug, name: s.name, t: { has: s.transfer.has, brackets: s.transfer.brackets, mode: s.transfer.mode, low: s.transfer.low ?? null, extra: s.transfer.extra ?? null }, payer: s.transfer.payer,
  mortgagePct: s.transfer.mortgageTax?.has ? s.transfer.mortgageTax.ratePct ?? 0 : 0, rateText: s.transfer.rateText,
}));

/** All 51 jurisdictions, with the estate tax facts where the state has one. */
export const estateStates = () => STATES.map((s) => {
  const e = RE.estate.find((x) => x.slug === s.slug);
  return { slug: s.slug, name: s.name, estate: e ? { slug: e.slug, name: e.name, exemption: e.exemption, brackets: e.brackets, method: e.method, cliffPct: e.cliffPct, cap: e.cap, offset: e.offset, credit: e.credit } as EstateState : null, inheritance: RE.inheritance.some((x) => x.slug === s.slug) };
});
export const inheritanceStates = () => RE.inheritance.map((x) => ({ slug: x.slug, name: x.name, classes: x.classes.map((c) => ({ who: c.who, exemption: c.exemption, brackets: c.brackets, mode: c.mode })) }));
