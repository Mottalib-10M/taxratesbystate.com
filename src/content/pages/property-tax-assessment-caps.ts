import { definePage } from '../../lib/page-types';
import { STATES, usd, listOf, CENSUS, eff } from '../../lib/kit';

const capped = STATES.filter((s) => s.property.assessment?.capped);
const notCapped = STATES.filter((s) => !capped.includes(s));
const v0 = 300000, g = 0.06, c = 0.02, n = 10;
const market = v0 * (1 + g) ** n, cappedV = v0 * (1 + c) ** n;

export default definePage({
  id: 'property-tax-assessment-caps',
  group: 'property',
  order: 40,
  slug: 'property-tax-assessment-caps',
  nav: 'Assessment caps by state',
  card: 'Where taxable value may only rise a set percentage a year',
  title: 'Property Tax Assessment Caps 2026: Limits on Rising Values',
  description: `Property tax assessment caps in 2026: the states that limit how fast a home's taxable value may rise, what a cap is worth over ten years, why a sale resets it.`,
  h1: 'Property tax assessment caps by state',
  intro: 'In rising markets, a cap on assessments matters more than the rate: it decides what part of the value is taxed at all.',
  resume: `An assessment cap limits how much the taxable value of a property may rise from one year to the next, whatever happens to its market value. ${capped.length} of the 51 jurisdictions have a cap, a freeze or a similar limit described on their official pages, including well-known ones such as California's Proposition 13 and Florida's Save Our Homes. The effect builds over time: if a ${usd(v0)} home gains 6% a year in value while its taxable value may rise only 2%, after ${n} years the market value is ${usd(market)} but the taxable value only ${usd(cappedV)}, and ${usd(market - cappedV)} of value is never taxed. Caps usually apply to the owner's main residence, and most reset the value to market when the home is sold, which is why a new buyer can pay twice the tax of a long-time neighbor. Caps limit the value; levies can still rise, so a capped bill is not a frozen bill.`,
  mini: 'capGrowth',
  body: (h) => `<h2>States with a cap or a similar limit</h2>
<ul>${capped.map((s) => `<li><strong>${h.a(s.slug, s.name)}</strong>: ${s.property.assessment?.capText ?? ''}${s.property.assessment?.capUrl ? ` ${h.ext(s.property.assessment.capUrl, 'Official page')}` : ''}</li>`).join('')}</ul>
<p>The other ${notCapped.length} jurisdictions reassess homes toward market value without a general cap on yearly increases, though many limit the growth of levies instead, require rates to roll back when values jump, or give seniors a freeze. Their rules are on each state page.</p>
<h2>Cap on value versus limit on levy</h2>
<p>Two families of rules protect owners against rising bills, and they work differently. A cap on assessed value acts on each property: the taxable value of your home may rise only so much a year, so your share of the tax burden shrinks if the market rises faster than the cap. A limit on levies acts on each taxing unit: a county or school district may raise only so much more revenue a year without a vote, and the rate falls when values rise. Under a levy limit alone, a home whose value rises faster than its neighbors' still sees its bill rise faster than theirs.</p>
<h2>The price of a cap: the gap between neighbors</h2>
<p>A cap rewards staying put. Two identical houses on the same street can carry very different bills if one has been owned for twenty years and the other was bought last year, because the sale reset the second one's value to market. That gap also discourages moving, since a move means giving up the accumulated benefit; some states let owners carry part of it to a new home, which the state pages mention when the official page does. Census medians reflect this: in capped states, the median effective rate of all owners can be well below the rate a new buyer faces. ${(() => { const ca = STATES.find((s) => s.slug === 'california'); return ca ? `California's median effective rate in the Census ${CENSUS.year} data is ${h.eff(ca.census.effectiveRate)}, a figure that blends long-held homes with recent purchases.` : ''; })()}</p>
<h2>What resets a capped value</h2>
<p>A sale is the most common trigger. Depending on the state, a change in ownership through inheritance, a transfer to a company, new construction or a major addition can also reset or partly reset the value. Transfers between spouses, and in some states between parents and children, may be excluded. The official page of each state, linked above, sets out its triggers.</p>
<h2>Estimating the effect on your bill</h2>
<p>The mini-calculator above projects a value under a cap against an uncapped market value. To turn either value into a bill, use the ${h.a('property-tax-calculator', 'property tax calculator')} in mill rate mode, entering the capped assessed value printed on your notice as the market value with a 100% ratio. For the other levers on a bill, see ${h.a('how-property-tax-is-calculated', 'how property tax is calculated')} and the ${h.a('homestead-exemption-by-state', 'homestead exemption by state')}.</p>`,
  faqs: [
    { q: 'Why is my new home taxed more than my neighbor’s identical house?', a: `In a state with an assessment cap, your neighbor's taxable value has risen by at most the capped percentage each year since they bought, while your purchase reset your home's value to market. The rates are the same; the taxable values are not. The gap closes only slowly, as your own capped value grows more slowly than the market from now on.` },
    { q: 'Does an assessment cap freeze my property tax bill?', a: `No. A cap limits how fast the taxable value may rise, not the rate. If a school district or county raises its levy, your bill rises even when your taxable value is capped. Some states add a separate limit on levy growth, and some freeze the bills of qualifying seniors, but a general value cap alone does not freeze the tax.` },
    { q: 'Do assessment caps apply to rental and commercial property?', a: `It depends on the state. Several caps apply only to owner-occupied homesteads; others cover all property with a higher cap for non-homestead property; a few apply to every class at the same level. The official pages linked from each state on this page say which properties are covered.` },
  ],
  related: ['homestead-exemption-by-state', 'how-property-tax-is-calculated', 'property-tax-by-state', 'property-tax-calculator'],
  sources: ['homestead:california', 'homestead:florida', 'censusB25103'],
});
