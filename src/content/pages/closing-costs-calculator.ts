import { definePage } from '../../lib/page-types';
import { usd, listOf, num } from '../../lib/kit';
import { transferTax } from '../../lib/engine/realestate';
import { RE_STATES } from '../../lib/realestate';

const P0 = 400000;
const withTax = RE_STATES.filter((s) => s.transfer.has);
const none = RE_STATES.filter((s) => !s.transfer.has);
const at = (s: (typeof RE_STATES)[number], p = P0) => transferTax(p, s.transfer);
const byTax = [...withTax].sort((a, b) => at(b) - at(a));
const hi = byTax[0], lo = byTax[byTax.length - 1];
const mort = RE_STATES.filter((s) => s.transfer.mortgageTax?.has && (s.transfer.mortgageTax.ratePct ?? 0) > 0);
const pct = (x: number) => `${num(x, 3).replace(/0+$/, '').replace(/\.$/, '')}%`;
/** Short label of a state's schedule, built from its brackets (the long official wording is in the calculator note). */
const label = (s: (typeof RE_STATES)[number]) => {
  const t = s.transfer;
  if (!t.has) return 'none statewide';
  const r = t.brackets.map((b) => b.ratePct).filter((x) => x > 0);
  const base = r.length === 1 ? `${pct(r[0])} of the price` : `${pct(Math.min(...r))} to ${pct(Math.max(...r))}, ${t.mode === 'whole' ? 'one rate by price band' : 'graduated'}`;
  const ex = (t.extra ?? []).length ? `, plus ${t.extra![0].name.toLowerCase()} from ${usd(Math.round(t.extra![0].from))} (${t.extra![0].who})` : '';
  return base + ex;
};
const host = (u: string) => new URL(u).hostname.replace(/^www\./, '');
const link = (h: { ext: (u: string, t: string) => string }, u: string | null) => (u ? h.ext(u, host(u)) : 'no state law found');

export default definePage({
  id: 'closing-costs-calculator',
  group: 'realestate',
  order: 30,
  slug: 'closing-costs-calculator',
  nav: 'Closing costs calculator',
  card: 'Buyer or seller costs, with the transfer tax and mortgage tax of every state',
  title: 'Closing Costs 2026: Calculator and Transfer Tax by State',
  description: `Closing costs calculator for 2026, buyer or seller: lender fees, title, commission, and the real estate transfer tax and mortgage tax of all 50 states and DC.`,
  h1: 'Closing costs calculator, with transfer tax by state',
  intro: 'What you pay at the closing table depends on your side of the deal, your lender, and above all your state.',
  resume: `Closing costs are the fees and taxes paid when a home changes hands, on top of the down payment for a buyer and out of the proceeds for a seller. Buyers pay mostly lender charges (origination fee, points, appraisal), title insurance and settlement fees, recording fees and prepaid items such as interest, homeowners insurance and the first deposits to the escrow account. Sellers pay mostly the agents' commission, their own title and settlement charges, and in many states the transfer tax on the deed. That tax is where states differ most: ${withTax.length} jurisdictions levy one statewide and ${none.length} do not, and on a ${usd(P0)} home the statewide tax runs from nothing in states such as ${listOf(none.slice(0, 3).map((s) => s.name))} to ${usd(at(hi))} in ${hi.name}. The calculator adds the tax of your state to the figures of your Loan Estimate, and the table below gives every state's rate with the official page it comes from.`,
  tool: 'closing',
  toolProps: { state: 'new-york', price: P0 },
  fold: true,
  body: (h) => `<h2>How much are closing costs, line by line</h2>
<p>There is no national rate for closing costs, because half of them are prices set by private companies and the other half are taxes set by states and counties. The reliable figure is the one on your own paperwork. A lender must send a Loan Estimate within three business days of your application and a Closing Disclosure at least three business days before closing, both on standard forms. Section A of the Loan Estimate lists the lender's own charges, origination fee and points. Sections B and C list services such as the appraisal, credit report, title insurance and settlement agent, the first ones chosen by the lender, the others shoppable. Section E holds taxes and government fees, which is where the transfer tax and recording fees appear. Sections F and G are prepaid interest, insurance and the initial escrow deposit for property tax: real money due at closing, but not a cost of the loan. Comparing Loan Estimates from two or three lenders is the single most effective way to cut the bill.</p>
<h2>The real estate transfer tax</h2>
<p>A transfer tax is charged when the deed is recorded, as a share of the price or as a set amount per $500 or $1,000 of value. States call it a deed tax, documentary stamp tax, conveyance tax, realty transfer fee, excise tax or recordation tax. Some apply one rate to every sale, others raise the rate with the price, and a few add a surcharge on expensive homes, the so-called mansion tax. Many states also let counties and cities add their own transfer tax, which can be larger than the state's; those local rates are not in the table, because they vary by county and change by ordinance, so the calculator asks for the local rate from your county recorder. On a ${h.usd(P0)} home, the statewide tax is highest in ${hi.name} (${h.usd(at(hi))}) and lowest among the states that levy one in ${lo.name} (${h.usd(at(lo))}).</p>
<h2>Who pays the transfer tax</h2>
<p>The law usually names the party responsible for paying the state, often the seller or grantor, but the purchase contract can shift the cost, and local custom decides who pays in practice in many markets. In some states the buyer pays by custom, in others the two split it, and in parts of the country the answer changes from one county to the next. The table states who pays only where the official source says so. Whatever the custom, the tax is negotiable between buyer and seller, and the calculator lets you enter your share. Exemptions are common for transfers between spouses, into a living trust, by inheritance, or to correct a deed; several states reduce the tax for first-time buyers or for a main home.</p>
${h.table(['State', 'Statewide transfer tax', `On ${h.usd(P0)}`, 'Mortgage tax', 'Official source'], RE_STATES.map((s) => [s.name, label(s), s.transfer.has ? h.usd(at(s)) : h.usd(0), s.transfer.mortgageTax?.has && s.transfer.mortgageTax.ratePct ? `${pct(s.transfer.mortgageTax.ratePct)} of the loan` : 'none', link(h, s.transfer.url)]), `Transfer tax and mortgage tax by state, statewide part only, read on the official pages on ${h.day('2026-10-08')}. County and city taxes come on top in many states.`, ['l', 'l', 'r', 'l', 'l'])}
<h2>Taxes on the mortgage itself</h2>
<p>A handful of states tax the mortgage rather than, or in addition to, the deed: ${listOf(mort.map((s) => s.name))}. These taxes are a percentage of the loan amount and are paid by the borrower when the mortgage or deed of trust is recorded, so a larger loan means a larger tax. They appear in section E of the Loan Estimate. A buyer paying cash owes none, and in some of these states a refinance with the same lender is partly exempt. The calculator applies the statewide rate of your state to the mortgage amount you enter.</p>
<h2>The seller's side</h2>
<p>For a seller, the largest cost is usually the commission paid to the listing agent and, by agreement, to the buyer's agent. Since August 2024, after the settlement of the commission lawsuits brought against the National Association of Realtors, buyers sign a written agreement with their own agent and the seller's offer to pay that agent is negotiated case by case. Add the transfer tax where the seller pays it, the seller's title and escrow charges, attorney fees in states where attorneys close, and the payoff of the existing mortgage with interest to the day of closing. Property tax is prorated between the two parties at closing; in states that collect it in arrears, the seller gives the buyer a credit. The mini-calculator gives a first figure for what reaches your bank account.</p>
<!--mini:sellerNet-->
<h2>Closing costs and taxes on the sale</h2>
<p>Closing costs matter twice for tax. A buyer adds the transfer tax, title insurance, recording fees and most settlement charges to the cost basis of the home, which reduces the gain on a future sale; points on a mortgage for a main home are generally deductible as interest instead, and the escrow deposits for property tax are deducted when the tax is paid, if you itemize. A seller subtracts commissions and the transfer tax from the sale price, which reduces the gain. Both effects are built into the ${h.a('capital-gains-tax-on-home-sale', 'capital gains tax on a home sale calculator')}. For investors, transfer taxes are part of the exchange expenses of a ${h.a('1031-exchange', '1031 exchange')} and are not deferred. Annual property tax after the purchase is a separate bill: see the ${h.a('property-tax-calculator', 'property tax calculator')}.</p>`,
  faqs: [
    { q: 'How much are closing costs for a buyer?', a: `It depends on the loan, the lender and the state. Lender fees, title insurance, settlement charges, recording fees, prepaid interest and escrow deposits add up differently on every loan, and the state transfer tax or mortgage tax can add thousands on its own. Your Loan Estimate, sent within three business days of applying, gives the figure for your loan; enter it in the calculator with your state's taxes.` },
    { q: 'Can closing costs be rolled into the mortgage?', a: `Sometimes. Some loan programs allow certain fees to be financed, and a lender credit lowers the cash due at closing in exchange for a higher interest rate. A seller can also agree to pay part of the buyer's costs, up to limits set by the loan program. The costs do not disappear: they move into the rate or the price, which the Loan Estimate shows under lender credits.` },
    { q: 'Which states have no real estate transfer tax?', a: `${listOf(none.map((s) => s.name))} have no statewide transfer tax on a home sale, according to their official pages. Some of them still allow a county or city tax, or charge recording fees that are flat amounts per document rather than a percentage of the price. Check the county recorder's fee schedule for the property's county.` },
    { q: 'Are closing costs tax deductible?', a: `Mostly not as a deduction in the year you buy. Mortgage points on a main home can be deducted as interest, and property tax paid at closing counts toward the SALT deduction if you itemize. Transfer taxes, title insurance and settlement fees are added to the home's basis instead, which lowers the taxable gain when you sell. A seller's costs reduce the amount realized on the sale.` },
    { q: 'Who pays the transfer tax, the buyer or the seller?', a: `The state law names who owes the tax to the state, often the seller, but the purchase contract can change who bears it, and local custom sets the default in many markets. In some states it is split, in others the buyer pays by custom. Because it is negotiable, the calculator lets you choose your share; the table states who pays only where the official source says so.` },
    { q: 'When do I find out my exact closing costs?', a: `The Closing Disclosure, which the lender must give you at least three business days before closing, lists the final figures. Compare it line by line with your Loan Estimate: some charges may not increase at all, others only within a limit. Ask the settlement agent for the seller's statement or the combined statement if you need the transfer tax split and the prorations.` },
  ],
  related: ['capital-gains-tax-on-home-sale', '1031-exchange', 'property-tax-calculator', 'homestead-exemption-by-state'],
  sources: ['cfpbLoanEstimate', 'cfpbClosingDisclosure', 'irsPub523'],
});
