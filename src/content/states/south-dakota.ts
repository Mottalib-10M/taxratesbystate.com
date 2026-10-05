import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day } from '../../lib/kit';

const s = st('south-dakota');
const S = s.sales, C = s.census, PR = s.property;
const back = S.scheduledChanges?.find((c) => c.rate != null);
const nextRate = back?.rate ?? S.stateRate;
const nextDate = back?.date ?? s.verified;
const cityCap = S.local.cap ?? 0;
const food = 150;
const foodNow = tx('south-dakota', food, 'groceries');
const foodCity = tx('south-dakota', food, 'groceries', cityCap);
const foodLater = (food * nextRate) / 100;
const service = 600;
const serviceTax = tx('south-dakota', service);
const ratio = PR.assessment?.ratio ?? 0;
const mvRate = S.otherRates?.[0]?.rate ?? 0;
const tourism = S.otherRates?.[1]?.rate ?? 0;
const v = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'south-dakota',
  title: `South Dakota Sales Tax 2026: ${rate(S.stateRate)}, Back to ${rate(nextRate)} in 2027`,
  description: `South Dakota sales tax in 2026: ${rate(S.stateRate)} until ${day(nextDate)}, then ${rate(nextRate)}; groceries and most services taxed, cities add up to ${rate(cityCap)}, median property tax ${usd(C.medianTax)}.`,
  intro: `A temporary ${rate(S.stateRate)} rate with an end date, a tax that reaches services and groceries alike, and new sales tax money aimed at homeowners' bills.`,
  resume: `South Dakota's state sales tax is ${rate(S.stateRate)} for now: the 2023 cut from ${rate(nextRate)} expires and the rate returns to ${rate(nextRate)} on ${day(nextDate)}, with that extra 0.3% earmarked by SB 245 for owner-occupied property tax relief. Municipalities add up to ${rate(cityCap)} of their own, plus a gross receipts tax of up to 1% on restaurants, bars, lodging and admissions. The base is unusually wide. Food carries the full state rate, with only SNAP and WIC purchases exempt; clothing has no break; and services are taxed by default unless a statute exempts them, as it does for health services, education and financial services. Prescription drugs are exempt. There is no sales tax holiday. Property is taxed locally on 85% of market value, and the 2024 Census numbers read: a ${usd(C.medianTax)} median bill, a ${usd(C.medianValue)} median home, ${eff(C.effectiveRate)} effective, ${effRank} of 51. A lower school levy for owner-occupied homes is the main break, and from 2027 counties may adopt a sales tax of up to 0.5% to shrink those bills further.`,
  sales: (h) => `<p>Most states list the services they tax. South Dakota does the reverse: every sale of a service is taxable unless an exemption names it, and the exempt list covers health services, education, financial services and trucking among a few others. A ${h.usd(service)} invoice for a taxable service owes ${h.usd(serviceTax.stateTax, 2)} of state tax before any city share, which is why South Dakota businesses often see tax on bills that would be untaxed one state over. Remote sellers start collecting once their sales into the state pass $100,000 a year.</p>
<p>Groceries show the cost of the broad base. A ${h.usd(food)} cart pays ${h.usd(foodNow.stateTax, 2)} to the state at ${h.rate(S.stateRate)}, and ${h.usd(foodCity.tax, 2)} in a city charging the full ${h.rate(cityCap)} municipal rate. When the state rate goes back to ${h.rate(nextRate)} on ${h.day(nextDate)}, the state's share of that same cart becomes ${h.usd(foodLater, 2)}. Paying with SNAP or WIC benefits is the only way groceries escape the tax.</p>
<p>The local picture is about to widen. Today, only municipalities levy a general sales tax, capped at ${h.rate(cityCap)}, and many add the gross receipts tax on hospitality. SB 96 of 2026 lets counties adopt a sales and use tax of up to 0.5%, effective no earlier than January 1, 2027, on the condition that every dollar is credited against the county portion of owner-occupied tax bills. Vehicles pay a ${h.rate(mvRate)} motor vehicle excise tax instead of sales tax, and lodging, amusements and short car rentals add a ${h.rate(tourism)} tourism tax. Use the state's address map for the city part, then enter it above.</p>`,
  property: (h) => `<p>The county director of equalization values every property at full and true value, then the taxable value is set at ${h.num(ratio)}% of it. The Census median home of ${h.usd(v)} is therefore taxed on about ${h.usd((v * ratio) / 100)}, and levies are expressed in dollars per thousand of that figure. The state neither collects nor spends a cent of the money; school districts, counties, cities and other districts share it. Taxes are paid a year in arrears, the first half by April 30 and the second by October 31.</p>
<p>The owner-occupied classification is the key form for a homeowner. There is no flat homestead deduction; classifying the home as a primary residence lowers the school general fund levy, and it must be filed with the director of equalization by March 15. What South Dakota calls its Homestead Exemption is something else: a deferral letting owners aged 70 or older postpone tax until the home is sold.</p>
<p>The Legislature has been working on the bill from several angles. SB 216 of 2025 holds growth in total owner-occupied valuation to 3% a year per county, and local property tax budgets to 3%, for five years, starting with taxes payable in 2027. SB 245 spends one-time money to cut the owner-occupied school levy on 2027 bills, then routes the July 2027 sales tax increase into permanent relief. Measured against the Census ratio of ${h.eff(C.effectiveRate)}, today's bill on a ${h.usd(320000)} home is roughly ${h.usd(ptx('south-dakota', 320000))}.</p>`,
  faqs: [
    { q: 'When does South Dakota sales tax go back to 4.5%?', a: `On ${day(nextDate)}. The ${rate(S.stateRate)} rate is a temporary cut passed in 2023, and the statute already carries the ${rate(nextRate)} text for that date. SB 245 of 2026 dedicates the extra 0.3% to ongoing property tax relief for owner-occupied homes. City sales taxes of up to ${rate(cityCap)} are not affected by the change and keep applying on top of the state rate.` },
    { q: 'Does South Dakota tax groceries?', a: `Yes. South Dakota has no general food exemption, so groceries pay the full ${rate(S.stateRate)} state rate plus any municipal sales tax. A ${usd(food)} grocery bill owes ${usd(foodNow.stateTax, 2)} to the state, or ${usd(foodCity.tax, 2)} in all in a city charging ${rate(cityCap)}. Only purchases paid with SNAP or WIC benefits are exempt. Prescription drugs, by contrast, are not taxed.` },
    { q: 'How do I get the owner-occupied rate on my South Dakota home?', a: `File the owner-occupied classification form with your county director of equalization by March 15. A home classified as the owner's primary residence pays a reduced school general fund levy, while every other levy is the same for all property. South Dakota has no flat homestead deduction, so this classification is the main break available to ordinary homeowners, along with the assessment freeze for qualifying seniors and disabled owners.` },
  ],
  related: ['north-dakota', 'nebraska', 'minnesota', 'iowa', 'grocery-sales-tax-by-state', 'property-tax-by-state'],
});
