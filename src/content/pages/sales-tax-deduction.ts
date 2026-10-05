import { definePage } from '../../lib/page-types';
import { P, usd, listOf, noSalesTax, ptx, st, tx } from '../../lib/kit';

const cap = P.salt.cap, capMfs = P.salt.capMarriedSeparate, floor = P.salt.floor;
const none = noSalesTax();
const tn = st('tennessee');
const car = tx('tennessee', 35000);

export default definePage({
  id: 'sales-tax-deduction',
  group: 'sales',
  order: 70,
  slug: 'sales-tax-deduction',
  nav: 'Sales tax deduction (SALT)',
  card: 'Deducting sales tax or income tax, plus property tax, under the federal cap',
  title: 'Sales Tax Deduction 2026: SALT Cap, Property Tax, IRS Rules',
  description: `Sales tax deduction in 2026: when itemizers can deduct sales tax instead of state income tax, how property tax counts, and the ${usd(cap)} SALT cap (IRS).`,
  h1: 'Deducting sales tax and property tax on your federal return',
  intro: 'Itemizers choose between state income tax and sales tax, add property tax, and stop at the cap.',
  resume: `If you itemize deductions on Schedule A of your federal return, you may deduct state and local taxes you paid during the year, in two buckets: either state and local income taxes or state and local general sales taxes, but not both, and real and personal property taxes on top. The IRS explains it in Topic no. 503: the election to deduct sales tax is made by checking box 5a, and you may use your actual receipts or the IRS optional sales tax tables, which the Sales Tax Deduction Calculator applies for you. The total of state and local taxes is limited to ${usd(cap)} (${usd(capMfs)} if married filing separately), reduced at higher incomes but not below ${usd(floor)}, for the ${P.salt.taxYear} returns filed in 2026 (IRS pages read on 5 October 2026). Choosing sales tax pays off mostly for residents of states without an income tax, and in years with a large purchase such as a car or a boat.`,
  mini: 'saltCap',
  miniArg: JSON.stringify({ cap }),
  body: (h) => `<h2>Sales tax or income tax: the choice</h2>
<p>The deduction for state and local general sales taxes exists as an alternative: you take it instead of the deduction for state and local income taxes, never in addition. For most people in a state with an income tax, income tax withheld is larger and the choice is easy. The sales tax option matters in two situations. If you live in a state without a broad income tax, there is nothing on the income tax side, and sales tax is the only general tax you can claim. And in a year with an unusually large purchase, the sales tax on a vehicle, a boat or a home renovation's materials can exceed the income tax you paid. A ${h.usd(35000)} car in ${tn.name}, for example, carries ${h.usd(car.stateTax)} of state sales tax before local tax.</p>
<h2>Actual receipts or the IRS tables</h2>
<p>You may total the sales tax on your actual receipts for the year, which requires keeping them. Or you may use the optional sales tax tables published with the Schedule A instructions, which estimate the general sales tax a household of your income and size pays in your state and locality. The ${h.src('irsSalesTaxCalc', 'IRS Sales Tax Deduction Calculator')} applies those tables to your ZIP code, so the local rate is counted too. With the table method, you may add the actual sales tax paid on certain large items on top of the table amount: a motor vehicle (only up to the tax at the general rate, if its rate was higher), an aircraft or boat taxed at the general rate, or a home or major addition when the materials were taxed at the general rate. Whichever you use, the deduction is the sales tax you paid, at the rate charged, not the price of the goods.</p>
<h2>Property tax counts in the same cap</h2>
<p>Real estate taxes on your home and personal property taxes based on the value of a car or boat, charged yearly, are deductible in the same Schedule A section. The IRS excludes charges that are not taxes, such as water, sewer or trash fees, homeowner's association dues, and assessments for local benefits like a new sidewalk (except the part for maintenance or interest). Transfer taxes paid when you buy or sell a home are not deductible as taxes either. The property tax figures on each state page of this site are typical bills; the deductible amount is what you actually paid in the year, often shown on the escrow statement from your lender.</p>
<h2>The cap and the income limit</h2>
<p>The combined deduction for income or sales taxes and property taxes is limited to ${h.usd(cap)}, or ${h.usd(capMfs)} for married people filing separately. The IRS adds that the limit is subject to a modified adjusted gross income limitation and is not reduced below ${h.usd(floor)}; the ${h.src('irsScheduleA', 'Schedule A instructions')} give the computation for the ${P.salt.taxYear} returns. In high-tax states, property tax alone can approach the limit, in which case the choice between sales and income tax no longer changes anything. The mini-calculator above adds your two figures and shows what fits under the limit; it does not apply the income-based reduction.</p>
<h2>Is itemizing worth it?</h2>
<p>Only if your itemized deductions together exceed the standard deduction for your filing status, which most households do not. State and local taxes, mortgage interest and charitable gifts are the usual components. Run your numbers in tax software or with a preparer; this page only explains how sales tax and property tax fit in.</p>
<h2>Where this site helps</h2>
<p>The ${h.a('home', 'sales tax calculator')} gives the sales tax on a large purchase in any state with your local rate, the ${h.a('property-tax-calculator', 'property tax calculator')} estimates a bill before you have one, and the states with no sales tax, ${listOf(none.map((s) => s.name))}, are covered on ${h.a('states-without-sales-tax', 'their own page')}. In those states there is little or no general sales tax to deduct, so income tax, if any, is normally the better option.</p>`,
  faqs: [
    { q: 'Can I deduct both state income tax and sales tax?', a: `No. IRS Topic 503 lets itemizers deduct state and local income taxes or, by election on Schedule A, state and local general sales taxes, not both. You pick the larger of the two for the year. Property taxes are separate and can be added in either case, within the overall limit of ${usd(cap)} (${usd(capMfs)} if married filing separately).` },
    { q: 'Can I deduct the sales tax on a new car?', a: `Yes, if you itemize and elect the sales tax deduction instead of income tax. Vehicle sales tax counts as general sales tax even at a different rate, but if the rate was higher than the general rate, only the tax at the general rate is deductible. With the IRS tables, you add it to the table amount. The total still counts toward the ${usd(cap)} limit on state and local taxes, together with your property tax.` },
    { q: 'Are my property taxes paid through escrow deductible?', a: `Yes, the real estate taxes your lender paid from escrow during the year are deductible if you itemize, in the year the lender paid them to the county, not the year you funded the escrow. Your lender's annual escrow statement or mortgage interest form usually shows the amount. Fees for water, sewer or trash on the same bill are not deductible taxes.` },
  ],
  related: ['property-tax-calculator', 'states-without-sales-tax', 'use-tax', 'home'],
  sources: ['irsTopic503', 'irsScheduleA', 'irsSalesTaxCalc'],
});
