import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('massachusetts');
const S = s.sales, C = s.census;
const T = S.clothing.threshold ?? 0;
const mealsLocal = 0.75; // local option meals excise, local.capNote
const hol = S.holidays2026?.[0];
const holCap = 2500; // per-item limit in holidays2026[0].items
const suit = tx('massachusetts', 200, 'clothing');
const boots = tx('massachusetts', 250, 'clothing');
const parka = tx('massachusetts', 520, 'clothing');
const shirt = tx('massachusetts', 60, 'clothing');
const laptop = tx('massachusetts', 1800);
const sofa = tx('massachusetts', 2900);
const dinner = 120;
// Senior Circuit Breaker: 10% of income threshold and $2,820 maximum (otherRelief text).
const cbMax = 2820, cbShare = 10;
const income = 48000, bill = C.medianTax;
const credit = Math.min(cbMax, Math.max(0, bill - (income * cbShare) / 100));
const effRank = rank(s, (x) => x.census.effectiveRate);
const billRank = rank(s, (x) => x.census.medianTax);

export default defineState({
  slug: 'massachusetts',
  title: `Massachusetts Sales Tax 2026: ${rate(S.stateRate)}, Clothing Free to ${usd(T)}`,
  description: `Massachusetts sales tax in 2026: ${rate(S.stateRate)} statewide, clothing taxed only above ${usd(T)} an item, meals ${rate(S.stateRate + mealsLocal)} in many towns, an August holiday and Proposition 2½.`,
  intro: `A clothing rule that taxes only the slice of the price above ${usd(T)}, a summer weekend when almost everything is tax free, and property tax set by each city and town.`,
  resume: `Massachusetts charges ${rate(S.stateRate)} on goods and telecommunications, with no local sales tax, and its clothing rule is the one to understand: an item of clothing or footwear is tax free up to ${usd(T)}, and above that only the excess is taxed, so a ${usd(200)} suit owes ${usd(suit.tax, 2)} and a ${usd(520)} parka ${usd(parka.tax, 2)}. Groceries and prescription drugs are exempt. Restaurant meals, take-out included, pay ${rate(S.stateRate)}, or ${rate(S.stateRate + mealsLocal)} in towns that adopted the ${rate(mealsLocal)} local meals excise. Each August a two-day holiday removes the tax on most items up to ${usd(holCap)}. Property tax is purely municipal: assessors value homes at full and fair cash value, towns may tax homes at a lower rate than businesses, and Proposition 2½ limits each town's total levy. The Census median bill is ${usd(C.medianTax)}, rank ${billRank} of 51, on homes worth a median ${usd(C.medianValue)}, a ratio of ${eff(C.effectiveRate)} that ranks ${effRank}. There is no statewide homestead exemption; seniors rely on local exemptions and the Senior Circuit Breaker income tax credit.`,
  sales: (h) => `<p>The clothing threshold works on each item and on the excess only, which makes Massachusetts the opposite of a cliff. A ${h.usd(60)} shirt owes ${h.usd(shirt.tax, 2)}. A pair of ${h.usd(250)} boots is taxed on ${h.usd(boots.stateBase)}, for ${h.usd(boots.tax, 2)}. A ${h.usd(520)} winter parka is taxed on ${h.usd(parka.stateBase)}, for ${h.usd(parka.tax, 2)}, where a flat ${h.rate(S.stateRate)} would have cost ${h.usd(tx('massachusetts', 520).tax, 2)}. The exemption covers everyday clothing and shoes; athletic and protective gear, handbags, jewelry and other accessories are taxed in full. Select "Clothing" in the calculator above to apply the rule to your own price.</p>
<p>The ${hol ? `${dayShort(hol.start)} and ${day(hol.end)}` : 'August'} holiday covered most retail items of ${h.usd(holCap)} or less bought for personal use, so a ${h.usd(1800)} laptop saved ${h.usd(laptop.tax, 2)}. The limit is a cliff, unlike the clothing rule: a ${h.usd(2900)} sofa bought that weekend paid the full ${h.usd(sofa.tax, 2)}. Meals, cars, boats, utilities, telecom, tobacco, marijuana and alcohol were excluded.</p>
<p>Several purchases have their own procedure. A car buyer pays the ${h.rate(S.stateRate)} tax straight to the Commonwealth on Form RTA within 10 days, not to the dealer. Restaurant meals pay the meals tax: a ${h.usd(dinner)} dinner owes ${h.usd((dinner * (S.stateRate + mealsLocal)) / 100, 2)} in a town with the local excise. Music, video and e-books downloaded electronically are not taxed, but software is. Residents who bought items elsewhere without tax report use tax on Form 1, with a safe-harbor estimate allowed for items under $1,000.</p>`,
  property: (h) => `<p>Every Massachusetts property tax dollar goes to a city or town. Local assessors value each parcel at its full and fair cash value as of January 1 and classify it as residential, open space, commercial or industrial; the Department of Revenue's Division of Local Services certifies those values every five years. Since 1978, a community can choose classification and shift part of the burden from homes to commercial, industrial and personal property, which is why two neighboring towns with similar values can post very different residential rates. Payment dates, too, are set by each community.</p>
<p>Proposition 2½ caps the levy, not the bill. It limits how much property tax a community can raise in total, and going above that limit takes an override or an exclusion approved by voters. An individual assessment can still rise sharply when the market does. Applied to a ${h.usd(750000)} house, the statewide median ratio of ${h.eff(C.effectiveRate)} gives about ${h.usd(ptx('massachusetts', 750000))} a year.</p>
<p>Massachusetts has no statewide homestead exemption. Relief comes from local exemptions under Chapter 59, section 5, for qualifying seniors, surviving spouses, veterans and blind owners, filed with local assessors, and from the Senior Circuit Breaker credit on the state income tax: homeowners and renters 65 or older whose property tax, plus half of water and sewer charges, is more than ${h.num(cbShare)}% of income can claim up to ${h.usd(cbMax)} for tax year 2025, with income limits of $75,000 single, $94,000 head of household and $112,000 joint, and a home assessed at no more than $1,298,000. A senior with ${h.usd(income)} of income and the median bill of ${h.usd(bill)} is ${h.usd(bill - (income * cbShare) / 100)} above the ${h.num(cbShare)}% line, so the credit would reach ${h.usd(credit)}. Since November 1, 2024, an owner who loses a home to a tax foreclosure keeps the excess equity from the sale.</p>`,
  faqs: [
    { q: 'How is a $250 pair of boots taxed in Massachusetts?', a: `Only the part of the price above ${usd(T)} is taxed. On ${usd(250)} boots, ${usd(boots.stateBase)} is taxable at ${rate(S.stateRate)}, so the tax is ${usd(boots.tax, 2)}. Any clothing or footwear item at ${usd(T)} or less is tax free. Athletic or protective gear, handbags, jewelry and accessories do not get the exemption and are taxed on the full price, with no local sales tax added.` },
    { q: 'What could you buy tax free on the Massachusetts sales tax holiday?', a: `In 2026 the holiday ran ${hol ? `${dayShort(hol.start)} and ${dayShort(hol.end)}` : 'on a weekend in August'}. Most retail items costing ${usd(holCap)} or less each, bought for personal use, were free of the ${rate(S.stateRate)} sales tax. An item above ${usd(holCap)} was taxed on its full price, not just the excess. Meals, motor vehicles, motorboats, telecom, utilities, tobacco, marijuana and alcohol were excluded.` },
    { q: 'Is there a homestead exemption in Massachusetts?', a: `Not statewide. Massachusetts leaves property tax relief to local exemptions under Chapter 59, section 5, for qualifying seniors, surviving spouses, veterans and blind owners, which you request from your town's assessors. Owners and renters 65 or older can also claim the Senior Circuit Breaker income tax credit, up to ${usd(cbMax)} for 2025, when property tax exceeds ${cbShare}% of their income.` },
  ],
  related: ['rhode-island', 'connecticut', 'new-hampshire', 'new-york', 'clothing-sales-tax-by-state', 'sales-tax-holidays'],
});
