import { definePage } from '../../lib/page-types';
import { STATES, CENSUS, usd, eff, propertyTax, ptx } from '../../lib/kit';

const byEff = [...STATES].sort((a, b) => b.census.effectiveRate - a.census.effectiveRate);
const hi = byEff[0], lo = byEff[byEff.length - 1];
const ex = propertyTax({ marketValue: 320000, assessmentRatio: 100, exemption: 50000, millRate: 18.5 });

export default definePage({
  id: 'property-tax-calculator',
  group: 'calculators',
  order: 20,
  slug: 'property-tax-calculator',
  nav: 'Property tax calculator',
  card: 'Typical bill by state, or your own bill from its mill rate and exemptions',
  title: 'Property Tax Calculator 2026: By State or by Your Mill Rate',
  description: `Property tax calculator for 2026: typical bill in each state from Census ACS ${CENSUS.year} data, or your own bill from assessed value, homestead exemption and mill rate.`,
  h1: 'Property tax calculator',
  intro: 'Two ways in: the typical rate of your state, or the numbers printed on your own tax bill.',
  resume: `A property tax bill is the taxable value of a home multiplied by the combined levy of every local government that taxes it. This calculator starts from what a typical owner pays in the state you choose: the median real estate tax divided by the median home value, from the Census Bureau's American Community Survey ${CENSUS.year}. That ratio runs from ${eff(lo.census.effectiveRate)} in ${lo.name} to ${eff(hi.census.effectiveRate)} in ${hi.name}, so the same ${usd(350000)} house is a ${usd(ptx(lo.slug, 350000))} bill in one and ${usd(ptx(hi.slug, 350000))} in the other. When you have your own bill or your assessor's notice, switch to “My mill rate”: enter the market value, the assessment ratio your state uses, the exemptions you receive and the total mill rate, and the calculator rebuilds the bill line by line, ready to compare with what the county sent.`,
  tool: 'property',
  toolProps: { state: 'texas', price: 350000 },
  body: (h) => `<h2>Reading your own bill</h2>
<p>Every county prints the same chain in its own words. The <strong>market value</strong> (also called appraised, full cash or just value) is the assessor's estimate of what the home would sell for on the assessment date. The <strong>assessed value</strong> is that figure times the assessment ratio set by the state: 100% in many states, a fixed fraction in others. Exemptions are then subtracted to give the <strong>taxable value</strong>, and every local levy, from the county to the school district and the fire district, is applied to it in mills. Add the mill rates of the lines on your bill and you have the total the calculator asks for.</p>
<p>Example: a ${h.usd(320000)} home in a full-value state, with a ${h.usd(50000)} homestead exemption and a combined levy of 18.5 mills, has a taxable value of ${h.usd(ex.taxableValue)} and owes ${h.usd(ex.tax)} a year, ${h.usd(ex.monthly)} a month, which is ${h.eff(ex.effectiveRate / 100)} of its market value. Without the exemption the same levy would cost ${h.usd(propertyTax({ marketValue: 320000, millRate: 18.5 }).tax)}.</p>
<h2>Typical rate or your rate: which to use</h2>
<p>The typical rate is the right tool before you buy, when you compare states or want an order of magnitude for a budget. It already includes the exemptions and caps that owners in the state receive, because it is computed from the taxes they actually paid. It does not know your county: within one state, the effective rate can easily double from one county to the next. Once you have an address, the mill rate mode is more precise, and for a home you already own, last year's bill is the best starting point of all.</p>
<h2>What the calculator leaves out</h2>
<p>Special assessments for sidewalks or sewers, flat fees added to the bill, penalties and installment schedules are not included. Assessment caps such as California's Proposition 13 or Florida's Save Our Homes keep a long-held home's taxable value below market value; if you have owned for years, use the assessed value printed on your notice rather than a market estimate. The state pages describe the main relief programs of each state, and ${h.a('how-property-tax-is-calculated', 'how property tax is calculated')} walks through each step with more examples. To compare the typical bill of all states at once, see ${h.a('property-tax-by-state', 'property tax by state')}.</p>`,
  faqs: [
    { q: 'Is the typical rate in this calculator what I will pay on a new purchase?', a: `Not exactly. The Census ratio reflects what current owners paid, including long-held homes whose taxable value is capped below market value in some states. A buyer whose purchase resets the assessment, as in California or Florida, often pays more than the median ratio suggests. Use the mill rate mode with the levy of the address to estimate a new purchase.` },
    { q: 'Where do I find the mill rate for my address?', a: `On last year's tax bill, which lists each taxing unit with its rate, or on the website of the county assessor, treasurer or tax collector, which usually publishes the levy of every district. Add the rates of all the lines that apply to your parcel. Some counties write the rate per $100 of value instead of per $1,000: multiply that figure by ten to get mills.` },
    { q: 'Should I enter the homestead exemption as an exemption or a credit?', a: `Enter it as an exemption when your state takes a dollar amount off the assessed value, which is the most common form, and as a credit when the state reduces the tax itself, as some rebate and credit programs do. The state page shows which form your state uses. If it is a percentage of value, reduce the assessment ratio instead.` },
  ],
  related: ['how-property-tax-is-calculated', 'property-tax-by-state', 'homestead-exemption-by-state', 'state-tax-comparison'],
  sources: ['censusB25103', 'censusB25077', 'censusAcsMethod'],
});
