import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('rhode-island');
const S = s.sales, C = s.census;
const T = S.clothing.threshold ?? 0;
const mealsRate = S.otherRates?.[0]?.rate ?? 0;
const strRate = S.otherRates?.[2]?.rate ?? 0;
const atTable = S.stateRate + mealsRate;
const coat = tx('rhode-island', 275, 'clothing');
const boots = tx('rhode-island', 400, 'clothing');
const suit = tx('rhode-island', 640, 'clothing');
const dinner = 90;
const dinnerTax = (dinner * atTable) / 100;
// Non-Owner Occupied Property Tax, as written in the Division of Taxation advisory: $2.50 per $500 above $1,000,000.
const NOOP_FLOOR = 1000000, NOOP_PER = 2.5, NOOP_STEP = 500;
const noop = (value: number) => (Math.max(0, value - NOOP_FLOOR) / NOOP_STEP) * NOOP_PER;
const beachHouse = 1400000;
const home = 400000;
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'rhode-island',
  title: `Rhode Island Sales Tax 2026: ${rate(S.stateRate)} Flat, Clothing Over ${usd(T)}`,
  description: `Rhode Island sales tax in 2026: one ${rate(S.stateRate)} rate statewide, clothing taxed only above ${usd(T)} an item, ${rate(atTable)} on restaurant meals, and a ${usd(C.medianTax)} median property tax bill.`,
  intro: `No town adds its own sales tax, a coat is taxed only on the dollars above ${usd(T)}, and since July 2026 the state taxes pricey second homes directly.`,
  resume: `Rhode Island applies a single ${rate(S.stateRate)} sales tax across the whole state, and none of its 39 cities and towns may stack a general rate on top, so the tax on a lamp or a laptop is the same at every address. What varies is the base. Clothing and footwear are tax-free up to ${usd(T)} per item, and above that line only the excess is taxed: a ${usd(275)} coat owes ${usd(coat.tax, 2)}, not ${rate(S.stateRate)} of the full price. Groceries and prescription drugs are exempt. Restaurant meals pay a further ${rate(mealsRate)} local meals and beverage tax, ${rate(atTable)} in all, and since January 1, 2026 short-term stays carry a 2% local hotel share, with whole-home rentals adding a new ${rate(strRate)} tax. Property tax belongs to the cities, towns and fire districts. The Census put the median bill at ${usd(C.medianTax)} on a ${usd(C.medianValue)} home in 2024, an effective ${eff(C.effectiveRate)}, with the median bill ranked ${billRank} of 51. Since July 1, 2026 the state also taxes homes assessed above $1,000,000 that are not the owner's primary residence.`,
  sales: (h) => `<p>A flat statewide rate changes how a Rhode Islander shops. There is no address lookup to run and no county line to cross for a cheaper rate: ${h.rate(S.stateRate)} is the answer in every one of the 39 municipalities, and the same ${h.rate(S.stateRate)} is owed as use tax on goods bought out of state without Rhode Island tax. The calculator above therefore needs no local rate at all.</p>
<p>The clothing rule is where the arithmetic gets interesting, because the exemption works as a deductible rather than a ceiling. The first ${h.usd(T)} of each garment is untaxed, the remainder pays ${h.rate(S.stateRate)}. Leather boots at ${h.usd(400)} owe ${h.usd(boots.tax, 2)}, an effective ${h.num(boots.effectiveRate, 2)}%, and even a ${h.usd(640)} suit pays only ${h.usd(suit.tax, 2)}. Two limits apply: the threshold is counted item by item, and pieces normally sold together, such as the jacket and trousers of that suit, cannot be rung up separately to squeeze each under ${h.usd(T)}. Choose "Clothing" in the calculator to see the deduction applied.</p>
<p>Eating out is taxed twice over. Every restaurant, café and bar adds the ${h.rate(mealsRate)} local meals and beverage tax, collected by the state and handed back to the city or town, so a ${h.usd(dinner)} dinner carries ${h.usd(dinnerTax, 2)} of tax, often printed as a single ${h.rate(atTable)} line. Candy, soft drinks and prepared food are taxed even when bought at a grocery. Lodging moved in 2026: the local hotel share doubled to 2% on January 1, and renting an entire house for a short stay now adds a ${h.rate(strRate)} whole-home tax. Tax on a room stops after 30 consecutive days, and checking out restarts the count.</p>`,
  property: (h) => `<p>Each of the 39 cities and towns runs its own assessment, valuing property as of December 31, and its tax rate is set per ${h.usd(1000)} of assessed value. State law sets the rhythm: a statistical update in the third and sixth years and a full revaluation every ninth year, so a bill can jump in a revaluation year even when the rate stands still. Towns may also tax classes of property at different rates; West Warwick uses four. A total levy cannot rise more than 4% over the previous fiscal year unless an exception applies, which caps the town's budget, not your individual bill.</p>
<p>There is no statewide homestead exemption, so any break for owner-occupants comes from your own town's rate structure. Cars, at least, have left the bill: the motor vehicle excise column reads $0.00 for every municipality in the FY2026 table. Apply the statewide Census ratio of ${h.eff(C.effectiveRate)} to a ${h.usd(home)} house and the bill lands near ${h.usd(ptx('rhode-island', home))}, though your town's own rate decides the real figure.</p>
<p>The novelty of 2026 sits at the top of the market. Since July 1, the state taxes residential property assessed above ${h.usd(NOOP_FLOOR)} that is not the owner's primary residence, at $2.50 for each $500 of value beyond the first million, with a first payment due September 15, 2026. A ${h.usd(beachHouse)} summer house therefore owes ${h.usd(noop(beachHouse))} to the state on top of its town bill. A home rented long term, or as a taxable short-term rental for 183 days or more in the year, is exempt from that charge.</p>`,
  faqs: [
    { q: 'How much tax is on a $300 jacket in Rhode Island?', a: `${usd(tx('rhode-island', 300, 'clothing').tax, 2)}. Rhode Island exempts the first ${usd(T)} of each clothing or footwear item and charges its ${rate(S.stateRate)} sales tax only on the part above it, so the jacket is taxed on ${usd(300 - T)}. No city or town tax is added anywhere in the state. The rule is per item, but a suit or other set normally sold as one unit cannot be split to fit under the limit.` },
    { q: 'Why is the restaurant tax 8% in Rhode Island?', a: `Because two taxes apply to meals. Rhode Island's ${rate(S.stateRate)} sales tax is joined by a ${rate(mealsRate)} local meals and beverage tax charged by every eating and drinking establishment, giving ${rate(atTable)}. The state collects the extra ${rate(mealsRate)} and distributes it to the city or town where the meal was served. Restaurants may print both as one combined line. A ${usd(dinner)} dinner carries ${usd(dinnerTax, 2)} in total.` },
    { q: 'Who pays the Rhode Island tax on second homes over $1 million?', a: `Owners of residential property assessed above ${usd(NOOP_FLOOR)} that is not their primary residence, since July 1, 2026. The tax is $2.50 per $500 of assessed value above one million, so a ${usd(beachHouse)} vacation home owes ${usd(noop(beachHouse))} a year to the state, on top of the city or town bill. Homes rented long term or as taxable short-term rentals for 183 days or more in the year are exempt.` },
  ],
  related: ['massachusetts', 'connecticut', 'new-york', 'clothing-sales-tax-by-state', 'property-tax-by-state'],
});
