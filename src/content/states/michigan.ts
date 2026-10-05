import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('michigan');
const S = s.sales, C = s.census;
const heat = S.otherRates?.[0]?.rate ?? 0;
// Proposal A multiplier, PRE and State Education Tax mills: figures in the assessment text and facts.
const irm = 1.027;
const preMills = 18, setMills = 6;
const heatBill = 240;
const couch = tx('michigan', 1500);
const tv = 120000; // example taxable value
const tv2026 = tv * irm;
const home = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'michigan',
  title: `Michigan Property Tax 2026: Taxable Value Cap, ${rate(S.stateRate)} Sales Tax`,
  description: `Michigan in 2026: ${rate(S.stateRate)} sales tax with no local tax, ${rate(heat)} on home heating, food untaxed by the constitution, and taxable value capped at 2.7% until a home is sold.`,
  intro: `A flat ${rate(S.stateRate)} sales tax written around a constitutional food exemption, and a property tax where two identical houses on the same street can carry very different bills.`,
  resume: `Michigan's property tax is built on taxable value, not market value: under Proposal A of 1994 the taxable value of a home can grow each year only by the State Tax Commission's inflation multiplier, ${irm} or 2.7% for 2026, until the property is sold, when it uncaps the following year and resets toward market. A long-time owner and a new buyer next door can therefore pay very different amounts. The Principal Residence Exemption removes up to ${preMills} mills of school operating tax from a main home, and every property pays the ${setMills}-mill State Education Tax on the summer bill. Census data give a median bill of ${usd(C.medianTax)}, rank ${billRank} of 51, on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)} of value. The sales tax is simpler: ${rate(S.stateRate)} everywhere, since local units may not levy one, with residential electricity, gas and heating fuel at ${rate(heat)}. The constitution forbids taxing food except prepared food, and since February 2024 food sold with utensils counts as prepared. Prescription drugs are exempt, clothing is taxed, and Michigan has no holiday.`,
  sales: (h) => `<p>The single rate makes most Michigan purchases easy to check: a ${h.usd(1500)} couch carries ${h.usd(couch.tax, 2)} of tax in a city mall and in a lakeside general store alike, and the calculator above needs no local entry. Home energy is the one reduced rate. Residential electricity, natural gas and heating fuel pay ${h.rate(heat)}, so a ${h.usd(heatBill)} winter heating bill carries ${h.usd((heatBill * heat) / 100, 2)} instead of ${h.usd(tx('michigan', heatBill).tax, 2)}.</p>
<p>The food exemption sits in the constitution itself, article IX, section 8, which allows only prepared food to be taxed. What counts as prepared changed on February 13, 2024: besides food sold hot or mixed by the seller, food becomes taxable when the seller provides utensils such as forks, napkins or straws. A deli salad handed over with a fork is taxed; the same container taken from the cooler without one is not. Bread, bagels, muffins and cookies stay exempt when sold without utensils.</p>
<p>Use tax follows the same ${h.rate(S.stateRate)} rate on online and out-of-state purchases, with credit for tax paid to another state. Two exceptions are worth knowing. A car bought from a spouse, parent, sibling, child, grandparent, step-relative or in-law owes no use tax. And a resident who brings home an item bought for personal use elsewhere more than 360 days after buying it owes nothing; for nonresidents moving in, the window is 90 days.</p>`,
  property: (h) => `<p>Local assessors in each city and township set two numbers for every parcel. Assessed value follows the market; taxable value, the one the millage applies to, is capped. For 2026 the State Tax Commission fixed the inflation rate multiplier at ${h.num(irm, 3)}, and assessors may use no other figure. A home with a taxable value of ${h.usd(tv)} in 2025 can reach at most ${h.usd(tv2026)} in 2026, even if its market value jumped 10%. When ownership changes, the cap lifts the next year and taxable value moves up toward the assessed value, which is why buyers should look at the seller's taxable value with caution: their own bill may be much higher.</p>
<p>Millage is levied by cities, townships, villages, counties, school districts and special authorities. Two levies stand out. The Principal Residence Exemption frees a main home from up to ${h.num(preMills)} mills of local school operating tax; on that ${h.usd(tv)} taxable value it is worth up to ${h.usd((tv * preMills) / 1000)} a year. File the PRE affidavit with your city or township assessor. The ${h.num(setMills)}-mill State Education Tax applies to everyone and arrives with the summer tax, ${h.usd((tv * setMills) / 1000)} on the same home.</p>
<p>On top of the bill, the Homestead Property Tax Credit on the Michigan income tax return helps homeowners and renters with household resources under an annual limit, and it can be claimed up to four years back. Deferment programs and veterans' exemptions also exist. As a rough benchmark, the statewide ratio of ${h.eff(C.effectiveRate)} applied to the median ${h.usd(home)} home gives about ${h.usd(ptx('michigan', home))}, effective-rate rank ${effRank} of 51.</p>`,
  faqs: [
    { q: 'Why did my property taxes go up after buying a house in Michigan?', a: `Because the taxable value uncapped. Under Proposal A, a Michigan home's taxable value can rise each year only by the inflation multiplier, ${irm} for 2026, but in the year after a sale it resets toward the assessed value. If the previous owner held the home for years, their capped value may have been far below market. File the Principal Residence Exemption affidavit to avoid paying school operating mills too.` },
    { q: 'Is takeout food taxed in Michigan?', a: `Often, yes. Michigan's constitution exempts food except prepared food, and since February 13, 2024 food counts as prepared when the seller provides utensils such as forks, napkins or straws, as well as when it is sold heated or mixed by the seller. Taxable food pays the ${rate(S.stateRate)} rate with no local tax. Bakery items sold without utensils remain exempt.` },
    { q: 'How much is the Michigan principal residence exemption worth?', a: `It exempts your main home from up to ${preMills} mills of local school operating tax, which is ${usd(preMills)} per ${usd(1000)} of taxable value. On a home with ${usd(tv)} of taxable value, that is up to ${usd((tv * preMills) / 1000)} a year. It does not remove the ${setMills}-mill State Education Tax. File the PRE affidavit with the assessor of your city or township.` },
  ],
  related: ['ohio', 'indiana', 'wisconsin', 'minnesota', 'property-tax-assessment-caps', 'how-property-tax-is-calculated'],
});
