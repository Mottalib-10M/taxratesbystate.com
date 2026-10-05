import { defineState } from '../../lib/page-types';
import { st, usd, rate, eff, tx, ptx, rank, day, dayShort } from '../../lib/kit';

const s = st('louisiana');
const S = s.sales, C = s.census, PR = s.property, HS = s.property.homestead;
const next = S.scheduledChanges?.[0];
const nextRate = next?.rate ?? S.stateRate;
const before = 4.45; // previous state rate, written in rateNote
const localCap = S.local.cap ?? 0;
const useRate = S.useTax?.rate ?? 0;
const useLocal = useRate - S.stateRate;
const cable = S.otherRates?.[0]?.rate ?? 0;
const hol = S.holidays2026?.[0];
const buy = 1000;
const now = tx('louisiana', buy);
const later = (buy * nextRate) / 100;
const order = 400;
const ratio = PR.assessment?.ratio ?? 0;
const hs = HS.amount ?? 0;
const hsMarket = (hs * 100) / ratio;
const home = C.medianValue;
const assessed = (home * ratio) / 100;
const net = Math.max(0, assessed - hs);
const effRank = rank(s, (x) => x.census.effectiveRate);

export default defineState({
  slug: 'louisiana',
  title: `Louisiana Sales Tax 2026: ${rate(S.stateRate)} Until 2029, Then ${rate(nextRate)}`,
  description: `Louisiana sales tax in 2026: ${rate(S.stateRate)} state rate through 2029, ${rate(nextRate)} from 2030, parish taxes on top, a flat ${rate(useRate)} use tax and a ${usd(hs)} assessed homestead exemption.`,
  intro: `A state rate raised for five years and already scheduled to come down, parish taxes that even reach groceries, and homes assessed at a tenth of their value.`,
  resume: `Louisiana's state sales tax has been ${rate(S.stateRate)} since January 1, 2025, up from ${rate(before)}, and the same law, Act 11 of the 2024 Third Extraordinary Session, already sets its end: the rate holds through December 31, 2029 and falls to ${rate(nextRate)} on January 1, 2030. Parishes, municipalities and school boards add their own taxes, which they collect themselves; the constitution caps them at ${rate(localCap)} combined unless the legislature authorizes more, and many areas do exceed it. Groceries and prescription drugs are exempt from the state rate only, so parish and city taxes can still apply at the checkout. The 2024 reform also scrapped the back-to-school and hurricane holidays, leaving only the Second Amendment Weekend. Online purchases that escaped tax owe a flat ${rate(useRate)} consumer use tax. Property tax is light by national standards: the Census median is ${usd(C.medianTax)} on a ${usd(C.medianValue)} home, ${eff(C.effectiveRate)} of value, rank ${effRank} of 51, because homes are assessed at ${ratio}% of market value and the homestead exemption removes the first ${usd(hs)} of that.`,
  sales: (h) => `<p>The rate is temporary by design. Act 11 raised the R.S. 47:321.1 levy from 0.45% to 1%, which took the state total from ${h.rate(before)} to ${h.rate(S.stateRate)}, and wrote in its own step down: that levy drops to 0.75% on January 1, 2030, for a state total of ${h.rate(nextRate)}. On a ${h.usd(buy)} purchase the state part is ${h.usd(now.stateTax, 2)} through 2029 and will be ${h.usd(later, 2)} from 2030, before any parish or city tax.</p>
<p>The local part is where Louisiana is unusual. Parish, municipal and school board taxes are approved by voters and collected locally rather than by the Department of Revenue, and no official address lookup could be confirmed, so the local rate to type in the calculator is the one on your parish collector's schedule or on a recent receipt. The constitution limits combined local taxes to ${h.rate(localCap)}, but the legislature may authorize more by law, and many places sit above that. Groceries and prescription drugs escape the ${h.rate(S.stateRate)} state tax, not necessarily the local one. Residential electricity, gas and water are exempt from the state rate under the constitution, while cable and satellite television pay an extra ${h.rate(cable)} state tax on top of the regular one.</p>
<p>For goods bought online or out of state without tax, individuals pay a flat ${h.rate(useRate)} consumer use tax, ${h.rate(S.stateRate)} for the state and ${h.rate(useLocal)} shared with local governments, whatever the real local rate at home, on the income tax return or Form R-1035: ${h.usd((order * useRate) / 100, 2)} on a ${h.usd(order)} order. The only holiday left${hol ? `, the Second Amendment Weekend, ran ${dayShort(hol.start)} to ${day(hol.end)}` : ' is the Second Amendment Weekend'}, exempting firearms, ammunition and hunting supplies from state and local tax.</p>`,
  property: (h) => `<p>Each parish elects an assessor who values property, and parishes, municipalities, school boards and levee and other special districts set the millages. The constitution fixes the assessment ratios: ${h.num(ratio)}% of fair market value for land and homes, 15% for most other property, 25% for public service property, and ${h.num(ratio)}% of use value for farm, marsh and timber land. Property must be reappraised at least every four years, and a homestead whose assessed value jumps more than 50% in one reappraisal gets the increase phased in.</p>
<p>The homestead exemption is expressed in assessed value: the first ${h.usd(hs)} of an owner-occupied home, up to 160 acres, is exempt from state, parish and special taxes, which matches ${h.usd(hsMarket)} of market value. On the Census median home of ${h.usd(home)}, assessed at ${h.usd(assessed)}, only ${h.usd(net)} remains taxable for parish millages, so each mill costs about ${h.usd(net / 1000, 2)}. City taxes are the exception: the exemption does not apply to municipal millages, apart from municipal school taxes and, in Orleans Parish, the general city, school and levee taxes. A mobile home used as the main residence qualifies even on rented land.</p>
<p>Owners 65 or older, veterans rated 50% or more disabled, permanently disabled owners and families of service members killed or missing in action can freeze the assessment through the special assessment level if their federal AGI is under $100,000, a limit indexed to inflation from 2026. Apply with the parish assessor. As an order of magnitude, ${h.eff(C.effectiveRate)} of value on a ${h.usd(300000)} home comes to about ${h.usd(ptx('louisiana', 300000))} a year.</p>`,
  faqs: [
    { q: `When does the Louisiana sales tax go down to ${rate(nextRate)}?`, a: `On January 1, ${next ? next.date.slice(0, 4) : '2030'}. Act 11 of the 2024 Third Extraordinary Session raised the state rate from ${rate(before)} to ${rate(S.stateRate)} on January 1, 2025 and keeps it there through December 31, 2029. From 2030 one of the state levies drops from 1% to 0.75%, so the state total becomes ${rate(nextRate)}. Parish and municipal taxes are separate and do not change with it.` },
    { q: `Why does Louisiana charge ${rate(useRate)} use tax on online purchases?`, a: `When an online or out-of-state seller does not collect Louisiana tax, individuals owe a flat ${rate(useRate)} consumer use tax for purchases since January 1, 2025: ${rate(S.stateRate)} for the state and ${rate(useLocal)} distributed to local governments. The flat rate applies whatever your parish's actual rate. Report it on your state income tax return or on Form R-1035.` },
    { q: 'How much does the Louisiana homestead exemption save?', a: `It removes the first ${usd(hs)} of assessed value from state, parish and special taxes on an owner-occupied home. Because homes are assessed at ${ratio}% of market value, that is ${usd(hsMarket)} of market value; at Louisiana's typical tax ratio, about ${usd(ptx('louisiana', hsMarket))} a year. Most municipal taxes still apply to the full value. Apply with your parish assessor.` },
  ],
  related: ['mississippi', 'texas', 'arkansas', 'alabama', 'use-tax', 'sales-tax-holidays'],
});
