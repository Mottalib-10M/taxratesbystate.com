import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('mississippi');
const S = s.sales, C = s.census, PR = s.property, HS = s.property.homestead;
const O = S.otherRates ?? [];
const groc = S.groceries.rate ?? 0;
const carRate = O[1]?.rate ?? 0, heavy = O[2]?.rate ?? 0, farm = O[3]?.rate ?? 0, vending = O[6]?.rate ?? 0, rentalTax = O[5]?.rate ?? 0;
const hol = S.holidays2026?.[0];
const cart = 160;
const cartTax = tx('mississippi', cart, 'groceries');
const truck = 32000;
const tractor = 90000;
const ratio = PR.assessment?.ratio ?? 0;
const other = 15, vehicles = 30; // other real property and motor vehicle ratios, assessment text
const tier1 = HS.amount ?? 0;
const tier2 = 7500; // assessed value exempt for owners 65+ or disabled, homestead text
const home = C.medianValue;
const assessed = (home * ratio) / 100;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'mississippi',
  title: `Mississippi Sales Tax 2026: ${rate(S.stateRate)} Rate, Groceries Cut to ${rate(groc)}`,
  description: `Mississippi sales tax in 2026: ${rate(S.stateRate)} on most goods, ${rate(groc)} on groceries since July 2025, ${rate(carRate)} on cars, a July holiday, and homes assessed at ${ratio}% of true value.`,
  intro: `One of the few states that still taxes groceries, now at a lower rate, a schedule of special rates for vehicles and machinery, and homes assessed at a tenth of their value.`,
  resume: `Mississippi still taxes food for home, but since July 1, 2025 at ${rate(groc)} instead of the general ${rate(S.stateRate)}, under House Bill 1 of the 2025 session; purchases paid with SNAP benefits are exempt. The state rate is the rate almost everywhere, because Mississippi has no general local option sales tax: the local extras are tourism and economic development taxes, typically 1% to 3% on restaurants and hotels, each created by its own act of the Legislature. Reduced state rates cover cars and light trucks at ${rate(carRate)}, heavy trucks, aircraft and manufactured homes at ${rate(heavy)}, and farm and manufacturing machinery at ${rate(farm)}. Prescription drugs and residential utilities are exempt, and clothing under $100 is tax free during a July weekend. Property tax is among the lightest in the country: the Census median is ${usd(C.medianTax)} on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)} of value, rank ${effRank} of 51. Owner-occupied homes are assessed at ${ratio}% of true value, and the homestead exemption gives a credit of up to ${usd(tier1)}, or far more for owners 65 or older.`,
  sales: (h) => `<p>The grocery cut is the change that shows on a weekly receipt. Food that qualifies for SNAP but is bought with cash or a card now pays ${h.rate(groc)}: a ${h.usd(cart)} cart costs ${h.usd(cartTax.tax, 2)} in tax, against ${h.usd((cart * S.stateRate) / 100, 2)} before July 2025. Paid with SNAP benefits, the same cart is exempt. Food from a full-service vending machine pays ${h.rate(vending)}, and hot or prepared food stays at ${h.rate(S.stateRate)}.</p>
<p>Instead of a county or city rate on everything, Mississippi lets the Legislature authorize specific local taxes town by town, mostly on restaurant meals and hotel rooms, each with its own rate and often a repeal date; the Department of Revenue collects them. For a purchase in a shop, the calculator above therefore needs no local rate; for a restaurant bill, add the local tourism tax if the town has one. Alcoholic beverages have carried no sales tax since July 1, 2022 and beer since July 1, 2023, because other levies apply to them.</p>
<p>The rate schedule for big purchases is what sets Mississippi apart. A ${h.usd(truck)} pickup of 10,000 pounds or less pays ${h.rate(carRate)}, or ${h.usd((truck * carRate) / 100)}, while a boat, motorcycle or ATV pays the full ${h.rate(S.stateRate)}. A ${h.usd(tractor)} farm tractor pays only ${h.rate(farm)}, ${h.usd((tractor * farm) / 100)}. Short car rentals add a ${h.rate(rentalTax)} rental tax. Residential electricity, fuels and water are exempt, while commercial users pay ${h.rate(S.stateRate)}. The ${hol ? `${dayShort(hol.start)} to ${day(hol.end)}` : 'July'} holiday exempted clothing, footwear and school supplies priced under $100 each.</p>`,
  property: (h) => `<p>Mississippi sorts property into five classes, each assessed at a share of its true value fixed by the constitution: ${h.num(ratio)}% for an owner-occupied single-family home, ${h.num(other)}% for other real estate and for personal property, and ${h.num(vehicles)}% for utility property and motor vehicles. The county tax assessor appraises, real property is revalued at least every four years, and counties, cities, school districts and special districts levy their millages on the assessed figure. On the Census median home of ${h.usd(home)}, assessed value is ${h.usd(assessed)}, so each mill costs about ${h.usd(assessed / 1000, 2)} before exemptions; the same house rented out would be assessed at ${h.usd((home * other) / 100)}.</p>
<p>The homestead exemption has three tiers. Owners under 65 get a credit of up to ${h.usd(tier1)} a year, depending on value. Owners 65 or older, or totally disabled, are exempt from tax on the first ${h.usd(tier2)} of assessed value, which is ${h.usd((tier2 * 100) / ratio)} of true value, and after the first year this tier can stretch to cover most later increases in value; reaching 65 requires a new application to move up. Honorably discharged veterans aged 90 or older and their unremarried surviving spouses pay nothing on the homestead. File with the county tax assessor between January 1 and April 1, after owning the home before January 1 and recording the deed before January 7.</p>
<p>The exemption can be taken back retroactively if the owner fails to file a Mississippi income tax return or to register vehicles properly, so the paperwork matters. Taxes on the previous year's assessment are due by February 1. For scale, ${h.eff(C.effectiveRate)} of a ${h.usd(250000)} home is about ${h.usd(ptx('mississippi', 250000))} a year.</p>`,
  faqs: [
    { q: 'What is the sales tax on groceries in Mississippi?', a: `${rate(groc)} since July 1, 2025, down from ${rate(S.stateRate)}, under House Bill 1. It applies to food and drink that is eligible for SNAP but paid for another way; purchases made with SNAP benefits are exempt. Prepared food stays at ${rate(S.stateRate)}, and full-service vending machine food pays ${rate(vending)}. Mississippi has no general local sales tax, so the grocery rate is the same statewide.` },
    { q: 'When is the Mississippi sales tax holiday?', a: `In 2026 it ran ${hol ? `from ${dayShort(hol.start)} to ${day(hol.end)}` : 'in July'}. Clothing, footwear and school supplies priced under $100 per item were exempt from the ${rate(S.stateRate)} sales tax. Anything priced at $100 or more was taxed as usual. A separate Second Amendment holiday was held in earlier years, but no 2026 guide for it appeared on the Department of Revenue's notices page.` },
    { q: 'How do I apply for homestead exemption in Mississippi?', a: `Apply at your county Tax Assessor's office between January 1 and April 1. You must own the home before January 1 and have the deed filed before January 7. Owners under 65 get a credit of up to ${usd(tier1)}; at 65, or if totally disabled, reapply to have the first ${usd(tier2)} of assessed value exempted. Keep filing Mississippi income tax and registering your vehicles, or the exemption can be disallowed.` },
  ],
  related: ['alabama', 'louisiana', 'tennessee', 'arkansas', 'grocery-sales-tax-by-state', 'homestead-exemption-by-state'],
});
