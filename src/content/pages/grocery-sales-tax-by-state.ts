import { definePage } from '../../lib/page-types';
import { STATES, usd, rate, listOf, tx } from '../../lib/kit';

const taxing = STATES.filter((s) => s.sales.hasStateSalesTax);
const exempt = taxing.filter((s) => s.sales.groceries.treatment === 'exempt');
const reduced = taxing.filter((s) => s.sales.groceries.treatment === 'reduced');
const full = taxing.filter((s) => s.sales.groceries.treatment === 'taxed');
const taxedFood = [...reduced, ...full];
const localOnly = exempt.filter((s) => s.sales.local.allowed && s.sales.local.groceriesTaxedLocally);
const foodRate = (s: (typeof STATES)[number]) => s.sales.groceries.treatment === 'exempt' ? 0 : s.sales.groceries.rate ?? s.sales.stateRate;
const arg = JSON.stringify(taxedFood.map((s) => [s.name, foodRate(s)]));
const top = [...taxedFood].sort((a, b) => foodRate(b) - foodRate(a))[0];
const week = 200;

export default definePage({
  id: 'grocery-sales-tax-by-state',
  group: 'sales',
  order: 40,
  slug: 'grocery-sales-tax-by-state',
  nav: 'Grocery sales tax by state',
  card: 'Which states tax food, at what rate, and where cities still do',
  title: 'Grocery Sales Tax by State 2026: Exempt, Reduced or Taxed',
  description: `Grocery sales tax by state in 2026: which states exempt food, which tax it at a reduced or full rate, where cities still tax groceries, and the cost per year.`,
  h1: 'Grocery sales tax by state',
  intro: 'Food for home is exempt in most states, taxed in a handful, and taxed by cities in a few that exempt it.',
  resume: `Of the ${taxing.length} jurisdictions with a statewide sales tax, ${exempt.length} exempt groceries (food bought to prepare and eat at home) from the state rate in 2026. ${reduced.length ? `${listOf(reduced.map((s) => s.name))} tax them at a reduced state rate` : 'None taxes them at a reduced rate'}${full.length ? `, and ${listOf(full.map((s) => s.name))} at the full state rate` : ''}. The state exemption is not always the end of it: in ${listOf(localOnly.map((s) => s.name))}, cities or counties may still tax food even though the state does not. On a ${usd(week)} weekly grocery bill, the state tax alone comes to ${usd(week * 52 * foodRate(top) / 100)} a year in ${top.name}, the highest state rate on food, and to nothing in an exempt state. In every state, the exemption stops at the door of the restaurant: prepared food, hot food and in most states candy and soft drinks are taxed at the general rate. Each line below links the state's own rule.`,
  mini: 'groceryYear',
  miniArg: arg,
  body: (h) => `<h2>The 51 jurisdictions and their grocery rule</h2>
${h.stateTable('groceries', 'name')}
<h2>States that still tax food</h2>
<ul>${taxedFood.map((s) => `<li><strong>${h.a(s.slug, s.name)}</strong>, ${h.rate(foodRate(s))} at the state level${s.sales.local.allowed ? ', plus local tax where it applies' : ''}. ${s.sales.groceries.note ?? ''}${s.sales.groceries.url ? ` ${h.ext(s.sales.groceries.url, 'Official rule')}.` : ''}</li>`).join('')}</ul>
<p>On a ${h.usd(week)} weekly grocery budget, the difference between these states and the exempt majority is real money: ${listOf(taxedFood.slice(0, 4).map((s) => `${h.usd(h.tx(s.slug, week * 52, 'groceries').stateTax)} a year in ${s.name}`))} at the state level, before any local rate.</p>
<h2>Exempt from the state, taxed by the city</h2>
<p>Exempting groceries from the state rate does not always exempt them from local rates. ${localOnly.length ? `In ${listOf(localOnly.map((s) => s.name))}, local governments may still tax food:` : ''}</p>
<ul>${localOnly.map((s) => `<li><strong>${h.a(s.slug, s.name)}</strong>: ${s.sales.groceries.note ?? s.sales.local.levies ?? ''}</li>`).join('')}</ul>
<p>In those states, choose “Groceries” in the calculator and type the local rate that applies to food at your store; the state part will be zero and only the local part will be added.</p>
<h2>What counts as groceries</h2>
<p>The exemption covers food for home consumption, and each state draws the line in its own law. The common pattern: raw and packaged food bought at a grocery store is exempt; food sold hot, food eaten on the premises and food prepared by the seller to eat right away is taxed like a restaurant meal. Many states also exclude candy and soft drinks from the definition of food, and alcoholic beverages are taxed everywhere. The borderline cases (a bakery cake, a deli tray, a smoothie, a meal kit) are settled by the state's own bulletins, which the state pages link. Purchases paid with SNAP benefits or WIC vouchers are exempt from sales tax under federal rules, whatever the state taxes otherwise.</p>
<h2>A recent trend: cutting the grocery tax</h2>
<p>Several states have reduced or removed their tax on food in recent years, often in steps written into law, and the notes above give the dates the states published. Where the reduction is phased, the calculator uses the rate in force on the day the state page was read, and the state page lists the scheduled changes. Local grocery taxes tend to survive state repeals longer, because they fund city and county budgets directly.</p>
<h2>Using the calculator for a grocery receipt</h2>
<p>A supermarket receipt usually mixes exempt food with taxable items such as paper towels, cleaning products, soda or candy. Run the taxable part with “Most goods” and the food with “Groceries”; the sum is what the register should charge. To check a receipt total backwards, the ${h.a('reverse-sales-tax-calculator', 'reverse sales tax calculator')} works category by category. The full rules of each state are on its page, reachable from the ${h.a('sales-tax-by-state', 'sales tax by state')} table.</p>`,
  faqs: [
    { q: 'Which states charge sales tax on groceries in 2026?', a: `At the state level: ${listOf(taxedFood.map((s) => `${s.name} (${rate(foodRate(s))})`))}, on the official pages read in 2026. In some other states the state exempts food but cities or counties may still tax it, so a grocery receipt can carry a local tax there. Each state page links the rule and its date.` },
    { q: 'Is restaurant food taxed in states that exempt groceries?', a: `Yes. The grocery exemption covers food for home consumption. Meals served in a restaurant, hot food and food prepared by the seller to be eaten immediately are taxed at the general rate in every state with a sales tax, and some localities add a separate meals tax on top. A cold sandwich from a grocery shelf and the same sandwich made to order can be taxed differently.` },
    { q: 'Do I pay sales tax on groceries bought with SNAP?', a: `No. Federal rules prohibit state and local sales tax on food purchased with SNAP benefits, and WIC purchases are exempt too, including in states that otherwise tax groceries. If you pay part of a receipt with SNAP and part with cash or a card, the tax applies only to the taxable items paid by other means.` },
  ],
  related: ['sales-tax-by-state', 'clothing-sales-tax-by-state', 'home', 'reverse-sales-tax-calculator'],
  sources: ['sst', 'state:alabama', 'state:illinois'],
});
