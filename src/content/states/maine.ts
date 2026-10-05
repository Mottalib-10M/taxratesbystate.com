import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day } from '../../lib/kit';

const s = st('maine');
const S = s.sales, C = s.census, PR = s.property, HS = s.property.homestead;
const O = S.otherRates ?? [];
const meals = O[0]?.rate ?? 0, lodging = O[1]?.rate ?? 0, carRental = O[2]?.rate ?? 0, cannabis = O[3]?.rate ?? 0;
const cannabisBefore = 10; // former adult use cannabis rate, written in the note
const dinner = 90;
const stay = 450;
const kayak = tx('maine', 800);
const hs = HS.amount ?? 0;
const townRatio = 90; // an example town assessing at 90% of just value
const vet = 6000, blind = 4000; // otherRelief text
const home = 375000;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'maine',
  title: `Maine Sales Tax 2026: ${rate(S.stateRate)} Goods, ${rate(meals)} Meals, ${rate(lodging)} Lodging`,
  description: `Maine sales tax in 2026: ${rate(S.stateRate)} on goods with no local tax, ${rate(meals)} on meals, ${rate(lodging)} on rooms, streaming newly taxed, and a ${usd(hs)} homestead exemption from your town.`,
  intro: `One state tax and no local add-on, but a separate rate for meals, rooms, car rentals and cannabis, and a property tax run town by town.`,
  resume: `Maine has a single state sales tax with several rates rather than a single rate with local add-ons. Goods pay ${rate(S.stateRate)}, unchanged since ${S.effectiveSince ? day(S.effectiveSince) : 'October 1, 2013'}, and no town or county adds anything. Prepared food and drinks in licensed places pay ${rate(meals)}, rooms ${rate(lodging)}, short car rentals ${rate(carRental)}, and adult use cannabis ${rate(cannabis)} since January 1, 2026. Grocery staples and prescription drugs are exempt, clothing is taxed, and there is never a holiday: a Maine retailer may not even advertise one or offer to absorb the tax. The 2026 changes run in both directions, with streaming video and music now taxed and home medical equipment newly exempt. Property tax is collected by 482 municipalities on the value their assessors set every April 1. The Census median is ${usd(C.medianTax)}, rank ${billRank} of 51, on a ${usd(C.medianValue)} home, a ratio of ${eff(C.effectiveRate)} that ranks ${effRank}. Owners who have held a Maine home for 12 months can claim up to ${usd(hs)} of value exempt by applying to their town by April 1.`,
  sales: (h) => `<p>Because Maine's tax is purely a state tax, a receipt on the coast and a receipt in a small inland town are computed the same way. What changes the bill is the kind of purchase. An ${h.usd(800)} kayak pays the general ${h.rate(S.stateRate)}, ${h.usd(kayak.stateTax, 2)}. A ${h.usd(dinner)} restaurant dinner pays ${h.rate(meals)}, ${h.usd((dinner * meals) / 100, 2)}, and the same rate covers alcohol served on the premises. Three nights at ${h.usd(stay)} in an inn or a rental cottage pay the ${h.rate(lodging)} lodging rate, ${h.usd((stay * lodging) / 100, 2)}, and a rental car for a week pays ${h.rate(carRental)}. Since there is no local part, leave the local rate in the calculator at zero.</p>
<p>The tax base moved on January 1, 2026. Maine repealed its separate Service Provider Tax, so cable, satellite and telecommunications services now sit inside the ${h.rate(S.stateRate)} sales tax, and streaming video and music subscriptions became taxable at the same rate. Adult use cannabis went from ${h.rate(cannabisBefore)} to ${h.rate(cannabis)}, while medical cannabis stays at ${h.rate(S.stateRate)}. In the other direction, durable medical equipment, breast pumps and mobility equipment for home use became exempt.</p>
<p>On food, the line is drawn at "grocery staples": they are exempt, while candy and confections, confectionery spreads included, soft drinks and prepared food are taxed, the last at ${h.rate(meals)}. Every new tire and new lead-acid battery carries a $1.00 recycling fee in addition to the tax. Goods bought from sellers that did not charge Maine tax owe use tax directly to the State at the rate that would have applied.</p>`,
  property: (h) => `<p>Maine's property tax is a municipal tax. Each of the 482 municipalities assesses property at "just value" as of April 1 and sends one bill that also carries the county and school shares; payment dates are set by the town. Where no town exists, in the Unorganized Territory, Maine Revenue Services acts as the assessor. Each year the state also measures every municipality against actual sales to set its state valuation, the equalized figure used to share out school aid, revenue sharing and county taxes.</p>
<p>The homestead exemption takes up to ${h.usd(hs)} of just value off a permanent residence, but only after 12 months of owning a home in Maine, and only if you apply to the local assessor by April 1. The figure is adjusted by the town's certified assessment ratio: in a town assessing at ${townRatio}% of just value, the exemption is worth ${h.usd((hs * townRatio) / 100)} of assessed value. With a typical Maine ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(home)} house pays roughly ${h.usd(ptx('maine', home))} a year, and the full exemption trims about ${h.usd(ptx('maine', hs))} from it. Wartime veterans 62 or older or fully disabled take off ${h.usd(vet)}, legally blind owners ${h.usd(blind)}, and solar panels are exempt when claimed by the same April 1 deadline.</p>
<p>Two state programs help beyond the bill. The Property Tax Fairness Credit refunds part of the property tax or rent through the Maine income tax return. The State Property Tax Deferral Program pays a qualifying owner's homestead taxes and is repaid, with interest, when the owner leaves the program or the home is sold; 2026 applications closed on April 1. Some towns run their own senior deferral or assistance programs by ordinance.</p>`,
  faqs: [
    { q: 'What is the meals tax in Maine?', a: `Maine taxes prepared food, and alcoholic drinks served in licensed establishments, at ${rate(meals)} instead of the general ${rate(S.stateRate)}. There is no local meals tax on top, so a ${usd(dinner)} dinner carries ${usd((dinner * meals) / 100, 2)} of tax anywhere in the state. Grocery staples are exempt, but candy, soft drinks and prepared food from a store are taxed, prepared food also at ${rate(meals)}.` },
    { q: 'Who can get the Maine homestead exemption?', a: `Any owner who has owned homestead property in Maine for at least 12 months and lives in the home as a permanent residence on April 1. It exempts up to ${usd(hs)} of just value, adjusted by the town's certified assessment ratio. Apply to the local assessor's office no later than April 1; a new owner who has not yet reached 12 months of ownership waits for the following April.` },
    { q: 'Are streaming subscriptions taxed in Maine?', a: `Yes, since January 1, 2026. Maine now taxes digital audiovisual and digital audio services, meaning video and music streaming subscriptions, at the general ${rate(S.stateRate)} sales tax rate. The same date ended the separate Service Provider Tax, so cable, satellite and telecom services moved into the sales tax as well. There is no local sales tax on top of these charges.` },
  ],
  related: ['new-hampshire', 'vermont', 'massachusetts', 'homestead-exemption-by-state', 'sales-tax-by-state'],
});
