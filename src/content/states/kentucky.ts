import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('kentucky');
const S = s.sales, C = s.census, HS = s.property.homestead;
const usage = S.otherRates?.[0]?.rate ?? 0;
// The state real property rate (cents per $100, 2024) and the payment discount and penalties are in the text facts.
const stateCents = 10.9;
const discount = 2, latePenalty = 5, febPenalty = 21;
const item = 4.99;
const itemTotal = tx('kentucky', item).total;
const cash = Math.round(itemTotal * 20) / 20;
const car = 30000;
const tv = tx('kentucky', 700);
const hs = HS.amount ?? 0;
const home = C.medianValue;
const seniorBase = home - hs;
const typical = ptx('kentucky', home);
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'kentucky',
  title: `Kentucky Sales Tax 2026: ${rate(S.stateRate)} Everywhere, No Local Sales Tax`,
  description: `Kentucky sales tax in 2026: ${rate(S.stateRate)} in every city and county, new taxes on data brokering, cash totals rounded to 5 cents, and a ${usd(hs)} senior homestead exemption.`,
  intro: `One rate in every county and city, no holiday, and a property tax bill that rewards paying early and punishes paying late.`,
  resume: `Kentucky charges ${rate(S.stateRate)} sales and use tax and nothing else at the register: the Department of Revenue states plainly that there are no local sales or use taxes, so the rate on a pair of shoes, a laptop or a lawn chair is identical in every county. Food for home and prescription drugs are exempt, clothing has no exemption, and there is no sales tax holiday. Summer 2026 brought three changes: data brokering services became taxable on August 1, sales by religious institutions became exempt the same day, and since July 15 cash totals are rounded to the nearest five cents because of the penny shortage. Vehicles pay a separate ${rate(usage)} usage tax to the county clerk. Kentucky still has a small state property tax, ${stateCents} cents per $100 of assessed value in 2024, on top of local rates. Census data show a median bill of ${usd(C.medianTax)} on a ${usd(C.medianValue)} home, an effective ${eff(C.effectiveRate)}, rank ${effRank} of 51. Owners 65 or older, or totally disabled, deduct ${usd(hs)} from their assessment.`,
  sales: (h) => `<p>With no local layer, the only number you need for most purchases is ${h.rate(S.stateRate)}: a ${h.usd(700)} television costs ${h.usd(tv.total, 2)} with tax anywhere in the Commonwealth, and the calculator above needs no local rate. The base keeps widening instead. Kentucky has been adding services to the tax list, and from August 1, 2026 that includes data brokering, the business of collecting and analyzing personal data to sell it. The same date ended the 200-transaction test for remote sellers, who now register only once their Kentucky sales pass $100,000.</p>
<p>The rounding rule is new and practical. Since July 15, 2026, a store that is paid in cash rounds the total, tax included, to the nearest five cents. An item priced ${h.usd(item, 2)} comes to ${h.usd(itemTotal, 2)} with tax and ${h.usd(cash, 2)} in cash, but the retailer still owes the state the exact tax computed on the price.</p>
<p>A few exemptions are specific. Groceries are exempt, while candy, soft drinks, dietary supplements and prepared food are taxed. Prescription drugs and home medical oxygen are exempt, and so is an over-the-counter medicine when a prescriber writes a prescription for it. Motor vehicles do not pay sales tax at all: the county clerk collects the ${h.rate(usage)} motor vehicle usage tax at transfer or first registration, ${h.usd((car * usage) / 100)} on a ${h.usd(car)} vehicle. Goods brought into Kentucky without tax owe the ${h.rate(S.stateRate)} use tax.</p>`,
  property: (h) => `<p>Kentucky is one of the states that still levies its own property tax. The Department of Revenue sets the state real property rate each year, ${stateCents} cents per $100 in 2024, down from 12.2 cents in 2020, and must lower it whenever statewide assessments grow faster than 4%. Counties, cities, school districts and special districts add their rates, and the county sheriff mails one bill for all of them in the fall. Values are set at full fair cash value by the elected Property Valuation Administrator of each county, who must inspect every parcel at least once every four years.</p>
<p>The calendar on the bill matters as much as the rate. Pay by November 1 and the sheriff takes ${h.num(discount)}% off; pay by December 31 and you owe the face amount; in January a ${h.num(latePenalty)}% penalty applies, and from February 1 to April 15 it jumps to ${h.num(febPenalty)}%. On a typical bill of ${h.usd(typical)} for the median ${h.usd(home)} home, that is the difference between ${h.usd(typical * (1 - discount / 100))} and ${h.usd(typical * (1 + febPenalty / 100))}. Bills still unpaid become certificates of delinquency that can be sold to third parties from mid-July, with interest at 1% a month.</p>
<p>There is no general homestead exemption. Owners 65 or older, and owners classified as totally disabled who receive disability payments, deduct ${h.usd(hs)} from their assessed value for the 2025 and 2026 assessments, which brings that median home down to ${h.usd(seniorBase)} of taxable value; at the 2024 state rate, the state portion alone falls by about ${h.usd((hs / 100) * (stateCents / 100), 2)}. Apply with your PVA. To challenge a value, meet the PVA during the May inspection period, then appeal to the local board of assessment appeals.</p>`,
  faqs: [
    { q: 'Does Kentucky have a city or county sales tax?', a: `No. The Kentucky Department of Revenue states that there are no local sales and use taxes in the state, so the ${rate(S.stateRate)} rate is the full rate in every city and county. Groceries and prescription drugs are exempt, and clothing is taxed at ${rate(S.stateRate)} all year.` },
    { q: 'What happens if I pay my Kentucky property tax late?', a: `Kentucky sheriffs give a ${discount}% discount for paying between October 1 and November 1, and the face amount is due by December 31. Paying in January adds a ${latePenalty}% penalty, and from February 1 to April 15 the penalty is ${febPenalty}%. After that the bill becomes a certificate of delinquency, which can be sold to a third party from mid-July with 1% monthly interest plus fees.` },
    { q: 'Who qualifies for the Kentucky homestead exemption?', a: `Homeowners aged 65 or older, and homeowners classified as totally disabled who receive disability payments, can deduct ${usd(hs)} from the assessed value of their home for 2025 and 2026; a ${usd(200000)} home is then taxed on ${usd(200000 - hs)}. Kentucky has no homestead exemption for other owners. Apply with the county Property Valuation Administrator; disability claims usually have to be renewed every year.` },
  ],
  related: ['tennessee', 'indiana', 'ohio', 'west-virginia', 'homestead-exemption-by-state', 'local-sales-tax-rates'],
});
