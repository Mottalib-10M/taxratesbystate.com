import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('georgia');
const S = s.sales, C = s.census, PR = s.property;
const tavt = S.otherRates?.[0]?.rate ?? 0;
const newcomer = 3;
const car = 32000;
const sofa = tx('georgia', 1100);
const food = tx('georgia', 200, 'groceries');
const ratio = PR.assessment?.ratio ?? 0;
const hs = PR.homestead.amount ?? 0;
const home = C.medianValue;
const assessed = (home * ratio) / 100;
const net = assessed - hs;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'georgia',
  title: `Georgia Sales Tax 2026: ${rate(S.stateRate)} State Rate Plus LOST and SPLOST`,
  description: `Georgia sales tax in 2026: ${rate(S.stateRate)} state rate plus local option taxes, groceries taxed locally, a ${rate(tavt)} title tax on cars, and homes assessed at ${ratio}% of value.`,
  intro: `Georgia builds its local sales tax out of one-percent blocks, each with its own acronym and purpose, and replaces the sales tax on cars with a one-time title tax.`,
  resume: `Georgia's state sales tax is ${rate(S.stateRate)}, and counties and cities stack local option taxes on top in one-percent blocks: LOST for general purposes, SPLOST for capital projects, ESPLOST for schools, TSPLOST for transportation, HOST and EHOST, MARTA and Atlanta's MOST, and, new on the 2026 charts, PTRLOST for property tax relief. The Department of Revenue publishes a new rate chart every quarter. Groceries are exempt from the ${rate(S.stateRate)} state tax but still pay most local taxes, prescription drugs are exempt, clothing is taxed, and no 2026 holiday was found. Vehicles skip sales tax: most pay a one-time Title Ad Valorem Tax of ${rate(tavt)} on fair market value. On property, Georgia taxes homes on ${ratio}% of market value; the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51. The statewide homestead exemption is small, so county exemptions and freezes carry most of the relief.`,
  sales: (h) => `<p>Each acronym on a Georgia rate chart is a separate county or city tax with its own purpose, usually worth 1%. A county can carry several at once, and the local rates change by quarter, which is why the Department of Revenue reissues its charts on January 1, April 1, July 1 and October 1. There is no address lookup on the department's pages: find your county on the current general chart, add up the local part, and enter it in the calculator above. A ${h.usd(1100)} sofa owes ${h.usd(sofa.stateTax, 2)} of state tax before those local blocks. The state rate is part of every jurisdiction's total except two special districts in Fulton County, Central Yards and South Downtown, where only local taxes apply.</p>
<p>Food needs its own chart. Groceries for home consumption are exempt from the state tax, so a ${h.usd(200)} cart owes ${h.usd(food.stateTax, 2)} to the state, but every local option tax still applies to it, except the SPLOST paired with an EHOST. The department publishes a separate food rate chart for that reason.</p>
<p>Cars follow a different system altogether. The Title Ad Valorem Tax replaces both the sales tax and the yearly ad valorem tax on most vehicles: it is paid once, at titling, at ${h.rate(tavt)} of the fair market value. A ${h.usd(car)} vehicle owes ${h.usd(car * tavt / 100)}. Someone moving to Georgia with a car pays ${newcomer}%, or ${h.usd(car * newcomer / 100)} on the same value, a rate in force since July 1, 2019, and certain family transfers pay 0.5%. Goods bought elsewhere without Georgia tax owe use tax at the same state and local rates.</p>`,
  property: (h) => `<p>County boards of assessors value every property at fair market value, and the tax is charged on ${h.num(ratio)}% of it. The Census median home of ${h.usd(home)} becomes ${h.usd(assessed)} of assessed value; take off the ${h.usd(hs)} standard homestead exemption and ${h.usd(net)} remains, so every mill of county and school tax costs its owner about ${h.usd(net / 1000, 2)} a year. Counties, school boards and cities each set a millage rate, and the county tax commissioner collects the county, school and state amounts. The owner on January 1 owes the year's tax, and property tax returns are filed between January 1 and April 1.</p>
<p>The state's homestead exemption is modest, and local governments supply most of the relief. Several counties freeze a homestead's value at a base year for as long as the owner lives there, and many grant larger exemptions of their own. Statewide, the extra relief targets age and income. Owners 65 or older with household income of $10,000 or less, retirement income partly excluded, get a $4,000 exemption from county taxes. Low-income owners 62 or older can exempt up to $10,000 of assessed value from school taxes, and those with household income up to $30,000 can shield value increases above $10,000 from county taxes. Qualifying disabled veterans and surviving spouses exempt $121,812 of value, the 2025 amount.</p>
<p>File the homestead claim with the county tax commissioner or assessor by April 1, after owning the home on January 1. Bills are due by December 20 in most counties, with 60 days from billing to pay. At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(375000)} home pays about ${h.usd(ptx('georgia', 375000))} a year. Farmland kept in agricultural use for 10 years can be assessed at 30% instead of ${h.num(ratio)}%.</p>`,
  faqs: [
    { q: 'What do LOST, SPLOST and ESPLOST mean on a Georgia receipt?', a: `They are local option sales taxes added to Georgia's ${rate(S.stateRate)} state rate, usually 1% each. LOST is the general local option tax, SPLOST is a special purpose tax, and ESPLOST is the special purpose tax for education. TSPLOST is tied to transportation and PTRLOST, new on the 2026 charts, to property tax relief. Each county and city carries its own mix, so the combined rate differs from place to place.` },
    { q: 'How much is the title tax on a car in Georgia?', a: `${rate(tavt)} of the vehicle's fair market value, paid once when the car is titled; it replaces both sales tax and the annual ad valorem tax. On a ${usd(car)} car, that is ${usd(car * tavt / 100)}. New Georgia residents titling a car they already own pay ${newcomer}% instead, and some transfers between family members pay 0.5%.` },
    { q: 'How much is the homestead exemption in Georgia?', a: `The statewide standard homestead exemption takes ${usd(hs)} off the assessed value, which is ${ratio}% of market value, for county and school taxes. That is small, so check your county: many add larger exemptions or freeze the home's value at a base year. Own the home on January 1 and file with the county tax commissioner or assessor by April 1.` },
  ],
  related: ['florida', 'alabama', 'south-carolina', 'tennessee', 'local-sales-tax-rates', 'homestead-exemption-by-state'],
});
