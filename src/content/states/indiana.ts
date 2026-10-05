import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('indiana');
const S = s.sales, C = s.census, HS = s.property.homestead;
// Circuit-breaker caps, food and beverage tax, credits: figures written in the text fields of the facts.
const capHome = 1, capRental = 2, capOther = 3;
const fb = 2;
const credit = 300;
const fridge = tx('indiana', 900);
const dinner = 60;
const home = C.medianValue;
const capBill = (home * capHome) / 100;
const typical = ptx('indiana', home);
const hs = HS.amount ?? 0;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'indiana',
  title: `Indiana Sales Tax 2026: ${rate(S.stateRate)} Flat, Property Tax Capped at ${capHome}%`,
  description: `Indiana sales tax in 2026: one ${rate(S.stateRate)} rate in every county with no local add-on, food exempt, clothing taxed, and home tax bills capped at ${capHome}% of assessed value.`,
  intro: `Seven percent at every register in the state, no county surcharge to look up, and a constitutional ceiling on what a homeowner's tax bill can reach.`,
  resume: `Indiana is one of the few states where the sales tax is the same at every till: ${rate(S.stateRate)}, in force since April 1, 2008, with no county or city sales tax on top. The only local extra is a food and beverage tax of usually 1%, or ${fb}% where county and city both adopted it, charged on prepared food and drinks. Groceries sold unheated and without utensils are exempt, many candy bars count as food because of the flour rule, and clothing is taxed in full with no holiday. Property tax is where Indiana stands out. The constitution caps a homestead's bill at ${capHome}% of its gross assessed value, ${capRental}% for rentals and farmland, ${capOther}% for everything else, and only voter-approved referendum levies can exceed it. Census figures put the median homeowner's tax at ${usd(C.medianTax)} on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)} of value, rank ${effRank} of 51. The 2025 reform (SEA 1) shrinks the homestead standard deduction to ${usd(hs)} for the 2026 assessment and to zero by 2030, while a larger supplemental deduction and a new credit take its place.`,
  sales: (h) => `<p>Because Indiana bars general local sales taxes, there is no rate map to consult before buying: a ${h.usd(900)} refrigerator costs ${h.usd(fridge.tax, 2)} in tax in the largest city mall and in the smallest village hardware store alike. The calculator above therefore needs no local rate for ordinary goods. Restaurants are the exception. A county, and a city inside it, can each adopt a food and beverage tax on prepared food and drinks, generally 1% each, so a ${h.usd(dinner)} dinner can carry up to ${h.usd(dinner * (S.stateRate + fb) / 100, 2)} instead of ${h.usd(tx('indiana', dinner).tax, 2)}. Counties also levy innkeeper's taxes on short stays. The Department of Revenue's county tax information page lists which places charge what.</p>
<p>The grocery line follows Indiana's own definitions. Food sold unheated and without utensils is exempt, while soft drinks, dietary supplements, alcohol and prepared food are taxed at ${h.rate(S.stateRate)}. Candy is taxed too, but the state's definition leaves out anything with flour on the label or that needs refrigeration, so a candy bar with flour among its ingredients can be sold tax free while a flourless one on the same shelf is taxed. Prescription drugs are exempt. Clothing and shoes have no exemption, and Indiana holds no sales tax holiday.</p>
<p>If an online seller charged less than ${h.rate(S.stateRate)}, the difference is owed as use tax, reported on Schedule 4 of Form IT-40 or on Form ST-115. Remote sellers must register once their Indiana revenue passes $100,000 in a year.</p>`,
  property: (h) => `<p>Counties, townships, cities and towns, school corporations and libraries all levy property tax in Indiana, and the county treasurer sends one bill for all of them. The bill is net assessed value times the local rate, then limited by the circuit breaker. On the Census median home of ${h.usd(home)}, a ${h.num(capHome)}% cap means the homestead tax cannot exceed ${h.usd(capBill)} a year unless voters approved a referendum levy; the typical ratio puts the actual figure near ${h.usd(typical)}, comfortably under the ceiling. A rental house worth the same can be billed up to ${h.usd((home * capRental) / 100)}.</p>
<p>The deductions are moving. Under SEA 1-2025 the homestead standard deduction falls from $48,000 on the 2025 assessment date to ${h.usd(hs)} for 2026, then $30,000, $20,000, $10,000 and nothing from 2030. In the other direction, the supplemental homestead deduction climbs from 40% of the remaining assessed value toward 66.7% for taxes payable in 2031. From the 2026 bills on, every homestead also gets a credit of 10% of its tax, up to ${h.usd(credit)}, with no application. Owners over 65 lost their old deduction in 2025 and now get a credit of up to $150 if their adjusted gross income is under $60,000 single or $70,000 joint; their homestead tax also cannot rise more than 2% from one year to the next.</p>
<p>Apply for deductions with the county auditor; filing by January 15 counts for that year's bill, and nothing needs renewing until the home changes hands. Taxes are paid in two installments, with a 5% penalty if you are up to 30 days late and 10% after that.</p>`,
  faqs: [
    { q: 'Is there a county sales tax in Indiana?', a: `No. Indiana does not allow counties or cities to add a general sales tax, so the rate is ${rate(S.stateRate)} in every store in the state. The one local exception is a food and beverage tax on prepared food and drinks, usually 1%, or ${fb}% where both the county and the city adopted it, plus innkeeper's taxes on hotel stays. Groceries and prescription drugs stay exempt everywhere.` },
    { q: 'How much is the Indiana homestead deduction in 2026?', a: `For the 2026 assessment date the homestead standard deduction is ${usd(hs)}, down from $48,000 a year earlier, under the 2025 law SEA 1. It keeps falling by $10,000 a year to zero in 2030. A supplemental deduction of 40% of the remaining value, rising toward 66.7%, and an automatic credit of 10% of the homestead bill, up to ${usd(credit)}, offset part of the loss.` },
    { q: 'What is the property tax cap on a home in Indiana?', a: `An Indiana homestead's tax bill cannot exceed ${capHome}% of its gross assessed value. Other residential property and farmland are capped at ${capRental}%, and all other real and personal property at ${capOther}%. On a ${usd(home)} home the ceiling is ${usd(capBill)} a year. Levies that voters approve in a referendum are added outside the cap, so a bill can go above it where such a levy passed.` },
  ],
  related: ['illinois', 'ohio', 'kentucky', 'michigan', 'property-tax-assessment-caps', 'local-sales-tax-rates'],
});
