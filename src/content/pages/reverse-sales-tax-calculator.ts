import { definePage } from '../../lib/page-types';
import { st, usd, rate, removeTax, preTaxFromTotal, salesTax } from '../../lib/kit';

const tx = st('texas');
const r1 = preTaxFromTotal(54.13, { state: tx, localRate: 2 });
const ma = st('massachusetts');
const r2 = preTaxFromTotal(212.5, { state: ma, category: 'clothing' });

export default definePage({
  id: 'reverse-sales-tax-calculator',
  group: 'calculators',
  order: 10,
  slug: 'reverse-sales-tax-calculator',
  nav: 'Reverse sales tax calculator',
  card: 'Price before tax from a receipt total, with each state’s exemptions',
  title: 'Reverse Sales Tax Calculator 2026: Price Before Tax by State',
  description: `Reverse sales tax calculator for 2026: the price before tax and the tax included in a receipt total, with the official rate and exemptions of every US state.`,
  h1: 'Reverse sales tax calculator',
  intro: 'From the amount you paid back to the price on the tag, and the tax hidden in between.',
  resume: `To take sales tax out of a total, divide the total by one plus the combined rate: a ${usd(54.13, 2)} receipt in Texas, where the state rate is ${rate(tx.sales.stateRate)}, with a 2% local rate, was ${usd(r1.price, 2)} before tax and included ${usd(r1.tax, 2)} of tax. That shortcut only works when the whole purchase was taxed at one rate. If the receipt mixed exempt groceries and taxable goods, or if a clothing threshold applied, dividing by the full rate gives the wrong answer. This calculator solves the forward rule of the state you pick instead: choose the state, type the local rate and the category, and it finds the pre-tax price that the register would have turned into your total. Expense reports, VAT-style bookkeeping for a small business, and checking whether a seller charged the right tax are the usual reasons to run it.`,
  tool: 'reverse',
  toolProps: { state: 'texas', price: 54.13 },
  body: (h) => `<h2>The formula, and when it breaks</h2>
<p>Price before tax = total ÷ (1 + rate). With a combined rate of 8.25%, a ${h.usd(108.25, 2)} total gives ${h.usd(removeTax(108.25, 8.25), 2)}; the tax is the difference. Subtracting 8.25% of the total instead, a common shortcut, removes too much, because the tax was calculated on the smaller pre-tax price, not on the total.</p>
<p>The formula breaks in three situations. First, when part of the receipt was exempt, such as groceries in a state that exempts them: only the taxable lines carry tax, so the rate applies to a smaller base. Second, with a per-item clothing threshold: in Massachusetts only the part of an item's price above the threshold is taxed, so a ${h.usd(212.5, 2)} total for one jacket means a price of ${h.usd(r2.price, 2)}, not the result of dividing by ${h.rate(ma.sales.stateRate)}. Third, when the seller rounded per line rather than on the total, which can leave a one-cent gap. The calculator above handles the first two through the category menu; for a mixed receipt, run it once per category.</p>
<h2>Finding the right combined rate</h2>
<p>The state part is filled in for you. The local part depends on where the sale took place, or the delivery address for shipped goods, and the state's address lookup gives it exactly. If the receipt prints the rate, use that: it is what the register applied. If it prints only the tax amount, you can work back to the rate by dividing the tax by the pre-tax subtotal.</p>
<h2>Checking a seller's tax</h2>
<p>Run the forward calculator with the price on the tag, then compare the tax with the receipt. A difference of a cent is rounding; a larger gap usually means the wrong local rate, an exemption the seller missed or applied by mistake, or a shipping charge taxed in a state that exempts it (or the reverse). The ${h.a('home', 'sales tax calculator')} does the forward direction, and each state page lists its exemptions.</p>`,
  faqs: [
    { q: 'How do I find the sales tax rate from a receipt?', a: `Divide the tax amount by the pre-tax subtotal and multiply by 100. A receipt showing ${usd(46.5, 2)} before tax and ${usd(3.84, 2)} of tax used a rate of about ${rate(Math.round((3.84 / 46.5) * 10000) / 100)}. If the receipt shows only the total, you need the rate first: get it from the state's address lookup, then use the reverse calculator.` },
    { q: 'Why does subtracting the tax rate from the total give the wrong price?', a: `Because the tax was added to the price, not taken from the total. At 10%, a ${usd(100)} item costs ${usd(110)}; taking 10% off ${usd(110)} leaves ${usd(99)}, a dollar short. Dividing by 1.10 gives back the correct ${usd(100)}. The higher the rate, the larger the error of the shortcut.` },
    { q: 'Can I reverse a receipt that mixes groceries and other goods?', a: `Not in one step unless you know which lines were taxable. Add up the taxable lines, reverse that subtotal at the full rate, then add the exempt lines unchanged. In a state that taxes groceries at a reduced rate, reverse each group at its own rate. The category menu of the calculator applies the state's grocery rule automatically.` },
  ],
  related: ['home', 'sales-tax-by-state', 'local-sales-tax-rates', 'use-tax'],
  sources: ['state:texas', 'state:massachusetts'],
});
