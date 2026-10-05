import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('hawaii');
const S = s.sales, C = s.census;
const surcharge = S.local.cap ?? 0;
const retail = S.stateRate + surcharge;
const passOn = 4.712;
const wholesale = S.otherRates?.[0]?.rate ?? 0;
const tat = S.otherRates?.[2]?.rate ?? 0;
const tatOld = 10.25;
const groceries = tx('hawaii', 250, 'groceries', surcharge);
const surf = 600;
const room = 380;
const credit = 220;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'hawaii',
  title: `Hawaii Sales Tax 2026: ${rate(S.stateRate)} General Excise Tax, ${rate(passOn)} Max`,
  description: `Hawaii has no sales tax in 2026 but a ${rate(S.stateRate)} General Excise Tax on businesses, a ${rate(surcharge)} county surcharge, groceries taxed, and the lowest property tax ratio (${eff(C.effectiveRate)}).`,
  intro: `What visitors call Hawaii's sales tax is a General Excise Tax on the seller's gross receipts, and it reaches the grocery bill and the surf lesson alike.`,
  resume: `Hawaii does not levy a sales tax. It levies a General Excise Tax (GET) of ${rate(S.stateRate)} on the gross receipts of businesses, for retail sales and most services, and all four counties, Honolulu, Hawaii, Kauai and Maui, add a ${rate(surcharge)} surcharge, bringing retail activity to ${rate(retail)}. The tax falls on the business, which may pass it on visibly but is not required to; because the amount passed on is itself part of gross receipts, the highest rate a seller can show is ${rate(passOn)}. GET is broader than most sales taxes: groceries are taxed, with only SNAP and WIC purchases deductible, and services are taxed like goods. Prescription drugs are exempt. Property tax belongs to the counties alone and is the lightest in the country relative to home values: the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51.`,
  sales: (h) => `<p>Because GET is a tax on the business, the line on a Hawaii receipt is a cost the seller chooses to show, not a tax the buyer owes. A shop that sells a ${h.usd(100)} item owes ${h.rate(retail)} on everything it takes in, including the tax it collects. If it passes the full burden on, it charges ${h.usd(100 * passOn / 100, 2)}, because ${h.rate(retail)} of ${h.usd(100 + passOn, 2)} comes back to that amount. That is why a receipt can show ${h.rate(passOn)} rather than ${h.rate(retail)}, and why a seller may legally charge less or show nothing at all.</p>
<p>The base is wide. Groceries are taxed: a ${h.usd(250)} grocery run carries ${h.usd(groceries.tax, 2)} at ${h.rate(retail)} before any pass-on gross-up, and only purchases paid with SNAP or WIC benefits are deductible. Low-income residents can claim the refundable Food/Excise Tax Credit on their income tax return, up to ${h.usd(credit)} per exemption when adjusted gross income is under $15,000. Services are taxed like goods, so a ${h.usd(surf)} surfing course owes the same ${h.usd(surf * retail / 100)} as a ${h.usd(surf)} surfboard. Even sales to nonprofits and churches are generally taxable, since the tax falls on the seller. Wholesalers pay a reduced ${h.rate(wholesale)}, and no county surcharge applies to activities taxed at that rate.</p>
<p>Hotel stays carry a second state tax. The Transient Accommodations Tax rose from ${h.rate(tatOld)} to ${h.rate(tat)} on January 1, 2026, so a ${h.usd(room)} night owes ${h.usd(room * tat / 100, 2)} of TAT plus the GET. The county surcharges, Honolulu's since 2007 and Maui's since January 1, 2024, are authorized through December 31, 2030. Goods and services imported for use in Hawaii without GET owe use tax at the same rates.</p>`,
  property: (h) => `<p>In Hawaii, the state constitution hands real property taxation entirely to the counties. Under Article VIII, section 3, Honolulu, Hawaii, Kauai and Maui counties each set their own valuation methods, property classes, tax rates, exemptions and due dates, and the state levies nothing. Kalawao County is the one exception and plays no such role. A home on Kauai and a home of the same value in Honolulu can therefore face different classes, rates and exemptions, and nothing on this page can stand in for the county's own rate table.</p>
<p>The Census figures show how light the burden is relative to prices. The median owner-occupied home was worth ${h.usd(C.medianValue)} in 2024, yet the median tax was ${h.usd(C.medianTax)}, ranked ${billRank} of 51 by bill, an effective rate of ${h.eff(C.effectiveRate)}. Unusually, owners without a mortgage paid slightly more at the median, ${h.usd(C.medianTaxNoMortgage)}, than owners with one, ${h.usd(C.medianTaxWithMortgage)}. At the typical ratio, a ${h.usd(900000)} house pays about ${h.usd(ptx('hawaii', 900000))} a year and a ${h.usd(1500000)} one about ${h.usd(ptx('hawaii', 1500000))}, though a higher-value home may fall into a different county class.</p>
<p>There is no statewide homestead exemption. Each county grants its own home exemption to owner-occupants, with larger amounts for older owners in some counties. In Honolulu, claims go to the Real Property Assessment Division, and the deadline it currently shows is June 30, 2027; owners whose home is assessed around $1 million or more can also find information there on the Residential A class. Owners on the other islands apply to their own county.</p>`,
  faqs: [
    { q: 'Why is Hawaii sales tax 4.712% on my receipt?', a: `Because Hawaii's tax is a General Excise Tax on the seller, and the amount the seller passes on is itself part of its taxable receipts. With the ${rate(S.stateRate)} state rate and the ${rate(surcharge)} county surcharge, the business owes ${rate(retail)} on everything it takes in; grossing that up gives a maximum visible pass-on rate of ${rate(passOn)}. Sellers may charge less, or nothing, since the tax is theirs.` },
    { q: 'Are groceries taxed in Hawaii?', a: `Yes. Hawaii's General Excise Tax applies to food at ${rate(S.stateRate)} plus the ${rate(surcharge)} county surcharge; only purchases paid with SNAP or WIC benefits are deductible. To offset it, residents with low incomes can claim the refundable Food/Excise Tax Credit on their state income tax return, worth up to ${usd(credit)} per exemption for adjusted gross income under $15,000.` },
    { q: 'How much is the hotel tax in Hawaii in 2026?', a: `The state Transient Accommodations Tax is ${rate(tat)} since January 1, 2026, up from ${rate(tatOld)} under Act 96 of 2025, and the General Excise Tax applies to the room as well. On a ${usd(room)} night, the TAT alone is ${usd(room * tat / 100, 2)}. The law also extended TAT to cruise fares, but a court has blocked its enforcement on cruise ships.` },
  ],
  related: ['alaska', 'california', 'oregon', 'washington', 'sales-tax-by-state', 'grocery-sales-tax-by-state'],
});
