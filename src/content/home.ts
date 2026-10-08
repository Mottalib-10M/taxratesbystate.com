/**
 * Home page text (pillar). Every figure is computed from the facts files and the Census file:
 * nothing typed (RECETTE §17.4, point 7).
 */
import type { FAQ, Helpers } from '../lib/page-types';
import { FED } from '../lib/engine/realestate';
import { STATES, CENSUS, usd, rate, eff, listOf, noSalesTax, salesTax, day, FACTS_VERIFIED } from '../lib/kit';

const byEff = [...STATES].sort((a, b) => b.census.effectiveRate - a.census.effectiveRate);
const byRate = [...STATES].filter((s) => s.sales.hasStateSalesTax).sort((a, b) => b.sales.stateRate - a.sales.stateRate);
const top = byRate[0];
const lowRate = byRate[byRate.length - 1];
const none = noSalesTax();
const noneNames = none.map((s) => s.name);
const grocExempt = STATES.filter((s) => s.sales.hasStateSalesTax && s.sales.groceries.treatment === 'exempt');
const grocTaxed = STATES.filter((s) => s.sales.hasStateSalesTax && s.sales.groceries.treatment !== 'exempt');
const clothFree = STATES.filter((s) => s.sales.hasStateSalesTax && s.sales.clothing.treatment === 'exempt');
const clothThreshold = STATES.filter((s) => s.sales.clothing.treatment === 'exempt-under-threshold');
const holidays = STATES.filter((s) => (s.sales.holidays2026 ?? []).length > 0);
const natMedianTax = (() => { const v = STATES.map((s) => s.census.medianTax).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; })();
const hi = byEff[0], lo = byEff[byEff.length - 1];
const ca = STATES.find((s) => s.slug === 'california');
const caTax = ca ? salesTax({ state: ca, price: 1000 }).stateTax : 0;

export const HOME = {
  title: 'Sales Tax Calculator 2026: Every State, Plus Property Tax',
  description: `Sales tax calculator for 2026: the official rate of all 50 states and DC, grocery and clothing rules, reverse calculation, plus property tax by state (Census).`,
  h1: 'Sales tax calculator for every state, with property tax',
  intro: 'Pick a state, type the price, add your local rate, and the calculator applies that state’s own rules for groceries, clothing and medicine. Below it, the property tax side.',
  resume: `Sales tax in the United States is set state by state: ${STATES.length - none.length} states and the District of Columbia charge a statewide rate, from ${rate(lowRate.sales.stateRate)} in ${lowRate.name} to ${rate(top.sales.stateRate)} in ${top.name}, and ${listOf(noneNames)} charge none. Counties, cities and special districts add their own rate in most states, so the tax at the register is the state rate plus a local part that depends on the address of the sale. This calculator takes the state rate from the revenue department of each state (read on ${day(FACTS_VERIFIED)}), asks you for the local part instead of guessing it, and applies the state’s treatment of groceries, clothing and prescription drugs, forward or in reverse from a receipt total. Property tax works differently: it is levied locally on the assessed value of a home, and the typical owner paid ${eff(hi.census.effectiveRate)} of the home’s value in ${hi.name} against ${eff(lo.census.effectiveRate)} in ${lo.name}, according to the Census Bureau’s ${CENSUS.year} survey.`,
  tableTitle: 'The 50 states and DC at a glance',
  tableIntro: (h: Helpers) => `<p>Statewide rates, local add-ons, the grocery and clothing rules and the typical property tax bill, one line per jurisdiction. Each state name opens its own page with the sources, the 2026 holidays and a calculator locked on that state. Sorted by rate instead: ${h.a('sales-tax-by-state', 'sales tax rates by state')}; by property tax: ${h.a('property-tax-by-state', 'property tax by state')}.</p>`,
  propertyTitle: 'Property tax estimator',
  propertyIntro: `Start from the typical rate of your state (median tax ÷ median home value, Census ACS ${CENSUS.year}), or switch to “My mill rate” and rebuild your own bill from its assessed value, exemptions and mills.`,
  foldTitle: 'How the two taxes work',
  sections: (h: Helpers): Array<{ title: string; html: string }> => [
    {
      title: 'How a sales tax bill is put together',
      html: `<p>A sales tax is charged by the seller on the price of taxable goods and some services, and passed to the state with a periodic return. Each state decides three things on its own: the statewide rate, what is taxable, and whether its counties and cities may add a rate of their own. On ${usd(1000)} of furniture in ${ca ? ca.name : 'California'}, the statewide part alone is ${usd(caTax)}; the local districts add the rest, which is why two stores a few miles apart can ring up different totals for the same item.</p>
<p>Since the Supreme Court decided ${h.src('wayfair', '<em>South Dakota v. Wayfair</em>')} in 2018, states can require online and out-of-state sellers to collect their tax even without a store in the state, and every state with a sales tax now does so above a sales threshold. When a seller does not collect it, the buyer usually owes the same amount as use tax: see ${h.a('use-tax', 'use tax on online and out-of-state purchases')}.</p>`,
    },
    {
      title: 'Why the calculator asks you for the local rate',
      html: `<p>Local sales tax rates are where most calculators go wrong. They change at the start of a quarter in many states, they follow district lines rather than ZIP codes, and a city, a county and a transit district can stack on the same address. A combined rate copied from a table, even a recent one, is easily out of date for one street. So we do the opposite of a guess: the state rate comes from the state, and the local part is a field you fill in from the free address lookup that each state publishes, linked from its page here. ${h.a('local-sales-tax-rates', 'How local sales taxes stack, state by state')} explains which governments may levy one.</p>`,
    },
    {
      title: 'Groceries, clothing and medicine',
      html: `<p>Three categories change the bill more than any rate difference. Food for home consumption is exempt from the state rate in ${grocExempt.length} of the states that have a sales tax, and taxed in ${grocTaxed.length}, often at a reduced rate (${listOf(grocTaxed.map((s) => s.name))}). Clothing is exempt in ${listOf(clothFree.map((s) => s.name))}, and exempt up to a price per item in ${listOf(clothThreshold.map((s) => s.name))}. Prescription drugs are exempt almost everywhere. Choose the category in the calculator and the state’s own rule is applied; the details are in ${h.a('grocery-sales-tax-by-state', 'grocery sales tax by state')} and ${h.a('clothing-sales-tax-by-state', 'clothing sales tax by state')}.</p>`,
    },
    {
      title: 'Taking the tax out of a total',
      html: `<p>Bookkeepers, expense reports and anyone checking a receipt need the opposite calculation: the price before tax from the amount paid. Switch the calculator to “Remove tax”. For a single rate the price is the total divided by one plus the rate; with a clothing threshold or an exempt category, the calculator solves the forward calculation instead, so the answer matches what the register would have charged. The ${h.a('reverse-sales-tax-calculator', 'reverse sales tax calculator')} page does only that, with worked examples.</p>`,
    },
    {
      title: 'Sales tax holidays in 2026',
      html: `<p>${holidays.length} states held at least one sales tax holiday in 2026, most of them on back-to-school weekends in July and August, some on hurricane or emergency supplies, Energy Star appliances or firearms safety equipment. Each holiday has its own list of items and price caps per item, and in several states local governments decide whether their rate is suspended too. The ${h.a('sales-tax-holidays', '2026 sales tax holiday calendar')} lists every one of them with its dates and its official notice.</p>`,
    },
    {
      title: 'How a property tax bill is calculated',
      html: `<p>Property tax is a local tax on real estate, collected by counties, cities, school districts and special districts; most states levy little or nothing themselves. The bill follows a chain: the assessor estimates the market value, applies the assessment ratio the state sets (100% in many states, a fraction in others), subtracts exemptions such as the homestead exemption, and multiplies the result by the combined levy of every local government, written in mills: one mill is one dollar per $1,000 of taxable value. Each step is explained, with a calculator, in ${h.a('how-property-tax-is-calculated', 'how property tax is calculated')}.</p>`,
    },
    {
      title: 'Homestead exemptions',
      html: `<p>Most states reduce the tax on the home you live in: a fixed dollar amount off the assessed value, a percentage, a credit on the bill, or a cap on how fast the assessed value may rise. The amounts range from a few thousand dollars to six figures, and some only apply to school taxes. You usually have to apply once, with the county assessor, by a deadline in the spring. The ${h.a('homestead-exemption-by-state', 'homestead exemption by state')} page lists the main one of each state with its official page.</p>`,
    },
    {
      title: 'Buying, selling or inheriting a home',
      html: `<p>A sale of real estate brings its own taxes. The deed is taxed when it is recorded: a transfer tax charged by the state in most places, sometimes doubled by the county or city, plus a tax on the mortgage in a handful of states; the ${h.a('closing-costs-calculator', 'closing costs calculator')} lists the rate of every state with its source. On the gain, a homeowner can exclude up to ${usd(FED.sec121.single)}, or ${usd(FED.sec121.joint)} for a couple, before federal and state income tax apply: see ${h.a('capital-gains-tax-on-home-sale', 'capital gains tax on a home sale')}. An investor can postpone the tax by buying another property within ${FED.x1031.exchangeDays} days through a ${h.a('1031-exchange', '1031 exchange')}. And at death, a few states tax the estate (${h.a('estate-tax-by-state', 'estate tax by state')}) or the heirs (${h.a('inheritance-tax-by-state', 'inheritance tax by state')}) long before the federal threshold is reached.</p>`,
    },
    {
      title: 'Where the property tax figures come from',
      html: `<p>The typical bills on this site come from the U.S. Census Bureau’s American Community Survey, ${CENSUS.year} 1-year estimates: the median real estate taxes paid by owner-occupants (${h.src('censusB25103', 'table B25103')}) and the median value of their homes (${h.src('censusB25077', 'table B25077')}). The middle state of the 51 has a median bill of ${usd(natMedianTax)}. Dividing the two medians gives an effective rate that already includes exemptions and caps: ${eff(hi.census.effectiveRate)} in ${hi.name}, the highest, ${eff(lo.census.effectiveRate)} in ${lo.name}, the lowest. It describes a typical owner of the state, not your county; your own bill’s mill rate does that, and the calculator above accepts it.</p>`,
    },
  ],
  faqs: [
    { q: 'Which state has the highest sales tax rate in 2026?', a: `At the state level, ${top.name} has the highest statewide rate, ${rate(top.sales.stateRate)}, on the official page read on ${day(top.verified)}. The highest combined rates paid at the register, though, are usually in states with a moderate state rate and heavy local taxes, because cities, counties and districts add their own rates on top. To compare real totals you need the local rate of the exact address, which each state’s free lookup gives.` },
    { q: 'Which states do not charge any sales tax?', a: `${listOf(noneNames)} have no statewide sales tax. That does not always mean no tax at the register: some allow local sales taxes or charge taxes on specific sales such as meals, lodging or gross receipts of businesses. Each of their pages here explains what replaces the sales tax and links the official source.` },
    { q: 'How do I calculate sales tax backwards from a total?', a: `Divide the total by one plus the combined rate. A ${usd(108.25, 2)} receipt at 8.25% was ${usd(100, 2)} before tax. If part of the purchase was exempt, or a clothing threshold applied, that shortcut fails; switch the calculator to “Remove tax”, pick the state and category, and it solves the exact forward rule of that state instead.` },
    { q: 'Is the sales tax rate based on where I live or where I buy?', a: `For a purchase in a store, the rate of the store’s location applies. For delivered goods, most states use the delivery address, so an online order is taxed where you receive it; a few states use the seller’s location for some in-state sales. When nobody collected the tax on something you use in your home state, use tax is usually due there.` },
    { q: 'What is the difference between an effective property tax rate and a mill rate?', a: `A mill rate is the levy written on your bill: dollars per $1,000 of taxable value, after the assessment ratio and exemptions. An effective rate is the tax divided by the market value of the home. A 30-mill levy on a home assessed at 40% of value is an effective rate of about 1.2%, before exemptions. The calculator accepts either.` },
    { q: 'Why do property taxes differ so much between states with similar home prices?', a: `Because states lean on property tax to different degrees. Some fund schools mostly through local property tax, others through state income or sales taxes. Assessment ratios, homestead exemptions and caps on assessment growth differ as well. Two homes of equal value can therefore owe bills several times apart, which the Census medians on each state page make visible.` },
    { q: 'Are the local sales tax rates on this site up to date?', a: `We deliberately do not publish city or county rates, because they change every quarter in many states and an outdated local rate is the most common error in this field. Each state page links the official address lookup of that state; type the local part it gives you into the calculator and the total will match the register.` },
  ] as FAQ[],
  /** States whose official rate page is listed among the home page sources. */
  sourceStates: ['california', 'texas', 'new-york', 'florida', 'illinois'],
};
