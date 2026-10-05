import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('maryland');
const S = s.sales, C = s.census, HS = s.property.homestead;
const O = S.otherRates ?? [];
const it = O[0]?.rate ?? 0, cannabis = O[1]?.rate ?? 0, alcohol = O[2]?.rate ?? 0, titling = O[3]?.rate ?? 0;
const [energy, school] = S.holidays2026 ?? [];
const consulting = 5000;
const car = 38000;
const boots = 95;
const capPct = HS.amount ?? 0;
// Example of the three-year phase-in and the homestead cap (hypothetical values).
const oldValue = 400000, newValue = 490000;
const step = (newValue - oldValue) / 3;
const year1 = oldValue + step;
const countyCap = 5;
const capped = oldValue * (1 + countyCap / 100);
const shielded = year1 - capped;
const home = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'maryland',
  title: `Maryland Sales Tax 2026: ${rate(S.stateRate)} Statewide, ${rate(it)} on IT Services`,
  description: `Maryland sales tax in 2026: ${rate(S.stateRate)} in every county by law, a ${rate(it)} rate on IT and data services, two tax-free periods each year, and a homestead cap of ${capPct}% a year.`,
  intro: `State law forbids county sales taxes, the 2025 budget added a ${rate(it)} tax on tech services, and a homeowner's assessment can rise only so fast.`,
  resume: `Maryland's sales tax is ${rate(S.stateRate)} in every county and in Baltimore City, because state law bars counties, municipalities and special districts from creating a sales tax of their own. The 2025 budget law widened the base: since July 1, 2025, data processing, web hosting, IT consulting and software publishing services pay a separate ${rate(it)} rate, cannabis went from 9% to ${rate(cannabis)}, and vending-machine snacks lost their food exemption. Alcohol pays ${rate(alcohol)} and cars a ${rate(titling)} titling tax instead of sales tax. Groceries and prescription drugs are exempt and clothing is taxed, except during two tax-free periods each year, one for Energy Star appliances in February and one for clothing in August. On property, the State Department of Assessments and Taxation revalues homes every three years and phases increases in, while the homestead tax credit stops the taxable assessment of a main home from rising more than ${capPct}% a year for the State tax, less where the county chooses. The Census median bill is ${usd(C.medianTax)}, rank ${billRank} of 51, on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)} of value.`,
  sales: (h) => `<p>Section 11-102 of the Tax-General Article settles the local question: apart from taxes already in force on January 1, 1971, no county, city or special taxing district may impose a retail sales or use tax. So the calculator above needs no local rate, and the tax on a sale is the state's bracket table at ${h.rate(S.stateRate)}, a few cents' rounding aside.</p>
<p>The newer story is services. From July 1, 2025, buyers of data processing, hosting, IT consulting or software publishing services, the NAICS codes 518, 519, 5132 and 5415, pay ${h.rate(it)}: a ${h.usd(consulting)} IT consulting invoice now carries ${h.usd((consulting * it) / 100)} of tax, half of what the general rate would give. The same law raised the adult-use cannabis rate to ${h.rate(cannabis)} and removed two exemptions, vending-machine snack food and bullion or coins sold for more than $1,000. Alcoholic beverages stay at ${h.rate(alcohol)}, vaping devices carry far higher rates, and peer-to-peer car sharing pays 8%.</p>
<p>Vehicles are taxed at titling, not at the register: the excise is ${h.rate(titling)} of fair market value, ${h.usd((car * titling) / 100)} on a ${h.usd(car)} car. Both tax-free periods are fixed by statute. ${energy ? `The Energy Star weekend ran ${dayShort(energy.start)} to ${day(energy.end)}, covering appliances such as air conditioners, washers, dryers, heat pumps and refrigerators.` : ''} ${school ? `The back-to-school week ran ${dayShort(school.start)} to ${day(school.end)}: clothing and footwear priced $100 or less per item and the first $40 of a backpack were exempt, so ${h.usd(boots)} boots saved ${h.usd(tx('maryland', boots).stateTax, 2)}, while jewelry, watches and handbags stayed taxed.` : ''}</p>`,
  property: (h) => `<p>Three layers of government tax a Maryland home: the State, the county or Baltimore City, and the municipality where there is one. Values come from a single State agency: the State Department of Assessments and Taxation reinspects each property every three years and phases any increase in over the cycle, one third a year; if the value has not increased, the most recent valuation stays. The property tax year runs from July 1 to June 30.</p>
<p>The homestead tax credit then caps what the phase-in can pass on. For an owner-occupied main residence, the assessment used for the State tax cannot rise more than ${h.num(capPct)}% a year, and each county and Baltimore City picks its own cap between 0% and ${h.num(capPct)}%, set by law before March 15 for the year that starts July 1. Suppose SDAT raises a home from ${h.usd(oldValue)} to ${h.usd(newValue)}: the phase-in gives ${h.usd(year1)} in the first year. In a county with a ${countyCap}% cap, the county tax is charged on ${h.usd(capped)}, and the tax on the other ${h.usd(shielded)} is credited. The State tax, with its ${h.num(capPct)}% cap, uses the full ${h.usd(year1)}.</p>
<p>The credit requires a one-time application to SDAT and that you live in the home by July 1. Lying to obtain it costs a penalty of 25% of the credit received in each year you did not qualify. At the typical ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(home)} home pays about ${h.usd(ptx('maryland', home))} a year, but county rates vary widely. Income-based credits exist too; SDAT's own pages could not be read for their amounts, so they are not given here.</p>`,
  faqs: [
    { q: 'Do Maryland counties add their own sales tax?', a: `No. Section 11-102 of Maryland's Tax-General Article prohibits counties, municipalities and special taxing districts from imposing a retail sales or use tax, except taxes already in effect on January 1, 1971. The ${rate(S.stateRate)} state rate is therefore the rate everywhere, including Baltimore City. Special state rates apply to some items, such as ${rate(alcohol)} on alcohol and ${rate(it)} on IT services.` },
    { q: `What is Maryland's ${rate(it)} sales tax on IT services?`, a: `Since July 1, 2025, Maryland taxes data processing, web hosting, IT consulting and software publishing services at ${rate(it)}, under Chapter 604 of the Acts of 2025. It covers services classified under NAICS codes 518, 519, 5132 and 5415. A ${usd(consulting)} invoice for such services carries ${usd((consulting * it) / 100)} of tax. Goods remain at the general ${rate(S.stateRate)} rate.` },
    { q: 'How does the Maryland homestead tax credit cap work?', a: `It limits how much the taxable assessment of your owner-occupied main home can rise each year: ${capPct}% for the State property tax, and between 0% and ${capPct}% for county tax, depending on the cap your county or Baltimore City adopted. Tax on any increase above the cap is credited on the bill. Apply once to SDAT; you must live in the home by July 1.` },
  ],
  related: ['virginia', 'delaware', 'pennsylvania', 'district-of-columbia', 'property-tax-assessment-caps', 'sales-tax-holidays'],
});
