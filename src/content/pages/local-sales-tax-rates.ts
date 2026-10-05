import { definePage } from '../../lib/page-types';
import { STATES, listOf } from '../../lib/kit';

const withLocal = STATES.filter((s) => s.sales.local.allowed);
const noLocal = STATES.filter((s) => s.sales.hasStateSalesTax && !s.sales.local.allowed);
const capped = withLocal.filter((s) => s.sales.local.cap != null);
const lookups = withLocal.filter((s) => s.sales.local.lookupUrl);

export default definePage({
  id: 'local-sales-tax-rates',
  group: 'sales',
  order: 15,
  slug: 'local-sales-tax-rates',
  nav: 'Local sales tax rates',
  card: 'Who may add a local rate in each state, and how to find yours',
  title: 'Local Sales Tax Rates 2026: Counties, Cities and Districts',
  description: `Local sales tax rates in 2026: which states let counties, cities and districts add a rate, the legal caps, and the official lookup for the rate of an address.`,
  h1: 'Local sales tax rates: how they stack, and where to find yours',
  intro: 'The state rate is the floor. What the register charges depends on the address, and only the state’s lookup gives it reliably.',
  resume: `In ${withLocal.length} of the 51 jurisdictions, local governments may add their own sales tax to the state rate: counties, cities, towns, transit authorities and special districts, depending on the state. ${listOf(noLocal.map((s) => s.name))} apply one rate everywhere. Where local taxes exist, the combined rate of an address is the state rate plus every local rate whose boundary includes that address, and boundaries do not follow ZIP codes: two homes with the same ZIP code can pay different rates. Local rates also change more often than state rates, in many states at the start of any quarter. That is why this site does not print city or county rates. It links, on each state page, the free address lookup run by the state itself (${lookups.length} states publish one), and asks you to type the local part into the calculator. Below, the rules of each state: who may levy, and the legal cap when the law sets one.`,
  mini: 'localStack',
  body: (h) => `<h2>Who may levy a local sales tax, state by state</h2>
${h.table(['State', 'Local levies', 'Legal cap', 'Official lookup'], withLocal.map((s) => [h.a(s.slug, s.name), s.sales.local.levies ?? 'yes', s.sales.local.cap != null ? h.rate(s.sales.local.cap) : (s.sales.local.capNote ? 'see state page' : 'none stated'), s.sales.local.lookupUrl ? h.ext(s.sales.local.lookupUrl, 'Rate lookup') : 'none published']), 'Rules read on each state’s official pages, October 2026', ['l', 'l', 'r', 'l'])}
<h2>How the rates stack</h2>
<p>Think of an address as sitting inside several overlapping territories: the state, a county, perhaps a city, perhaps one or more special districts for transit, hospitals, stadiums or tourism. Each territory that levies a sales tax adds its rate. The mini-calculator above adds four layers; real addresses can have more. A store on one side of a city line can charge a point more than a store a block away, and a delivery outside the city limits of a city whose name is in the postal address may owe no city tax at all. This is the main source of errors in ZIP-based tables and in online checkouts that rely on them.</p>
<h2>Where the sale takes place</h2>
<p>For a purchase in a store, the store's address decides. For a delivery, most states tax at the delivery address (destination sourcing). A few states use the seller's location for some sales between businesses and customers inside the state (origin sourcing), which the state pages note when the official page says so. Services follow their own sourcing rules. When you check a receipt or an online checkout, use the address that the state's rule designates, then the lookup.</p>
<h2>Caps on local rates</h2>
<p>${capped.length ? `${listOf(capped.map((s) => s.name))} set a maximum on local rates in law, shown in the table.` : ''} Elsewhere the cap, if any, is set per type of government or per purpose, and each new local tax usually needs a vote of the local electors or of the governing body. These rules are why combined rates rarely exceed a few points above the state rate, although special districts can push some addresses higher.</p>
<h2>Who collects the local tax</h2>
<p>In most states, the department of revenue collects local sales taxes together with the state tax and sends each locality its share, so a seller files one return and the state's lookup covers every local rate. A few states work differently, and it shows on receipts and in disputes. In Colorado, home-rule cities collect their own tax and set their own base and exemptions, so a purchase can be exempt from the state tax and taxable in the city. In Louisiana, parishes, municipalities and school boards collect locally rather than through the Department of Revenue. In Alabama, the state administers more than 200 local taxes and the rest are collected by the localities themselves. In Alaska, there is no state tax at all, and boroughs and cities run their own, with a commission of member communities collecting on remote sales. In those states, the local government is the one to ask about a local rate or a refund.</p>
<p>Some states also cap local tax on a single large purchase. Florida's county surtax applies only to the first part of the price of an item, and Arkansas limits local tax on vehicles, boats, aircraft and certain equipment to the first part of the price. The state pages give the thresholds as each state publishes them.</p>
<h2>Groceries and other exemptions at the local level</h2>
<p>Local taxes usually follow the state's list of what is taxable, with exceptions that matter: in some states that exempt groceries from the state rate, cities or counties may still tax them, and some local exemptions for clothing are optional. The ${h.a('grocery-sales-tax-by-state', 'grocery')} and ${h.a('clothing-sales-tax-by-state', 'clothing')} pages list them. Choose the right category in the calculator and it will apply the local rate only where the state's rules allow it.</p>
<h2>Using the lookup and the calculator together</h2>
<p>Open your state's page from the ${h.a('sales-tax-by-state', 'sales tax by state')} table, follow its lookup link, enter the full street address, and note the local part of the combined rate (or the combined rate minus the state rate). Type that local part into the ${h.a('home', 'sales tax calculator')}. If you are checking a past receipt, use the rate in force on the date of the sale: most lookups let you choose the period.</p>`,
  faqs: [
    { q: 'Why is the sales tax different in two towns with the same ZIP code?', a: `Because local sales taxes follow the boundaries of counties, cities and special districts, not postal ZIP codes. A ZIP code can straddle a city line or a transit district, so addresses inside it can owe different local rates. The address lookup published by the state's revenue department uses the exact boundaries; ZIP-based tables do not.` },
    { q: 'How often do local sales tax rates change?', a: `More often than state rates. In many states a new local rate can take effect at the start of any calendar quarter after a vote or an ordinance, and the state announces the change a few weeks before. Check the lookup for the date of your purchase, especially around January 1, April 1, July 1 and October 1.` },
    { q: 'Do online stores charge my local sales tax?', a: `Most large online sellers and marketplaces now charge the combined state and local rate of the delivery address, using the state's boundary data. Smaller sellers may charge only the state rate or nothing. If too little was charged, the difference is generally owed by you as use tax to your home state.` },
  ],
  related: ['sales-tax-by-state', 'home', 'use-tax', 'reverse-sales-tax-calculator'],
  sources: ['sst', 'state:alaska', 'state:new-york', 'state:california'],
});
