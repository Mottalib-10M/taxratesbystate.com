import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('alabama');
const S = s.sales, C = s.census, PR = s.property;
const food = S.groceries.rate ?? 0;
const auto = S.otherRates?.[0]?.rate ?? 0;
const ssut = S.otherRates?.[2]?.rate ?? 0;
const school = S.holidays2026?.[1];
const weather = S.holidays2026?.[0];
const cart = tx('alabama', 180, 'groceries');
const cartFull = tx('alabama', 180);
const truck = 32000;
const online = 250;
const ratio = PR.assessment?.ratio ?? 0;
const H = PR.homestead.amount ?? 0;
const home = C.medianValue;
const assessed = (home * ratio) / 100;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'alabama',
  title: `Alabama Sales Tax 2026: ${rate(S.stateRate)} State Rate, ${rate(food)} on Groceries`,
  description: `Alabama sales tax in 2026: ${rate(S.stateRate)} state rate, ${rate(food)} on food, city, county and police jurisdiction add-ons, two holidays, and property tax at ${eff(C.effectiveRate)} of home value.`,
  intro: `A low state rate that cities and counties build on, a grocery rate cut twice since 2023 and switched off for two months in 2026, and property bills that stay small because homes are taxed on a tenth of their value.`,
  resume: `Alabama's state sales tax is ${rate(S.stateRate)}, but almost nobody pays only that: cities and counties stack their own taxes on top, and many cities also tax sales in their police jurisdiction, the band just outside city limits, usually at half the city rate. Food is the exception at state level. Its state rate dropped to ${rate(food)} on September 1, 2025, after a step from 4% to 3% in 2023, and Act 2026-604 suspended it entirely from May 1 to June 30, 2026; local taxes on food never stopped. Cars pay a reduced ${rate(auto)} state rate, prescription drugs are exempt, and clothing is taxed outside the July back-to-school weekend. Property tax runs the other way. Homes are assessed at ${ratio}% of appraised value, so the median owner paid only ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51.`,
  sales: (h) => `<p>The ${h.rate(S.stateRate)} figure is the smallest piece of an Alabama receipt. The Department of Revenue (ALDOR) administers more than 200 city and county sales taxes, yet some localities collect their own tax directly and publish their own rules, so a retailer may file with the state and with the city separately. Cities can also reach past their borders: in the police jurisdiction around a city, sales usually carry half the city's rate. Two stores a mile apart, one inside the limits and one in the PJ, can therefore print different totals for the same item. ALDOR's rate lookup takes a street address and returns every layer; type the combined local figure into the calculator above.</p>
<p>Groceries show how the state part and the local part can drift apart. A ${h.usd(180)} grocery run now carries ${h.usd(cart.stateTax, 2)} of state tax at the ${h.rate(food)} food rate, against ${h.usd(cartFull.stateTax, 2)} at the general rate, but the city and county food taxes still apply in full. During the May and June 2026 suspension, those local taxes were the only ones on the receipt.</p>
<p>Several reduced state rates matter for bigger purchases. A ${h.usd(truck)} pickup pays ${h.usd(truck * auto / 100)} of state tax at the automotive rate of ${h.rate(auto)}, against ${h.usd(truck * S.stateRate / 100)} at the general rate. Online sellers enrolled in the Simplified Sellers Use Tax program charge a flat ${h.rate(ssut)} instead of the address-based rate, so a ${h.usd(online)} order costs ${h.usd(online * ssut / 100)} of tax whether it ships to a city or to a rural county. Two holidays suspend the state tax: severe weather supplies on the last full weekend of February${weather ? ` (${dayShort(weather.start)} to ${h.day(weather.end)})` : ''}, and back-to-school items in July${school ? ` (${dayShort(school.start)} to ${h.day(school.end)})` : ''}, when clothing at $156 or less per article goes untaxed by the state. Local taxes follow only where the city or county opted in, and Act 2025-309 now requires that choice at least 90 days ahead.</p>`,
  property: (h) => `<p>Alabama sorts property into four classes and taxes each on a different slice of its appraised value. Owner-occupied homes, farms and timberland sit in Class III at ${h.num(ratio)}%; commercial and other property in Class II at 20%; utilities at 30%; private cars and pickups at 15% in Class IV. Mills are then applied to that assessed value. ALDOR's own illustration takes a ${h.usd(100000)} house to ${h.usd(10000)} of assessed value and, at 32.5 mills, a bill of $325 before exemptions. The state, counties, cities and school districts all levy, and county commissions and other taxing bodies set the rates.</p>
<p>At the Census median value of ${h.usd(home)}, the assessed value is ${h.usd(assessed)}. The basic homestead exemption, H-1, removes ${h.usd(H)} of assessed value from the state levy and $2,000 from the county levy, and counties and cities can raise their part to $4,000. Owners aged 65 or older and disabled owners move to the H-2, H-3 or H-4 exemptions, which wipe out the state tax and, for H-3, the whole bill. Each one is claimed at the county office, and the owner must be living in the home on October 1, the first day of the tax year.</p>
<p>A newer limit changes what buyers should expect. Under Act 2024-344, the taxable assessed value of homes and commercial real estate can climb by no more than 7% a year, starting with taxes collected from October 1, 2025, and the cap runs through the fiscal year beginning October 1, 2027. It resets on a sale or a new improvement, so a seller's bill says little about the buyer's. At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(300000)} house pays about ${h.usd(ptx('alabama', 300000))} a year. Bills fall due October 1 and turn delinquent after December 31.</p>`,
  faqs: [
    { q: 'What is the police jurisdiction sales tax in Alabama?', a: `Many Alabama cities tax sales made in their police jurisdiction, the area just outside the city limits. The PJ rate is usually half the rate charged inside the city. It is added to the ${rate(S.stateRate)} state tax and the county tax, so check the exact address with ALDOR's rate lookup before assuming a store outside town is cheaper.` },
    { q: 'How much is the Alabama state sales tax on food in 2026?', a: `${rate(food)}, the rate in force since September 1, 2025, except from May 1 to June 30, 2026, when Act 2026-604 suspended the state food tax entirely. City and county sales taxes on food were not suspended and still apply in full, so the total on a grocery bill is the ${rate(food)} state part plus the local rates of the store's location.` },
    { q: `Why do online stores charge ${rate(ssut)} sales tax in Alabama?`, a: `Remote sellers enrolled in Alabama's Simplified Sellers Use Tax program collect a flat ${rate(ssut)} on orders shipped into the state, in place of the combined state and local rate of the delivery address. The buyer then owes nothing more on that order. A seller outside the program charges the regular address-based rate, which can be higher or lower depending on the city and county.` },
    { q: 'Can Alabama property tax on my house go up more than 7% a year?', a: `Not the taxable assessed value, under Act 2024-344, from taxes collected October 1, 2025 through the fiscal year beginning October 1, 2027. The cap resets when the home is sold or improved, and millage rate changes are separate, so the bill itself can still move. Homes are assessed at ${ratio}% of appraised value before the cap and the homestead exemptions apply.` },
  ],
  related: ['georgia', 'florida', 'tennessee', 'mississippi', 'grocery-sales-tax-by-state', 'sales-tax-holidays'],
});
