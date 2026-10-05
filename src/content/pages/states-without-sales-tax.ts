import { definePage } from '../../lib/page-types';
import { STATES, usd, eff, rate, listOf, noSalesTax, CENSUS } from '../../lib/kit';

const none = noSalesTax();
const withLocal = none.filter((s) => s.sales.local.allowed);
const without = none.filter((s) => !s.sales.local.allowed);
const near = STATES.filter((s) => ['washington', 'idaho', 'california', 'nevada', 'maryland', 'pennsylvania', 'new-jersey', 'massachusetts', 'vermont', 'maine', 'wyoming', 'north-dakota', 'south-dakota'].includes(s.slug) && s.sales.hasStateSalesTax);
const arg = JSON.stringify(near.map((s) => [s.name, s.sales.stateRate]));
const prop = [...none].sort((a, b) => b.census.effectiveRate - a.census.effectiveRate);

export default definePage({
  id: 'states-without-sales-tax',
  group: 'sales',
  order: 20,
  slug: 'states-without-sales-tax',
  nav: 'States without sales tax',
  card: 'The five states with no statewide sales tax, and what they tax instead',
  title: 'States Without Sales Tax 2026: The Five and What They Charge',
  description: `States without sales tax in 2026: ${listOf(none.map((s) => s.abbr))} have no statewide sales tax. What each one taxes instead, where local taxes apply, and use tax.`,
  h1: 'States without a statewide sales tax',
  intro: `${listOf(none.map((s) => s.name))}: no statewide sales tax, but not always a tax-free receipt.`,
  resume: `${none.length} states have no statewide sales tax in 2026: ${listOf(none.map((s) => s.name))}. “No sales tax” does not mean the same thing in all five. ${withLocal.length ? `In ${listOf(withLocal.map((s) => s.name))}, local governments may levy their own sales tax, so a receipt can carry tax depending on where you shop or take delivery` : ''}${without.length ? `, while ${listOf(without.map((s) => s.name))} ${without.length > 1 ? 'have' : 'has'} no local general sales tax either` : ''}. Each of the five taxes specific sales instead: meals and lodging, rental cars, new vehicles, or the gross receipts of businesses, which are built into prices rather than printed on the receipt. And they make up the revenue elsewhere: property tax in some, income tax in others. For residents of neighboring states, buying across the line does not avoid tax for long: the home state's use tax is legally due on the purchase, and vehicles are taxed when they are registered.`,
  mini: 'noTaxSaving',
  miniArg: arg,
  body: (h) => `<h2>What each of the five charges instead</h2>
${none.map((s) => `<h3>${h.a(s.slug, s.name)}</h3>
<p>${s.sales.rateNote ?? ''} ${s.sales.local.allowed ? `Local sales taxes: ${s.sales.local.levies ?? 'allowed'}.` : 'No local general sales tax.'}</p>
${(s.sales.otherRates ?? []).length ? `<ul>${(s.sales.otherRates ?? []).map((o) => `<li>${o.item.charAt(0).toUpperCase() + o.item.slice(1)}${o.rate != null ? `: ${h.rate(o.rate)}` : ''}. ${o.note ?? ''} ${h.ext(o.url, 'Source')}</li>`).join('')}</ul>` : ''}`).join('\n')}
<h2>Where the money comes from</h2>
<p>A state that does not tax sales raises its budget from other taxes, and property tax is often one of them. On the Census Bureau's ${CENSUS.year} medians, the effective property tax rate of the five ranges from ${h.eff(prop[prop.length - 1].census.effectiveRate)} in ${prop[prop.length - 1].name} to ${h.eff(prop[0].census.effectiveRate)} in ${prop[0].name}; the full ranking is in ${h.a('property-tax-by-state', 'property tax by state')}. Business taxes play a part too: a gross receipts or commercial activity tax is paid by the seller and passed on in prices, invisibly. The ${h.a('state-tax-comparison', 'two-state comparison')} sets sales tax and property tax side by side for any pair of states.</p>
<h2>Shopping across the border</h2>
<p>The border stores of these states attract shoppers from neighboring states, especially for large items. For a resident of a state with a sales tax, the purchase is not tax-free in law: the home state's use tax is due at the same rate as its sales tax, reported on the state income tax return or a consumer use tax return. Most states enforce it systematically only on vehicles, boats and other items that must be registered, which is where the tax is collected. The mini-calculator above shows the state tax a purchase would carry in the neighboring state you choose, which is also the use tax a resident there owes. Details in ${h.a('use-tax', 'use tax on out-of-state purchases')}.</p>
<h2>Buying online when you live in one of the five</h2>
<p>Online sellers charge the tax of the delivery address. With a delivery address in a state without sales tax, no state sales tax is due, although a local sales tax can apply where local governments levy one and have joined a collection system for remote sellers. Gift cards, digital downloads and services follow the same logic. Moving to one of the five does not change the tax due on purchases made before the move in your former state.</p>
<h2>Visitors</h2>
<p>Travellers notice the absence of sales tax in shops, then meet the specific taxes at the hotel desk, the car rental counter and in restaurants in the states that tax meals. The rates of those taxes are listed above and on each state's page, with their official sources.</p>`,
  faqs: [
    { q: 'Which 5 states have no sales tax in 2026?', a: `${listOf(none.map((s) => s.name))} have no statewide general sales tax, on the official pages read in 2026. Some of them still allow local sales taxes or tax specific sales such as meals, lodging, rental cars or new vehicles, and businesses there may pay a gross receipts tax that is built into prices. Each state page lists those taxes with their sources.` },
    { q: 'Can I avoid sales tax by buying a car in a state without sales tax?', a: `Generally not. When you register the vehicle in your home state, that state collects its sales or use tax on the purchase price, minus any sales tax legally paid elsewhere. The state without sales tax may charge its own titling fee or vehicle tax if you register there, which residents of other states usually cannot do.` },
    { q: 'Is Alaska really free of sales tax?', a: `Alaska has no statewide sales tax, but boroughs and cities may levy their own sales taxes, so many Alaskan purchases are taxed at a local rate set by the community. Online orders delivered to member communities are taxed through a remote seller commission. The Alaska page here explains the local structure and links the official lookup.` },
  ],
  related: ['sales-tax-by-state', 'use-tax', 'state-tax-comparison', 'alaska', 'oregon'],
  sources: ['state:oregon', 'state:delaware', 'state:new-hampshire', 'wayfair'],
});
