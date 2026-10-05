import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, ptx, rank } from '../../lib/kit';

const s = st('delaware');
const C = s.census, PR = s.property, S = s.sales;
const docFee = S.otherRates?.[0]?.rate ?? 0;
const hotel = S.otherRates?.[1]?.rate ?? 0;
const lease = S.otherRates?.[2]?.rate ?? 0;
const car = 36000;
const stay = 450;
const grtRetail = 0.7468;
const monthly = 400000;
const deduction = 100000;
const seniorMax = PR.homestead.amount ?? 0;
const schoolTax = 1400;
const seniorCredit = Math.min(schoolTax / 2, seniorMax);
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'delaware',
  title: `Delaware Sales Tax 2026: None Statewide, Gross Receipts Tax`,
  description: `Delaware sales tax in 2026: none at state or local level, a gross receipts tax on sellers, a ${rate(docFee)} car document fee, ${rate(hotel)} on hotels, and property tax at ${eff(C.effectiveRate)}.`,
  intro: `Shoppers pay the sticker price in Delaware; the state taxes the store's receipts instead, and the few charges a buyer does see come at the motor vehicle office and the hotel desk.`,
  resume: `Delaware has no sales tax, neither at the state level nor in any city or county, so a ${usd(1000)} television, a pair of shoes or a week of groceries costs exactly the shelf price. The state taxes businesses instead, through a gross receipts tax on their total receipts: general retailers pay 0.7468% after a $100,000 monthly deduction, and the tax is not itemized on the receipt. Buyers meet a few targeted charges: a ${rate(docFee)} document fee when titling a car, an ${rate(hotel)} tax on hotel and motel rooms, and a ${rate(lease)} lessee use tax on leased goods. There is no general use tax and no holiday, since there is nothing to suspend. Property tax is low too: the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51. It is levied by New Castle, Kent and Sussex counties, towns and school districts, with school taxes the largest part.`,
  sales: (h) => `<p>The gross receipts tax explains why Delaware prices carry no tax line. It is a license tax on the business, owed on gross receipts at a rate that depends on the type of activity: 0.7468% for general retailers, 0.3267% for grocery supermarkets, 0.6472% for restaurants and contractors, 0.3983% for services and wholesalers, and 0.0945% to 0.1260% for manufacturers. A retailer with ${h.usd(monthly)} of receipts in a month owes ${h.usd((monthly - deduction) * grtRetail / 100, 2)} after the ${h.usd(deduction)} deduction, which applies once to the whole enterprise. The cost may be built into prices, but it never appears as a percentage on the customer's bill.</p>
<p>The calculator above therefore shows zero for every category bought in Delaware. The charges a resident does pay are narrow. Titling a vehicle costs a document fee of ${h.usd(docFee, 2)} per ${h.usd(100)} of the price above ${h.usd(500)}, a flat $8 under $400 and $13.75 between $400 and $500; on a ${h.usd(car)} car, that comes to roughly ${h.usd(car * docFee / 100)}. A ${h.usd(stay)} hotel weekend adds ${h.usd(stay * hotel / 100)} of state lodging tax, collected from the guest and remitted to the Division of Revenue. Leasing equipment or a vehicle brings a ${h.rate(lease)} lessee use tax on the payments, the only use tax the state applies.</p>
<p>Visitors who shop in Delaware pay no Delaware tax at the counter. If you live in a state that has a sales tax, read how ${h.a('use-tax', 'use tax')} works there before counting the savings, since that rule is set by your home state, not by Delaware.</p>`,
  property: (h) => `<p>Delaware itself levies no property tax. Three counties, New Castle, Kent and Sussex, along with municipalities and school districts, tax real property, and the school district share is the largest on most bills. Property is valued at fair market value as of the base year of the county's most recent general reassessment, not at today's value. State law requires each county to reassess every property at least once every five years, counted from the certification of its last reassessment.</p>
<p>A reassessment does not automatically raise the total collected. School boards must then reset their rates so that revenue does not exceed the previous year's operating revenue plus the growth the law allows. School districts lying entirely in New Castle County may tax nonresidential property at up to 1.85 times the residential rate. Owners in Kent and Sussex can appeal to the Board of Assessment Review between March 1 and May 31.</p>
<p>There is no homestead exemption for every owner. Homeowners aged 65 or older receive a Senior School Property Tax Credit equal to half the school tax on their principal residence, capped at ${h.usd(seniorMax)}: on a school tax of ${h.usd(schoolTax)}, the credit is ${h.usd(seniorCredit)}. Newcomers who arrived after 2017 need 10 consecutive years of Delaware domicile first. Apply to the county receiver of taxes or treasurer by April 30 before the tax year, and pay the bill in full, or the credit is withdrawn the next year. At the Census ratio of ${h.eff(C.effectiveRate)}, a ${h.usd(400000)} home pays about ${h.usd(ptx('delaware', 400000))} a year.</p>`,
  faqs: [
    { q: 'Is it really tax free to shop in Delaware?', a: `For the buyer, yes. Delaware has no state or local sales tax on any retail purchase, clothing, electronics and groceries included. Businesses pay a gross receipts tax on their total receipts instead, 0.7468% for general retailers after a $100,000 monthly deduction, but it is not added to the receipt. Hotel rooms are the main exception for visitors, at ${rate(hotel)}.` },
    { q: 'What fees do you pay when buying a car in Delaware?', a: `Instead of sales tax, Delaware charges a document fee when the vehicle is titled: ${usd(docFee, 2)} per ${usd(100)} of the purchase price above ${usd(500)}, with a flat $8 below $400 and $13.75 from $400 to $500. A ${usd(car)} car costs about ${usd(car * docFee / 100)} in document fee. Leased vehicles pay the ${rate(lease)} lessee use tax on the lease instead.` },
    { q: 'How do seniors lower their school property tax in Delaware?', a: `Homeowners 65 or older can claim the Senior School Property Tax Credit on their principal residence: half the school district tax, up to ${usd(seniorMax)} a year. Those who moved to Delaware after 2017 need 10 consecutive years of domicile, and 2013 to 2017 arrivals need 3. File with the county by April 30, and pay the bill in full to keep the credit.` },
  ],
  related: ['maryland', 'pennsylvania', 'new-jersey', 'states-without-sales-tax', 'use-tax'],
});
