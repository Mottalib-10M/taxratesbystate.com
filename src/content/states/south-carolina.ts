import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, dayShort } from '../../lib/kit';

const s = st('south-carolina');
const S = s.sales, C = s.census, PR = s.property;
const hol = S.holidays2026?.[0];
const maxRate = S.otherRates?.[1]?.rate ?? 0;
const casual = S.otherRates?.[2]?.rate ?? 0;
// "taxed at 5% with a maximum of $500 per item" (SCDOR Max Tax page, as written in the facts).
const MAX_CAP = 500;
const boat = 48000;
const boatUncapped = (boat * maxRate) / 100;
const laptop = tx('south-carolina', 1800);
const cart = tx('south-carolina', 180, 'groceries', 1);
const legal = PR.assessment?.ratio ?? 0;
// Second homes and rentals: 6% ratio, as written in the assessment note.
const OTHER = 6;
const hs = PR.homestead.amount ?? 0;
const v = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'south-carolina',
  title: `South Carolina Sales Tax 2026: ${rate(S.stateRate)} State, Up to 9% Locally`,
  description: `South Carolina sales tax 2026: ${rate(S.stateRate)} state rate plus voter-approved county taxes, a ${usd(MAX_CAP)} cap on boats, an uncapped August holiday, and homes taxed on ${legal}% of value.`,
  intro: `Counties vote their own pennies onto a ${rate(S.stateRate)} state rate, boats pay at most ${usd(MAX_CAP)}, and a lived-in home is assessed at ${legal}% while the house next door rented out pays on ${OTHER}%.`,
  resume: `South Carolina's sales tax starts at ${rate(S.stateRate)}, a 5% base plus a 1% layer added on June 1, 2007, and counties then add taxes their voters approve, each usually 1%, for combined rates the Department of Revenue lists between 6% and 9%. Unprepared food is exempt from the state ${rate(S.stateRate)}, yet in counties with a Local Option tax it still pays the local rate. Clothing is taxed except during the early-August holiday, which has no price limit per item. Boats, aircraft and some light equipment fall under the Max Tax: ${rate(maxRate)}, never more than ${usd(MAX_CAP)} an item. Property tax is among the lightest in the country. In 2024 the median homeowner's bill was ${usd(C.medianTax)} on a ${usd(C.medianValue)} home (Census ACS), an effective ${eff(C.effectiveRate)} that places the state ${effRank} of 51. The reason is the ${legal}% assessment ratio on a legal residence, against ${OTHER}% for second homes and rentals, and the exemption of owner-occupied homes from school operating millage.`,
  sales: (h) => `<p>The local layer in South Carolina is a menu of single-purpose taxes, and each county picks from it by referendum: a Local Option tax that must be used to lower property taxes, Capital Projects, Transportation, School District, Education Capital Improvement, Green Space, plus a Tourism Development tax in some municipalities and one specific to Myrtle Beach. Williamsburg County added a Capital Projects penny on May 1, 2026, bringing it to 8%. Because these taxes switch on and off by vote, the safest route is the address lookup linked below; add its local figure to the calculator above.</p>
<p>Groceries show why the layers matter. The state exemption covers food that SNAP would pay for, but the local taxes decide for themselves: Capital Projects and Education Capital Improvement taxes exempt food, while a Local Option penny does not. A ${h.usd(180)} grocery run in a county with that one penny owes ${h.usd(cart.tax, 2)}, all of it local.</p>
<p>Two features are unusual. The Max Tax caps the bill on boats, airplanes and certain light construction equipment: ${h.rate(maxRate)} with a ceiling of ${h.usd(MAX_CAP)} per item and no local tax, so a ${h.usd(boat)} boat that would owe ${h.usd(boatUncapped)} at ${h.rate(maxRate)} pays ${h.usd(MAX_CAP)}. And the back-to-school holiday${hol ? `, ${dayShort(hol.start)} to ${h.day(hol.end)},` : ''} sets no price limit, so a ${h.usd(1800)} laptop bought that weekend saves ${h.usd(laptop.stateTax, 2)} of state tax alone. Jewelry, watches, furniture and anything bought for a business stay taxable.</p>`,
  property: (h) => `<p>A South Carolina tax bill begins with a ratio. The county assessor values the home at fair market value, then multiplies by ${h.num(legal)}% if it is the owner's legal residence, on up to five acres, or by ${h.num(OTHER)}% for a vacation house or a rental. On the Census median home of ${h.usd(v)}, that is ${h.usd((v * legal) / 100)} of assessed value for an owner who lives there and ${h.usd((v * OTHER) / 100)} for an investor. The legal residence ratio is not automatic: apply to the assessor before the first penalty date, and expect to lose it if the house is rented out more than 72 days a year.</p>
<p>Owner-occupied homes also pay nothing toward school operating millage, only school debt, which moves that cost onto second homes, rentals and businesses. Reassessment comes every fifth year, and Act 388 limits the increase from a reappraisal to 15% over five years, until the home is sold and the buyer starts again at full value. Together these rules explain the ${h.eff(C.effectiveRate)} effective rate: a ${h.usd(350000)} home at that ratio pays about ${h.usd(ptx('south-carolina', 350000))} a year.</p>
<p>Owners aged 65 or older, totally and permanently disabled, or legally blind can exclude the first ${h.usd(hs)} of value from county, municipal, school and special assessment taxes through the county auditor, and the state reimburses counties for it from the Trust Fund for Tax Relief. Bills fall due between September 30 and January 15.</p>`,
  faqs: [
    { q: 'Are groceries taxed in South Carolina?', a: `Not by the state: food eligible for SNAP is exempt from South Carolina's ${rate(S.stateRate)} state sales tax. Local taxes can still apply, though. In counties with a Local Option sales tax, groceries keep paying that local penny, while Capital Projects and Education Capital Improvement taxes exempt food. Prepared food remains taxable at the full state and local rate. Check your county's mix with the address lookup.` },
    { q: 'What is the maximum sales tax on a boat in South Carolina?', a: `${usd(MAX_CAP)}. Boats, aircraft and certain light construction equipment fall under South Carolina's Max Tax, a ${rate(maxRate)} rate capped at ${usd(MAX_CAP)} per item, and no local sales tax is added. A ${usd(boat)} boat that would owe ${usd(boatUncapped)} at ${rate(maxRate)} pays only the cap. Issuing a title or registration for a boat, motor or airplane can bring a separate ${rate(casual)} casual excise tax on fair market value.` },
    { q: 'How do I get the 4% legal residence rate in South Carolina?', a: `Apply to your county assessor before the first penalty date of the tax year. Your home and up to five acres are then assessed at ${legal}% of market value instead of ${OTHER}%, and owner-occupied homes also stop paying school operating millage. You lose the ${legal}% ratio if the home is rented out for more than 72 days in a year, so a second home or a rental stays at ${OTHER}%.` },
  ],
  related: ['north-carolina', 'georgia', 'tennessee', 'sales-tax-holidays', 'property-tax-assessment-caps'],
});
