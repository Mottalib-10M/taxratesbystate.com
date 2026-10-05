import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('wyoming');
const S = s.sales, C = s.census, PR = s.property;
const countyCap = S.local.cap ?? 0;
// Cities and towns may add up to 1%, and combined rates generally reach 8%, as written in the rate notes.
const CITY = 1, TOP = 8;
const lodging = S.otherRates?.[0]?.rate ?? 0;
const saddle = 1200;
const saddleLow = tx('wyoming', saddle);
const saddleTop = tx('wyoming', saddle, 'general', TOP - S.stateRate);
const ratio = PR.assessment?.ratio ?? 0;
const hx = PR.homestead.amount ?? 0;
// The homeowner exemption applies on the first $1,000,000 of value; the 4% yearly cap on assessed value of a home.
const HX_LIMIT = 1000000, CAP = 4;
const assessedOf = (value: number) => (value * ratio) / 100;
const exemptOf = (value: number) => (Math.min(value, HX_LIMIT) * hx) / 100;
const v = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'wyoming',
  title: `Wyoming Sales Tax 2026: ${rate(S.stateRate)} State, Homes Assessed at ${ratio}%`,
  description: `Wyoming sales tax in 2026: ${rate(S.stateRate)} state rate plus county pennies, ${rate(S.stateRate)} to ${rate(TOP)} combined; homes assessed at ${ratio}% of fair market value with a ${hx}% homeowner exemption.`,
  intro: `A ${rate(S.stateRate)} state rate, local pennies that need a vote, and homes taxed on ${ratio}% of their value, with a quarter of that value exempt for owners who live there.`,
  resume: `Wyoming's state sales tax is ${rate(S.stateRate)}, a 3% base plus a point added on July 1, 1993, and roughly 30% of what it raises goes back to local governments. Counties may add voter-approved "pennies" for general, specific or economic development purposes, up to ${rate(countyCap)} combined, cities up to ${rate(CITY)}, and resort districts up to 3%, so combined rates generally run from ${rate(S.stateRate)} to ${rate(TOP)}, set by the county where the buyer takes possession. Food for home consumption and prescription drugs are exempt, and local taxes follow the same food exemption; clothing and over-the-counter medicine are taxed, and there is no holiday. Property tax is moderate: the 2024 median bill was ${usd(C.medianTax)} on a median home of ${usd(C.medianValue)} (Census ACS), an effective ${eff(C.effectiveRate)}, rank ${effRank} of 51. Homes are assessed at ${ratio}% of fair market value, a homeowner exemption removes ${hx}% of value on the first ${usd(HX_LIMIT)} for owners living there at least eight months a year, and a home's assessed value may rise at most ${CAP}% a year.`,
  sales: (h) => `<p>A Wyoming penny is a ballot question before it is a tax. Each optional county levy, whether for general revenue, a specific project or economic development, must be approved by the county's voters, and a proposal that fails cannot return to the ballot for at least 11 months. Together the county taxes may not exceed ${h.rate(countyCap)}; a city or town can add up to ${h.rate(CITY)} under its own authority, and a resort district up to 3%. In practice, a ${h.usd(saddle)} saddle costs ${h.usd(saddleLow.tax, 2)} in tax in a county with no penny and ${h.usd(saddleTop.tax, 2)} where the combined rate reaches ${h.rate(TOP)}.</p>
<p>The rate follows the buyer. Wyoming is destination-based, so the county where the customer takes possession sets the local part, for a shipped order as much as for a counter sale. The Department of Revenue offers no address lookup on its own site; the county rate sheets it publishes give the local figure to enter in the calculator above. Goods bought outside Wyoming without tax owe use tax at the rate of the place where they are used, which buyers report themselves.</p>
<p>The exemptions are short. Groceries for home consumption are exempt at both state and local level, but restaurant meals, alcohol and tobacco are taxed. Only prescribed drugs, insulin, oxygen and medical devices sold under prescription escape the tax; aspirin and cold medicine do not. Hotel guests pay a mandatory ${h.rate(lodging)} statewide lodging tax, 3% to the state and 2% to the local jurisdiction, plus up to 2% of optional local lodging tax and sales tax. A refund of tax charged in error is requested from the seller, within three years.</p>`,
  property: (h) => `<p>County assessors set fair market value, and the taxable figure is only ${h.num(ratio, 1)}% of it for homes and most other property (11.5% for industrial property). Before the homeowner exemption, the Census median home of ${h.usd(v)} is assessed at ${h.usd(assessedOf(v))}. The exemption takes ${h.num(hx)}% of fair market value off a single family home and its land, on value up to ${h.usd(HX_LIMIT)}, so the same home is taxed on ${h.usd(assessedOf(v - exemptOf(v)))}. From tax year 2026 the owner must live in the home at least eight months a year, active-duty military excepted.</p>
<p>A second brake limits growth: the assessed value of a single family home and its land may not rise more than ${h.num(CAP)}% over the prior year, and anything above is exempt, unless the owner bought the home the year before or made structural changes. A buyer is valued at full market value the year after the purchase, so neighbors in identical houses can owe very different amounts. Statewide, the Census ratio of ${h.eff(C.effectiveRate)} means about ${h.usd(ptx('wyoming', 450000))} a year on a ${h.usd(450000)} house.</p>
<p>Owners 65 or older who have paid Wyoming residential property tax for 25 years or more can claim the long-term homeowner exemption instead: 50% of the value of the primary residence, on up to $3,000,000, claimed with the county assessor by March 1. It cannot be combined with the ${h.num(hx)}% exemption, and it is repealed effective July 1, 2027. The county treasurer collects half the tax by November 10 and half by May 10, and paying the whole bill by December 31 avoids interest and penalty.</p>`,
  faqs: [
    { q: 'How do county pennies work in Wyoming sales tax?', a: `Each penny is an optional county sales tax that county voters must approve. Wyoming counties can levy general purpose, specific purpose and economic development taxes, together capped at ${rate(countyCap)}, on top of the ${rate(S.stateRate)} state rate. A defeated proposal cannot go back to the ballot for at least 11 months. Cities may add up to ${rate(CITY)}, so combined rates generally run from ${rate(S.stateRate)} to ${rate(TOP)}.` },
    { q: 'Who qualifies for the Wyoming homeowner property tax exemption?', a: `Owners of a single family home who live in it at least eight months a year, from tax year 2026, with an exception for active-duty military. The exemption removes ${hx}% of the fair market value of the home and its land, on the first ${usd(HX_LIMIT)} of value. It cannot be combined with the 50% long-term homeowner exemption for owners 65 or older, which is repealed on July 1, 2027.` },
    { q: 'How is a house assessed for property tax in Wyoming?', a: `At ${ratio}% of fair market value. A ${usd(400000)} home has an assessed value of ${usd(assessedOf(400000))} before exemptions, and local levies apply to that figure. The homeowner exemption then removes ${hx}% of value for a qualifying owner, and the assessed value of a home cannot rise more than ${CAP}% a year unless it was bought the prior year or structurally changed.` },
  ],
  related: ['montana', 'colorado', 'south-dakota', 'utah', 'property-tax-assessment-caps', 'local-sales-tax-rates'],
});
