import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('west-virginia');
const S = s.sales, C = s.census, PR = s.property;
const loc = S.local.cap ?? 0;
const hol = S.holidays2026?.[0];
const ratio = PR.assessment?.ratio ?? 0;
const hs = PR.homestead.amount ?? 0;
// Early-payment discount on each half of the bill, as written in the Tax Division's due-date note.
const DISCOUNT = 2.5;
const v = C.medianValue;
const assessed = (v * ratio) / 100;
const assessed65 = Math.max(0, assessed - hs);
const hsMarket = hs / (ratio / 100);
const gear = tx('west-virginia', 140);
const tablet = tx('west-virginia', 480);
const cold = tx('west-virginia', 15, 'general', loc);
const billRank = rank(s, (x) => x.census.medianTax);
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'west-virginia',
  title: `West Virginia Sales Tax 2026: ${rate(S.stateRate)}, Lowest Median Property Tax`,
  description: `West Virginia sales tax in 2026: ${rate(S.stateRate)} state rate, up to ${rate(loc)} city tax, no tax on groceries since 2013, a four-day summer holiday, and a ${usd(C.medianTax)} median property tax.`,
  intro: `A ${rate(S.stateRate)} sales tax that let go of groceries step by step, a summer holiday that even covers sports gear, and the smallest median property tax bill of any state.`,
  resume: `West Virginia's consumers sales and service tax is ${rate(S.stateRate)} statewide, and qualifying municipalities may add a municipal sales tax of up to ${rate(loc)}, collected by the state Tax Division. Food and food ingredients have been untaxed since July 1, 2013, after the state cut its grocery tax from ${rate(S.stateRate)} to 3% in 2008 and 2% in 2012. Prescription drugs are exempt, but over-the-counter medicine is not. Clothing is taxed, except over a four-day holiday in late summer that also covers laptops, school supplies and sports equipment. On property, West Virginia posts the smallest median bill of the 51: ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), ranked ${billRank} of 51, an effective ${eff(C.effectiveRate)}. Every property is assessed at ${ratio}% of value as of July 1, and the state itself takes a small share of the levy alongside counties, school boards and cities. Owners 65 or older or disabled exempt ${usd(hs)} of assessed value, and paying early earns a ${DISCOUNT}% discount.`,
  sales: (h) => `<p>The grocery story explains much of West Virginia's sales tax today. Food once paid the full ${h.rate(S.stateRate)}; the rate dropped to 3% in 2008, to 2% in 2012, and ended after June 30, 2013. A ${h.usd(160)} grocery run now owes nothing to the state. The exemption does not reach the pharmacy shelf: a ${h.usd(15)} box of cold medicine is taxable, ${h.usd(cold.tax, 2)} in a city charging the ${h.rate(loc)} municipal tax, since only drugs dispensed on prescription are exempt.</p>
<p>Local tax is limited to cities. Only municipalities that qualify under state law may levy it, it cannot exceed ${h.rate(loc)}, and the Tax Division administers it and publishes the list of cities that impose it. There is no address lookup; check that list, then add the municipal rate in the calculator above if your city appears. Four developments, Charles Pointe, The Ridges, University Town Center and The Highlands, collect a ${h.rate(S.stateRate)} special district excise tax in place of state sales tax, so shoppers there pay the same rate under another name. A factory-built home used as a year-round principal residence is taxed on half its price.</p>
<p>The ${hol ? `${dayShort(hol.start)} to ${h.day(hol.end)}` : 'summer'} holiday runs Friday to Monday and has its own price limits per item: clothing up to $125, laptops and tablets up to $500, school supplies up to $50, instructional material up to $20, and sports equipment up to $150, an unusual category. ${h.usd(140)} of sports equipment saves ${h.usd(gear.tax, 2)} of state tax; a ${h.usd(480)} tablet saves ${h.usd(tablet.tax, 2)}. Since April 7, 2025, businesses no longer make an accelerated sales tax payment each June.</p>`,
  property: (h) => `<p>Every West Virginia property is assessed each year as of July 1 at ${h.num(ratio)}% of its true and actual value. The Census median home of ${h.usd(v)} is therefore assessed at ${h.usd(assessed)}, and the state constitution sorts property into four classes, each with its own maximum levy rate. County boards of education, county commissions, municipalities and the state all levy on that assessment. With an effective rate of ${h.eff(C.effectiveRate)} (Census), ranked ${effRank} of 51, a ${h.usd(250000)} house would owe about ${h.usd(ptx('west-virginia', 250000))}.</p>
<p>The homestead exemption is reserved for owners aged 65 or older or permanently and totally disabled who live in the home and reside in West Virginia: ${h.usd(hs)} of assessed value, about ${h.usd(hsMarket)} of market value at the ${h.num(ratio)}% ratio. On the median home, it lowers the assessment to ${h.usd(assessed65)}. Apply with the county assessor; the exemption attaches to the home occupied on July 1 and applies to the following tax year.</p>
<p>The calendar rewards punctual owners. The bill is split in two halves, the first due September 1 and the second March 1 of the next year, and each half paid before its due date earns a ${h.num(DISCOUNT, 1)}% discount: on a bill the size of the state median, ${h.usd((C.medianTax * DISCOUNT) / 100, 2)} a year. Late taxes draw 9% interest a year. Cars are taxed as personal property, but the Motor Vehicle Property Tax Adjustment Credit lets owners who paid on time recover that tax on their income tax return.</p>`,
  faqs: [
    { q: 'When did West Virginia stop taxing groceries?', a: `After June 30, 2013. West Virginia taxed food at the full ${rate(S.stateRate)} until 2008, then cut the rate to 3% that year and 2% in 2012 before ending it. Food and food ingredients for human consumption are now exempt, so a ${usd(160)} grocery bill carries no state sales tax. Prescription drugs are exempt as well, but over-the-counter medicines remain taxable at ${rate(S.stateRate)} plus any municipal tax.` },
    { q: 'What is included in the West Virginia sales tax holiday?', a: `${hol ? `In 2026 it ran from ${dayShort(hol.start)} to ${day(hol.end)}, four days from Friday to Monday.` : 'It runs four days, Friday to Monday, around the start of August.'} Clothing up to $125 per item, laptops and tablets up to $500, school supplies up to $50, school instructional material up to $20 and sports equipment up to $150 are exempt from the ${rate(S.stateRate)} sales tax. Each limit applies to a single item, not to the receipt.` },
    { q: 'How much is the homestead exemption in West Virginia?', a: `${usd(hs)} of assessed value, which is about ${usd(hsMarket)} of market value because homes are assessed at ${ratio}%. It is available to West Virginia residents aged 65 or older or permanently and totally disabled who own and occupy the home. Apply with the county assessor; it applies to the home occupied on the July 1 assessment date, for the following tax year. Other homeowners get no general exemption.` },
  ],
  related: ['virginia', 'pennsylvania', 'ohio', 'kentucky', 'grocery-sales-tax-by-state', 'sales-tax-holidays'],
});
