/**
 * Facts of one jurisdiction, as read on official pages (src/data/states/<slug>.json,
 * schema in research/BRIEF-FAITS.md). Rates are percentages as written by the states (6.25 = 6.25%).
 */
export interface Fact { text: string; url: string }
export interface Holiday { name: string; start: string; end: string; items: string; url: string }
export interface StateFacts {
  name: string;
  abbr: string;
  slug: string;
  verified: string;
  sales: {
    hasStateSalesTax: boolean;
    stateRate: number;
    rateNote?: string | null;
    effectiveSince?: string | null;
    scheduledChanges?: Array<{ date: string; rate: number | null; what: string; url: string }>;
    local: {
      allowed: boolean;
      levies?: string | null;
      cap?: number | null;
      capNote?: string | null;
      groceriesTaxedLocally?: boolean | null;
      /** Fixed local rate on groceries, in percent (Illinois 1% where adopted, Virginia 1% everywhere). */
      groceriesLocalRate?: number | null;
      /** true when that local grocery rate applies everywhere, whatever local rate the visitor types (Virginia). */
      groceriesLocalAlways?: boolean | null;
      lookupUrl?: string | null;
      url?: string | null;
    };
    groceries: { treatment: 'exempt' | 'reduced' | 'taxed'; rate?: number | null; note?: string | null; url?: string | null };
    clothing: { treatment: 'taxed' | 'exempt' | 'exempt-under-threshold'; threshold?: number | null; note?: string | null; url?: string | null;
      /** 'excess': tax only on the part of the price above the threshold (MA, RI); 'item': items under the threshold exempt, items at or above fully taxed (NY). */
      thresholdMode?: 'excess' | 'item' | null;
      /** false when local taxes still apply below the threshold (New York counties that did not elect the exemption). */
      localFollows?: boolean | null };
    prescriptionDrugs: { treatment: 'exempt' | 'taxed'; rate?: number | null; note?: string | null; url?: string | null; localTaxed?: boolean | null };
    otherRates?: Array<{ item: string; rate: number | null; note?: string | null; url: string }>;
    holidays2026?: Holiday[];
    holidayNote?: string | null;
    useTax?: { rate?: number | null; note?: string | null; url?: string | null } | null;
    facts?: Fact[];
  };
  property: {
    levied?: string | null;
    assessment?: { text?: string | null; ratio?: number | null; url?: string | null;
      /** A cap or freeze on yearly growth of the taxable value (or of the bill), set during normalization. */
      capped?: boolean; capText?: string | null; capUrl?: string | null } | null;
    homestead: {
      name?: string | null;
      amountType: 'value-exemption' | 'credit' | 'percent' | 'freeze' | 'none' | string;
      amount?: number | null;
      text?: string | null;
      applyBy?: string | null;
      url?: string | null;
    };
    otherRelief?: Array<{ name: string; text: string; url: string }>;
    dueDates?: { text?: string | null; url?: string | null } | null;
    facts?: Fact[];
  };
  uncertain?: string[];
}

export interface CensusRow {
  medianTax: number;
  medianTaxMoe: number;
  medianTaxWithMortgage: number;
  medianTaxNoMortgage: number;
  medianValue: number;
  /** medianTax / medianValue, a ratio (0.0131 = 1.31%). */
  effectiveRate: number;
}
