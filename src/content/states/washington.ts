import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day } from '../../lib/kit';

const s = st('washington');
const S = s.sales, C = s.census;
const services = S.scheduledChanges?.find((c) => c.rate == null);
const servicesDate = services?.date ?? s.verified;
const rental = S.scheduledChanges?.find((c) => c.date.startsWith('2027'));
const mvExtra = S.otherRates?.[0]?.rate ?? 0;
const lux = S.otherRates?.[1]?.rate ?? 0;
const carRental = S.otherRates?.[2]?.rate ?? 0;
// Luxury vehicle tax applies above $100,000 of price, as written in the Department of Revenue note.
const LUX_FLOOR = 100000;
const car = 130000;
const carLux = ((car - LUX_FLOOR) * lux) / 100;
const carExtra = (car * mvExtra) / 100;
const site = tx('washington', 6000);
// Constitutional limit on regular levies: 1% of market value, $10 per $1,000.
const LIMIT = 0.01;
const v = C.medianValue;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'washington',
  title: `Washington Sales Tax 2026: ${rate(S.stateRate)} State, Services Now Taxed`,
  description: `Washington sales tax in 2026: ${rate(S.stateRate)} state plus local rates by address, business services taxed since ${day(servicesDate)}, and an ${rate(lux)} luxury tax on cars over ${usd(LUX_FLOOR)}.`,
  intro: `A destination-based sales tax that reached business services in October 2025, car taxes that rose in January 2026, and regular property levies capped at 1% of value.`,
  resume: `Washington's state retail sales tax is ${rate(S.stateRate)}, and cities, counties, transit authorities and other districts add a local rate that depends on where the buyer takes delivery, so the address decides the total. The base widened on ${day(servicesDate)}: under ESSB 5814, advertising, IT support and consulting, custom websites and software, security and investigation services, temporary staffing and live presentations became taxable, joining consumer services like repairs and cleaning that were already taxed. Groceries and prescription drugs are exempt, though bottled water and soft drinks are not; clothing has no break, and there is no holiday. Cars carry extra layers since January 1, 2026: a ${rate(mvExtra)} motor vehicle tax and an ${rate(lux)} luxury tax on the part of a price above ${usd(LUX_FLOOR)}. Property tax combines a state school levy with local levies; the Census median bill was ${usd(C.medianTax)} in 2024, ranked ${billRank} of 51, on a ${usd(C.medianValue)} home, an effective ${eff(C.effectiveRate)}, ranked ${effRank} of 51, because home values are high.`,
  sales: (h) => `<p>October 1, 2025 changed who collects in Washington. Agencies selling advertising, IT firms providing support or consulting, studios building custom websites or software, security companies and staffing agencies now add retail sales tax to their invoices. A ${h.usd(6000)} website project carries ${h.usd(site.stateTax, 2)} of state tax before the local rate of the client's location is added. Telehealth and telemedicine, by contrast, are now explicitly excluded. For freelancers and small agencies the practical step is to check whether a service sits on the Department of Revenue's list and then to charge the rate of the place where the customer receives it.</p>
<p>Washington is destination-based for goods and services alike. The Department's tax rate lookup returns the combined rate for an address; subtract ${h.rate(S.stateRate)} and type the rest into the calculator above. Groceries are exempt, but the food definition leaves out prepared meals, soft drinks, bottled water and dietary supplements.</p>
<p>Vehicles are where 2026 hit hardest. The additional motor vehicle tax rose from 0.3% to ${h.rate(mvExtra)} on January 1, and a new ${h.rate(lux)} luxury tax applies to the slice of a price above ${h.usd(LUX_FLOOR)}, a threshold raised 2% each July 1. On a ${h.usd(car)} car with no trade-in, that is ${h.usd(carLux)} of luxury tax and ${h.usd(carExtra)} of additional motor vehicle tax, on top of regular sales tax. Car rentals pay an extra ${h.rate(carRental)} through December 31, 2026${rental?.rate != null ? `, falling to ${h.rate(rental.rate)} from ${h.day(rental.date)}` : ''}.</p>`,
  property: (h) => `<p>County assessors value property at 100% of true and fair market value, judged by its highest and best use, and the county treasurer collects for the state school levy and for counties, cities, school districts, fire and library districts. Two limits shape every bill. The state constitution caps regular, non-voted levies at 1% of market value, ${h.usd(10)} per ${h.usd(1000)}: on the Census median home of ${h.usd(v)}, those levies together can never exceed ${h.usd(v * LIMIT)}. Voter-approved levies, such as school or fire measures, come on top. And each taxing district may raise its regular levy by only 1% a year plus new construction, so rising values spread a fixed levy rather than inflate it.</p>
<p>For a ${h.usd(500000)} house, the Census ratio of ${h.eff(C.effectiveRate)} implies roughly ${h.usd(ptx('washington', 500000))} a year. The bill is split: the first half is due April 30 and the second October 31, with taxes under $50 paid in full by April 30. Late taxes accrue 1% interest a month, and a 3% penalty is added if still unpaid on June 1.</p>
<p>No homestead exemption exists for every owner; relief depends on income. Owners aged 61 or older, retired because of disability, or veterans rated 80% or more disabled, whose combined disposable income is at or below their county's Income Threshold 3, can claim an exemption from the county assessor, renewed at least every six years. Owners 60 or older or disabled can defer tax at 5% simple interest, and owners of five years with combined disposable income of $57,000 or less can defer the October half by applying before September 1.</p>`,
  faqs: [
    { q: 'Which services became taxable in Washington in 2025?', a: `Since ${day(servicesDate)}, under ESSB 5814, Washington's ${rate(S.stateRate)} state retail sales tax plus local tax applies to advertising, IT support and consulting, custom website development, custom software, security and investigation services, temporary staffing and live presentations. A ${usd(6000)} website project now carries ${usd(site.stateTax, 2)} of state tax before local tax. Telehealth and telemedicine are specifically excluded. Consumer services such as repairs and cleaning were already taxable.` },
    { q: 'How much is the luxury car tax in Washington State?', a: `${rate(lux)} of the part of a vehicle's price above ${usd(LUX_FLOOR)}, since January 1, 2026, and that threshold rises 2% each July 1. It is added to regular sales tax and to the ${rate(mvExtra)} additional motor vehicle tax. On a ${usd(car)} car with no trade-in, the luxury tax is ${usd(carLux)} and the additional motor vehicle tax ${usd(carExtra)}.` },
    { q: 'When is property tax due in Washington State?', a: `The first half is due April 30 and the second half October 31. If the year's tax is under $50, pay it all by April 30. Late taxes accrue 1% interest per month, and a 3% penalty is added on the amount still delinquent on June 1. Owners of five years with combined disposable income of $57,000 or less can defer the October half by applying before September 1.` },
  ],
  related: ['oregon', 'idaho', 'california', 'use-tax', 'local-sales-tax-rates'],
});
