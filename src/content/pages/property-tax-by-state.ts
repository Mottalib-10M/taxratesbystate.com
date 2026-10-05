import { definePage } from '../../lib/page-types';
import { STATES, CENSUS, usd, eff, listOf, day } from '../../lib/kit';

const byEff = [...STATES].sort((a, b) => b.census.effectiveRate - a.census.effectiveRate);
const byBill = [...STATES].sort((a, b) => b.census.medianTax - a.census.medianTax);
const top5 = byEff.slice(0, 5), low5 = byEff.slice(-5).reverse();
const med = (xs: number[]) => { const v = [...xs].sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const midEff = med(STATES.map((s) => s.census.effectiveRate));
const midBill = med(STATES.map((s) => s.census.medianTax));
const hiBill = byBill[0], loBill = byBill[byBill.length - 1];
const hw = STATES.find((s) => s.slug === 'hawaii');
const mortGap = [...STATES].sort((a, b) => (b.census.medianTaxWithMortgage - b.census.medianTaxNoMortgage) - (a.census.medianTaxWithMortgage - a.census.medianTaxNoMortgage));
const arg = JSON.stringify(STATES.map((s) => [s.name, s.census.effectiveRate, s.census.medianTax]));
// A state with a low rate but a high bill, because homes are expensive.
const paradox = [...STATES].filter((s) => s.census.effectiveRate < midEff && s.census.medianTax > midBill).sort((a, b) => b.census.medianTax - a.census.medianTax)[0];

export default definePage({
  id: 'property-tax-by-state',
  group: 'property',
  order: 10,
  slug: 'property-tax-by-state',
  nav: 'Property tax by state',
  card: 'Median bill, home value and effective rate of all 51 jurisdictions',
  title: 'Property Tax by State 2026: Effective Rates and Median Bills',
  description: `Property tax by state for 2026: median bill, median home value and effective rate for all 50 states and DC from the Census ACS ${CENSUS.year}, ranked, with a calculator.`,
  h1: 'Property tax by state',
  intro: `What owners actually pay, state by state, from the Census Bureau's ${CENSUS.year} American Community Survey.`,
  resume: `The typical homeowner in ${hiBill.name} paid ${usd(hiBill.census.medianTax)} of property tax, the highest median bill of the 51 jurisdictions, against ${usd(loBill.census.medianTax)} in ${loBill.name}, the lowest, according to the Census Bureau's American Community Survey for ${CENSUS.year}. As a share of home value, the ranking changes: ${top5[0].name} has the highest effective rate at ${eff(top5[0].census.effectiveRate)}, followed by ${listOf(top5.slice(1, 4).map((s) => s.name))}, while ${low5[0].name} is lowest at ${eff(low5[0].census.effectiveRate)}. The effective rate here is the median real estate tax paid by owner-occupants divided by the median value of their homes, so it already includes the homestead exemptions and assessment caps owners receive. The middle state sits at ${eff(midEff)} and ${usd(midBill)} a year. Use the table to compare, the calculator to apply a state's rate to your own home value, and each state page for its exemptions.`,
  mini: 'statePropertyPick',
  miniArg: arg,
  body: (h) => `<h2>All 51 jurisdictions, by effective rate</h2>
${h.stateTable('property', 'eff')}
<h2>Rate and bill are two different rankings</h2>
<p>A high effective rate does not always mean a high bill, and the reverse. Where home values are high, a modest rate still produces a large bill${paradox ? `: ${paradox.name}'s effective rate of ${h.eff(paradox.census.effectiveRate)} is below the middle of the table, yet its median bill of ${h.usd(paradox.census.medianTax)} is above the middle, because its median home is worth ${h.usd(paradox.census.medianValue)}` : ''}. ${hw ? `${hw.name} shows the effect most clearly: the lowest rate of all on homes with a median value of ${h.usd(hw.census.medianValue)}.` : ''} When you compare states before a move, look at the rate if you know what you will spend on a home, and at the bill to see what a typical owner there pays.</p>
<h2>How these figures are built</h2>
<p>The Census Bureau asks a sample of households each year how much they paid in real estate taxes and what their home is worth. Table ${h.src('censusB25103', 'B25103')} gives the median taxes paid by owner-occupied housing units, table ${h.src('censusB25077', 'B25077')} the median value of those homes. Both are ${CENSUS.year} one-year estimates, read on ${h.day(CENSUS.retrieved_at)}; the next release usually comes in September. Dividing one median by the other is a convention: it is not the median of each household's own ratio, but it is stable, dated and published for every state, which is what a comparison needs. Each figure carries a margin of error: on the median bill it ranges from ${h.usd(Math.min(...STATES.map((x) => x.census.medianTaxMoe)))} in the most surveyed state to ${h.usd(Math.max(...STATES.map((x) => x.census.medianTaxMoe)))} in the least.</p>
<h2>What the table cannot tell you</h2>
<p>Property tax is local. Inside one state, the levy of a city with its own school district can be twice that of a rural county, and the Census median does not show it. Owners who have held their homes for decades in states with assessment caps pay far less than new buyers of identical houses, which pulls the median rate down. Renters are not in these figures at all, although landlords pass part of the tax into rents. And the median bill describes owners, many of whom have a mortgage with an escrow account; the figures with and without a mortgage are on each state page.</p>
<h2>Why the gap between states is so large</h2>
<p>States finance schools and local services in different mixes. Where local governments depend heavily on property tax for schools, rates are high, as in much of the Northeast and the Midwest; where the state funds more of the schools from income or sales taxes, or where large homestead exemptions remove much of the value from the rolls, rates are low. Assessment practice adds another layer: a state that assesses homes at a fraction of their value, or caps annual increases, can look low on paper while its levies are high. The ${h.a('how-property-tax-is-calculated', 'step-by-step explanation')} shows where each of these levers acts on a bill.</p>
<h2>With a mortgage, without a mortgage</h2>
<p>The Census splits owners in two: those still paying a mortgage, whose tax usually goes through an escrow account, and those who own outright. In ${STATES.filter((x) => x.census.medianTaxWithMortgage > x.census.medianTaxNoMortgage).length} of the 51, owners with a mortgage pay more, partly because they bought more recently and at higher values, which matters wherever a sale resets the assessment. The gap is widest in ${h.a(mortGap[0].slug, mortGap[0].name)}, where the median bill is ${h.usd(mortGap[0].census.medianTaxWithMortgage)} with a mortgage against ${h.usd(mortGap[0].census.medianTaxNoMortgage)} without, and in ${h.a(mortGap[1].slug, mortGap[1].name)} (${h.usd(mortGap[1].census.medianTaxWithMortgage)} against ${h.usd(mortGap[1].census.medianTaxNoMortgage)}). ${(() => { const rev = STATES.filter((x) => x.census.medianTaxWithMortgage < x.census.medianTaxNoMortgage); return rev.length ? `The order is reversed in ${rev.map((x) => x.name).join(', ')}.` : ''; })()} If you are about to buy, the figure with a mortgage is the closer guide to your own first bills.</p>
<h2>The ten highest and lowest rates</h2>
<p>Highest effective rates, in order: ${byEff.slice(0, 10).map((s) => `${h.a(s.slug, s.name)} (${h.eff(s.census.effectiveRate)})`).join(', ')}. Lowest, from the bottom: ${[...byEff].reverse().slice(0, 10).map((s) => `${h.a(s.slug, s.name)} (${h.eff(s.census.effectiveRate)})`).join(', ')}. Each name opens the state's page, with the homestead exemption, the other relief programs and the official pages that describe how its counties assess and levy.</p>
<h2>Using the numbers</h2>
<p>For an order of magnitude, the mini-calculator above applies a state's median rate to the value you type. For a specific address, the ${h.a('property-tax-calculator', 'property tax calculator')} accepts the mill rate, the assessment ratio and the exemptions of your bill. To weigh property tax against sales tax between two states, use the ${h.a('state-tax-comparison', 'two-state comparison')}. And before buying, check the ${h.a('homestead-exemption-by-state', 'homestead exemption')} of the state, since it changes the bill of an owner-occupant from the first year.</p>`,
  faqs: [
    { q: 'Which state has the highest property taxes in 2026?', a: `On the latest Census data, for ${CENSUS.year}, ${hiBill.name} has the highest median bill, ${usd(hiBill.census.medianTax)} a year, and ${top5[0].name} the highest effective rate, ${eff(top5[0].census.effectiveRate)} of home value. The Census releases a new year each September, so these rankings move slightly from year to year; local levies for 2026 are set by each county, city and school district.` },
    { q: 'Which state has the lowest property tax rate?', a: `${low5[0].name}, at ${eff(low5[0].census.effectiveRate)} of home value on the Census ${CENSUS.year} medians, followed by ${listOf(low5.slice(1, 4).map((s) => s.name))}. A low rate does not always mean a low bill: where homes are expensive, even a small rate adds up. Check the median bill in the table as well as the rate before drawing conclusions.` },
    { q: 'Is the effective rate the same as the rate on my tax bill?', a: `No. Your bill shows levies in mills or dollars per $100, applied to your taxable value after the assessment ratio and exemptions. The effective rate divides the tax by the full market value. In a state that assesses at a fraction of value or grants a large homestead exemption, the levy on the bill looks much higher than the effective rate.` },
  ],
  related: ['property-tax-calculator', 'how-property-tax-is-calculated', 'homestead-exemption-by-state', 'state-tax-comparison'],
  sources: ['censusB25103', 'censusB25077', 'censusAcsMethod'],
});
