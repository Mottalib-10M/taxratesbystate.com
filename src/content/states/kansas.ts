import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('kansas');
const S = s.sales, C = s.census, PR = s.property;
const redev = S.otherRates?.[1]?.rate ?? 0;
// Grocery phase-down steps, city and county limits and the highway share appear only in the text fields.
const step2023 = 4, step2024 = 2;
const cityGen = 2, citySpecial = 1, county = 1;
const highway = 18;
const cart = 220;
const cartLocal = 2;
const old = (cart * S.stateRate) / 100;
const mower = tx('kansas', 450);
const ratio = PR.assessment?.ratio ?? 0;
const schoolEx = PR.homestead.amount ?? 0;
const home = C.medianValue;
const assessed = (home * ratio) / 100;
const shielded = (schoolEx * ratio) / 100;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'kansas',
  title: `Kansas Sales Tax 2026: ${rate(S.stateRate)} State Rate, 0% on Groceries`,
  description: `Kansas sales tax in 2026: ${rate(S.stateRate)} on most goods, a 0% state rate on food since January 2025, local add-ons, and homes assessed at ${ratio}% of appraised value.`,
  intro: `Kansas took its state grocery tax from 6.5% to zero in three steps, and it taxes a house on barely a ninth of what the appraiser says it is worth.`,
  resume: `Kansas finished cutting its state tax on food on January 1, 2025: groceries went from ${rate(S.stateRate)} to ${step2023}% in 2023, ${step2024}% in 2024 and 0% since, so food for home now carries no state tax at all, though the state rate alone does not switch off city and county taxes on it. Everything else pays the ${rate(S.stateRate)} state rate, of which ${highway}% has gone to the state highway fund since 2025, plus local taxes: a city can levy up to ${cityGen}% for general purposes and ${citySpecial}% for special purposes, a county generally up to ${county}%. Clothing is taxed, prescription drugs and home heating are exempt, and Kansas holds no sales tax holiday. On property, Kansas assesses homes at ${ratio}% of appraised value, and since 2024 the first ${usd(schoolEx)} of a home's value is outside the statewide school levy. Median homeowners paid ${usd(C.medianTax)} on ${usd(C.medianValue)} homes in the 2024 Census survey, ${eff(C.effectiveRate)} of value, which ranks Kansas ${effRank} of 51.`,
  sales: (h) => `<p>The food change is worth seeing in dollars. A ${h.usd(cart)} week of groceries carried ${h.usd(old, 2)} of state tax before 2023; today the state share is ${h.usd(tx('kansas', cart, 'groceries').stateTax, 2)}. In a town where city and county taxes still reach food, say ${h.rate(cartLocal)} together, the receipt would show ${h.usd(tx('kansas', cart, 'groceries', cartLocal).tax, 2)}. The Kansas grocery definition is generous: bread, bagels, cakes, cookies and other bakery items count as food when sold without utensils, as do unheated items sold by weight or volume and food that still needs cooking. Hot and prepared food stays at the full rate.</p>
<p>Local rates are built from statute K.S.A. 12-189. A city may add up to ${h.rate(cityGen)} for general purposes and another ${h.rate(citySpecial)} for a special purpose, and a special-purpose tax lapses after ten years unless renewed. A countywide tax is limited to ${h.rate(county)}, with exceptions written into the law for named counties that may go higher. The state collects all of it. Inside a redevelopment district created under K.S.A. 74-8921, an extra ${h.rate(redev)} applies until the district's bonds are repaid. A ${h.usd(450)} lawn mower owes ${h.usd(mower.stateTax, 2)} of state tax before those local pieces; ask your city clerk or check a recent local receipt for the local share, then enter it above.</p>
<p>Gas, electricity, propane, coal and firewood used to heat a home are exempt from the state rate, and so is energy for farm use. Items bought out of state without Kansas tax owe the ${h.rate(S.useTax?.rate ?? S.stateRate)} compensating use tax.</p>`,
  property: (h) => `<p>Kansas sorts property into classes and taxes each on a different slice of its appraised value. Homes are assessed at ${h.num(ratio, 1)}%, commercial and industrial real estate at 25%, vacant lots at 12%, other real property at 30%, and farmland at 30% of its agricultural use value rather than its market price. On the Census median home of ${h.usd(home)}, the residential slice is ${h.usd(assessed)}, so each mill a county, city, township or school district levies costs the owner about ${h.usd(assessed / 1000, 2)} a year.</p>
<p>The statewide school levy works differently since a 2024 special session. The first ${h.usd(schoolEx)} of a home's appraised value is exempt from that one levy, which takes ${h.usd(shielded)} of assessed value out of its reach on every house, automatically and with no form to file. All the other levies, local school levies included, still apply to the full assessed value, so the saving is real but narrow. Commercial owners do not get it, which widens the gap the class system already creates between a house and a shop of the same value.</p>
<p>Put together, ${h.eff(C.effectiveRate)} of value is what Kansas owners pay at the median, which on a ${h.usd(325000)} house means roughly ${h.usd(ptx('kansas', 325000))} a year. County treasurers set the billing calendar, so the due dates and any installment plan are on your county's statement. Relief programs run by the Department of Revenue, such as income-based refunds, were not readable on official pages when this page was checked, so they are not described here.</p>`,
  faqs: [
    { q: 'Do Kansas cities still charge sales tax on groceries?', a: `The state rate on food has been 0% since January 1, 2025, after steps of ${step2023}% in 2023 and ${step2024}% in 2024. The state law that set that rate does not by itself remove city and county sales taxes, so a grocery receipt in Kansas can still show local tax. Bakery items and unheated food sold without utensils count as groceries; prepared hot food is taxed at ${rate(S.stateRate)} plus local.` },
    { q: 'What is the assessment rate on a house in Kansas?', a: `Kansas assesses residential property at ${ratio}% of its appraised value, compared with 25% for commercial and industrial property and 30% for most other real estate. A ${usd(home)} house therefore has an assessed value of ${usd(assessed)}, and every local mill costs about ${usd(assessed / 1000, 2)}. The first ${usd(schoolEx)} of appraised value is also exempt from the statewide school levy.` },
    { q: 'How much can a Kansas city add to the sales tax?', a: `Under K.S.A. 12-189 a Kansas city can add up to ${cityGen}% for general purposes plus ${citySpecial}% for a special purpose, and special-purpose taxes expire after 10 years. A countywide tax is limited to ${county}%, though the statute lets certain named counties go higher. These come on top of the ${rate(S.stateRate)} state rate, and redevelopment districts can add ${rate(redev)} more.` },
  ],
  related: ['missouri', 'nebraska', 'oklahoma', 'colorado', 'grocery-sales-tax-by-state', 'how-property-tax-is-calculated'],
});
