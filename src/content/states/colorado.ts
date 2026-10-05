import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';

const s = st('colorado');
const S = s.sales, C = s.census, PR = s.property;
const bike = tx('colorado', 2000);
const schoolRate = 7.05;
const localRate = PR.assessment?.ratio ?? 0;
const value = 600000;
const reduced = value - Math.min(value, 700000) * 0.1;
const schoolAv = (value * schoolRate) / 100;
const localAv = (reduced * localRate) / 100;
const seniorPct = PR.homestead.amount ?? 0;
const seniorBase = 200000;
const seniorCut = (seniorBase * seniorPct) / 100;
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'colorado',
  title: `Colorado Sales Tax 2026: ${rate(S.stateRate)} State Rate, Home-Rule Cities`,
  description: `Colorado sales tax in 2026: a ${rate(S.stateRate)} state rate, the lowest, plus city, county and district taxes. Property tax: two 2026 assessment rates, median ${usd(C.medianTax)}.`,
  intro: `Colorado's own rate is the smallest of any state that has one; what the buyer pays depends on a city that may run its sales tax entirely on its own.`,
  resume: `Colorado's state sales tax is ${rate(S.stateRate)}, the lowest rate of any state that levies one, and it is rarely the rate that matters. Cities, counties and special districts such as RTD, the Scientific and Cultural Facilities District and Rural Transportation Authorities add their own, and home-rule cities may run a separate sales tax with their own license, base and exemptions that the Department of Revenue does not collect. Food for home consumption is exempt from the state tax, though cities and counties may still tax it; prescription drugs are exempt, clothing is taxed, and there is no holiday. Property tax is low against home prices: the median owner paid ${usd(C.medianTax)} in 2024 on a ${usd(C.medianValue)} home (Census ACS), an effective rate of ${eff(C.effectiveRate)}, ranked ${effRank} of 51. For 2026, homes are assessed at ${rate(schoolRate)} of actual value for school levies and ${rate(localRate)} for other local levies, after a 10% reduction on the first $700,000.`,
  sales: (h) => `<p>A ${h.usd(2000)} mountain bike owes ${h.usd(bike.stateTax, 2)} of state tax, which is the easy part. The local part comes from up to three sources. State-administered city and county taxes are filed with the Department of Revenue along with the state tax. Special district taxes, from the Regional Transportation District to the cultural facilities district and the rural transportation authorities, apply only inside each district's boundaries. And home-rule cities can collect their own tax directly, with their own definitions of what is taxable, so a business there may need a city license as well as a state one. The state's Sales and Use Tax System (SUTS) lets businesses file for participating home-rule cities in one place, but participation is up to each city.</p>
<p>Food shows how far the layers can diverge. The state exempts food for home consumption, with Colorado's own exceptions such as candy and soft drinks. A city or county may still tax groceries; if it exempts them, it must use the state's definition, and every jurisdiction must exempt purchases paid with SNAP or WIC. The RTD and other district taxes follow the state treatment, so they never apply to exempt food.</p>
<p>Timing is predictable for state-administered rates: changes take effect only on January 1 or July 1, when the DR 1002 rate table is reissued. Use the state's address lookup, add any home-rule city rate, and enter the local part in the calculator above. Two recent changes concern retailers more than shoppers: since January 1, 2026, sellers no longer keep a vendor fee on the state tax, and with the penny no longer minted, the Department issued rounding guidance in March 2026.</p>`,
  property: (h) => `<p>Colorado computes two assessed values for every home. For 2026, school district levies apply to ${h.rate(schoolRate)} of actual value, a rate the State Board of Equalization can lower to keep schools within their revenue limit. Every other local levy, county, city or special district, applies to ${h.rate(localRate)} of actual value after first cutting 10% from the first ${h.usd(700000)}, with a floor of ${h.usd(1000)} of assessed value. County assessors set values, the mill levies of each taxing body apply to the matching assessed value, county treasurers collect, and the Division of Property Taxation oversees the process.</p>
<p>For a home with an actual value of ${h.usd(value)}, the school levies apply to ${h.usd(schoolAv)}, while the other levies apply to ${h.usd(reduced)} × ${h.rate(localRate)}, or ${h.usd(localAv)}. Each mill then costs ${h.usd(schoolAv / 1000, 2)} on the school side and ${h.usd(localAv / 1000, 2)} on the other side. At the Census ratio of ${h.eff(C.effectiveRate)}, a home of that value pays about ${h.usd(ptx('colorado', value))} a year.</p>
<p>There is no homestead exemption for all owners. Seniors aged 65 or older who have owned and lived in their home for at least 10 consecutive years before January 1 are exempt on ${seniorPct}% of the first ${h.usd(seniorBase)} of actual value, so ${h.usd(seniorCut)} of value drops out of the calculation. Apply to the county assessor between January 1 and July 15, or by August 15 without appeal rights. A transitional rule for seniors who moved after qualifying ends after tax year 2026 under SB26-116. Veterans rated 100% permanently disabled, their surviving spouses and Gold Star spouses have a separate exemption, whose deadlines align with the senior ones from January 1, 2027.</p>`,
  faqs: [
    { q: 'What is a home-rule city sales tax in Colorado?', a: `A home-rule city can run its own sales tax instead of letting the Department of Revenue collect it. It sets its own rate, license and list of exemptions, and the business files with the city directly or through the state's SUTS portal if the city participates. Buyers pay it on top of the ${rate(S.stateRate)} state rate and county or district taxes, so the address decides the total.` },
    { q: 'Are groceries taxed in Colorado?', a: `Not by the state: food for home consumption is exempt from the ${rate(S.stateRate)} state tax, with exceptions such as candy and soft drinks. Cities and counties may still tax food, and home-rule cities apply their own rules. Special district taxes like RTD follow the state exemption, and no Colorado jurisdiction may tax purchases made with SNAP or WIC benefits.` },
    { q: 'Who qualifies for the Colorado senior property tax exemption?', a: `Homeowners aged 65 or older on January 1 who have owned and lived in the home as their primary residence for at least 10 consecutive years before that date. The exemption covers ${seniorPct}% of the first ${usd(seniorBase)} of actual value. Apply to your county assessor from January 1 to July 15; filings until August 15 are accepted without appeal rights.` },
  ],
  related: ['utah', 'new-mexico', 'kansas', 'wyoming', 'local-sales-tax-rates', 'how-property-tax-is-calculated'],
});
