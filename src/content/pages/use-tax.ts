import { definePage } from '../../lib/page-types';
import { STATES, usd, rate, listOf, noSalesTax } from '../../lib/kit';

const none = noSalesTax();
const withUse = STATES.filter((s) => s.sales.hasStateSalesTax && s.sales.useTax?.rate != null && s.sales.useTax.rate === s.sales.stateRate);

export default definePage({
  id: 'use-tax',
  group: 'sales',
  order: 60,
  slug: 'use-tax',
  nav: 'Use tax on online purchases',
  card: 'When you owe your home state’s tax on what you buy elsewhere',
  title: 'Use Tax 2026: Online and Out-of-State Purchases Explained',
  description: `Use tax in 2026: when you owe your home state's rate on online and out-of-state purchases, the credit for tax already paid, and how to report it on a return.`,
  h1: 'Use tax on online and out-of-state purchases',
  intro: 'The other half of the sales tax: due when you use something at home that nobody taxed when you bought it.',
  resume: `Use tax is the twin of sales tax. Every state with a sales tax also charges a use tax, at the same rate, on taxable goods bought without sales tax and then used, stored or consumed in the state: an online order from a seller that did not collect, furniture bought in a state with no sales tax and driven home, equipment ordered from abroad. It exists so that buying across a border does not beat buying at home. Since the Supreme Court's 2018 decision in South Dakota v. Wayfair, most large online sellers and marketplaces collect the buyer's state tax at checkout, so the question now comes up mainly with small out-of-state sellers, purchases made while travelling and private imports. When the seller charged another state's tax, most states credit it against what you owe, up to their own rate. ${listOf(none.map((s) => s.name))} have no statewide sales tax and therefore no statewide use tax.`,
  mini: 'useTax',
  body: (h) => `<h2>Who collects it now</h2>
<p>Before 2018, a state could only make a seller collect its tax if the seller had a physical presence there, such as a store, a warehouse or employees. ${h.src('wayfair', 'South Dakota v. Wayfair, Inc.')} ended that rule: a state may require collection from a remote seller whose sales into the state pass an economic threshold. Every state with a sales tax has since adopted such a threshold, and most also make marketplaces responsible for the tax on sales by their third-party sellers. In practice, an order from a large retailer or a major marketplace arrives with the tax of the delivery address already charged. Use tax remains the buyer's responsibility in the cases the collection rules miss: small out-of-state shops below the threshold, purchases made in person in another state, private sales, and goods imported directly.</p>
<h2>The rate you owe</h2>
<p>Use tax is charged at the same rate as the sales tax would have been had you bought at home: the state rate plus, in most states, the local rate of the place where the item is used. ${withUse.length > 0 ? `Among the state files read for this site, ${withUse.length} states publish a use tax rate equal to their state sales tax rate.` : ''} The categories are the same too: an item exempt from sales tax at home, such as groceries in most states, is exempt from use tax.</p>
<h2>Credit for tax already paid</h2>
<p>If you paid sales tax to another state on the purchase, most states let you subtract it from the use tax due, but only up to their own rate. Buy a ${h.usd(1200)} laptop in a state at 6% and take it home to a combined rate of 8%: you paid ${h.usd(72)}, the use tax at home is ${h.usd(96)}, and ${h.usd(24)} is still due. Bought in a state with no sales tax, the full ${h.usd(96)} is due. If the other state's tax was higher than yours, nothing is due, and the difference is not refunded. The mini-calculator above does this arithmetic.</p>
<h2>How individuals report it</h2>
<p>Most states with an income tax give individuals a line on the state income tax return to report use tax for the year, and some publish a lookup table that estimates it from income for small purchases, to be used instead of keeping every receipt. Large single items, typically above a dollar threshold, must be reported at their actual price. States without an income tax provide a separate consumer use tax return. Vehicles, boats and aircraft are a separate case: the tax is normally collected when you register them in your state, with credit for tax paid elsewhere, which is why a car bought across the state line does not avoid tax in practice.</p>
<h2>Businesses</h2>
<p>A business registered for sales tax reports use tax on its own returns, for equipment and supplies bought tax-free from out-of-state vendors and for inventory taken out of stock for its own use. Audits of small businesses often turn up unreported use tax on office equipment and software, and the assessment comes with interest. If you sell, the question is the other one: whether your sales into a state have crossed its economic threshold and you must register there. The state pages link the official guidance for each state.</p>
<h2>Common situations</h2>
<ul>
<li><strong>Online order, tax charged at checkout:</strong> nothing more to do, the seller collected your state's tax.</li>
<li><strong>Online order, no tax charged:</strong> use tax is due at your home rate, unless the item is exempt in your state.</li>
<li><strong>Shopping trip to a state without sales tax:</strong> legally the use tax is due at home; for cars it is collected at registration.</li>
<li><strong>Moving to a new state with your belongings:</strong> household goods used before the move are generally not taxed; check the state's rules for vehicles.</li>
</ul>
<p>To find your home rate, open your ${h.a('sales-tax-by-state', 'state in the sales tax table')} and its official address lookup. The ${h.a('home', 'sales tax calculator')} adds the local part.</p>`,
  faqs: [
    { q: 'Do I really owe use tax on something I bought online without tax?', a: `Legally, yes, in every state that has a sales tax, unless the item is exempt there. The seller not collecting it does not cancel the tax; it moves the duty to report it to you. Most states provide a line on the individual income tax return for it, and some publish an estimate table for small purchases so that you do not need every receipt.` },
    { q: 'I bought furniture in a state with no sales tax. What do I owe at home?', a: `The full use tax of your home state and locality on the purchase price, because no sales tax was paid that could be credited. A ${usd(2000)} sofa used in a place where the combined rate is 7% means ${usd(140)} of use tax. If you also paid for delivery, check whether your state taxes delivery charges.` },
    { q: 'What if the other state charged a higher sales tax than mine?', a: `Then you owe nothing more at home, because the credit for tax paid to the other state covers your use tax entirely. The excess is not refunded by your home state: you paid it to the state where you bought, under its law. Keep the receipt showing the tax paid, in case your state asks for proof of the credit.` },
  ],
  related: ['home', 'sales-tax-by-state', 'states-without-sales-tax', 'local-sales-tax-rates'],
  sources: ['wayfair', 'sst', 'state:new-york'],
});
