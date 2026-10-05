import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('connecticut');
const S = s.sales, C = s.census, PR = s.property;
const meals = S.otherRates?.[0]?.rate ?? 0;
const luxury = S.otherRates?.[1]?.rate ?? 0;
const rental = S.otherRates?.[2]?.rate ?? 0;
const hol = S.holidays2026?.[0];
const coat = 1200;
const coatRegular = tx('connecticut', coat);
const suv = 58000;
const dinner = 120;
const ratio = PR.assessment?.ratio ?? 0;
const home = C.medianValue;
const assessed = (home * ratio) / 100;
const carValue = 30000;
const carMills = 32.46;
const carMax = (carValue * ratio / 100) * carMills / 1000;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'connecticut',
  title: `Connecticut Sales Tax 2026: ${rate(S.stateRate)} Everywhere, ${rate(luxury)} Luxury`,
  description: `Connecticut sales tax in 2026: one ${rate(S.stateRate)} rate in every town, ${rate(meals)} on meals, ${rate(luxury)} on luxury goods, and property tax on homes and cars (median ${usd(C.medianTax)}).`,
  intro: `No town adds a cent to Connecticut's sales tax, which keeps the rate simple; the towns make up for it with a property tax that reaches the car in the driveway.`,
  resume: `Connecticut charges ${rate(S.stateRate)} in every one of its towns, because no city or county may levy a sales tax of its own. The one rate splits into several by item instead: ${rate(meals)} on meals, ${rate(luxury)} on luxury goods such as cars over $50,000, jewelry over $5,000 and clothing, handbags or watches over $1,000, and ${rate(rental)} on short car rentals. Groceries and prescription drugs are exempt, nonelectronic school supplies are exempt all year, and clothing under $300 an item is free of tax during Sales Tax Free Week in August. Property tax is where Connecticut is expensive: the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51 by rate and ${billRank} by median bill. Towns levy it alone, on 70% of market value, and they tax motor vehicles as well, under a mill rate cap.`,
  sales: (h) => `<p>Because Connecticut has no local sales taxes, the calculator above needs no local rate: what it shows for ${h.rate(S.stateRate)} is the full tax in every town of the state. The complexity is elsewhere, in the rate ladder. The luxury rate of ${h.rate(luxury)} applies to the full price once an item crosses its threshold, not just to the part above it. A ${h.usd(coat)} coat therefore owes ${h.usd(coat * luxury / 100)} instead of the ${h.usd(coatRegular.stateTax, 2)} it would owe at the general rate, and a ${h.usd(suv)} SUV owes ${h.usd(suv * luxury / 100)}. A ${h.usd(dinner)} restaurant bill carries ${h.usd(dinner * meals / 100, 2)} at the meals rate, one point above the general rate.</p>
<p>${hol ? `Sales Tax Free Week ran from ${dayShort(hol.start)} to ${h.day(hol.end)}, the 27th edition.` : 'Sales Tax Free Week falls in August.'} In 2026 the per-item limit on clothing and footwear rose from $100 to $300, with cleated shoes and backpacks now included, in stores and online. Pens, pencils, notebooks, binders, rulers and other nonelectronic school supplies bought for personal use do not need to wait for that week: they are exempt year-round under section 12-412(128) of the General Statutes. A retailer that advertises it will pay or absorb the sales tax for its customers faces a $500 fine per offense.</p>
<p>A few other rates are worth checking before a big purchase: boats, motors and boat trailers pay ${h.rate(S.otherRates?.[3]?.rate ?? 0)}, and business computer and data processing services ${h.rate(S.otherRates?.[4]?.rate ?? 0)}. Nonresident active-duty military stationed in Connecticut buy cars at ${h.rate(S.otherRates?.[5]?.rate ?? 0)} with form CERT-135. Use tax applies at the same rates to goods bought for use in the state without Connecticut tax.</p>`,
  property: (h) => `<p>The state of Connecticut levies no property tax. Each town or city, plus some fire and special districts, assesses and taxes real estate, business personal property and motor vehicles, and sets its own mill rate. Every assessment is a uniform ${h.num(ratio)}% of market value: the Census median home of ${h.usd(home)} has an assessed value of ${h.usd(assessed)}, and each mill of the town's rate costs its owner ${h.usd(assessed / 1000, 2)} a year. Assessment years start on October 1, and towns revalue at least every five years on a schedule the Office of Policy and Management sets for each revaluation zone. After a revaluation, comparing mill rates between towns says little until both have revalued.</p>
<p>The car tax surprises newcomers. A vehicle is assessed at the same ${h.num(ratio)}% and taxed by the town, but the vehicle mill rate is capped at ${h.num(carMills, 2)}, so a ${h.usd(carValue)} car can owe at most ${h.usd(carMax, 2)} a year. Since July 1, 2025, towns may set a lower vehicle rate, down to zero.</p>
<p>There is no homestead exemption for all owners. Owners aged 65 or older or totally disabled with income under the indexed limits can cut their bill by 10% to 50% through the state circuit breaker, worth up to $1,250 for married owners and $1,000 for single ones, claimed with the local assessor. At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(350000)} home pays about ${h.usd(ptx('connecticut', 350000))} a year. Each town sets its due dates; an installment becomes delinquent one month after it is due, and late tax costs 18% a year, every part of a month counting as a full month.</p>`,
  faqs: [
    { q: 'Is there a luxury tax in Connecticut?', a: `Yes, ${rate(luxury)} instead of ${rate(S.stateRate)} on most cars over $50,000, jewelry over $5,000, and clothing, footwear, handbags, luggage, umbrellas, wallets or watches over $1,000. The higher rate applies to the full sales price once the item is above its threshold, not only to the excess. Below those amounts, the general rate applies, and no town adds a local tax in either case.` },
    { q: 'Do you pay property tax on cars in Connecticut?', a: `Yes. Towns tax registered motor vehicles as personal property, assessed at ${ratio}% of value, but the vehicle mill rate may not exceed ${carMills} mills: a ${usd(carValue)} car owes at most ${usd(carMax, 2)} a year. Since July 1, 2025, a town may choose a lower rate for vehicles, even zero, while keeping a higher mill rate on homes.` },
    { q: 'What can you buy tax free during Connecticut Sales Tax Free Week?', a: `In 2026, most clothing and footwear priced under $300 per item, up from the old $100 limit, with cleated shoes and backpacks now included, whether bought in a store or online. The week ran ${hol ? `from ${dayShort(hol.start)} to ${day(hol.end)}` : 'in August'}. Nonelectronic school supplies such as pens and notebooks are exempt all year, so they need no special week.` },
  ],
  related: ['new-york', 'massachusetts', 'rhode-island', 'new-jersey', 'sales-tax-holidays', 'property-tax-by-state'],
});
