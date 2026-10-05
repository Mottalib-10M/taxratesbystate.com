/**
 * Engines (sales, property) on synthetic states with known answers, then on every real state file.
 * Hand-computed cases: the expected values are worked out on paper in the comments.
 */
import { describe, it, expect } from 'vitest';
import { salesTax, preTaxFromTotal, addTax, removeTax, stateRateFor, localApplies } from '../src/lib/engine/sales';
import { propertyTax, taxAtEffectiveRate, millsToPercent, percentToMills, millsFromEffective } from '../src/lib/engine/property';
import { STATES, CENSUS } from '../src/lib/engine/states';
import type { StateFacts } from '../src/lib/engine/types';

const mk = (o: Partial<StateFacts['sales']> & { stateRate: number }): StateFacts => ({
  name: 'Testland', abbr: 'TL', slug: 'testland', verified: '2026-10-05',
  sales: {
    hasStateSalesTax: o.stateRate > 0, local: { allowed: true, groceriesTaxedLocally: false }, groceries: { treatment: 'exempt' },
    clothing: { treatment: 'taxed' }, prescriptionDrugs: { treatment: 'exempt' }, ...o,
  } as StateFacts['sales'],
  property: { homestead: { amountType: 'none' } },
});

describe('sales tax engine', () => {
  it('general rate, state plus local: $100 at 6.25% + 2% = $8.25', () => {
    const r = salesTax({ state: mk({ stateRate: 6.25 }), price: 100, localRate: 2 });
    expect(r.stateTax).toBe(6.25); expect(r.localTax).toBe(2); expect(r.tax).toBe(8.25); expect(r.total).toBe(108.25);
  });
  it('rounds each part to the cent: $19.99 at 7.25% = $1.45', () => {
    expect(salesTax({ state: mk({ stateRate: 7.25 }), price: 19.99 }).tax).toBe(1.45); // 1.449275 → 1.45
  });
  it('groceries exempt: no state tax, no local tax unless localities tax food', () => {
    const s = mk({ stateRate: 6 });
    expect(salesTax({ state: s, price: 100, localRate: 1, category: 'groceries' }).tax).toBe(0);
    const s2 = mk({ stateRate: 6, local: { allowed: true, groceriesTaxedLocally: true } });
    expect(salesTax({ state: s2, price: 100, localRate: 1, category: 'groceries' }).tax).toBe(1);
  });
  it('groceries at a reduced rate: $200 at 4% + 2.75% local = $13.50', () => {
    const s = mk({ stateRate: 7, groceries: { treatment: 'reduced', rate: 4 } });
    expect(salesTax({ state: s, price: 200, localRate: 2.75, category: 'groceries' }).tax).toBe(13.5);
    expect(stateRateFor(s, 'groceries').rate).toBe(4);
  });
  it('clothing, excess mode: only the part above $175 is taxed ($200 → $25 × 6.25% = $1.56)', () => {
    const s = mk({ stateRate: 6.25, local: { allowed: false }, clothing: { treatment: 'exempt-under-threshold', threshold: 175, thresholdMode: 'excess' } });
    expect(salesTax({ state: s, price: 200, category: 'clothing' }).tax).toBe(1.56);
    expect(salesTax({ state: s, price: 150, category: 'clothing' }).tax).toBe(0);
  });
  it('clothing, item mode: $109 exempt, $110 taxed in full at the state rate (4.40)', () => {
    const s = mk({ stateRate: 4, clothing: { treatment: 'exempt-under-threshold', threshold: 110, thresholdMode: 'item' } });
    expect(salesTax({ state: s, price: 109, category: 'clothing' }).stateTax).toBe(0);
    expect(salesTax({ state: s, price: 110, category: 'clothing' }).stateTax).toBe(4.4);
  });
  it('clothing fully exempt, prescription drugs exempt', () => {
    const s = mk({ stateRate: 6, clothing: { treatment: 'exempt' } });
    expect(salesTax({ state: s, price: 80, localRate: 1, category: 'clothing' }).tax).toBe(0);
    expect(salesTax({ state: s, price: 80, localRate: 1, category: 'prescription' }).tax).toBe(0);
    expect(localApplies(s, 'clothing')).toBe(false);
  });
  it('no state sales tax, but a local tax: $100 with 5% local = $5', () => {
    const s = mk({ stateRate: 0 });
    const r = salesTax({ state: s, price: 100, localRate: 5 });
    expect(r.stateTax).toBe(0); expect(r.localTax).toBe(5);
  });
  it('no local taxes allowed: a typed local rate is ignored', () => {
    const s = mk({ stateRate: 6.35, local: { allowed: false } });
    expect(salesTax({ state: s, price: 100, localRate: 3 }).tax).toBe(6.35);
  });
  it('negative or absurd input gives zero, never NaN', () => {
    const r = salesTax({ state: mk({ stateRate: 6 }), price: -50, localRate: NaN });
    expect(r.tax).toBe(0); expect(Number.isNaN(r.total)).toBe(false);
  });
  it('reverse: $108.25 at 6.25% + 2% → $100', () => {
    expect(preTaxFromTotal(108.25, { state: mk({ stateRate: 6.25 }), localRate: 2 }).price).toBe(100);
    expect(removeTax(108.25, 8.25)).toBe(100); expect(addTax(100, 8.25)).toBe(108.25);
  });
  it('reverse across a clothing threshold (excess mode): $201.56 → $200', () => {
    const s = mk({ stateRate: 6.25, local: { allowed: false }, clothing: { treatment: 'exempt-under-threshold', threshold: 175, thresholdMode: 'excess' } });
    expect(preTaxFromTotal(201.56, { state: s, category: 'clothing' }).price).toBe(200);
  });
});

describe('state-specific rules from the facts files', () => {
  const get = (slug: string) => STATES.find((s) => s.slug === slug)!;
  it('Illinois: groceries 0% state, 1% local where adopted; drugs 1% state, no local', () => {
    const il = get('illinois');
    expect(salesTax({ state: il, price: 100, category: 'groceries', localRate: 3.75 }).tax).toBe(1);
    expect(salesTax({ state: il, price: 100, category: 'groceries' }).tax).toBe(0);
    expect(salesTax({ state: il, price: 100, category: 'prescription', localRate: 3.75 }).tax).toBe(1);
  });
  it('Virginia: groceries taxed 1% locally everywhere', () => {
    expect(salesTax({ state: get('virginia'), price: 200, category: 'groceries' }).tax).toBe(2);
  });
  it('Massachusetts: $200 suit owes $1.56 (DOR example)', () => {
    expect(salesTax({ state: get('massachusetts'), price: 200, category: 'clothing' }).tax).toBe(1.56);
  });
  it('Rhode Island: $275 coat taxed on $25 (regulation example)', () => {
    const r = salesTax({ state: get('rhode-island'), price: 275, category: 'clothing' });
    expect(r.stateBase).toBe(25); expect(r.tax).toBe(1.75);
  });
  it('New York: $109 shirt no state tax, $110 taxed in full', () => {
    const ny = get('new-york');
    expect(salesTax({ state: ny, price: 109, category: 'clothing' }).stateTax).toBe(0);
    expect(salesTax({ state: ny, price: 110, category: 'clothing' }).stateTax).toBe(4.4);
  });
  it('Alabama, Mississippi, Missouri, Tennessee, Utah: reduced state rate on food', () => {
    for (const [slug, r] of [['alabama', 2], ['mississippi', 5], ['missouri', 1.225], ['tennessee', 4], ['utah', 1.75]] as const)
      expect(salesTax({ state: get(slug), price: 1000, category: 'groceries' }).stateTax, slug).toBeCloseTo(r * 10, 2);
  });
  it('Louisiana 5%, Idaho 6%, Nevada 6.85%, South Dakota 4.2% general rates', () => {
    for (const [slug, r] of [['louisiana', 5], ['idaho', 6], ['nevada', 6.85], ['south-dakota', 4.2]] as const)
      expect(salesTax({ state: get(slug), price: 100 }).stateTax, slug).toBe(r);
  });
  it('Alabama property example: $100,000 home, 10%, 32.5 mills = $325 before exemptions (ALDOR)', () => {
    expect(propertyTax({ marketValue: 100000, assessmentRatio: 10, millRate: 32.5 }).tax).toBe(325);
  });
});

describe('property tax engine', () => {
  it('assessed × mills: $300,000 at 40%, $2,000 exemption, 30 mills = $3,540', () => {
    // 300,000 × 40% = 120,000 ; − 2,000 = 118,000 ; × 30 / 1,000 = 3,540
    const r = propertyTax({ marketValue: 300000, assessmentRatio: 40, exemption: 2000, millRate: 30 });
    expect(r.assessedValue).toBe(120000); expect(r.taxableValue).toBe(118000); expect(r.tax).toBe(3540); expect(r.monthly).toBe(295);
  });
  it('full value, credit off the tax: $250,000 × 20 mills = $5,000, − $600 credit = $4,400', () => {
    expect(propertyTax({ marketValue: 250000, millRate: 20, credit: 600 }).tax).toBe(4400);
  });
  it('exemption larger than the assessed value: tax zero, never negative', () => {
    expect(propertyTax({ marketValue: 40000, assessmentRatio: 50, exemption: 50000, millRate: 25 }).tax).toBe(0);
  });
  it('mills and percent: 1 mill = 0.1%', () => {
    expect(millsToPercent(25)).toBe(2.5); expect(percentToMills(1.2)).toBe(12);
    expect(millsFromEffective(0.012)).toBeCloseTo(12, 9);
    expect(taxAtEffectiveRate(400000, 0.0125)).toBe(5000);
  });
});

describe('state facts files', () => {
  it('51 jurisdictions with a Census row', () => {
    expect(Object.keys(CENSUS.states).length).toBe(51);
    if (STATES.length === 51) expect(new Set(STATES.map((s) => s.abbr)).size).toBe(51);
  });
  it.each(STATES.map((s) => [s.slug, s] as const))('%s: valid facts', (_s, s) => {
    const S = s.sales;
    expect(S.stateRate).toBeGreaterThanOrEqual(0); expect(S.stateRate).toBeLessThan(10);
    expect(S.hasStateSalesTax).toBe(S.stateRate > 0);
    expect(['exempt', 'reduced', 'taxed']).toContain(S.groceries.treatment);
    if (S.groceries.treatment === 'reduced') expect(S.groceries.rate).toBeGreaterThanOrEqual(0);
    expect(['taxed', 'exempt', 'exempt-under-threshold']).toContain(S.clothing.treatment);
    if (S.clothing.treatment === 'exempt-under-threshold') { expect(S.clothing.threshold).toBeGreaterThan(0); expect(['excess', 'item']).toContain(S.clothing.thresholdMode); }
    expect(['exempt', 'taxed']).toContain(S.prescriptionDrugs.treatment);
    for (const hol of S.holidays2026 ?? []) { expect(hol.start).toMatch(/^2026-\d\d-\d\d$/); expect(hol.end >= hol.start).toBe(true); expect(hol.url).toMatch(/^https:\/\//); }
    const urls = [S.local.url, S.local.lookupUrl, S.groceries.url, S.clothing.url, ...(S.facts ?? []).map((f) => f.url), s.property.homestead.url, ...(s.property.facts ?? []).map((f) => f.url)].filter(Boolean) as string[];
    for (const u of urls) expect(u, u).toMatch(/^https:\/\//);
    expect(s.verified).toMatch(/^2026-\d\d-\d\d$/);
    // The engine reproduces the statewide rate on $100 of general goods.
    expect(salesTax({ state: s, price: 100 }).stateTax).toBeCloseTo(S.stateRate, 2);
    // Reverse of the forward result gives the price back, with a local rate of 1.5%.
    const f = salesTax({ state: s, price: 250, localRate: 1.5 });
    expect(preTaxFromTotal(f.total, { state: s, localRate: 1.5 }).price).toBeCloseTo(250, 2);
    // Census ratio is plausible.
    expect(s.census.effectiveRate).toBeGreaterThan(0.001); expect(s.census.effectiveRate).toBeLessThan(0.03);
  });
});
