import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('missouri');
const S = s.sales, C = s.census, PR = s.property;
const food = S.groceries.rate ?? 0;
// The three parts of the state rate, written in rateNote.
const general = 4, conservation = 0.125, parks = 0.1;
const [green, school] = S.holidays2026 ?? [];
const cart = 150;
const cartFood = tx('missouri', cart, 'groceries');
const cartGeneral = tx('missouri', cart);
const fridge = 1400;
const car = 26000;
const ratio = PR.assessment?.ratio ?? 0;
const farm = 12, commercial = 32; // assessment text
const home = C.medianValue;
const assessed = (home * ratio) / 100;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'missouri',
  title: `Missouri Sales Tax 2026: ${rate(S.stateRate)} State Rate, Food at ${rate(food)}`,
  description: `Missouri sales tax in 2026: a ${rate(S.stateRate)} state rate built from three taxes, ${rate(food)} on food, local add-ons, two holidays, and homes assessed at ${ratio}% of market value.`,
  intro: `A state rate with three decimals because it adds up three separate taxes, a reduced rate on food that still carries full local tax, and two tax holidays a year.`,
  resume: `Missouri's state sales tax of ${rate(S.stateRate)} is really three taxes: the ${rate(general)} general sales tax set by statute, plus two taxes written into the constitution, ${rate(conservation)} for conservation and ${rate(parks)} for soil, water and state parks, which voters renewed again on August 4, 2026. Food eligible for SNAP pays a reduced ${rate(food)} state rate, in place since October 1, 1997, with the revenue going to school districts, but cities, counties and special districts generally charge their full local rates on groceries too. Prescription drugs are exempt and clothing is taxed, except during the back-to-school holiday in early August; a second holiday each April covers Energy Star appliances. Cars, trailers and boats are taxed when titled. Property taxes are moderate: Census figures show a median ${usd(C.medianTax)} on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)} of value, rank ${effRank} of 51. Homes are assessed at ${ratio}% of market value. Missouri has no general homestead exemption, but counties can now freeze the tax of owners 62 or older.`,
  sales: (h) => `<p>Because the state part is fixed and the local part is not, the useful exercise is to see what each layer does. A ${h.usd(cart)} purchase of general goods carries ${h.usd(cartGeneral.stateTax, 2)} of state tax, of which ${h.usd((cart * general) / 100, 2)} is the general tax and ${h.usd((cart * (conservation + parks)) / 100, 2)} the two constitutional taxes. The same amount in groceries carries ${h.usd(cartFood.stateTax, 2)} of state tax, because only the 1% food rate and the 0.225% constitutional taxes apply. Cities, counties and special taxing districts then add their own rates to both, so check the combined local rate on a recent receipt from your area and type it into the calculator above.</p>
<p>The parks and soils tax is a quirk of Missouri law: it lapses unless voters renew it, which they did on November 8, 2016 and again on August 4, 2026, so the ${h.rate(S.stateRate)} total holds. Titled property follows its own path. A car, trailer, boat or outboard motor is taxed by the person who titles it, at the state rate plus the local rate where the buyer lives: on a ${h.usd(car)} car, the state part is ${h.usd(tx('missouri', car).stateTax, 2)}. Some cities and counties also levy a local use tax on goods bought from outside the state.</p>
<p>Both holidays are fixed by statute. ${green ? `The Show Me Green holiday runs April 19 to 25 every year, through ${day(green.end)} in the latest edition, and new Energy Star appliances up to ${h.usd(1500)} each were exempt, so a ${h.usd(fridge)} refrigerator saved ${h.usd(tx('missouri', fridge).stateTax, 2)} of state tax plus the local part.` : ''} ${school ? `Back-to-school ran ${dayShort(school.start)} to ${day(school.end)}, covering clothing up to $100 an item, school supplies up to $50 per purchase, software up to $350, graphing calculators up to $150 and computers up to $1,500.` : ''}</p>`,
  property: (h) => `<p>Missouri assessors value real estate in odd-numbered years, and the value carries over into the following even year unless new construction changes it. The assessed value is then a fixed share of that market value: ${h.num(ratio)}% for homes, ${h.num(farm)}% for agricultural land and ${h.num(commercial)}% for commercial, industrial and utility property. Most tangible personal property is assessed at one third of its value. Counties, cities, school districts and other local taxing districts levy on these assessed values.</p>
<p>On the Census median home of ${h.usd(home)}, the assessed value is ${h.usd(assessed)}, so every one-percent levy rate, or $1 per $100 of assessed value, costs that owner ${h.usd(assessed / 100)} a year. The same building used as a shop would be assessed at ${h.usd((home * commercial) / 100)}. In practice, owners at the median paid ${h.usd(C.medianTax)}, and a ${h.usd(300000)} house at the statewide ratio of ${h.eff(C.effectiveRate)} pays about ${h.usd(ptx('missouri', 300000))}.</p>
<p>Missouri offers no general homestead exemption. What it has instead, since SB 190 of 2023, amended in 2024 and by HB 199 in 2025, is a local-option senior credit: a county may adopt it by ordinance, or voters can force a referendum with a petition signed by 5% of voters, and it then freezes the homestead tax of owners 62 or older at the level of their first credit year. The credit equals any later increase. Whether you can claim it depends entirely on your county, so ask your county whether it has been adopted before counting on it.</p>`,
  faqs: [
    { q: `Why is the Missouri state sales tax ${rate(S.stateRate)} and not ${rate(general)}?`, a: `Because three taxes are added together. The general sales tax under RSMo 144.020 is ${rate(general)}; the Missouri Constitution adds ${rate(conservation)} for conservation and ${rate(parks)} for soil, water and state parks, for ${rate(S.stateRate)} in total. The parks tax must be renewed by voters and was reauthorized on August 4, 2026. Cities, counties and special districts add their own local rates on top.` },
    { q: 'How much is the Missouri sales tax on groceries?', a: `The state part on SNAP-eligible food is ${rate(food)}: a reduced 1% food tax plus the 0.225% constitutional conservation and parks taxes. Local sales taxes generally apply to groceries at their full rate, so the total on a grocery bill depends on your city and county. On a ${usd(cart)} cart, the state share is ${usd(cartFood.stateTax, 2)}, compared with ${usd(cartGeneral.stateTax, 2)} on general goods.` },
    { q: 'Can seniors freeze their property taxes in Missouri?', a: `Only where the county adopted the senior credit. Since SB 190 (2023), a Missouri county may grant homeowners 62 or older a credit that freezes their homestead tax at the level of their first credit year, either by ordinance or after a referendum forced by a petition of 5% of voters. Missouri has no general homestead exemption, so apply to your county if it offers the credit.` },
  ],
  related: ['kansas', 'illinois', 'arkansas', 'tennessee', 'grocery-sales-tax-by-state', 'sales-tax-holidays'],
});
