import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('minnesota');
const S = s.sales, C = s.census;
// Retail delivery fee and class rates for taxes payable in 2026: figures in the text fields of the facts.
const fee = 0.5, feeFloor = 100;
const hsLow = 1, hsHigh = 1.25, hsBreak = 500000;
const nonHs = 1.25;
const blindRate = 0.45, blindBase = 50000;
const incomeLimit = 142490;
const coat = tx('minnesota', 320, 'clothing');
const bag = tx('minnesota', 140);
const vitamins = tx('minnesota', 30);
const home = 620000;
const capacity = (Math.min(home, hsBreak) * hsLow) / 100 + (Math.max(0, home - hsBreak) * hsHigh) / 100;
const capacityRental = (home * nonHs) / 100;
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'minnesota',
  title: `Minnesota Sales Tax 2026: ${rate(S.stateRate)} Rate, Clothing Tax Free`,
  description: `Minnesota sales tax in 2026: ${rate(S.stateRate)} plus city and county taxes, clothing exempt with no price cap, a 50-cent delivery fee, and homes taxed at a ${hsLow}% class rate.`,
  intro: `A high state rate on what is taxed and a long list of what is not, from winter coats to cough syrup, then a property tax that works through class rates and refunds.`,
  resume: `Minnesota's ${rate(S.stateRate)} state rate is among the higher ones, but its base leaves out things most states tax: clothing suitable for everyday wear is exempt at any price, so a ${usd(320)} winter coat costs ${usd(coat.tax)} in tax, and over-the-counter drugs are exempt along with prescriptions. Groceries are exempt too, while candy, soft drinks, vitamins and prepared food are taxed. Cities and counties, many of them in the Twin Cities metro area, add general local taxes, and some add special local taxes on lodging, liquor, entertainment or restaurant food. Deliveries of ${usd(feeFloor)} or more of taxable goods or clothing carry a 50-cent retail delivery fee. There is no sales tax holiday. On property, a home's market value is multiplied by a class rate to get its tax capacity: ${hsLow}% on the first ${usd(hsBreak)} for a homestead, ${hsHigh}% above, and homesteads escape the State General Tax. The median bill reported by the Census is ${usd(C.medianTax)}, rank ${billRank} of 51, on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)} of value. The Homestead Credit Refund, filed on Form M1PR, returns part of the tax to households under ${usd(incomeLimit)} of income.`,
  sales: (h) => `<p>The clothing exemption is broad and simple: there is no price cap and no per-item test. A ${h.usd(320)} parka, a suit or a pair of boots is sold without state or local tax. The exemption stops at accessories and gear: a ${h.usd(140)} backpack or handbag is taxed, ${h.usd(bag.stateTax, 2)} at the state rate before any local tax, and so are jewelry, cosmetics, protective equipment and sports gear not suitable for general use. Medicine is handled just as generously, since nonprescription drugs are exempt like prescriptions, but vitamins and minerals count as dietary supplements and pay tax: ${h.usd(vitamins.stateTax, 2)} on a ${h.usd(30)} bottle.</p>
<p>Local taxes come in two kinds. General local sales taxes are levied by a number of cities and counties, many of them in the Twin Cities metro area, and the Department of Revenue collects most of them alongside the state tax. Special local taxes target admissions, entertainment, food and beverages, liquor and lodging, and a few are collected by the city or county itself. The department's sales tax rate calculator returns the combined general rate for an address; enter the part above ${h.rate(S.stateRate)} in the calculator above. Liquor, cannabis, motor vehicles, short-term car rentals and manufactured homes have special state rates of their own.</p>
<p>The retail delivery fee is separate from the tax. A delivery to a Minnesota address that includes ${h.usd(feeFloor)} or more of taxable items or clothing carries a flat ${h.usd(fee, 2)}, once per delivery, whatever the order's size. Purchases on which no Minnesota tax was charged owe use tax at the same state and local rates.</p>`,
  property: (h) => `<p>Minnesota does not tax a home's value directly. The county assessor sets market value, a class rate turns it into net tax capacity, and the local levies of counties, cities, towns, school districts and special districts are spread over that capacity. For taxes payable in 2026, a residential homestead in class 1a pays ${h.num(hsLow, 2)}% on the first ${h.usd(hsBreak)} of value and ${h.num(hsHigh, 2)}% above, while a rental house of one to three units pays ${h.num(nonHs, 2)}% on all of it. A ${h.usd(home)} home therefore has a tax capacity of ${h.usd(capacity)} if the owner lives in it and ${h.usd(capacityRental)} if it is rented out. Homesteads are also exempt from the State General Tax, which falls on commercial, industrial and seasonal recreational property. Blind or disabled owners get class 1b, at ${h.num(blindRate, 2)}% on the first ${h.usd(blindBase)}.</p>
<p>The homestead classification is not automatic: apply with the county assessor after buying. After the bill comes the refund. The regular Homestead Credit Refund requires 2025 household income under ${h.usd(incomeLimit)} and ownership and occupancy on January 2, 2026. The special refund ignores income and pays when net property tax rose more than 12%, and by at least $100, from 2025 to 2026. Both are claimed on Form M1PR with the Department of Revenue. A 2026 law raised 2025 homeowner refunds by nearly 15%, applied automatically to returns filed before July 15, 2026. Renters now claim the Renter's Credit on the income tax return instead.</p>
<p>For a rough figure, the statewide median ratio of ${h.eff(C.effectiveRate)} on a ${h.usd(C.medianValue)} home works out to about ${h.usd(ptx('minnesota', C.medianValue))} a year, effective-rate rank ${effRank} of 51. Seniors can also defer part of their tax through the state deferral program.</p>`,
  faqs: [
    { q: 'Is a winter coat taxed in Minnesota?', a: `No. Minnesota exempts clothing suitable for general use with no price limit, so a coat, boots or a suit carries neither the ${rate(S.stateRate)} state tax nor local sales tax. The exemption does not cover accessories such as backpacks, handbags and jewelry, nor protective equipment or sports gear that is not suitable for everyday wear. Those are taxed at the state rate plus any local rate.` },
    { q: 'What is the 50-cent delivery fee in Minnesota?', a: `It is the retail delivery fee: a flat ${usd(fee, 2)} charged on a delivery to a Minnesota address when the taxable items and clothing in it total ${usd(feeFloor)} or more. It applies once per delivery, not per item, and it is separate from the ${rate(S.stateRate)} sales tax. Groceries and other exempt goods do not count toward that ${usd(feeFloor)} total.` },
    { q: 'Who qualifies for the Minnesota homestead credit refund?', a: `Homeowners whose 2025 household income was under ${usd(incomeLimit)} and who owned and lived in the home on January 2, 2026 can claim the regular refund on Form M1PR. A special refund is open at any income when net property tax rose more than 12%, and at least $100, from 2025 to 2026. The home must be classified as a homestead with the county.` },
  ],
  related: ['wisconsin', 'iowa', 'north-dakota', 'south-dakota', 'clothing-sales-tax-by-state', 'property-tax-by-state'],
});
