import { definePage } from '../../lib/page-types';
import { STATES, usd, rate, listOf, noSalesTax, day, FACTS_VERIFIED, tx } from '../../lib/kit';

const taxing = STATES.filter((s) => s.sales.hasStateSalesTax).sort((a, b) => b.sales.stateRate - a.sales.stateRate);
const top = taxing[0], low = taxing[taxing.length - 1];
const none = noSalesTax();
const noLocal = taxing.filter((s) => !s.sales.local.allowed);
const withLocal = STATES.filter((s) => s.sales.local.allowed);
const changed = STATES.flatMap((s) => (s.sales.scheduledChanges ?? []).map((c) => ({ s, c }))).filter(({ c }) => c.date >= '2025-01-01');
const recent = STATES.filter((s) => s.sales.effectiveSince && s.sales.effectiveSince >= '2025-01-01');
const arg = JSON.stringify(taxing.map((s) => [s.name, s.sales.stateRate]));
const atRate = (r: number) => taxing.filter((s) => s.sales.stateRate === r).map((s) => s.name);
const sixes = atRate(6);

export default definePage({
  id: 'sales-tax-by-state',
  group: 'sales',
  order: 10,
  slug: 'sales-tax-by-state',
  nav: 'Sales tax rates by state',
  card: 'Statewide rate, local add-ons, groceries and clothing for all 51',
  title: 'Sales Tax by State 2026: Official Rates of All 50 States, DC',
  description: `Sales tax by state in 2026: the statewide rate of all 50 states and DC from each revenue department, which allow local taxes, and grocery and clothing rules.`,
  h1: 'Sales tax rates by state',
  intro: 'The statewide rate of every state, from its own revenue department, with the rules that change the bill.',
  resume: `In 2026, ${taxing.length - 1} states and the District of Columbia charge a statewide sales tax. The highest statewide rate is ${top.name}'s ${rate(top.sales.stateRate)}; the lowest is ${low.name}'s ${rate(low.sales.stateRate)}; ${listOf(sixes)} sit at 6%; and ${listOf(none.map((s) => s.name))} have no statewide sales tax at all. Those state rates are only part of what shoppers pay: in ${withLocal.length} states, counties, cities or districts add a local rate, while ${listOf(noLocal.map((s) => s.name))} apply a single rate everywhere. Every rate below was read on the official page of the state's revenue department, most recently on ${day(FACTS_VERIFIED)}, and links to it from the state's page. The table also shows how each state treats groceries and clothing, the two exemptions that change a household's bill the most.`,
  mini: 'statePick',
  miniArg: arg,
  body: (h) => `<h2>The 51 statewide rates, highest first</h2>
${h.stateTable('sales', 'rate')}
<h2>State rate versus combined rate</h2>
<p>The statewide rate is the floor in states that allow local taxes, not the rate you pay. A state at a moderate rate with heavy local add-ons can end up with higher totals at the register than a state with a higher statewide rate and no local taxes. That is why this site does not rank states by an average combined rate: an average hides the address that matters to you. The calculator on the ${h.a('home', 'home page')} adds the local rate you read on the state's official lookup, and ${h.a('local-sales-tax-rates', 'how local sales taxes work')} explains who may levy them in each state.</p>
<h2>Single-rate states</h2>
<p>${listOf(noLocal.map((s) => s.name))} charge the same rate everywhere in the state, so the statewide rate is the whole answer for most purchases. Special taxes on meals, lodging or rental cars can still apply locally in some of them, and their state pages list those rates when the state publishes them. A ${h.usd(1000)} purchase costs ${listOf(noLocal.slice(0, 3).map((s) => `${h.usd(h.tx(s.slug, 1000).tax)} in ${s.name}`))}, with nothing to add.</p>
<h2>Recent and scheduled changes</h2>
<p>${recent.length ? `Rates that changed since January 1, 2025: ${listOf(recent.map((s) => `${s.name} (${h.rate(s.sales.stateRate)} since ${h.day(s.sales.effectiveSince!)})`))}. ` : ''}${changed.length ? `Changes already scheduled by law: ${listOf(changed.map(({ s, c }) => `${s.name} on ${h.day(c.date)} (${c.what})`))}. ` : 'No statewide rate change scheduled for the coming months was found on the official pages read. '}Rate changes usually take effect on January 1, April 1, July 1 or October 1, and states announce them weeks in advance in a bulletin, which is when we re-read the pages.</p>
<h2>Why the same item costs different tax in different states</h2>
<p>The rate is one difference; the tax base is the other. One state taxes groceries at the full rate, another at a reduced rate, most not at all; a few exempt clothing; some tax services such as repairs or digital downloads that others leave out. Two receipts for the same basket of goods can therefore differ by more than the rate difference suggests. The ${h.a('grocery-sales-tax-by-state', 'grocery')} and ${h.a('clothing-sales-tax-by-state', 'clothing')} pages detail the two big exemptions; services and digital goods are described on each state page when the state publishes a rule.</p>
<h2>Reading the table</h2>
<p>“Local taxes: yes” means counties, cities or districts in that state may levy their own sales tax; it does not mean every address has one. “Groceries: reduced” gives the state rate on food for home consumption; local taxes may apply on top in some states. “Clothing: exempt under $X” is a per-item threshold. For the rule in full and its official source, open the state. To see what a purchase costs at the state level in each, use the mini-calculator above; for the total with your local rate, use the ${h.a('home', 'sales tax calculator')}; and to take the tax out of a receipt, the ${h.a('reverse-sales-tax-calculator', 'reverse calculator')}.</p>`,
  faqs: [
    { q: 'What is the average sales tax rate in the United States?', a: `There is no official national rate, because sales tax is a state and local tax. Across the ${taxing.length} jurisdictions with a statewide sales tax, the statewide rates read on 2026 official pages range from ${rate(low.sales.stateRate)} to ${rate(top.sales.stateRate)}. Averages of combined rates published by private organizations depend on how local rates are weighted; for a purchase, the rate of the actual address is what counts.` },
    { q: 'Which states have the same sales tax rate everywhere?', a: `${listOf(noLocal.map((s) => s.name))} do not allow local general sales taxes, so the statewide rate applies across the state. A few still allow local taxes on specific items such as meals or lodging. In every other state with a sales tax, the rate can change from one city or county to the next.` },
    { q: 'How often do states change their sales tax rate?', a: `Statewide rates change rarely, usually by law after a budget debate, and often take effect on January 1 or July 1. Local rates change far more often, in many states at the start of any quarter after a local vote or ordinance. This site re-reads every state's official pages at least once a year and before those effective dates.` },
  ],
  related: ['home', 'local-sales-tax-rates', 'states-without-sales-tax', 'grocery-sales-tax-by-state'],
  sources: ['sst', 'state:california', 'state:texas', 'state:new-york'],
});
