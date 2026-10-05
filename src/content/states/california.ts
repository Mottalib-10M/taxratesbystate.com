import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('california');
const S = s.sales, C = s.census, PR = s.property;
const statePart = 6;
const bradley = S.stateRate - statePart;
const districtCap = S.local.cap ?? 0;
const laptop = tx('california', 1400);
const ho = PR.homestead.amount ?? 0;
const bought = 650000;
const baseRate = 0.01;
const years = 10;
const capped = bought * Math.pow(1.02, years);
const firstBill = (bought - ho) * baseRate;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'california',
  title: `California Sales Tax 2026: ${rate(S.stateRate)} Base Rate and Prop 13`,
  description: `California sales tax in 2026: a ${rate(S.stateRate)} statewide base plus district taxes of up to ${rate(districtCap)} per county, food exempt, and Prop 13 property tax (median ${usd(C.medianTax)}).`,
  intro: `A single statewide base rate sits under a patchwork of voter-approved district taxes, while property tax follows the purchase price rather than the market.`,
  resume: `California's statewide sales tax rate is ${rate(S.stateRate)}, unchanged since January 1, 2017. It splits into ${rate(statePart)} for the state and ${rate(bradley)} of local Bradley-Burns tax charged everywhere, and most areas then add voter-approved district taxes of 0.10% to 2.00% each, capped in principle at ${rate(districtCap)} combined per county, though some jurisdictions have special authority to go beyond. Food products are exempt, hot prepared food and meals are not, prescription drugs are exempt and clothing is taxed, with no holiday. The California Department of Tax and Fee Administration (CDTFA) publishes a new rate table every quarter. Property tax runs on Proposition 13: a home is taxed at 1% of its base-year value, the purchase price, which can rise no more than 2% a year until it is sold, plus voter-approved debt. The median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), ranked ${billRank} of 51 by bill but ${effRank} by effective rate at ${eff(C.effectiveRate)}.`,
  sales: (h) => `<p>Every California receipt starts from the same ${h.rate(S.stateRate)}. That base is lower than it was: it peaked at 8.25% from April 2009 to June 2011 and fell from 7.50% to its present level on January 1, 2017. What changes from one address to another is the district layer. Cities, counties and special districts ask voters for taxes of 0.10% to 2.00% each, earmarked for transportation, public safety or general purposes, and a single address can sit under several of them. Under Revenue and Taxation Code section 7251.1 their combined rate in a county should not pass ${h.rate(districtCap)}, which would put the usual ceiling at ${h.rate(S.stateRate + districtCap)}, yet specific statutes let some places exceed it. The CDTFA rate map gives the exact figure for an address; the current table took effect on October 1, 2026.</p>
<p>A ${h.usd(1400)} laptop owes ${h.usd(laptop.stateTax, 2)} at the base rate before any district tax. Groceries carry nothing, under Regulation 1602, but hot prepared food or a restaurant meal is taxed at the full local rate. Clothing has no exemption at any price, and there is no tax-free weekend to wait for.</p>
<p>Use tax closes the gap on purchases made without California tax, from an out-of-state website or abroad. Individuals can report it on their state income tax return, with CDTFA's lookup table if they prefer an estimate, at ${h.rate(S.stateRate)} plus the district tax of the place of use. Vehicles, vessels and aircraft cannot go on the income tax return; their use tax is handled separately.</p>`,
  property: (h) => `<p>Proposition 13 sets California's property tax on the price paid, not on today's market. The county assessor records a base-year value at purchase or new construction; each year it may rise by no more than 2%, and it is reset to market value only on a change of ownership or new construction. The general levy is 1% of that taxable value, and voter-approved bonds add their own rate on top. Two neighbors in identical houses can therefore pay very different bills, the long-time owner often far less than the recent buyer.</p>
<p>Take a home bought for ${h.usd(bought)}. With the ${h.usd(ho)} Homeowners' Exemption, the 1% levy comes to ${h.usd(firstBill)} in the first year, before bonds. After ${years} years at the maximum 2% growth, its taxable value can reach only ${h.usd(capped)}, whatever the market has done. The exemption is claimed once on form BOE-266 with the county assessor, by February 15 for the full year, and the home must be the principal residence on the January 1 lien date. At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(800000)} home pays about ${h.usd(ptx('california', 800000))}.</p>
<p>Proposition 19 governs moves and inheritances. Owners aged 55 or older, severely disabled owners and disaster victims can carry their taxable value to a replacement home anywhere in the state, up to three times. A family home passed to a child keeps its old value only if the child lives there, and only up to the factored base-year value plus $1 million: in the Board of Equalization's example, a home with a ${h.usd(300000)} factored value and a ${h.usd(1500000)} market value adds ${h.usd(200000)} to its taxable value. Secured bills go out by November 1; the first installment is delinquent after December 10 and the second after April 10.</p>`,
  faqs: [
    { q: 'What is the highest sales tax rate in California?', a: `The statewide base is ${rate(S.stateRate)}, and district taxes approved by local voters are added on top. Their combined rate is limited to ${rate(districtCap)} per county by section 7251.1 of the Revenue and Taxation Code, which would give ${rate(S.stateRate + districtCap)}, but special statutes allow some cities and districts to go higher. CDTFA's rate map shows the exact figure for any address, updated each quarter.` },
    { q: 'How much does the California homeowners exemption save?', a: `It takes ${usd(ho)} off the taxable value of a home that is your principal residence on January 1. At the 1% general levy, that is about ${usd(ho * baseRate)} a year, more where voter-approved bonds raise the rate. File form BOE-266 once with the county assessor, by February 15 for the full exemption, and cancel it by December 10 if the home stops being your residence.` },
    { q: 'Can I keep my Prop 13 tax base if I move in California?', a: `Yes, if you are 55 or older, severely disabled or a disaster victim. Proposition 19 lets you transfer the taxable value of your old home to a replacement home anywhere in California, up to three times in your life. Other buyers have the new home reassessed at its purchase price, which then becomes its base-year value under Proposition 13.` },
  ],
  related: ['oregon', 'nevada', 'arizona', 'washington', 'use-tax', 'property-tax-assessment-caps'],
});
