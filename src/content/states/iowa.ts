import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('iowa');
const S = s.sales, C = s.census, PR = s.property;
const lost = S.local.cap ?? 0;
const regFee = S.otherRates?.[0]?.rate ?? 0;
const hotel = S.otherRates?.[1]?.rate ?? 0;
const rental = S.otherRates?.[2]?.rate ?? 0;
const hol = S.holidays2026?.[0];
const rollback = PR.assessment?.ratio ?? 0;
// SF 2472 homestead exemption: 10% of taxable value, $5,500 minimum, $20,000 maximum, +$6,500 at 65 (homestead.text).
const hsPct = 10, hsMin = 5500, hsMax = 20000, hsSenior = 6500;
const truck = 28000;
const shoes = 90;
const shoesTax = tx('iowa', shoes, 'clothing', lost);
const home = C.medianValue;
const taxable = Math.round((home * rollback) / 100);
const hsAmt = Math.min(hsMax, Math.max(hsMin, Math.round((taxable * hsPct) / 100)));
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'iowa',
  title: `Iowa Sales Tax 2026: ${rate(S.stateRate)} Plus ${rate(lost)} LOST, New Homestead Rule`,
  description: `Iowa sales tax in 2026: ${rate(S.stateRate)} state rate and a voter-approved ${rate(lost)} local option, a ${rate(regFee)} fee instead of tax on car purchases, and homes taxed on ${rollback}% of value.`,
  intro: `A state rate with a single one-percent local option, a two-day clothing holiday every August, and a property tax that only reaches part of a home's value.`,
  resume: `Iowa's sales tax has two possible levels and no more: the ${rate(S.stateRate)} state rate, and ${rate(S.stateRate + lost)} where voters approved the ${rate(lost)} local option sales tax, known as LOST. LOST can only reach what the state taxes, and there is no local use tax. Food for home is exempt, prescription drugs too, and clothing is taxed except on the first Friday and Saturday of August, when pieces under $100 are free of both state and local tax. Cars skip sales tax entirely: buyers pay a registration fee of $10 plus ${rate(regFee)} of the price. For property, the county auditor's rollback means a home is taxed on only part of its assessed value, ${rollback}% for the 2025 assessment year. The Census puts the median Iowa bill at ${usd(C.medianTax)} for a ${usd(C.medianValue)} home, a ratio of ${eff(C.effectiveRate)} and rank ${effRank} of 51. In 2026 the Legislature replaced the old homestead credit with an exemption of ${hsPct}% of taxable value, between ${usd(hsMin)} and ${usd(hsMax)}, starting with bills paid in September 2027.`,
  sales: (h) => `<p>A local option sales tax exists only after a public vote, and once in force it cannot be repealed by another vote until it has run for a year. The rate is always ${h.rate(lost)}, whether the vote covered a whole county, a city or the unincorporated part of a county, so the combined rate is either ${h.rate(S.stateRate)} or ${h.rate(S.stateRate + lost)}. The Department of Revenue's Tax Mapper tells you which one applies at an address. LOST also brings a ${h.rate(lost)} local excise on residential gas and electricity, which the state rate exempts.</p>
<p>Several purchases follow their own rule. A ${h.usd(truck)} pickup bought from a dealer or a neighbor pays no sales tax but a new registration fee of ${h.usd(10 + (truck * regFee) / 100)}, that is $10 plus ${h.rate(regFee)}. Hotel rooms pay a ${h.rate(hotel)} state hotel and motel tax instead of the ${h.rate(S.stateRate)} sales tax, plus a local hotel tax of up to 7%, and LOST does not apply to them. Short car rentals add a ${h.rate(rental)} rental excise on top of the sales tax. At the pharmacy, the label decides: ibuprofen filled and labeled by a pharmacist on a prescription is exempt, the same pill off the shelf is taxable.</p>
<p>The clothing holiday is set by law for the first Friday and Saturday of August${hol ? `, which in 2026 fell on ${dayShort(hol.start)} and ${dayShort(hol.end)}` : ''}. It covers each article of clothing or footwear priced under $100, and it removes LOST as well as the state tax, so a ${h.usd(shoes)} pair of running shoes that would cost ${h.usd(shoesTax.tax, 2)} in tax in a LOST area costs nothing extra. Backpacks and school supplies are not part of it.</p>`,
  property: (h) => `<p>More than 2,000 levying authorities share Iowa's property tax: counties, cities, school districts and others. The local assessor values homes at market value every odd-numbered year, the county auditor applies the levy rates, and the county treasurer collects. Between the assessment and the rate sits the rollback, the assessment limitation that keeps total residential taxable value from growing more than 3% a year statewide. For assessment year 2025 it was ${h.num(rollback, 4)}%, so the Census median home of ${h.usd(home)} becomes ${h.usd(taxable)} of taxable value. The 2026 percentage is certified by November 1.</p>
<p>From assessment year 2026, SF 2472 replaces the old homestead credit, which was the tax on the first $4,850 of value, with an exemption of ${h.num(hsPct)}% of the home's taxable value, no less than ${h.usd(hsMin)} and no more than ${h.usd(hsMax)}. On that median home it would remove ${h.usd(hsAmt)}. Owners 65 or older take an extra ${h.usd(hsSenior)} off. Anyone who already had the credit before July 1, 2026 is switched over automatically; new buyers claim it with the local assessor. Disabled veterans can have the whole homestead tax credited, and owners 70 or older under 250% of the poverty level can file for the Property Tax Credit with the county treasurer by June 1.</p>
<p>Timing is unusual. A January 1 assessment produces bills a year and a half later: the first half is due September 30, the second March 31. Disagreements with a value go first to the assessor between April 2 and 25, then to the board of review by April 30. As a rough guide, ${h.eff(C.effectiveRate)} of value on a ${h.usd(300000)} house is about ${h.usd(ptx('iowa', 300000))} a year.</p>`,
  faqs: [
    { q: 'What is the local option sales tax in Iowa?', a: `It is a ${rate(lost)} local tax, called LOST, that a county, city or unincorporated area can add after voters approve it, bringing the rate to ${rate(S.stateRate + lost)}. It applies only to sales that the ${rate(S.stateRate)} state tax covers, there is no local use tax, and it cannot be repealed until it has been in effect for one year. Iowa's Tax Mapper shows whether an address has it.` },
    { q: 'How does the new Iowa homestead exemption work?', a: `From assessment year 2026, with the first bills paid in September 2027, Iowa exempts ${hsPct}% of a homestead's taxable value, at least ${usd(hsMin)} and at most ${usd(hsMax)}, instead of the old credit. Owners 65 or older get another ${usd(hsSenior)}. If you had the credit before July 1, 2026, the switch is automatic; otherwise file the claim with your local assessor.` },
    { q: 'Do you pay sales tax on a car in Iowa?', a: `No. Vehicles subject to registration are exempt from Iowa sales tax, but the buyer pays a one-time fee for new registration of $10 plus ${rate(regFee)} of the purchase or lease price, and that also applies when you buy from a private seller. On a ${usd(truck)} truck the fee comes to ${usd(10 + (truck * regFee) / 100)}. Annual registration fees are separate.` },
  ],
  related: ['nebraska', 'minnesota', 'illinois', 'wisconsin', 'sales-tax-holidays', 'homestead-exemption-by-state'],
});
