import { definePage } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, CENSUS } from '../../lib/kit';

const pair = (a: string, b: string, spend: number, home: number) => {
  const A = st(a), B = st(b);
  return { A, B, ta: tx(a, spend).tax + ptx(a, home), tb: tx(b, spend).tax + ptx(b, home) };
};
const p1 = pair('california', 'texas', 30000, 400000);
const p2 = pair('washington', 'oregon', 30000, 450000);

export default definePage({
  id: 'state-tax-comparison',
  group: 'calculators',
  order: 30,
  slug: 'state-tax-comparison',
  nav: 'Compare two states',
  card: 'Sales tax and property tax of two states, side by side',
  title: 'State Tax Comparison 2026: Sales and Property Tax Together',
  description: `State tax comparison for 2026: two states side by side, with the state sales tax on a year of purchases and the typical property tax on a home of your value.`,
  h1: 'Compare sales tax and property tax between two states',
  intro: 'Moving, or choosing where to buy? The two taxes that follow a household every year, in one view.',
  resume: `States raise money in different mixes, and a low rate on one tax often comes with a high rate on another. This comparison adds the two that every household pays wherever it lives: the state sales tax on a year of taxable purchases, and the property tax on a home, at the typical rate of each state from the Census Bureau's ${CENSUS.year} survey. On ${usd(30000)} of taxable spending and a ${usd(400000)} home, ${p1.A.name} comes to about ${usd(p1.ta)} a year at the state level and ${p1.B.name} to ${usd(p1.tb)}, ${p1.tb > p1.ta ? `because ${p1.B.name}'s higher property tax more than offsets its lower sales tax rate` : `a gap driven mostly by property tax`}. Between ${p2.A.name} and ${p2.B.name}, two neighbors with opposite systems, a ${usd(450000)} home and the same spending leave ${(p2.ta < p2.tb ? p2.A : p2.B).name} about ${usd(Math.abs(p2.ta - p2.tb))} a year cheaper at the state level. Local sales taxes are left out on purpose, since they depend on the exact address; add them on each state's page.`,
  tool: 'compare',
  body: (h) => `<h2>What the comparison counts</h2>
<p>For each state: the statewide sales tax rate (${h.rate(p1.A.sales.stateRate)} in ${p1.A.name}, ${h.rate(p1.B.sales.stateRate)} in ${p1.B.name}) applied to the purchases you enter, and the median effective property tax rate (${h.eff(p1.A.census.effectiveRate)} and ${h.eff(p1.B.census.effectiveRate)}) applied to the home value. Groceries are not included in the spending figure, because most states exempt them and the rest tax them at different rates; enter only what would be taxed at the general rate, such as furniture, electronics, cars in most states, household goods and clothing outside the exempt states.</p>
<h2>What it leaves out on purpose</h2>
<p>State income tax is the third large piece and is not part of this site, which deals with consumption and property only. Local sales taxes can add several points in some states and nothing in others; on each state page, the calculator lets you add the local rate of an address. Vehicle registration fees, excise taxes on fuel and utilities, and local income taxes in a few states are also out of scope. The result is therefore a comparison of two specific taxes, not a full cost of living.</p>
<h2>How to read a large gap</h2>
<p>Property tax dominates for most owners: a one-point difference in the effective rate is ${h.usd(4000)} a year on a ${h.usd(400000)} home, while a one-point difference in the sales tax rate is ${h.usd(300)} on ${h.usd(30000)} of purchases. Renters pay property tax indirectly through their rent, which the comparison cannot measure. And the typical rate is a statewide median: before deciding on a move, check the levy of the county you are considering with the ${h.a('property-tax-calculator', 'property tax calculator')}.</p>`,
  faqs: [
    { q: 'Is a state with no sales tax always cheaper to live in?', a: `No. States without a statewide sales tax raise money elsewhere, and property tax is often part of the answer. Comparing ${p2.B.name} with ${p2.A.name} on a ${usd(450000)} home and ${usd(30000)} of taxable purchases shows how close the totals can be once both taxes are counted. Income tax, which this site does not cover, can tip the balance either way.` },
    { q: 'Why does the comparison use median property tax rates?', a: `Because a statewide figure is needed to compare states, and the Census Bureau's median tax divided by median value is the most widely published, dated and comparable one. It includes the exemptions owners actually receive. Its limit is that counties within a state can differ widely, so the result is a starting point, not a quote for a specific address.` },
    { q: 'Should I count my car purchase in the yearly spending?', a: `Only if you buy one that year, and with care: many states tax vehicles at a different rate from other goods, collect the tax at registration rather than at the dealer, or add separate title fees. The state pages note vehicle rates when the state publishes them. For a typical year without a car purchase, leave it out.` },
  ],
  related: ['sales-tax-by-state', 'property-tax-by-state', 'states-without-sales-tax', 'property-tax-calculator'],
  sources: ['censusB25103', 'censusB25077', 'state:california', 'state:texas'],
});
