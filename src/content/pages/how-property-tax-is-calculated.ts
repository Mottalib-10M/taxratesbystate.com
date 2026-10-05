import { definePage } from '../../lib/page-types';
import { usd, propertyTax, CENSUS, STATES, eff } from '../../lib/kit';

const a = propertyTax({ marketValue: 300000, assessmentRatio: 100, exemption: 25000, millRate: 22 });
const b = propertyTax({ marketValue: 300000, assessmentRatio: 40, exemption: 0, millRate: 55 });
const nat = (() => { const v = STATES.map((s) => s.census.effectiveRate).sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; })();

export default definePage({
  id: 'how-property-tax-is-calculated',
  group: 'property',
  order: 20,
  slug: 'how-property-tax-is-calculated',
  nav: 'How property tax is calculated',
  card: 'Market value, assessment ratio, exemptions and mills, step by step',
  title: 'Property Tax Calculation 2026: Assessed Value × Mill Rate',
  description: `How property tax is calculated in 2026: market value, assessment ratio, homestead exemptions and mill rates, step by step, with a calculator and worked example.`,
  h1: 'How property tax is calculated',
  intro: 'Four numbers, always in the same order. Once you can find them on your bill, you can check it.',
  resume: `Property tax equals the taxable value of a home multiplied by the tax rate, and both numbers are built in steps. The assessor first estimates the market value. The state's assessment ratio turns it into an assessed value: 100% of market value in many states, a fixed fraction such as 40% in others. Exemptions, such as the homestead exemption for an owner's main residence, are subtracted to give the taxable value. Finally, every local government that serves the property (county, city or town, school district, special districts) sets a levy, expressed in mills, dollars per $1,000 of taxable value, and the bill is the sum. A ${usd(300000)} home with a ${usd(25000)} exemption and a combined levy of 22 mills owes ${usd(a.tax)} a year. Across the 51 jurisdictions, the median of the statewide effective rates was ${eff(nat)} in the Census Bureau's ${CENSUS.year} survey.`,
  mini: 'mills',
  body: (h) => `<h2>Step 1: market value</h2>
<p>The assessor values every parcel as of a fixed date, often January 1, using recent sales of comparable homes, the cost of rebuilding, or for rental property the income it produces. Some states reassess every year, others on a cycle of several years, and a few only when a home is sold or improved. The figure appears on your assessment notice under names such as market value, fair market value, appraised value, full cash value or just value. It is not the price you paid, and in a rising market it often trails behind sale prices.</p>
<h2>Step 2: assessment ratio and assessed value</h2>
<p>States decide what share of market value is taxed. Where the ratio is 100%, assessed value and market value are the same number. Where it is lower, the ratio is usually written in law for each class of property, residential homes often getting a lower ratio than commercial buildings. Two consequences follow. A low ratio does not mean a low tax, because levies are then set higher to raise the same money: ${h.usd(300000)} assessed at 40% and taxed at 55 mills costs ${h.usd(b.tax)}, more than the full-value example above. And mill rates can only be compared between places that use the same ratio. In states that let each town choose its level of assessment, the town publishes an equalization rate to make comparisons possible.</p>
<h2>Step 3: exemptions and caps</h2>
<p>Exemptions reduce the assessed value before the rate is applied. The homestead exemption for an owner's main residence is the most common; many states add exemptions for seniors, disabled owners, veterans and farmland. They come in several forms: a fixed dollar amount, a percentage of value, a freeze of the assessed value at the level of the year the owner qualified, or a credit taken off the tax rather than the value. Separately, several states cap how much the assessed value of a home may rise each year while the same owner keeps it, so that the taxable value of a long-held home can sit far below its market value. A sale normally resets the value to market, which is why two identical houses on the same street can carry very different bills.</p>
<h2>Step 4: the levy, in mills</h2>
<p>Each taxing unit adopts a budget and divides the property tax it needs by the total taxable value of its territory. The result is its rate, written in mills (per $1,000), in dollars per $100, or as a percentage; 25 mills, $2.50 per $100 and 2.5% are the same rate. Your parcel sits inside several overlapping units, and the total rate is the sum of all of them. School districts usually carry the largest share. Many states limit how fast levies may grow, require a public hearing before an increase, or roll back rates automatically when values jump, so a higher assessment does not always mean a proportionally higher bill.</p>
<h2>Putting it together</h2>
<p>Tax = (market value × assessment ratio − exemptions) × mills ÷ 1,000, minus any credits. Run it in the mini-calculator above with the numbers from your notice, or in the ${h.a('property-tax-calculator', 'property tax calculator')}, which adds exemptions and credits and compares the result with the median bill of your state. If the result is far from your actual bill, the usual culprits are a missed exemption, a special assessment added to the bill, or an assessed value that is not what you think: check the notice before the appeal deadline.</p>
<h2>When the bill looks wrong</h2>
<p>You can challenge the assessed value, not the rate. Every state sets a window, often only a few weeks after notices are mailed, to ask for an informal review and then file a formal appeal with a local board. The strongest evidence is recent sales of similar homes, or errors in the property record such as wrong square footage. Missing an exemption is a different matter: it is fixed by applying, usually with the county assessor, and some states allow late applications for a limited period. The ${h.a('homestead-exemption-by-state', 'homestead exemption by state')} page lists the main exemption of each state, and each state page links the official application.</p>`,
  faqs: [
    { q: 'How do I convert a tax rate per $100 into mills?', a: `Multiply by ten. A rate of $2.10 per $100 of value is 21 mills, because a mill is one dollar per $1,000. To go from mills to a percentage, divide by ten: 21 mills is 2.1% of taxable value. Remember that the percentage applies to taxable value, after the assessment ratio and exemptions, not to market value.` },
    { q: 'Why did my property tax go up when my assessment did not change?', a: `Because the rate changed. Each school district, county and city sets its levy every year from its budget, and voters can approve new levies or bonds. A new taxing district, such as a library or fire district, adds a line too. The reverse also happens: when values rise sharply, some states require rates to be rolled back.` },
    { q: 'Is a lower assessment ratio better for homeowners?', a: `Not by itself. Taxing units set their rates to raise the revenue they need from the total taxable value, so a lower ratio is offset by a higher mill rate. What matters to you is the tax divided by your home's market value. The ratio does matter when it differs between classes of property, for instance when homes are assessed at a lower share than businesses.` },
    { q: 'Do I pay property tax on the price I paid for my home?', a: `Not directly. The tax is based on the assessor's value, which may be above or below your purchase price. In states that cap assessment growth, though, a sale typically resets the assessed value to the market value, which is often close to the sale price, so buyers there feel the purchase price sooner.` },
  ],
  related: ['property-tax-calculator', 'homestead-exemption-by-state', 'property-tax-by-state', 'state-tax-comparison'],
  sources: ['censusB25103', 'censusB25077', 'censusAcsMethod'],
});
