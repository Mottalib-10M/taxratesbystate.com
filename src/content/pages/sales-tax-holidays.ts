import { definePage } from '../../lib/page-types';
import { STATES, listOf, day, dayShort, LAST } from './_holidays';

export default definePage({
  id: 'sales-tax-holidays',
  group: 'sales',
  order: 30,
  slug: 'sales-tax-holidays',
  nav: 'Sales tax holidays 2026',
  card: 'Every 2026 tax-free weekend, with dates, items and caps',
  title: 'Sales Tax Holidays 2026: Every State, Dates, Items and Caps',
  description: `Sales tax holidays 2026: every state tax-free period with official dates, qualifying items and price caps, from back-to-school weekends to hurricane kits.`,
  h1: 'Sales tax holidays in 2026',
  intro: 'Every tax-free period of 2026, read on the official notice of each state.',
  resume: `${LAST.count} states held at least one sales tax holiday in 2026, for ${LAST.total} holiday periods in all, according to the notices published by their revenue departments. Most fall on back-to-school weekends in late July and August and cover clothing, footwear and school supplies under a price cap per item, with computers in some states; others waive the tax on emergency and hurricane supplies, Energy Star or WaterSense appliances, or firearms and safety equipment. The first period of the year began on ${LAST.first ? day(LAST.first) : 'the dates listed below'} and the last ends on ${LAST.lastEnd ? day(LAST.lastEnd) : 'the dates listed below'}. A holiday removes the state tax on qualifying items; whether the local tax is waived too depends on the state, and on the locality in some. Prices must be under the cap item by item, and items outside the list, such as accessories or sports equipment, stay taxed. The table gives every period with a link to the state's notice.`,
  mini: 'holidaySaving',
  miniArg: LAST.arg,
  body: (h) => `<h2>The 2026 calendar, in date order</h2>
${h.table(['Dates', 'State', 'Holiday', 'What qualifies'], LAST.rows.map((r) => [r.start === r.end ? dayShort(r.start) : `${dayShort(r.start)} to ${dayShort(r.end)}`, h.a(r.s.slug, r.s.name), h.ext(r.url, r.name), r.items]), 'Dates and items as published by each state for 2026', ['l', 'l', 'l', 'l'])}
<h2>The holidays by theme</h2>
${(() => {
  const by = (re: RegExp) => LAST.rows.filter((r) => re.test(`${r.name} ${r.items}`));
  const groups: Array<[string, RegExp, string]> = [
    ['Back to school', /school|cloth/i, 'clothing, shoes and school supplies under a per-item cap, sometimes computers'],
    ['Storms and emergencies', /hurricane|storm|severe weather|emergency|disaster|preparedness/i, 'generators, batteries, flashlights, tarps and similar supplies before the storm season'],
    ['Energy and water saving', /energy star|watersense|energy/i, 'qualifying appliances and water-efficient products'],
    ['Firearms and hunting', /firearm|ammunition|second amendment|hunting/i, 'firearms, ammunition and hunting supplies'],
  ];
  return groups.map(([t, re, what]) => { const g = by(re); return g.length ? `<p><strong>${t}.</strong> ${g.length} period${g.length > 1 ? 's' : ''} in 2026 (${listOf([...new Set(g.map((r) => r.s.name))])}), usually covering ${what}.</p>` : ''; }).join('');
})()}
<p>Within each theme, the details differ more than the names suggest: one state caps clothing at $100 an item, another at a higher figure, one includes backpacks and calculators, another only school supplies under a separate cap. The table above gives the list of each state as it published it, and the state page repeats it next to a calculator set on that state.</p>
${(() => { const notes = STATES.filter((x) => x.sales.holidayNote && (x.sales.holidays2026 ?? []).length); return notes.length ? `<h2>Notes on the dates</h2><ul>${notes.map((x) => `<li><strong>${h.a(x.slug, x.name)}</strong>: ${x.sales.holidayNote}</li>`).join('')}</ul>` : ''; })()}
<h2>States without a holiday in 2026</h2>
<p>No 2026 holiday was found on the official pages of ${listOf(LAST.without.map((s) => s.name))}. Several states have repealed their holidays in recent years, and the five states without a statewide sales tax have no reason to hold one. When a state's page carries a note on a repealed or suspended holiday, it appears on that state's page.</p>
<h2>How to use a holiday well</h2>
<p>The cap is per item, not per receipt: a family buying four pairs of shoes under the cap pays no state tax on any of them, while a single coat above the cap is taxed in full in most states, not only on the part above it. Layaway, rain checks and online orders are covered by special rules in each state's notice; for online orders, what usually counts is when the order is placed and paid, and the delivery address. Items bought for a business are often excluded. If a seller charges tax on a qualifying item during the holiday, the state notice explains how to ask for a refund.</p>
<h2>Returns, exchanges and coupons</h2>
<p>Holiday purchases raise practical questions that each state answers in its notice: whether an item bought during the holiday and exchanged afterwards for a different size keeps the exemption, whether a coupon that brings a price under the cap counts, and whether a bundle can be split to fit under it. As a rule of thumb, a store coupon that lowers the selling price is taken into account, while a manufacturer's rebate is not, and items normally sold together cannot be priced separately to qualify. Keep the receipt: it is what the store and the state will ask for.</p>
<h2>What a holiday is worth</h2>
<p>The saving is the state rate, plus the local rate where it is waived too, on what you would have bought anyway. On ${h.usd(500)} of back-to-school clothing, a ${h.rate(6)} state rate is ${h.usd(30)}; on a ${h.usd(1000)} laptop where computers qualify, it is ${h.usd(60)}. The mini-calculator above uses the state rate of the holiday you pick. The full rate of each state, with its local part, is in the ${h.a('home', 'sales tax calculator')}.</p>
<h2>Clothing and groceries outside the holidays</h2>
<p>A holiday matters most where clothing is normally taxed. In states that exempt clothing all year, or exempt it under a threshold, the holiday adds little for clothes; see ${h.a('clothing-sales-tax-by-state', 'clothing sales tax by state')}. Groceries are exempt in most states all year, and the few that tax them do not usually include food in a holiday; see ${h.a('grocery-sales-tax-by-state', 'grocery sales tax by state')}.</p>`,
  faqs: [
    { q: 'When is the back-to-school tax-free weekend in 2026?', a: `It depends on the state: the 2026 back-to-school holidays ran on weekends between late July and August, each on dates fixed by the state's law or announced by its revenue department. The table on this page lists every one with its official notice. Several states repeat the same weekend every year by statute, for example the first weekend of August.` },
    { q: 'Do sales tax holidays apply to online purchases?', a: `Generally yes, when the item qualifies and the order is placed and paid during the holiday for delivery in the state. Each state's notice sets the details, including what happens when an item is delivered after the holiday or back-ordered. Shipping charges follow the state's usual rules on delivery charges.` },
    { q: 'Is the local sales tax also waived during a holiday?', a: `In some states the holiday covers state and local tax together; in others it covers only the state part, and in a few, each county or city decides whether to join. The notice linked in the table says which applies. Where only the state part is waived, the calculator on the state's page shows the local tax you still pay.` },
  ],
  related: ['clothing-sales-tax-by-state', 'sales-tax-by-state', 'home', 'grocery-sales-tax-by-state'],
  sources: ['state:texas', 'state:florida', 'state:ohio'],
});
