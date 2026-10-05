import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, dayShort } from '../../lib/kit';

const s = st('tennessee');
const S = s.sales, C = s.census, PR = s.property;
const hol = S.holidays2026?.[0];
const localCap = S.local.cap ?? 0;
const single = S.otherRates?.[0]?.rate ?? 0;
const digital = S.otherRates?.[2]?.rate ?? 0;
// Single article bands, as written in the Department of Revenue notice: local tax on the first $1,600, state single article tax from $1,600 to $3,200.
const BAND1 = 1600, BAND2 = 3200;
const bigTicket = (price: number, local: number) => {
  const state = (price * S.stateRate) / 100;
  const loc = (Math.min(price, BAND1) * local) / 100;
  const sat = (Math.max(0, Math.min(price, BAND2) - BAND1) * single) / 100;
  return { state, loc, sat, total: state + loc + sat };
};
const fridge = 5000;
const f = bigTicket(fridge, localCap);
const cart = tx('tennessee', 200, 'groceries', localCap);
const ratio = PR.assessment?.ratio ?? 0;
// Commercial and industrial ratio, as written in the Comptroller's assessment note.
const COMMERCIAL = 40;
const v = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'tennessee',
  title: `Tennessee Sales Tax 2026: ${rate(S.stateRate)} State, ${rate(S.groceries.rate ?? 0)} on Groceries`,
  description: `Tennessee sales tax in 2026: ${rate(S.stateRate)} state rate, ${rate(S.groceries.rate ?? 0)} on groceries, local tax up to ${rate(localCap)} on the first ${usd(BAND1)} of an item, and homes assessed at ${ratio}% of their value.`,
  intro: `High sales tax with a built-in brake on expensive items, a reduced but real grocery tax, and property tax bills among the lowest in the country.`,
  resume: `Tennessee charges ${rate(S.stateRate)} state sales tax on most goods and taxable services, and counties and some cities add a local rate of up to ${rate(localCap)}, so the combined rate can reach ${rate(S.stateRate + localCap)}. Two rules soften that headline. Food and food ingredients pay a reduced ${rate(S.groceries.rate ?? 0)} state rate, though the full local rate still applies, and prepared food, candy and supplements pay ${rate(S.stateRate)}. On a single expensive item, local tax stops after the first ${usd(BAND1)} of the price, and a ${rate(single)} state single article tax covers only the slice from ${usd(BAND1)} to ${usd(BAND2)}. A late-July weekend removes the tax on clothing and school supplies up to $100 and computers up to $1,500. Property tax is light. The 2024 Census median was ${usd(C.medianTax)} a year for a ${usd(C.medianValue)} home, an effective ${eff(C.effectiveRate)} and a rank of ${effRank} of 51, because homes are assessed at ${ratio}% of appraised value. There is no general homestead exemption; help goes to seniors, disabled owners and veterans.`,
  sales: (h) => `<p>The single article rule is what makes Tennessee different, and it matters most for appliances, furniture and electronics. The ${h.rate(S.stateRate)} state rate applies to the whole price. The local rate, at most ${h.rate(localCap)}, applies to the first ${h.usd(BAND1)} only. Between ${h.usd(BAND1)} and ${h.usd(BAND2)}, a state single article tax of ${h.rate(single)} takes the local tax's place, and above ${h.usd(BAND2)} nothing extra is added. A ${h.usd(fridge)} riding mower in a county at the ${h.rate(localCap)} cap owes ${h.usd(f.state, 2)} of state tax, ${h.usd(f.loc, 2)} of local tax and ${h.usd(f.sat, 2)} of single article tax: ${h.usd(f.total, 2)}, an effective ${h.num((f.total / fridge) * 100, 2)}% instead of the ${h.rate(S.stateRate + localCap)} a flat calculation would give. The single article rate is the same in every county, whatever the local rate. The calculator above applies the local rate to the whole price, so for an item over ${h.usd(BAND1)} use the breakdown here instead.</p>
<p>Groceries are taxed, just at a lower state rate. A ${h.usd(200)} cart in a county at the cap owes ${h.usd(cart.stateTax, 2)} to the state and ${h.usd(cart.localTax, 2)} locally. The definition of food is strict: a hot meal, candy, dietary supplements, alcohol and tobacco all pay ${h.rate(S.stateRate)}, and over-the-counter medicine is taxed unless bought on a prescription. Digital movies, books and music carry a fixed ${h.rate(digital)} local rate wherever the buyer lives.</p>
<p>The ${hol ? `${dayShort(hol.start)} to ${h.day(hol.end)}` : 'late-July'} holiday has a strict price test: an item over its limit is taxed on the whole price, with no partial exemption. A $101 jacket pays full tax that weekend.</p>`,
  property: (h) => `<p>Tennessee taxes a fixed share of value set in state law: residential and farm property is assessed at ${h.num(ratio)}% of appraised value, commercial and industrial property at ${h.num(COMMERCIAL)}%. County assessors appraise, counties and cities each set a rate per ${h.usd(100)} of assessed value, and the county trustee collects. On the Census median home of ${h.usd(v)}, the assessment is ${h.usd((v * ratio) / 100)}; each ${h.usd(1)} of combined rate per ${h.usd(100)} adds ${h.usd((v * ratio) / 100 / 100)} to the bill. Even a ${h.usd(450000)} house comes to roughly ${h.usd(ptx('tennessee', 450000))} a year at the Census ratio of ${h.eff(C.effectiveRate)}.</p>
<p>Real property is reappraised county by county on a four, five or six-year cycle, while personal property is revalued yearly. Appeals go to the county board of equalization, which begins meeting on June 1 (May 1 in Shelby County). Bills fall due on the first Monday in October, and the last day to pay without interest is the end of February.</p>
<p>Tennessee offers no homestead exemption for every owner. The state Tax Relief program pays part of the bill for owners 65 or older or disabled with 2025 income of $38,470 or less, calculated on up to $33,600 of market value, and for qualifying disabled veterans on up to $175,000. The Property Tax Freeze, available only where the county or city has adopted it, locks the tax on a senior's home at its current level. Both programs are claimed through the county trustee, up to 35 days after the local delinquency date.</p>`,
  faqs: [
    { q: 'What is the single article tax in Tennessee?', a: `A ${rate(single)} state tax on the part of one item's price between ${usd(BAND1)} and ${usd(BAND2)}. Tennessee's local sales tax applies only to the first ${usd(BAND1)} of a single article, so this state tax replaces it on the next slice. The ${rate(S.stateRate)} state rate still covers the full price. On a ${usd(fridge)} item in a county charging ${rate(localCap)}, total tax is ${usd(f.total, 2)}.` },
    { q: 'How much is sales tax on food in Tennessee?', a: `${rate(S.groceries.rate ?? 0)} state tax plus the full local rate, which is up to ${rate(localCap)}. A ${usd(200)} grocery bill can therefore carry ${usd(cart.tax, 2)}. The reduced rate covers food and food ingredients only: prepared food, candy, dietary supplements, alcohol and tobacco are taxed at the general ${rate(S.stateRate)} state rate plus local tax, the same as general merchandise.` },
    { q: 'Who qualifies for property tax relief in Tennessee?', a: `Owners aged 65 or older or disabled with 2025 income of $38,470 or less, whose relief is calculated on up to $33,600 of market value, and qualifying disabled veterans or their surviving spouses, on up to $175,000 with no income limit stated. Seniors may also get a tax freeze if their county or city adopted it. Apply with the county trustee within 35 days after the local delinquency date.` },
  ],
  related: ['kentucky', 'georgia', 'north-carolina', 'alabama', 'grocery-sales-tax-by-state', 'local-sales-tax-rates'],
});
