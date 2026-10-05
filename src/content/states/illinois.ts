import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('illinois');
const S = s.sales, C = s.census, PR = s.property, HS = s.property.homestead;
const rx = S.prescriptionDrugs.rate ?? 0;
const hol = S.holidays2026?.[0];
// The holiday's reduced state share and its price limit exist only in the text of holidays2026[0].items.
const holRate = 1.25, holLimit = 125;
const groceryLocal = 1; // the local grocery tax "must be exactly 1%" (local.capNote)
const cart = 180;
const cartLocal = tx('illinois', cart, 'groceries', groceryLocal);
const cough = tx('illinois', 14, 'prescription');
const jacket = 110;
const ratio = PR.assessment?.ratio ?? 0;
const cookRatio = 10; // Cook County residential level, PR.assessment.text
const hs = HS.amount ?? 0;
const home = 320000;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'illinois',
  title: `Illinois Sales Tax 2026: ${rate(S.stateRate)}, Medicine ${rate(rx)}, Grocery Reform`,
  description: `Illinois sales tax in 2026: ${rate(S.stateRate)} on goods, no state grocery tax since January 1 but a ${rate(groceryLocal)} local one in many towns, medicine at ${rate(rx)}, homes taxed at ${eff(C.effectiveRate)}.`,
  intro: `Illinois dropped its state tax on groceries on January 1, 2026, kept a 1% rate on medicine, and still has some of the heaviest property tax bills in the country.`,
  resume: `Since January 1, 2026, Illinois no longer collects any state tax on groceries, yet most shoppers still see ${rate(groceryLocal)} on their food receipt, because cities and counties may adopt a local grocery tax of exactly that rate and more than 600 of them filed ordinances before the change. Everything else keeps its old treatment: general merchandise, clothing included, pays the ${rate(S.stateRate)} state rate plus home rule, county, transit and other local taxes, and medicines, prescription or not, pay a reduced ${rate(rx)} state rate. A ten-day back-to-school holiday in August 2026 cut the state share on clothing under ${usd(holLimit)} to ${rate(holRate)}. The property side is what makes Illinois expensive: homeowners paid a median ${usd(C.medianTax)} in 2024 (Census ACS), rank ${billRank} of 51, on homes worth a median ${usd(C.medianValue)}, a ratio of ${eff(C.effectiveRate)} that ranks ${effRank}. Cook County assesses homes at ${cookRatio}% of value, every other county at one third, and the general homestead exemption ranges from ${usd(hs)} to $10,000 of equalized value.`,
  sales: (h) => `<p>The grocery reform is the change every Illinois household felt in 2026. Public Act 103-0781 ended the state's ${h.rate(groceryLocal)} tax on food for home consumption, but it handed the same rate to local government: a municipality or county may impose its own grocery tax, and the ordinance must set it at exactly ${h.rate(groceryLocal)}, no more and no less. Ordinances filed by April 1 start on July 1, and those filed by October 1 start the following January 1. In a town that adopted one, a ${h.usd(cart)} grocery run still owes ${h.usd(cartLocal.tax, 2)}; in a town that did not, it owes nothing. The Department of Revenue had to issue a compliance alert because some stores stopped charging the local tax where it was still due. Soft drinks, candy, alcohol and prepared food stay outside the grocery rate and pay the full general merchandise rate.</p>
<p>Medicine is the other Illinois peculiarity. Prescription and nonprescription drugs, corrective glasses, insulin syringes and prostheses pay ${h.rate(rx)} to the state instead of ${h.rate(S.stateRate)}, so a ${h.usd(14)} bottle of cough syrup carries ${h.usd(cough.stateTax, 2)} of state tax. The local part on top depends on the address, which since January 1, 2025 is also the delivery address when an out-of-state retailer ships to Illinois, and local rates move only on January 1 and July 1. Use MyTax Illinois' rate finder for the combined figure and type the local share into the calculator above.</p>
<p>The ${hol ? `${dayShort(hol.start)} to ${day(hol.end)}` : 'August'} holiday was a reduced-rate event, not an exemption: a ${h.usd(jacket)} jacket owed ${h.usd(jacket * holRate / 100, 2)} of state tax that week instead of ${h.usd(tx('illinois', jacket).stateTax, 2)}, with local taxes unchanged. Buyers of a car from a private seller pay on Form RUT-50, and households that owe use tax of $600 or less on untaxed purchases can settle it on their IL-1040.</p>`,
  property: (h) => `<p>Illinois property tax is entirely local: counties, townships, municipalities, school districts and a long list of special districts each levy, and the Department of Revenue only supervises equalization and exemptions. The first number on a bill is the assessment. Outside Cook County, homes are assessed at 33 1/3% of fair market value; in Cook County, residential property is assessed at ${cookRatio}% and multiplied by the state equalization factor, so the two systems produce very different assessed values for the same house before rates are applied. Reassessment comes every four years, every three in Cook.</p>
<p>The homestead exemption is a reduction in equalized assessed value, not in market value, and its size depends on the county: ${h.usd(hs)} in most of the state, $8,000 in the counties next to Cook and $10,000 in Cook itself. Owners 65 or older add a senior exemption of up to $5,000, or $8,000 in Cook and its neighbors, and those with household income of $75,000 or less in tax year 2026 can freeze their EAV by filing Form PTAX-340 every year. Remodeling a home is shielded for four years up to $75,000 of added value. PTELL, the "tax cap" law, limits how fast a non-home-rule district's total levy can grow, to 5% or inflation if lower, but it caps the district, not your individual bill.</p>
<p>With a typical ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(home)} house in Illinois carries about ${h.usd(ptx('illinois', home))} a year, and homeowners can then claim an income tax credit worth up to 5% of the property tax paid on their main home. Payment dates are set county by county, so check your county treasurer's bill for the installments.</p>`,
  faqs: [
    { q: 'Do Illinois grocery stores still charge sales tax in 2026?', a: `The state no longer does: Illinois ended its ${rate(groceryLocal)} state grocery tax on January 1, 2026. But a city or county can impose a local grocery tax of exactly ${rate(groceryLocal)}, and more than 600 ordinances were filed, so in most towns you still pay ${rate(groceryLocal)} on food for home. Candy, soft drinks, alcohol and prepared food are taxed at the full ${rate(S.stateRate)} state rate plus local taxes.` },
    { q: 'Is over-the-counter medicine taxed in Illinois?', a: `Yes, at a reduced rate. Illinois taxes qualifying drugs at ${rate(rx)} instead of ${rate(S.stateRate)}, and that covers nonprescription items such as aspirin and cough medicine as well as prescription drugs, insulin syringes, corrective eyewear and prostheses. Local taxes can apply on top depending on where you buy. The grocery reform of January 1, 2026 did not change this rate.` },
    { q: 'How much is the homestead exemption in Cook County, Illinois?', a: `In Cook County the general homestead exemption can reduce a home's equalized assessed value by up to $10,000, compared with $8,000 in the neighboring counties and ${usd(hs)} elsewhere in Illinois. It covers the increase in EAV above the 1977 level, for an owner-occupied main residence. Owners 65 or older can add a senior exemption of up to $8,000 in Cook. Apply through the Cook County Assessor.` },
  ],
  related: ['indiana', 'wisconsin', 'missouri', 'iowa', 'grocery-sales-tax-by-state', 'property-tax-by-state'],
});
