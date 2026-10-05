/**
 * The few facts a calculator island needs, passed as props by the Astro page (a calculator never
 * imports the 51 facts files, which carry long texts: the browser only receives these numbers).
 */
import type { StateFacts } from './types';
import type { State } from './states';

export interface CompactState {
  slug: string; name: string; abbr: string;
  /** StateFacts subset read by the sales engine. */
  facts: StateFacts;
  lookupUrl: string | null;
  homestead: { name: string | null; amountType: string; amount: number | null };
  assessmentRatio: number | null;
  census: { medianTax: number; medianValue: number; effectiveRate: number };
}

export function compactState(s: State): CompactState {
  const S = s.sales;
  const facts = {
    name: s.name, abbr: s.abbr, slug: s.slug, verified: s.verified,
    sales: {
      hasStateSalesTax: S.hasStateSalesTax, stateRate: S.stateRate,
      local: { allowed: S.local.allowed, groceriesTaxedLocally: S.local.groceriesTaxedLocally ?? false, groceriesLocalRate: S.local.groceriesLocalRate ?? null, groceriesLocalAlways: S.local.groceriesLocalAlways ?? null },
      groceries: { treatment: S.groceries.treatment, rate: S.groceries.rate ?? null },
      clothing: { treatment: S.clothing.treatment, threshold: S.clothing.threshold ?? null, thresholdMode: S.clothing.thresholdMode ?? null, localFollows: S.clothing.localFollows ?? null },
      prescriptionDrugs: { treatment: S.prescriptionDrugs.treatment, rate: S.prescriptionDrugs.rate ?? null, localTaxed: S.prescriptionDrugs.localTaxed ?? null },
    },
    property: { homestead: { amountType: s.property.homestead.amountType } },
  } as StateFacts;
  return {
    slug: s.slug, name: s.name, abbr: s.abbr, facts,
    lookupUrl: S.local.lookupUrl ?? null,
    homestead: { name: s.property.homestead.name ?? null, amountType: s.property.homestead.amountType, amount: s.property.homestead.amount ?? null },
    assessmentRatio: s.property.assessment?.ratio ?? null,
    census: { medianTax: s.census.medianTax, medianValue: s.census.medianValue, effectiveRate: s.census.effectiveRate },
  };
}
