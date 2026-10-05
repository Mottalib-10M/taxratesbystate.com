import { definePage } from '../../lib/page-types';
import { STATES, usd, listOf, propertyTax } from '../../lib/kit';

const kind = (t: string) => t === 'value-exemption' ? 'Amount off the assessed value' : t === 'credit' ? 'Credit or rebate on the tax' : t === 'percent' ? 'Percentage of value' : t === 'freeze' ? 'Freeze or cap on value' : 'No general homestead exemption';
const by = (t: string) => STATES.filter((s) => s.property.homestead.amountType === t);
const fixed = by('value-exemption').filter((s) => s.property.homestead.amount);
const biggest = [...fixed].sort((a, b) => (b.property.homestead.amount ?? 0) - (a.property.homestead.amount ?? 0));
const noneH = by('none');
const ex = propertyTax({ marketValue: 300000, exemption: 50000, millRate: 20 });
const ex0 = propertyTax({ marketValue: 300000, millRate: 20 });

export default definePage({
  id: 'homestead-exemption-by-state',
  group: 'property',
  order: 30,
  slug: 'homestead-exemption-by-state',
  nav: 'Homestead exemption by state',
  card: 'The main property tax break for owner-occupants in each state',
  title: 'Homestead Exemption by State 2026: Amounts and How to Apply',
  description: `Homestead exemption by state in 2026: the main property tax relief for owner-occupied homes in all 50 states and DC, its amount, who qualifies, where to apply.`,
  h1: 'Homestead exemption by state',
  intro: 'The property tax break for the home you live in: what it is called in each state, how big it is, and where to apply.',
  resume: `A homestead exemption lowers the property tax on the home you own and live in. Almost every state has one, but they take different forms. In ${by('value-exemption').length} jurisdictions it is a dollar amount taken off the assessed value${biggest.length ? `, from ${usd(biggest[biggest.length - 1].property.homestead.amount ?? 0)} in ${biggest[biggest.length - 1].name} to ${usd(biggest[0].property.homestead.amount ?? 0)} in ${biggest[0].name}` : ''}; in ${by('credit').length} it is a credit or rebate on the tax itself; in ${by('percent').length} a percentage of value; and in ${by('freeze').length} a freeze or a cap on how fast the taxable value can rise. ${noneH.length ? `${listOf(noneH.map((s) => s.name))} have no general homestead exemption, only targeted programs. ` : ''}Many exemptions apply only to school taxes or only up to an income limit, and almost all require an application with the county assessor, often once, by a spring deadline. On a ${usd(300000)} home taxed at 20 mills, a ${usd(50000)} exemption saves ${usd(ex0.tax - ex.tax)} a year.`,
  mini: 'exemptionSaving',
  body: (h) => `<h2>The main homestead relief of each state</h2>
${h.table(['State', 'Program', 'Form', 'Amount'], STATES.map((s) => [h.a(s.slug, s.name), s.property.homestead.url ? h.ext(s.property.homestead.url, s.property.homestead.name ?? 'Official page') : (s.property.homestead.name ?? ''), kind(s.property.homestead.amountType), s.property.homestead.amount != null ? (s.property.homestead.amountType === 'percent' ? `${h.num(s.property.homestead.amount)}%` : h.usd(s.property.homestead.amount)) : 'varies']), 'Main program read on each state’s official page, October 2026; details and conditions on the state pages', ['l', 'l', 'l', 'r'])}
<h2>Four forms of relief</h2>
<p><strong>An amount off the value.</strong> The most common form: a fixed dollar figure is subtracted from the assessed value before the levy is applied. Its worth depends on your mill rate, so the same ${h.usd(50000)} exemption saves more in a high-tax county than in a low-tax one. Where homes are assessed at a fraction of value, check whether the amount comes off market value or assessed value; the state page says which.</p>
<p><strong>A credit or rebate.</strong> Some states reduce the tax bill directly, or pay owners a rebate after the bill is paid, often scaled by income. The saving is a dollar figure regardless of the levy. Rebates paid by the state can arrive months after the bill.</p>
<p><strong>A percentage.</strong> A share of the home's value, sometimes up to a ceiling, is exempt. It behaves like a lower assessment ratio for owner-occupants.</p>
<p><strong>A freeze or cap.</strong> Instead of a fixed reduction, the taxable value of the home may rise only by a set percentage a year while the same owner keeps it, or is frozen for qualifying seniors. The benefit grows in rising markets and disappears when the home is sold; see ${h.a('property-tax-assessment-caps', 'property tax assessment caps')}.</p>
<h2>The largest dollar exemptions</h2>
<p>Among the states whose main program takes a fixed amount off the value, the largest are ${biggest.slice(0, 6).map((x) => `${h.a(x.slug, x.name)} (${h.usd(x.property.homestead.amount ?? 0)}${x.property.homestead.name ? `, ${x.property.homestead.name}` : ''})`).join(', ')}. Size alone is misleading. In some of these states the exemption applies only to school taxes, or only to owners over an age or under an income, and where homes are assessed at a fraction of their value a small dollar figure removes a larger share of the taxable value than it seems. A fixed amount also weighs more on a modest home than on an expensive one: ${h.usd(50000)} off a ${h.usd(150000)} house removes a third of its value, off a ${h.usd(600000)} house a twelfth.</p>
<h2>Relief tied to income</h2>
<p>${(() => { const inc = STATES.filter((x) => /income/i.test(x.property.homestead.text ?? '')); return inc.length ? `In ${listOf(inc.map((x) => h.a(x.slug, x.name)))}, the main program described on the official page depends on household income, so two neighbors with the same house can receive different amounts, and the claim is usually renewed every year with proof of income.` : ''; })()} Income-tested programs are often called circuit breakers: they cap the property tax at a share of income, or refund the part above it. They matter most for retirees with a paid-off home and a small pension, whose bill can rise with values while their income does not.</p>
<h2>Who qualifies</h2>
<p>The home must be your primary residence, owned by you (or held in a trust for you in many states) on the assessment date, which is often January 1. You can usually claim only one homestead, in one state: claiming a homestead in two places, for instance a home in one state and a winter condo in another, is a classic reason for back taxes and penalties when assessors compare their rolls. Seniors, people with disabilities, disabled veterans and surviving spouses often receive larger exemptions or a freeze on top of the general one, as listed on each state page under other relief.</p>
<h2>How and when to apply</h2>
<p>In most states you file once with the county assessor or property appraiser, and the exemption renews automatically while you own and live in the home; a few states require a periodic renewal, or an income declaration every year for income-tested programs. Deadlines are usually early in the year, and a missed deadline typically means waiting a year, though some states accept late filing with a reduced benefit. New owners should apply in the first year: the seller's exemption does not pass to the buyer, and a bill based on the seller's exemption can be followed by a higher one.</p>
<h2>Checking that you receive it</h2>
<p>Your bill or assessment notice lists exemptions applied to the parcel. If the homestead line is missing, the bill was computed without it. In the ${h.a('property-tax-calculator', 'property tax calculator')}, switch to your mill rate, enter the exemption your state grants and compare: the gap is what the missing exemption costs you each year. The ${h.a('how-property-tax-is-calculated', 'step-by-step guide')} shows where the exemption enters the calculation.</p>`,
  faqs: [
    { q: 'Do I have to apply for a homestead exemption every year?', a: `In most states, no: you apply once with the county assessor and the exemption continues while you own and occupy the home. Some states require periodic renewal, and income-tested programs, such as rebates or senior freezes, usually require an income statement each year. The state page here links the official rule and the application of each state.` },
    { q: 'Can I claim a homestead exemption in two states?', a: `No. A homestead exemption is tied to your permanent residence, and you have only one. Claiming it on a home in one state and another elsewhere can lead to the exemption being revoked with back taxes, penalties and interest, as assessors increasingly compare records. Choose the state where you actually live and vote, file taxes and register vehicles.` },
    { q: 'Does the homestead exemption transfer when I buy a home?', a: `No. The exemption belongs to the owner who qualified, not to the house. When you buy, the seller's exemption ends with the sale and you must file your own application by your state's deadline. Until you do, the next bill may be computed without any homestead exemption, which can be a large jump compared with the seller's bill.` },
  ],
  related: ['how-property-tax-is-calculated', 'property-tax-calculator', 'property-tax-assessment-caps', 'property-tax-by-state'],
  sources: ['homestead:texas', 'homestead:florida', 'homestead:new-york', 'homestead:california'],
});
