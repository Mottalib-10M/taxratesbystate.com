import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('vermont');
const S = s.sales, C = s.census;
const loc = S.local.cap ?? 0;
const mr = S.otherRates?.[0]?.rate ?? 0;
const alc = S.otherRates?.[1]?.rate ?? 0;
const skis = tx('vermont', 700, 'general', loc);
const dinner = 80;
const dinnerTax = (dinner * mr) / 100;
const dinnerTaxLocal = (dinner * (mr + loc)) / 100;
const home = 330000;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'vermont',
  title: `Vermont Sales Tax 2026: ${rate(S.stateRate)}, No Tax on Clothing or Food`,
  description: `Vermont sales tax in 2026: ${rate(S.stateRate)} on goods, all clothing and food exempt, a ${rate(mr)} meals and rooms tax, a 1% town option, and a statewide education property tax.`,
  intro: `A short list of what gets taxed at the register, a separate tax for the restaurant table, and a property tax built around a statewide school levy.`,
  resume: `Vermont's sales tax is ${rate(S.stateRate)}, and it reaches fewer purchases than in most states: all clothing and footwear are exempt whatever their price, food and most beverages are exempt, and so are prescription and over-the-counter drugs. Towns that vote for it add a ${rate(loc)} local option tax, for ${rate(S.stateRate + loc)}. Restaurants and lodging sit outside the sales tax altogether and pay a ${rate(mr)} meals and rooms tax instead, ${rate(alc)} on drinks served, with a further ${rate(loc)} where a town has adopted the local option. There is no sales tax holiday, and with clothing and groceries exempt all year there is little for one to cover. Property tax is a different story. Census data for 2024 show a median bill of ${usd(C.medianTax)} on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)}, ranked ${effRank} of 51 by rate and ${billRank} by median bill. Much of it is the state education property tax, charged at a homestead rate or a higher nonhomestead rate set for each town every year.`,
  sales: (h) => `<p>Vermont exempts by category, and the categories are generous. A ${h.usd(450)} winter parka owes no sales tax, and neither does an expensive pair of boots. The exemption stops at the garment itself: jewelry, handbags and sunglasses are taxable accessories, and protective or sports equipment counts as taxable goods, so ${h.usd(700)} of skis bought in a local option town carry ${h.usd(skis.tax, 2)}. Food follows the same pattern, with soft drinks as the main exception, while aspirin, antacids, cough medicine and menstrual products are exempt along with prescriptions.</p>
<p>The local option is a town decision and applies base by base. A town may adopt the ${h.rate(loc)} on sales only, on meals and rooms only, on alcoholic beverages, or on several, so two neighboring towns can differ at the register and at the restaurant. The state's map lookup shows which apply at an address; enter ${h.num(loc)} in the calculator above if the sales option is in force.</p>
<p>Eating out is taxed under a separate law. An ${h.usd(dinner)} dinner pays ${h.usd(dinnerTax, 2)} of meals and rooms tax, or ${h.usd(dinnerTaxLocal, 2)} in a town with the local option, and drinks are taxed at ${h.rate(alc)} instead of ${h.rate(mr)}. Hotel and inn stays fall under the same ${h.rate(mr)} tax. Businesses that collect any local option tax must file and pay electronically. Goods bought out of state without Vermont tax owe ${h.rate(S.useTax?.rate ?? S.stateRate)} use tax, paid by the buyer.</p>`,
  property: (h) => `<p>A Vermont bill has two parts. The municipal tax is set by the town or city for its own budget. The education tax is a state tax: a homestead rate and a nonhomestead rate are set for every town each year, and the town collects both. The FY2027 rates were published town by town in summer 2026. Values come from listers, elected or hired by each town, who appraise at fair market value, and the town's common level of appraisal adjusts the result.</p>
<p>The Homestead Declaration decides which education rate you pay. Owners who live in the home as their principal dwelling file Form HS-122 every year by the April filing deadline, alongside the income tax return; without it, the home is billed at the nonhomestead rate, and a late filing can bring a penalty of up to 3%. A home rented to a tenant on April 1 can still qualify if it is not rented for more than 182 days in the year.</p>
<p>Relief is tied to income rather than a fixed exemption. The Vermont Property Tax Credit can reduce the education tax by up to $5,600 and the municipal tax by up to $2,400 for homestead owners within the $115,400 household income limit (tax year 2025). A ${h.usd(home)} house at the Census ratio of ${h.eff(C.effectiveRate)} faces about ${h.usd(ptx('vermont', home))} before any credit, which is why filing both the declaration and the credit claim matters. Due dates are set by each town, with bills usually mailed 30 days ahead.</p>`,
  faqs: [
    { q: 'Is there sales tax on shoes and clothes in Vermont?', a: `No. Vermont exempts all clothing and footwear from its ${rate(S.stateRate)} sales tax with no price limit, so a ${usd(450)} coat is tax-free. Clothing accessories such as jewelry, handbags and sunglasses are taxable, and so are protective gear and sports equipment. Vermont has no sales tax holiday, since clothing is already exempt year-round.` },
    { q: 'What is the meals and rooms tax in Vermont?', a: `${rate(mr)} on restaurant meals and lodging, and ${rate(alc)} on alcoholic beverages served. It replaces the sales tax on those sales rather than adding to it. Towns that have adopted the local option add ${rate(loc)}, for ${rate(mr + loc)} on meals and rooms and ${rate(alc + loc)} on drinks. An ${usd(dinner)} dinner therefore carries ${usd(dinnerTax, 2)} of tax, or ${usd(dinnerTaxLocal, 2)} in a local option town.` },
    { q: 'Do I have to file a Homestead Declaration every year in Vermont?', a: `Yes. Vermont owners who live in the home as their principal dwelling file Form HS-122 each year by the April filing deadline, with the income tax return. It lets the town bill the education property tax at the homestead rate instead of the nonhomestead rate. A late declaration can bring a penalty of up to 3%, and the income-based Property Tax Credit is reserved for declared homesteads.` },
  ],
  related: ['new-hampshire', 'new-york', 'massachusetts', 'clothing-sales-tax-by-state', 'how-property-tax-is-calculated'],
});
