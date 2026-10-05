import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('arizona');
const S = s.sales, C = s.census, PR = s.property;
const lodging = S.otherRates?.[0]?.rate ?? 0;
const base = 5;
const increment = S.stateRate - base;
const fridge = tx('arizona', 1200);
const ratio = PR.assessment?.ratio ?? 0;
const rebate = PR.homestead.amount ?? 0;
const lpv = 320000;
const lpvNext = lpv * 1.05;
const primaryCap = lpv * 0.01;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'arizona',
  title: `Arizona Sales Tax 2026: ${rate(S.stateRate)} State TPT Plus City Rates`,
  description: `Arizona sales tax in 2026 is a ${rate(S.stateRate)} transaction privilege tax on sellers, plus county and city TPT. Property tax: 5% value cap, ${usd(rebate)} homeowner rebate.`,
  intro: `Arizona never adopted a sales tax in the textbook sense: the seller owes a tax for the privilege of doing business, and the buyer usually sees it passed through on the receipt.`,
  resume: `Arizona's ${rate(S.stateRate)} state rate belongs to a transaction privilege tax, or TPT, which the law places on the vendor rather than the customer; most sellers pass it on, so in practice it looks like a sales tax. The ${rate(S.stateRate)} is a ${rate(base)} base rate plus a ${rate(increment)} education increment approved by voters, and counties and cities add their own TPT, all collected by the Department of Revenue (ADOR). Groceries are exempt from the state TPT but cities and towns may still tax them; prescription drugs are exempt from state and city tax alike; clothing is taxed, and there is no holiday. Property tax is light: the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51. Homes are taxed on a limited property value that may grow 5% a year at most, and owner-occupants get a state rebate of up to ${usd(rebate)}.`,
  sales: (h) => `<p>Because TPT is a tax on the business, the classification of the business matters more than the item. Retail sales pay the ${h.rate(S.stateRate)} rate; hotels and short-term lodging start from a state base of ${h.rate(lodging)} before the education increment and local add-ons; commercial leases owe no state TPT at all, though cities may tax them. A ${h.usd(1200)} refrigerator carries ${h.usd(fridge.stateTax, 2)} of state TPT, and the county and city portions come on top. ADOR collects every layer, so one return covers the state, the county and the city, and its address tool returns the combined rate to type into the calculator above.</p>
<p>City TPT has its own habits. Cities must follow the state's retail rules, yet they keep the right to tax food for home consumption, which is why a grocery bill in one town shows tax and in the next one does not. Some cities apply tiered rates to single items priced above a threshold, taxing either the whole item or only the part above it at the special rate, which matters for furniture, appliances and other big tickets. A city that changes its rate must wait out a 60-day notice period agreed with ADOR. Since January 1, 2025, no city or town may tax residential rent.</p>
<p>Two rules concern buyers who cross state lines. Goods bought from out-of-state retailers without Arizona tax owe use tax at ${h.rate(S.useTax?.rate ?? S.stateRate)}, the same rate as retail TPT, increment included. And a nonresident buying a car in Arizona pays a reduced state rate when the vehicle tax of their home state is lower than Arizona's.</p>`,
  property: (h) => `<p>Arizona taxes homes on a figure that is not their market price. The county assessor sets a full cash value and a limited property value (LPV), which can rise by no more than 5% a year and never above full cash value. Primary taxes are computed on the LPV. Owner-occupied homes, class three, are assessed at ${h.num(ratio)}% of it; residential rentals, class four, use the same ratio but lose the homeowner rebate; commercial property was assessed at 25% in 2005 and is down to 15.5% in 2026, then 15% from 2027.</p>
<p>A home with an LPV of ${h.usd(lpv)} has an assessed value of ${h.usd(lpv * ratio / 100)}, and next year its LPV can reach at most ${h.usd(lpvNext)} whatever the market does. Two protections then apply to the bill. The Arizona Constitution limits primary taxes on a home to 1% of its LPV, ${h.usd(primaryCap)} in this example, with bonds and voter-approved overrides outside the limit. The state also pays part of each owner-occupied home's school district primary tax, which cuts the bill by up to ${h.usd(rebate)}; the county applies it from the primary residence classification, with no separate form.</p>
<p>At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(450000)} home pays about ${h.usd(ptx('arizona', 450000))} a year. County treasurers send one bill for the county, cities, school districts, community colleges and special districts. The first half is due October 1 and becomes delinquent after November 1 at 5 p.m.; the second half is due March 1 and becomes delinquent after May 1. Paying the whole year by December 31 avoids interest, and late taxes otherwise bear 16% a year. Widows, widowers and totally disabled residents within income limits have a separate exemption, and a veteran rated 100% service-connected disabled pays nothing on the primary residence.</p>`,
  faqs: [
    { q: 'Is Arizona TPT the same thing as sales tax?', a: `Not legally. The transaction privilege tax is levied on the seller for the privilege of doing business in Arizona, while a true sales tax falls on the buyer. Sellers usually pass TPT on as a line on the receipt, so shoppers pay the ${rate(S.stateRate)} state rate plus county and city TPT either way. Prescription drugs and grocery food escape the state part, and residential rent has been free of city TPT since January 1, 2025.` },
    { q: 'Do Arizona cities tax groceries?', a: `Some do. Food for home consumption sold by grocery-type retailers is exempt from the ${rate(S.stateRate)} state TPT, but state law lets cities and towns keep their own TPT on food. Whether a grocery bill shows tax therefore depends on the town where you shop. Food eaten on the premises is taxable everywhere, and prescription drugs are exempt from both state and city tax.` },
    { q: 'How much can my Arizona property value go up each year for taxes?', a: `The limited property value used for primary taxes can rise by at most 5% a year, and it can never exceed the full cash value set by the county assessor. On an owner-occupied home it is then assessed at ${ratio}%, and primary taxes cannot exceed 1% of the limited value, with voter-approved bonds and overrides charged outside that limit.` },
  ],
  related: ['california', 'nevada', 'new-mexico', 'utah', 'local-sales-tax-rates', 'property-tax-assessment-caps'],
});
