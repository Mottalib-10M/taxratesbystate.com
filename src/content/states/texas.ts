import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, dayShort } from '../../lib/kit';

const s = st('texas');
const S = s.sales, C = s.census, PR = s.property;
const HS = PR.homestead.amount ?? 0;
// Extra school exemption for owners 65 or older or disabled, as written in the Comptroller's relief note.
const SENIOR = 60000;
const localCap = S.local.cap ?? 0;
const top = S.stateRate + localCap;
const tv = tx('texas', 1000, 'general', localCap);
const genHol = S.holidays2026?.[0];
const starHol = S.holidays2026?.[1];
const generator = tx('texas', 2400);
const fridge = tx('texas', 1900);
const v = C.medianValue;
const schoolBase = Math.max(0, v - HS);
const schoolBase65 = Math.max(0, v - HS - SENIOR);
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'texas',
  title: `Texas Sales Tax 2026: ${rate(S.stateRate)} State, ${usd(HS)} Homestead`,
  description: `Texas sales tax in 2026: ${rate(S.stateRate)} state rate, ${rate(top)} at most with local taxes, three spring holidays, and a ${usd(HS)} school homestead exemption on property tax.`,
  intro: `A sales tax that tops out at ${rate(top)}, and property tax bills that are the real cost of owning a home, softened by a ${usd(HS)} school exemption.`,
  resume: `Texas charges a ${rate(S.stateRate)} state sales tax, and cities, counties, transit authorities and special districts can add up to ${rate(localCap)} between them, so no Texas receipt exceeds ${rate(top)}. Groceries such as bread, milk, eggs and produce are untaxed, as are prescription drugs and over-the-counter medicines with a Drug Facts label; clothing is taxed except during the August back-to-school weekend. The spring brings extra breaks: emergency supplies in late April, ENERGY STAR appliances and water-saving products over Memorial Day weekend. Property tax is where Texans pay. It is entirely local, levied by school districts, counties, cities and special districts on values set each January 1 by the county appraisal district. The typical owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), ${eff(C.effectiveRate)} of value, ranked ${effRank} of 51 by rate. A principal residence gets a ${usd(HS)} exemption from school district tax, plus ${usd(SENIOR)} more for owners 65 or older or disabled, ${usd(HS + SENIOR)} in all.`,
  sales: (h) => `<p>The ${h.rate(localCap)} local ceiling is the number to remember in Texas. However many taxing bodies overlap at an address, a city, its county, a transit authority and a special purpose district together cannot charge more than ${h.rate(localCap)}, so the combined rate tops out at ${h.rate(top)}. A ${h.usd(1000)} television bought at that maximum carries ${h.usd(tv.tax, 2)} of tax. The Comptroller's address search gives the exact local figure to type into the calculator above.</p>
<p>The grocery line is drawn by how food is sold. Flour, sugar, milk and fruit are exempt, while soft drinks, candy, beer and wine are taxed. Bakeries get a special rule: bakery items are tax-free from a bakery whose display case brings in more than half its sales, but the same items heated or handed over with utensils elsewhere are taxable. Over-the-counter medicine with an FDA Drug Facts label is exempt with no prescription needed.</p>
<p>Texas uses holidays more than most states. ${genHol ? `From ${dayShort(genHol.start)} to ${h.day(genHol.end)}` : 'In late April'}, emergency gear was tax-free, including portable generators under $3,000: a ${h.usd(2400)} generator saved ${h.usd(generator.stateTax, 2)} of state tax alone. ${starHol ? `From ${dayShort(starHol.start)} to ${h.day(starHol.end)}` : 'Over Memorial Day weekend'}, ENERGY STAR refrigerators up to $2,000 qualified, so a ${h.usd(1900)} model escaped ${h.usd(fridge.stateTax, 2)} of state tax, and water-efficient products joined in. The back-to-school holiday in August covers clothing, shoes and supplies under $100 per item. Cars pay a separate ${h.rate(S.otherRates?.[0]?.rate ?? 0)} motor vehicle sales tax on the price minus any trade-in, and new residents bringing their own vehicle pay a flat $90 instead.</p>`,
  property: (h) => `<p>Texas has no state property tax, and the Comptroller neither sets rates nor collects. Each county appraisal district values property at market value as of January 1, and then every school district, county, city, junior college and special district with a claim on that address adopts its own rate. Owners who disagree with a value can protest to the appraisal review board. A ${h.usd(350000)} house, taxed at the Census ratio of ${h.eff(C.effectiveRate)}, faces roughly ${h.usd(ptx('texas', 350000))} a year, a large bill by national standards.</p>
<p>The homestead exemption works levy by levy, and the school levy gets the largest one. For a principal residence, school districts must exempt ${h.usd(HS)} of appraised value: on the Census median home of ${h.usd(v)}, school tax falls only on ${h.usd(schoolBase)}. Owners 65 or older or disabled exempt another ${h.usd(SENIOR)}, which brings the school base on the same home to ${h.usd(schoolBase65)}, and their school tax is also frozen at a ceiling that can move with them to a new home and continue for a surviving spouse aged 55 or older. Any taxing unit may add a local option exemption of up to 20% of value, at least $5,000, and counties levying farm-to-market or flood control taxes must give $3,000. File Form 50-114 with the appraisal district, generally before May 1.</p>
<p>Whoever owns the home on January 1 owes that year's tax. Bills are due by January 31; from February 1 a 6% penalty and 1% interest apply, and the penalty reaches 12% by July 1.</p>`,
  faqs: [
    { q: 'How much is the homestead exemption in Texas for school taxes?', a: `${usd(HS)} of appraised value for a principal residence, and school districts must grant it. Owners aged 65 or older or disabled receive an extra ${usd(SENIOR)}, for ${usd(HS + SENIOR)} in all, plus a ceiling on their school tax. On a ${usd(v)} home, the regular exemption leaves ${usd(schoolBase)} taxable for school purposes. File Form 50-114 with your county appraisal district, generally before May 1.` },
    { q: 'What is the highest sales tax rate in Texas?', a: `${rate(top)}. Texas charges ${rate(S.stateRate)} statewide, and all local taxes together, from cities, counties, transit authorities and special purpose districts, are capped at ${rate(localCap)}. That cap holds however many local bodies overlap at an address. A ${usd(1000)} purchase at the maximum rate costs ${usd(tv.tax, 2)} in tax. Use the Comptroller's address search to see the local rate where you shop or take delivery.` },
    { q: 'When are Texas property taxes due?', a: `By January 31 of the year after the tax year. From February 1, unpaid taxes draw a 6% penalty plus 1% interest, and the penalty rises to 12% by July 1. If a bill is mailed after January 10, the delinquency date moves so you still have at least 21 days to pay. The person who owned the property on January 1 owes the whole year's tax.` },
  ],
  related: ['oklahoma', 'louisiana', 'new-mexico', 'arkansas', 'homestead-exemption-by-state', 'sales-tax-holidays'],
});
