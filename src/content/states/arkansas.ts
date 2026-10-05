import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('arkansas');
const S = s.sales, C = s.census, PR = s.property;
const usedRate = S.otherRates?.[0]?.rate ?? 0;
const rental = S.otherRates?.[2]?.rate ?? 0;
const hol = S.holidays2026?.[0];
const used = 8000;
const boat = 40000;
const localCap = 2500;
const groceries = tx('arkansas', 150, 'groceries');
const ratio = PR.assessment?.ratio ?? 0;
const credit = PR.homestead.amount ?? 0;
const credit27 = 675;
const home = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'arkansas',
  title: `Arkansas Sales Tax 2026: ${rate(S.stateRate)} Rate, State Grocery Tax Gone`,
  description: `Arkansas sales tax in 2026: ${rate(S.stateRate)} state rate, ${rate(S.groceries.rate ?? 0)} state tax on groceries since January, local taxes still due, an August holiday, and a ${usd(credit)} homestead credit.`,
  intro: `January 2026 ended the state's tax on groceries, but not the city and county taxes on them, and the property tax works on a calendar that runs a year behind.`,
  resume: `Arkansas charges a ${rate(S.stateRate)} state sales tax, a rate unchanged since July 1, 2013, and cities and counties add their own taxes based on the delivery address. The big change of 2026 is food: under Act 1008 of 2025, the state rate on food and food ingredients fell to ${rate(S.groceries.rate ?? 0)} on January 1, 2026, so a ${usd(150)} grocery bill now owes ${usd(groceries.stateTax, 2)} of state tax, though city and county taxes still apply to it. Prescription drugs are exempt, clothing is taxed except on the first weekend of August, and used cars between $4,000 and $10,000 pay a reduced ${rate(usedRate)}. Property tax is modest: the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51. Homes are assessed at ${ratio}% of market value, and the homestead credit reaches ${usd(credit)} on bills paid in 2026.`,
  sales: (h) => `<p>Arkansas belongs to the Streamlined Sales Tax group and has sourced local tax to the delivery address since January 1, 2008, so an online order is taxed at the rate of the city and county where the parcel lands, not where the seller sits. The Department of Finance and Administration (DFA) collects state and local taxes together, and its lookup tools give the local part for any address. After the grocery repeal, that local part is the only tax left on a cart of food.</p>
<p>The car rules are unusually detailed. A used vehicle sold for less than $4,000 owes no sales tax at all, and one priced from $4,000 to under $10,000 is taxed at ${h.rate(usedRate)} instead of ${h.rate(S.stateRate)}: on an ${h.usd(used)} sedan that is ${h.usd(used * usedRate / 100)} rather than ${h.usd(used * S.stateRate / 100)}. Selling your old car yourself within 60 days before or after buying the next one lowers the taxable amount as if it had been traded in, a credit added by Act 277 of 2021. Local tax on vehicles, boats, aircraft and manufactured homes stops at the first ${h.usd(localCap)} of the price, so a ${h.usd(boat)} boat pays the state rate on the full price but local tax only on ${h.usd(localCap)}. Renting a car for a short period adds a separate ${h.rate(rental)} state tax.</p>
<p>The ${hol ? `${dayShort(hol.start)} to ${h.day(hol.end)}` : 'first weekend of August'} holiday, set by Act 757 of 2011, reaches further than most: it lifts local taxes as well as the state tax, and retailers may not opt out. Clothing and footwear under $100 an item, accessories under $50, school supplies, art supplies, instructional materials and electronic devices used for study all qualify.</p>`,
  property: (h) => `<p>An Arkansas tax bill is the product of two years. Values and millage are set in the assessment year, and the county collector collects the tax the following year, by October 15. Owners must list personal property, vehicles included, by May 31 each year, and a value they dispute goes to the county Board of Equalization by the third Monday in August. County quorum courts levy the millage for counties, cities and school districts, and the Assessment Coordination Division of DFA supervises assessment in all 75 counties.</p>
<p>Taxable value is ${h.num(ratio)}% of market value, so the Census median home of ${h.usd(home)} carries an assessed value of ${h.usd(home * ratio / 100)}. Counties reappraise every three, four or five years, and Amendment 79 then smooths the jump: a homestead's taxable value can rise at most 5% a year, other real property 10%, until full assessed value is reached. New construction and substantial improvements, meaning work that adds 25% or more to the value, fall outside the cap. Owners aged 65 or older or disabled can freeze the assessed value of their homestead instead; millage changes still apply, and the freeze ends with a sale.</p>
<p>The Homestead Property Tax Credit comes off the bill itself. It is up to ${h.usd(credit)} on bills payable in 2026 and rises to ${h.usd(credit27)} for assessment years from 2026 under Act 174 of 2026, meaning bills paid in 2027; one credit per owner per year, claimed with the county assessor by October 15. At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(250000)} home pays about ${h.usd(ptx('arkansas', 250000))} a year before that credit.</p>`,
  faqs: [
    { q: 'Do you still pay sales tax on groceries in Arkansas?', a: `Only the local part. Since January 1, 2026, under Act 1008 of 2025, Arkansas charges a ${rate(S.groceries.rate ?? 0)} state rate on food and food ingredients, but city and county sales taxes continue to apply. A grocery bill therefore shows the local rate of the delivery or store address. The cut did not touch the general ${rate(S.stateRate)} rate on other goods, which has stood since July 1, 2013.` },
    { q: 'How much is sales tax on a used car in Arkansas?', a: `It depends on the price. Used vehicles under $4,000 are exempt; from $4,000 to under $10,000 the state rate is ${rate(usedRate)}; at $10,000 and above the full ${rate(S.stateRate)} applies. Local tax is charged only on the first ${usd(localCap)}. Selling your previous car within 60 days before or after the purchase reduces the taxable amount, like a trade-in.` },
    { q: 'When is the Arkansas homestead credit deadline?', a: `Apply with your county assessor by October 15. The Homestead Property Tax Credit is worth up to ${usd(credit)} on bills payable in 2026 and up to ${usd(credit27)} for assessment years beginning January 1, 2026, under Act 174 of 2026. It applies to your principal residence only, one credit per owner per year, and comes off the tax due rather than the assessed value.` },
  ],
  related: ['missouri', 'tennessee', 'louisiana', 'oklahoma', 'grocery-sales-tax-by-state', 'homestead-exemption-by-state'],
});
