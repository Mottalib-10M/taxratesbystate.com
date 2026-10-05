import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('utah');
const S = s.sales, C = s.census, PR = s.property;
const g = S.groceries.rate ?? 0;
// The 1% local option and 0.25% county option taxes charged everywhere, as written in the rate note.
const LOCAL_OPTION = 1, COUNTY_OPTION = 0.25;
const floor = LOCAL_OPTION + COUNTY_OPTION;
const groceryAll = Math.round((g + floor) * 100) / 100;
const fuel = S.otherRates?.[1]?.rate ?? 0;
const cart = tx('utah', 200, 'groceries', floor);
const cartFull = tx('utah', 200, 'general', floor);
const bike = tx('utah', 1400, 'general', floor);
const exempt = PR.homestead.amount ?? 0;
const taxedShare = 100 - exempt;
const v = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'utah',
  title: `Utah Sales Tax 2026: ${rate(S.stateRate)} State, ${rate(groceryAll)} Combined on Groceries`,
  description: `Utah sales tax in 2026: ${rate(S.stateRate)} state rate plus local taxes, groceries at ${rate(groceryAll)} combined everywhere, and a ${exempt}% property tax exemption for a primary residence.`,
  intro: `Groceries pay the same ${rate(groceryAll)} in every Utah town, and a home you live in is taxed on ${taxedShare}% of its value while a cabin pays on all of it.`,
  resume: `Utah's state sales tax is ${rate(S.stateRate)}, and every location adds at least a ${rate(LOCAL_OPTION)} local option tax and a ${rate(COUNTY_OPTION)} county option tax, with transit, highway, resort, rural health care and recreation taxes on top depending on the area. Groceries are the exception that keeps things simple: grocery food pays a ${rate(g)} state rate, and with the two option taxes the total is ${rate(groceryAll)} in every corner of the state, since other local taxes do not apply to it. Clothing has no break, prescription drugs are exempt, and there is no sales tax holiday. Since January 1, 2026, food made or heated to order at grocery stores, convenience stores and gas stations also pays the county restaurant tax. Property tax is moderate. Owners paid a median ${usd(C.medianTax)} in 2024 on homes worth a median ${usd(C.medianValue)}, according to the Census, an effective ${eff(C.effectiveRate)} ranked ${effRank} of 51. The reason is the primary residential exemption, which removes ${exempt}% of a lived-in home's market value.`,
  sales: (h) => `<p>Every Utah rate is built in layers, and the bottom ones are universal. The ${h.rate(S.stateRate)} state tax, the ${h.rate(LOCAL_OPTION)} local option and the ${h.rate(COUNTY_OPTION)} county option apply everywhere, so ${h.rate(S.stateRate + floor)} is the least anyone pays on general goods. From there, each city and county adds the special taxes it has adopted, such as a resort community tax of up to 1.60% or a public transit tax of up to 0.30%, with no single statewide cap. A ${h.usd(1400)} mountain bike costs ${h.usd(bike.tax, 2)} in tax at the floor rate; the Tax Commission's TAP lookup gives the exact local total, and changes take effect only at the start of a calendar quarter.</p>
<p>Food bought to cook at home follows a separate, flat schedule. The state's ${h.rate(g)} plus the two option taxes come to ${h.rate(groceryAll)}, and no resort, transit or other local tax is added, so a ${h.usd(200)} grocery bill pays ${h.usd(cart.tax, 2)} in a resort town or a rural county alike, against ${h.usd(cartFull.tax, 2)} if it were taxed as general merchandise at the floor rate. Choose "Groceries" in the calculator and enter ${h.num(floor, 2)} as the local rate to reproduce it. Home heating fuel has its own reduced state rate of ${h.rate(fuel)}.</p>
<p>The restaurant line moved in 2026. All counties impose a restaurant tax on top of sales tax, and since January 1 it also reaches food prepared or heated at a customer's request in grocery stores, convenience stores and gas stations (SB 91, 2025). Resort community taxes do not apply to cars, boats, aircraft or manufactured homes.</p>`,
  property: (h) => `<p>County assessors value property at market value as of January 1 each year, and the county treasurer collects for the county, cities, school districts and special districts. Neither the state nor the federal government receives any of it. The decisive rule is the primary residential exemption: ${h.num(exempt)}% of a qualifying home's market value, with up to one acre of land, is exempt, so only ${h.num(taxedShare)}% is taxed. On the Census median home of ${h.usd(v)}, that leaves ${h.usd((v * taxedShare) / 100)} of taxable value. A cabin or vacation home of the same value is taxed on the full ${h.usd(v)}, nearly double the base.</p>
<p>The exemption follows occupancy rather than ownership. A rental used as someone's full-time home qualifies, as long as the owner or a full-time tenant lives there at least 183 consecutive days a year, and only one exemption is allowed per household anywhere in Utah. The county assessor handles it and may ask for a signed declaration. Furniture and home furnishings are never taxed as property. Run a ${h.usd(480000)} house through the Census ratio of ${h.eff(C.effectiveRate)} and the result is close to ${h.usd(ptx('utah', 480000))} a year.</p>
<p>Bills become delinquent if unpaid on November 30, with a penalty of 2.5% or $10 per parcel, cut to 1% or $10 if paid by January 31. For owners aged 67 or older or surviving spouses with 2025 household income under $44,221, the county can abate up to $1,412 and add a credit; apply by September 1.</p>`,
  faqs: [
    { q: 'What is the sales tax on groceries in Utah?', a: `${rate(groceryAll)} in total, everywhere in Utah. Grocery food pays a ${rate(g)} state rate plus the ${rate(LOCAL_OPTION)} local option and ${rate(COUNTY_OPTION)} county option taxes, and no other local tax applies to it. A ${usd(200)} grocery bill owes ${usd(cart.tax, 2)}. Prepared food is different: it pays the full rate plus the county restaurant tax, which since January 1, 2026 also covers food heated to order at convenience stores and gas stations.` },
    { q: `Does my Utah rental property get the ${exempt}% exemption?`, a: `Only if it is someone's primary home. Utah's primary residential exemption removes ${exempt}% of market value when the owner or a full-time tenant occupies the home as a primary domicile for at least 183 consecutive days a year, with up to one acre of land. A long-term rental qualifies; a cabin, vacation home or nightly rental does not and is taxed on its full value. Only one exemption is allowed per household.` },
    { q: 'What is the lowest sales tax rate anywhere in Utah?', a: `${rate(S.stateRate + floor)} on general goods. Utah's ${rate(S.stateRate)} state rate is joined everywhere by a ${rate(LOCAL_OPTION)} local option tax and a ${rate(COUNTY_OPTION)} county option tax, and most places add more for transit, highways, resort communities or rural health care. Groceries are the exception at ${rate(groceryAll)} in all. Look up an exact address with the Tax Commission's TAP tool before entering the local part in the calculator.` },
  ],
  related: ['idaho', 'nevada', 'colorado', 'arizona', 'grocery-sales-tax-by-state', 'homestead-exemption-by-state'],
});
