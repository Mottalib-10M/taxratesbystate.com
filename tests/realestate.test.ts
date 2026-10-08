/** Real estate engine: hand-checked cases against IRS Pub. 523, Form 8824 instructions, Rev. Proc. 2025-32, Form 706. */
import { describe, it, expect } from 'vitest';
import { sec121, federalGainTax, exchange1031, federalEstateTax, unifiedTax, brackets, stateEstateTax, inheritanceTax, ordinaryTax } from '../src/lib/engine/realestate';

describe('section 121', () => {
  it('full exclusion, joint, 2 of 5 years', () => {
    const r = sec121({ filing: 'joint', price: 900000, sellingCosts: 50000, basis: 350000, monthsOwned: 96, monthsUsed: 96, usedExclusionLast2y: false, partialReason: false, depreciationAfter1997: 0, nonqualifiedMonths: 0 });
    expect(r.gain).toBe(500000); expect(r.exclusion).toBe(500000); expect(r.taxableGain).toBe(0);
  });
  it('partial exclusion: 12 months, single, qualifying reason = half of $250,000', () => {
    const r = sec121({ filing: 'single', price: 600000, sellingCosts: 0, basis: 400000, monthsOwned: 12, monthsUsed: 12, usedExclusionLast2y: false, partialReason: true, depreciationAfter1997: 0, nonqualifiedMonths: 0 });
    expect(r.maxExclusion).toBe(125000); expect(r.taxableGain).toBe(75000);
  });
  it('no reason, under 2 years: nothing excluded', () => {
    const r = sec121({ filing: 'single', price: 600000, sellingCosts: 0, basis: 400000, monthsOwned: 12, monthsUsed: 12, usedExclusionLast2y: false, partialReason: false, depreciationAfter1997: 0, nonqualifiedMonths: 0 });
    expect(r.exclusion).toBe(0);
  });
  it('depreciation after May 6, 1997 is never excluded', () => {
    const r = sec121({ filing: 'single', price: 500000, sellingCosts: 0, basis: 300000, monthsOwned: 60, monthsUsed: 60, usedExclusionLast2y: false, partialReason: false, depreciationAfter1997: 20000, nonqualifiedMonths: 0 });
    expect(r.exclusion).toBe(180000); expect(r.taxableGain).toBe(20000);
  });
});

describe('federal tax on a gain, 2026', () => {
  it('0% up to $49,450 of taxable income for a single filer', () => {
    expect(federalGainTax({ filing: 'single', otherTaxable: 0, ltcg: 49450, unrecaptured: 0 }).federalOnGain).toBe(0);
  });
  it('15% then 20% above $613,700 joint', () => {
    const r = federalGainTax({ filing: 'joint', otherTaxable: 600000, ltcg: 100000, unrecaptured: 0 });
    expect(r.at15).toBe(13700); expect(r.at20).toBe(86300);
    expect(r.onLtcg).toBeCloseTo(13700 * 0.15 + 86300 * 0.2, 6);
    expect(r.niit).toBeCloseTo(100000 * 0.038, 6);
  });
  it('ordinary table: $24,800 joint at 10%', () => expect(ordinaryTax(24800, 'joint')).toBeCloseTo(2480, 6));
  it('unrecaptured 1250 capped at 25%', () => {
    const r = federalGainTax({ filing: 'single', otherTaxable: 700000, ltcg: 0, unrecaptured: 10000 });
    expect(r.on1250).toBeCloseTo(2500, 6);
  });
});

describe('1031 exchange', () => {
  it('trade up with more debt: no boot, all deferred', () => {
    const r = exchange1031({ salePrice: 800000, costs: 45000, adjustedBasis: 420000, depreciation: 180000, oldDebt: 250000, replacementPrice: 1000000, newDebt: 450000 });
    expect(r.realized).toBe(335000); expect(r.boot).toBe(0); expect(r.deferred).toBe(335000); expect(r.newBasis).toBe(665000);
  });
  it('cash out and smaller loan: boot taxed first as depreciation', () => {
    const r = exchange1031({ salePrice: 1000000, costs: 0, adjustedBasis: 400000, depreciation: 100000, oldDebt: 300000, replacementPrice: 900000, newDebt: 260000 });
    // equity 700,000; needed 640,000 → cash boot 60,000; debt relief 40,000 not offset → 100,000 boot
    expect(r.cashBoot).toBe(60000); expect(r.debtBoot).toBe(40000); expect(r.recognized).toBe(100000);
    expect(r.recognized1250).toBe(100000); expect(r.deferred).toBe(500000); expect(r.newBasis).toBe(400000);
  });
});

describe('estate and inheritance', () => {
  it('unified schedule: $1,000,000 → $345,800', () => expect(unifiedTax(1000000)).toBe(345800));
  it('federal: nothing at $15,000,000, 40% above', () => {
    expect(federalEstateTax(15000000)).toBe(0);
    expect(federalEstateTax(16000000)).toBeCloseTo(400000, 6);
  });
  it('marginal brackets', () => expect(brackets(150, [{ from: 0, to: 100, ratePct: 10 }, { from: 100, to: null, ratePct: 20 }])).toBeCloseTo(20, 6));
  it('excess method', () => expect(stateEstateTax(3000000, { slug: 'x', name: 'X', exemption: 2000000, brackets: [{ from: 0, to: null, ratePct: 10 }], method: 'excess' })).toBeCloseTo(100000, 6));
  it('Illinois: $285,714 on $5,000,000 (Attorney General example)', () => {
    const T = [[0, 40000, 0], [40000, 90000, 0.8], [90000, 140000, 1.6], [140000, 240000, 2.4], [240000, 440000, 3.2], [440000, 640000, 4], [640000, 840000, 4.8], [840000, 1040000, 5.6], [1040000, 1540000, 6.4], [1540000, 2040000, 7.2], [2040000, 2540000, 8], [2540000, 3040000, 8.8], [3040000, 3540000, 9.6], [3540000, 4040000, 10.4], [4040000, 5040000, 11.2], [5040000, null, 12]].map(([from, to, ratePct]) => ({ from: from as number, to: to as number | null, ratePct: ratePct as number }));
    expect(Math.round(stateEstateTax(5000000, { slug: 'illinois', name: 'Illinois', exemption: 4000000, brackets: T, method: 'illinois' }))).toBe(285714);
    // Massachusetts: table on $2,000,000 − $60,000 = $99,600 = the credit, so nothing at the threshold.
    expect(stateEstateTax(2000000, { slug: 'm', name: 'M', exemption: 2000000, brackets: T, method: 'credit', offset: 60000, credit: 99600 })).toBe(0);
    expect(stateEstateTax(2100000, { slug: 'm', name: 'M', exemption: 2000000, brackets: T, method: 'credit', offset: 60000, credit: 99600 })).toBeCloseTo(7200, 6);
  });
  it('inheritance: exemption then rate', () => expect(inheritanceTax(150000, { who: 'x', exemption: 100000, brackets: [{ from: 0, to: null, ratePct: 1 }] })).toBeCloseTo(500, 6));
});
