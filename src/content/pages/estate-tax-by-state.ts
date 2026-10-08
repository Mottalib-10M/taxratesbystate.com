import { definePage } from '../../lib/page-types';
import { usd, listOf, num } from '../../lib/kit';
import { FED, federalEstateTax, stateEstateTax } from '../../lib/engine/realestate';
import { RE } from '../../lib/realestate';

const E = FED.estate;
const ES = [...RE.estate].sort((a, b) => a.exemption - b.exemption);
const low = ES[0], high = ES[ES.length - 1];
const inh = RE.inheritance.map((x) => x.name);
const both = RE.estate.filter((e) => RE.inheritance.some((i) => i.slug === e.slug)).map((e) => e.name);
const topRate = (e: (typeof ES)[number]) => Math.max(...e.brackets.map((b) => b.ratePct));
const X = 6000000;
/** Marginal rate just above the threshold, then the top rate (the table's low brackets never apply above the threshold). */
const at = (e: (typeof ES)[number], x: number) => (e.brackets.find((b) => x >= b.from && (b.to === null || x < b.to)) ?? e.brackets[e.brackets.length - 1]).ratePct;
const pct = (x: number) => `${num(x, 2).replace(/\.?0+$/, '')}%`;
const range = (e: (typeof ES)[number]) => {
  const lo = e.method === 'excess' ? e.brackets[0].ratePct : at(e, e.exemption - (e.offset ?? 0) + 1);
  const hi = topRate(e);
  return lo === hi ? pct(hi) : `${pct(lo)} to ${pct(hi)}`;
};
const exState = ES.find((e) => e.slug === 'massachusetts') ?? low;
const host = (u: string) => new URL(u).hostname.replace(/^www\./, '');

export default definePage({
  id: 'estate-tax-by-state',
  group: 'realestate',
  order: 40,
  slug: 'estate-tax-by-state',
  nav: 'Estate tax by state',
  card: `The ${RE.estate.length} jurisdictions with an estate tax, their 2026 thresholds and a calculator`,
  title: `Estate Tax by State 2026: Thresholds, Rates and Calculator`,
  description: `Estate tax by state for 2026 deaths: the ${RE.estate.length} jurisdictions that tax estates, thresholds from ${usd(low.exemption)}, top rates, and the federal ${usd(E.basicExclusion)} exclusion.`,
  h1: 'Estate tax by state',
  intro: `Federal estate tax now starts above ${usd(E.basicExclusion)}. ${RE.estate.length} jurisdictions start far lower.`,
  resume: `For deaths in 2026, the federal estate tax applies only to estates above ${usd(E.basicExclusion)} per person, the basic exclusion set by the One Big Beautiful Bill Act and confirmed in IRS Revenue Procedure 2025-32, with a top rate of ${E.topRatePct}% on the excess. A married couple can shelter twice that by electing portability on the first spouse's return. State estate taxes reach much smaller estates: ${listOf(ES.map((e) => e.name))} tax the estate of a resident, or the real estate a nonresident owns there, with thresholds from ${usd(low.exemption)} in ${low.name} to ${usd(high.exemption)} in ${high.name} and top rates up to ${num(Math.max(...ES.map(topRate)), 0)}%. An estate of ${usd(X)} owes no federal tax but about ${usd(stateEstateTax(X, exState))} to ${exState.name}. The calculator applies both, after debts and the deductions for a spouse and for charity.`,
  tool: 'estate',
  toolProps: { state: exState.slug, price: X },
  fold: true,
  body: (h) => `<h2>The federal estate tax in 2026</h2>
<p>The estate tax is figured on the taxable estate: everything the person owned or controlled at death, including the home, investments, retirement accounts, business interests and life insurance the person owned, minus debts, funeral and administration costs, and the unlimited deductions for property left to a U.S. citizen spouse or to charity. Taxable gifts made during life above the annual exclusion are added back, because the gift and estate taxes share one exclusion. The unified rate schedule runs from 18% to ${E.topRatePct}%, but the credit for the ${h.usd(E.basicExclusion)} basic exclusion wipes out every bracket below it, so in practice the tax is ${E.topRatePct}% of the amount above the exclusion: an estate of ${h.usd(16000000)} owes ${h.usd(federalEstateTax(16000000))}. The exclusion is indexed for inflation from 2027. A return, Form 706, is due nine months after death when the gross estate plus adjusted taxable gifts exceeds the filing threshold, and also when a surviving spouse wants to keep the unused exclusion.</p>
<h2>Portability between spouses</h2>
<p>When the first spouse dies, any part of the federal exclusion not used is the deceased spousal unused exclusion, or DSUE. The executor can transfer it to the surviving spouse by filing a timely Form 706, even when no tax is due. The survivor then adds it to his or her own exclusion, which lets a couple pass up to twice ${h.usd(E.basicExclusion)} free of federal tax. State estate taxes generally do not allow this transfer, which is why couples in states with a low threshold still use credit shelter trusts to use the first spouse's state exemption.</p>
<h2>The states that tax estates</h2>
<p>Each state sets its own threshold and table, and only a few follow the federal amount. Below the threshold no tax is due; above it, most states tax only the excess, but some reach back to the first dollar once the threshold is passed. ${ES.some((e) => e.method === 'cliff') ? 'New York is the sharpest case: an estate that exceeds its exclusion by more than 5% loses the exclusion entirely, so a small difference in value can cost hundreds of thousands of dollars.' : ''} The table gives the 2026 threshold, the rate range and the official source of each.</p>
${h.table(['State', `Threshold, 2026 deaths`, 'Rates above the threshold', 'How it applies', 'Official source'], ES.map((e) => [e.name, h.usd(e.exemption), range(e), e.notes, h.ext(e.urls[0], host(e.urls[0]))]), `State estate taxes for deaths in 2026, read on the official pages on ${h.day('2026-10-08')}.`, ['l', 'r', 'r', 'l', 'l'])}
<h2>Residents, nonresidents and real estate</h2>
<p>A state taxes the whole estate of its residents, wherever their investments are held, except real estate and tangible property located in another state. It taxes nonresidents only on real estate and tangible property located inside it. A Florida retiree who keeps a summer house in Maine or a condominium in Massachusetts can therefore owe estate tax there on that property alone, usually computed on the whole estate and then prorated to the share located in the state. Moving to a state without an estate tax is one of the most common planning steps for retirees with large estates, but the move must be real: a domicile is judged on where you live, vote, register cars and spend your time.</p>
<h2>Estate tax and inheritance tax are different taxes</h2>
<p>The estate tax is paid by the estate, before anything is distributed, and depends on the size of the whole estate. An inheritance tax is paid on what each heir receives and depends on the heir's relationship to the deceased: spouses are exempt everywhere, children usually are, and distant relatives and friends pay the most. ${listOf(inh)} levy an inheritance tax${both.length ? `, and ${listOf(both)} ${both.length > 1 ? 'levy' : 'levies'} both taxes, with a credit so the same property is not taxed twice` : ''}. See ${h.a('inheritance-tax-by-state', 'inheritance tax by state')} for the rates by heir.</p>
<h2>Ways the tax is reduced</h2>
<p>Lifetime gifts within the annual exclusion of ${h.usd(E.annualGiftExclusion)} per recipient in 2026 leave the estate without using any exclusion, and a married couple can give twice that to each person. Payments of tuition and medical bills made directly to the school or provider are not gifts at all. Charitable bequests are fully deductible, as is property left to a citizen spouse, although that only postpones the tax to the second death. Life insurance held in an irrevocable trust stays outside the estate. Several states with an estate tax add back gifts made within a few years of death, so the federal playbook does not always work at the state level. The mini-calculator below shows how much annual gifts move out of an estate over time.</p>
<!--mini:giftExclusion-->
<h2>Heirs and the step-up in basis</h2>
<p>Heirs do not pay income tax on what they inherit. Property included in the estate generally receives a basis equal to its value at death, so a home bought for ${h.usd(200000)} and worth ${h.usd(900000)} at death can be sold by the heirs for ${h.usd(900000)} with no capital gain. That rule is often worth more than the estate tax itself for families below the thresholds, and it is the reason investors hold property exchanged through a ${h.a('1031-exchange', '1031 exchange')} until death. A home sold by heirs uses the step-up, not the ${h.a('capital-gains-tax-on-home-sale', 'home sale exclusion')}.</p>`,
  faqs: [
    { q: 'What is the federal estate tax exemption for 2026?', a: `The basic exclusion amount for people who die in 2026 is $15,000,000, set by the One Big Beautiful Bill Act and published by the IRS in Revenue Procedure 2025-32. It is indexed for inflation from 2027 and is no longer scheduled to fall by half. A surviving spouse can add the unused exclusion of the first spouse to die, if the executor elected portability on a timely Form 706.` },
    { q: 'Which state has the lowest estate tax exemption?', a: `${low.name}, where the estate tax applies to estates above ${usd(low.exemption)} for deaths in 2026. ${ES[1] ? `${ES[1].name} follows at ${usd(ES[1].exemption)}.` : ''} These thresholds catch many families with a paid-off home, retirement accounts and life insurance, which is why residents of those states plan for state estate tax long before the federal threshold matters.` },
    { q: 'Do I owe estate tax on a vacation home in another state?', a: `Possibly. A state with an estate tax taxes real estate located within its borders even when the owner lived elsewhere. The tax is usually computed on the whole estate and prorated to the share located in the state, and it applies only if the estate exceeds that state's threshold. Holding the property in a properly structured entity can change the result; ask an estate attorney of that state.` },
    { q: 'Is life insurance subject to estate tax?', a: `Life insurance is included in the estate when the deceased owned the policy or held rights over it, such as changing the beneficiary, even though the payout goes directly to the beneficiary. It is excluded when the policy is owned by someone else or by an irrevocable life insurance trust, provided the transfer happened more than three years before death.` },
    { q: 'Who pays the estate tax, the estate or the heirs?', a: `The estate. The executor files the federal Form 706 and any state return and pays the tax from the estate's assets before distributing what is left, usually within nine months of death, with extensions available for filing and in some cases for payment. Heirs receive their share after tax. An inheritance tax, by contrast, is charged on each heir's share.` },
    { q: 'Can a state estate tax apply when no federal estate tax is due?', a: `Yes, and in 2026 that is the usual case. Every state threshold is at or below the federal ${usd(E.basicExclusion)}, so an estate of a few million dollars can owe state tax with no federal return due. The state still needs its own return, and some states require it even below their threshold when the gross estate passes a filing limit.` },
  ],
  related: ['inheritance-tax-by-state', 'capital-gains-tax-on-home-sale', '1031-exchange', 'property-tax-by-state'],
  sources: ['rp202532', 'irsEstate', 'irsI706', 'irs706'],
});
