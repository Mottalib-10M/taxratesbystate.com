import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('district-of-columbia');
const S = s.sales, C = s.census, PR = s.property;
const R = (i: number) => S.otherRates?.[i]?.rate ?? 0;
const soda = R(0), meals = R(1), rentalCar = R(2), hotel = R(3), parking = R(4);
const next = S.scheduledChanges?.[0]?.rate ?? 0;
const phone = tx('district-of-columbia', 800);
const dinner = 90, garage = 25, night = 320;
const hd = PR.homestead.amount ?? 0;
const per100 = 0.85;
const home = C.medianValue;
const billNoHd = (home / 100) * per100;
const billHd = ((home - hd) / 100) * per100;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'district-of-columbia',
  title: `District of Columbia Sales Tax 2026: ${rate(S.stateRate)} Rate, ${rate(next)} Delayed`,
  description: `DC sales tax in 2026: ${rate(S.stateRate)} on most goods through September 2027, ${rate(meals)} on meals, ${rate(hotel)} on hotels, ${rate(parking)} on parking. Property tax: ${usd(hd)} homestead deduction.`,
  intro: `One jurisdiction, no county or city layer, and seven sales tax rates that depend on what you buy, from groceries at nothing to parking at the top of the scale.`,
  resume: `The District of Columbia charges ${rate(S.stateRate)} on most goods, and that is the whole rate: DC is a single taxing jurisdiction, so no county or city tax is added. The increase to ${rate(next)} written into the D.C. Code has been postponed again, and the Office of Tax and Revenue (OTR) states that ${rate(S.stateRate)} remains in force through September 30, 2027. What varies is the item. Soft drinks pay ${rate(soda)}, restaurant meals and prepared food ${rate(meals)}, rental cars and alcohol bought to take away ${rate(rentalCar)}, hotel rooms ${rate(hotel)} and parking ${rate(parking)}. Groceries eligible for SNAP are exempt, and so are medicines, prescribed or not. On property, the District taxes homes directly at $0.85 per $100 of value, reassessed every year: the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51. A ${usd(hd)} homestead deduction and a 10% yearly assessment cap protect owner-occupants.`,
  sales: (h) => `<p>Because no other layer exists, the rate on a DC receipt is fixed by the category of the sale. An ${h.usd(800)} phone owes ${h.usd(phone.stateTax, 2)} at the general rate. A ${h.usd(dinner)} dinner owes ${h.usd(dinner * meals / 100, 2)} at the restaurant rate, a ${h.usd(garage)} day in a garage ${h.usd(garage * parking / 100, 2)}, and a ${h.usd(night)} hotel night ${h.usd(night * hotel / 100, 2)}. The hotel figure is a temporary rate that the Hotel Surtax Amendment Act of 2025 extended through September 30, 2027. Commercial bingo was added at ${h.rate(R(5))} on October 1, 2025.</p>
<p>The general rate was scheduled to rise and has been held back twice. The Sales Tax Increase Delay Amendment Act of 2025 first held it at ${h.rate(S.stateRate)} through September 30, 2026; OTR now says the ${h.rate(next)} rate is postponed and ${h.rate(S.stateRate)} remains through September 30, 2027, even though the codified text of section 47-2002 still shows ${h.rate(next)} from October 1, 2026. Check OTR's notices before planning a large purchase late in 2027.</p>
<p>The food rule follows the SNAP definition: groceries a SNAP card could buy are excluded from sales tax, except food prepared to be eaten right away and soft drinks. Medicines and drugs are exempt whether or not a doctor prescribed them,, so over-the-counter remedies carry no tax either. Street and mobile food vendors charge ${h.rate(meals)} on food and ${h.rate(S.stateRate)} on other items, with a minimum of $375 per quarter. Use tax applies at the same rates to taxable goods bought outside the District for use in it.</p>`,
  property: (h) => `<p>No county stands between a DC homeowner and the tax collector: the District government levies and collects property tax itself, and the Council sets the rate for each class every year. OTR reassesses every property annually at estimated market value. Residential property sits in Class 1A at $0.85 per $100 of value. One- and two-unit homes worth more than $2.558 million fall in Class 1B, where the part above that amount is taxed at $1.00. Commercial property pays $1.65 to $1.89, while vacant property pays $5.00 and blighted property $10.00, rates designed to push owners to use or repair it.</p>
<p>On the Census median home of ${h.usd(home)}, the Class 1A rate gives ${h.usd(billNoHd, 2)} before relief. The homestead deduction removes ${h.usd(hd)} of assessed value for tax year 2026, so the same owner-occupant owes ${h.usd(billHd, 2)}, a saving of $781.58. Apply once with form ASD-100 on MyTax.DC.gov; approval between October 1 and March 31 gives the full year, between April 1 and September 30 half of it. The Assessment Cap Credit then limits the taxable increase to 10% a year, 2% for owners aged 65 or older and disabled owners, who may also qualify for a 50% cut in their tax within the income limit, ${h.usd(159750)} for tax year 2025.</p>
<p>At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(600000)} condo pays about ${h.usd(ptx('district-of-columbia', 600000))} a year. The bill comes in two halves: the first, covering October to March, is due by March 31, and the second, covering April to September, by September 15. Disabled veterans have their own homestead deduction, which cannot be combined with the regular one, the senior relief or the cap credit.</p>`,
  faqs: [
    { q: 'Did the DC sales tax go up to 7%?', a: `Not yet. The increase from ${rate(S.stateRate)} to ${rate(next)} has been postponed twice: a 2025 act kept ${rate(S.stateRate)} through September 30, 2026, and the Office of Tax and Revenue now states that ${rate(S.stateRate)} remains in force through September 30, 2027. The codified D.C. Code still shows the higher rate, so check OTR's notices for the date that finally applies.` },
    { q: 'What is the tax on parking in Washington DC?', a: `${rate(parking)}, the highest sales tax rate in the District. It applies to parking or storing a motor vehicle, so a ${usd(garage)} garage stay carries ${usd(garage * parking / 100, 2)} of tax. Hotel rooms pay ${rate(hotel)}, rental cars ${rate(rentalCar)} and restaurant meals ${rate(meals)}, while most other goods stay at ${rate(S.stateRate)}. No city or county rate is added in DC.` },
    { q: 'How much does the DC homestead deduction save?', a: `For tax year 2026 it removes ${usd(hd)} from the assessed value of an owner-occupied principal residence, worth $781.58 a year at the Class 1A rate of $0.85 per $100. It also unlocks the Assessment Cap Credit, which limits taxable increases to 10% a year. Apply online with form ASD-100; an approval by March 31 covers the full tax year.` },
  ],
  related: ['maryland', 'virginia', 'delaware', 'sales-tax-by-state', 'homestead-exemption-by-state'],
});
