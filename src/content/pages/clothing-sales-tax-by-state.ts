import { definePage } from '../../lib/page-types';
import { STATES, usd, rate, listOf, noSalesTax } from '../../lib/kit';

const taxing = STATES.filter((s) => s.sales.hasStateSalesTax);
const exempt = taxing.filter((s) => s.sales.clothing.treatment === 'exempt');
const thr = taxing.filter((s) => s.sales.clothing.treatment === 'exempt-under-threshold');
const taxed = taxing.filter((s) => s.sales.clothing.treatment === 'taxed');
const none = noSalesTax();
const mode = (s: (typeof STATES)[number]) => s.sales.clothing.treatment === 'exempt' ? 1 : s.sales.clothing.treatment === 'taxed' ? 0 : s.sales.clothing.thresholdMode === 'excess' ? 2 : 3;
const arg = JSON.stringify([...thr, ...exempt, ...taxed.slice(0, 6)].map((s) => [s.name, s.sales.stateRate, mode(s), s.sales.clothing.threshold ?? 0]));
const excess = thr.filter((s) => s.sales.clothing.thresholdMode === 'excess');
const item = thr.filter((s) => s.sales.clothing.thresholdMode === 'item');
const clothingHolidays = STATES.filter((s) => (s.sales.holidays2026 ?? []).some((x) => /cloth/i.test(x.items)));

export default definePage({
  id: 'clothing-sales-tax-by-state',
  group: 'sales',
  order: 50,
  slug: 'clothing-sales-tax-by-state',
  nav: 'Clothing sales tax by state',
  card: 'States that exempt clothing, per-item thresholds, holiday weekends',
  title: 'Clothing Sales Tax by State 2026: Exemptions and Thresholds',
  description: `Clothing sales tax by state in 2026: the states that exempt clothes, the per-item thresholds of ${listOf(thr.map((s) => s.abbr))}, and the 2026 holidays that waive the tax.`,
  h1: 'Clothing sales tax by state',
  intro: 'Most states tax clothes like anything else. A few exempt them, and three draw a line at a price per item.',
  resume: `Clothing is taxed at the general rate in ${taxed.length} of the ${taxing.length} jurisdictions with a statewide sales tax. ${listOf(exempt.map((s) => s.name))} exempt everyday clothing from the state tax altogether, and ${listOf(none.map((s) => s.name))} have no statewide sales tax to begin with. ${listOf(thr.map((s) => `${s.name} (${usd(s.sales.clothing.threshold ?? 0)})`))} exempt clothing up to a price per item, but not in the same way: ${listOf(excess.map((s) => s.name))} tax only the part of the price above the threshold, while ${listOf(item.map((s) => s.name))} exempts items below it and taxes items at or above it in full. Accessories, jewelry, costumes and sports equipment are usually outside the exemption. In the taxing states, sales tax holidays waived the tax on clothing for a few days in ${clothingHolidays.length} states in 2026. Pick “Clothing” in the calculator and the state's rule is applied to the price of one item.`,
  mini: 'clothingItem',
  miniArg: arg,
  body: (h) => `<h2>Where clothing is exempt or capped</h2>
<ul>${[...exempt, ...thr].map((s) => `<li><strong>${h.a(s.slug, s.name)}</strong>: ${s.sales.clothing.treatment === 'exempt' ? 'exempt from the state tax' : `exempt up to ${h.usd(s.sales.clothing.threshold ?? 0)} an item`}. ${s.sales.clothing.note ?? ''}${s.sales.clothing.url ? ` ${h.ext(s.sales.clothing.url, 'Official rule')}.` : ''}</li>`).join('')}</ul>
<h2>Two ways to apply a threshold</h2>
<p>The difference matters as soon as an item crosses the line. Under the “excess” method${excess.length ? ` of ${listOf(excess.map((s) => s.name))}` : ''}, a coat priced just above the threshold owes tax only on the few dollars above it${excess[0] ? `: in ${excess[0].name}, a ${h.usd((excess[0].sales.clothing.threshold ?? 0) + 25)} coat is taxed on ${h.usd(25)}, which is ${h.usd(h.tx(excess[0].slug, (excess[0].sales.clothing.threshold ?? 0) + 25, 'clothing').stateTax, 2)}` : ''}. Under the “whole item” method${item.length ? ` of ${listOf(item.map((s) => s.name))}` : ''}, crossing the threshold makes the entire price taxable${item[0] ? `: a ${h.usd((item[0].sales.clothing.threshold ?? 0) - 1)} jacket owes no state tax in ${item[0].name}, a ${h.usd(item[0].sales.clothing.threshold ?? 0)} one owes ${h.usd(h.tx(item[0].slug, item[0].sales.clothing.threshold ?? 0, 'clothing').stateTax, 2)}` : ''}. In both cases the threshold applies to each item or pair, not to the receipt: five shirts below the threshold are all exempt even if the total is far above it.</p>
<h2>What counts as clothing</h2>
<p>States define clothing as articles worn on the body for everyday use: shirts, trousers, dresses, coats, shoes, underwear, hats and similar items. The exemption usually leaves out accessories such as jewelry, watches, handbags and wallets, protective and sports equipment such as helmets, skates and cleats designed for a sport, costumes and formal wear rentals, and fabric or sewing supplies. The exact lists differ from state to state, and the state bulletins linked above settle borderline items. Alterations and dry cleaning are services, taxed or not under separate rules.</p>
<h2>Local taxes on clothing</h2>
<p>A state exemption usually carries over to local rates, with exceptions. ${item.map((s) => `In ${s.name}, ${s.sales.clothing.note ?? ''}`).join(' ')} When local tax still applies to clothing in your area, choose “Clothing”, type your local rate, and the calculator charges only that part.</p>
<h2>Holiday weekends</h2>
<p>In states that tax clothing, a sales tax holiday is the one moment of the year when it is not taxed, usually during a weekend in late July or August with a cap per item. The ${h.a('sales-tax-holidays', '2026 sales tax holiday calendar')} lists the dates, caps and official notices of each state, and the state pages show the same information next to their calculator.</p>
<h2>Shopping across a state line</h2>
<p>Buying clothes in an exempt state as a resident of a taxing one technically leaves use tax due at home, as with any untaxed purchase; see ${h.a('use-tax', 'use tax')}. For online orders, the rule of the delivery address applies: an order shipped to an exempt state is exempt, an order shipped to a taxing state is taxed at its rate, whatever the seller's location.</p>`,
  faqs: [
    { q: 'Which states have no sales tax on clothing?', a: `${listOf(exempt.map((s) => s.name))} exempt everyday clothing from the state sales tax, and ${listOf(none.map((s) => s.name))} have no statewide sales tax at all. ${listOf(thr.map((s) => s.name))} exempt clothing only up to a price per item. Accessories, sports equipment and costumes are usually taxed even where clothing is exempt.` },
    { q: 'Is a pair of shoes counted as clothing for the exemption?', a: `Yes, everyday footwear is clothing in the states that exempt it, and per-item thresholds apply to each pair. Shoes designed for a specific sport, such as cleats, ski boots or bowling shoes, are often classed as sports equipment and taxed. Check the clothing bulletin of the state, linked from its page, for the borderline cases.` },
    { q: 'Do clothing thresholds apply per receipt or per item?', a: `Per item. A threshold such as ${usd(thr[0]?.sales.clothing.threshold ?? 0)} in ${thr[0]?.name ?? 'those states'} is compared with the price of each article or pair, so several inexpensive items on one receipt each stay exempt even when the total is much higher. Splitting one item's price, or bundling, does not change the rule: the price of the article itself counts.` },
  ],
  related: ['grocery-sales-tax-by-state', 'sales-tax-holidays', 'sales-tax-by-state', 'home'],
  sources: ['sst', 'state:new-york', 'state:massachusetts'],
});
