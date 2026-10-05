import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, dayShort } from '../../lib/kit';

const s = st('virginia');
const S = s.sales, C = s.census;
const loc = S.local.cap ?? 0;
const base = Math.round((S.stateRate + loc) * 100) / 100;
const groc = S.otherRates?.[0]?.rate ?? 0;
// Highest combined rate (Historic Triangle), as written in the Virginia Tax rate note.
const TRIANGLE = 7;
const triangleLocal = Math.round((TRIANGLE - S.stateRate) * 100) / 100;
const hol = S.holidays2026?.[0];
const desk = 1000;
const deskBase = tx('virginia', desk, 'general', loc);
const deskTri = tx('virginia', desk, 'general', triangleLocal);
const cart = tx('virginia', 220, 'groceries', groc);
const shoes = tx('virginia', 90, 'clothing', loc);
const v = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'virginia',
  title: `Virginia Sales Tax 2026: ${rate(base)} Most Places, ${rate(groc)} on Groceries`,
  description: `Virginia sales tax in 2026: ${rate(S.stateRate)} state plus ${rate(loc)} local, so ${rate(base)} in most places and up to ${rate(TRIANGLE)}; groceries at ${rate(groc)}, an August holiday, and local-only property tax.`,
  intro: `A ${rate(base)} base everywhere, regional add-ons in the big metro areas, and a grocery rate that is purely local since the state dropped its share in 2023.`,
  resume: `Virginia's state sales tax is ${rate(S.stateRate)}, and every city and county adds ${rate(loc)}, so ${rate(base)} is the general rate in most of the state. Regional taxes push it to 6% in Central Virginia, Hampton Roads and Northern Virginia, 6.3% in eight southside localities such as Danville and Pittsylvania County, and ${rate(TRIANGLE)} in the Historic Triangle of James City County, Williamsburg and York County. Food for home consumption and essential hygiene products such as diapers lost their state tax on January 1, 2023, so they pay only the ${rate(groc)} local share, the same everywhere. Prescription and nonprescription drugs are exempt. Clothing is taxed except during the early-August holiday, which also covers hurricane and Energy Star items. Property tax is entirely local, on 100% of fair market value; the typical owner's bill in 2024 was ${usd(C.medianTax)} on a ${usd(C.medianValue)} home per the Census, ${eff(C.effectiveRate)} of value, ${effRank} of 51 by rate. There is no statewide homestead exemption.`,
  sales: (h) => `<p>Virginia's local tax is not a choice: every city and county levies the ${h.rate(loc)}, which is why ${h.rate(base)} works as the floor almost everywhere. The variation comes from regional taxes laid over particular areas. A ${h.usd(desk)} standing desk costs ${h.usd(deskBase.tax, 2)} in tax in most of the state and ${h.usd(deskTri.tax, 2)} in Williamsburg, where the combined rate is ${h.rate(TRIANGLE)}. For use in the calculator, enter ${h.num(loc)} as the local rate in a ${h.rate(base)} locality, or the combined rate of your area minus ${h.rate(S.stateRate)}.</p>
<p>Groceries are the case where the calculator needs a small adjustment. Since 2023 the state charges nothing on food for home consumption, but the ${h.rate(groc)} local tax remains, and regional add-ons do not apply to it. Choose "Groceries" and enter ${h.num(groc)}: a ${h.usd(220)} grocery bill comes to ${h.usd(cart.tax, 2)} of tax. Diapers, feminine hygiene products and other essential personal hygiene items get the same ${h.rate(groc)} treatment. Hot prepared food is taxed at the full rate.</p>
<p>The ${hol ? `${dayShort(hol.start)} to ${h.day(hol.end)}` : 'early-August'} holiday bundles three themes into one weekend: back to school, hurricane preparedness and efficient appliances. Clothing and footwear up to $100 an item qualify, so ${h.usd(90)} sneakers skip ${h.usd(shoes.tax, 2)} of tax at the base rate; school supplies qualify up to $20, portable generators up to $1,000, gas chainsaws up to $350, and Energy Star or WaterSense products for the home up to $2,500. Nonprescription medicines are exempt all year, not only prescriptions.</p>`,
  property: (h) => `<p>The Commonwealth levies no real estate tax. Counties, cities and towns set their own rates and assess real estate at 100% of fair market value, as state law requires for every general reassessment. Counties reassess every four years, or every three if their board votes for it, and counties of 50,000 people or fewer may wait five or six years; many cities reassess annually. In a slow-cycle county, assessed values can trail the market until the next reassessment.</p>
<p>The Census ratio of ${h.eff(C.effectiveRate)} puts the tax on the median home of ${h.usd(v)} near ${h.usd(ptx('virginia', v))}, and on a ${h.usd(550000)} house near ${h.usd(ptx('virginia', 550000))}. Each locality sets its own rate, so the figure published by your county or city is the one to apply.</p>
<p>Without a statewide homestead exemption, relief is a local ordinance. Each locality may exempt or defer tax for owners 65 or older or permanently and totally disabled who live in the home, with income and net worth limits it sets itself, and applications go to the commissioner of the revenue or the assessor. One exemption is statewide: since 2011 the constitution fully exempts the principal residence of a veteran rated 100% service-connected, permanent and total disability, including a home held jointly with a spouse. Payment dates are set locally too.</p>`,
  faqs: [
    { q: 'What is the sales tax rate in Williamsburg, Virginia?', a: `${rate(TRIANGLE)}, the highest general rate in Virginia. It applies in the Historic Triangle: James City County, Williamsburg and York County. It combines the ${rate(S.stateRate)} state rate, the ${rate(loc)} local tax every locality charges and a regional tax. A ${usd(desk)} purchase there carries ${usd(deskTri.tax, 2)} of tax, against ${usd(deskBase.tax, 2)} in most of the state. Groceries still pay only ${rate(groc)}.` },
    { q: 'Do you pay tax on groceries in Virginia?', a: `Only ${rate(groc)}. Since January 1, 2023, Virginia charges no state tax on food for home consumption or essential personal hygiene products such as diapers, but the ${rate(groc)} local tax still applies everywhere, regional areas included. A ${usd(220)} grocery bill carries ${usd(cart.tax, 2)}. Hot prepared food is taxed at the full combined rate of the locality, from ${rate(base)} to ${rate(TRIANGLE)}.` },
    { q: 'Is there a property tax break for seniors in Virginia?', a: `It depends on your locality. Virginia has no statewide homestead exemption, but counties, cities and towns may adopt exemptions, deferrals or both for owners 65 or older or permanently and totally disabled who live in the home, with income and net worth limits they set themselves. Ask your commissioner of the revenue or assessor. Veterans rated 100% permanently and totally disabled are fully exempt statewide.` },
  ],
  related: ['north-carolina', 'maryland', 'west-virginia', 'district-of-columbia', 'grocery-sales-tax-by-state', 'sales-tax-holidays'],
});
