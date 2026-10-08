import { definePage } from '../../lib/page-types';
import { usd, listOf, num } from '../../lib/kit';
import { inheritanceTax } from '../../lib/engine/realestate';
import { RE } from '../../lib/realestate';

const I = RE.inheritance;
const names = I.map((x) => x.name);
const pa = I.find((x) => x.slug === 'pennsylvania') ?? I[0];
const share = 300000;
const paChild = pa.classes[1], paOther = pa.classes.find((c) => /^Other heirs/.test(c.who)) ?? pa.classes[pa.classes.length - 1];
const maxRate = (x: (typeof I)[number]) => Math.max(...x.classes.flatMap((c) => c.brackets.map((b) => b.ratePct)));
const top = [...I].sort((a, b) => maxRate(b) - maxRate(a))[0];
const host = (u: string) => new URL(u).hostname.replace(/^www\./, '');
const classLine = (c: (typeof I)[number]['classes'][number]) => {
  const free = c.brackets[0]?.ratePct === 0 && c.brackets[0].to !== null ? c.brackets[0].to : c.exemption;
  const rates = c.brackets.map((b) => b.ratePct).filter((r) => r > 0);
  const r = !rates.length ? 'exempt' : Math.min(...rates) === Math.max(...rates) ? `${num(rates[0], 1)}%` : `${num(Math.min(...rates), 1)}% to ${num(Math.max(...rates), 1)}%`;
  return `${c.who}: ${r}${rates.length && free ? (c.mode === 'whole' ? ` of the whole share above ${usd(free)}` : ` above ${usd(free)}`) : ''}`;
};

export default definePage({
  id: 'inheritance-tax-by-state',
  group: 'realestate',
  order: 50,
  slug: 'inheritance-tax-by-state',
  nav: 'Inheritance tax by state',
  card: `The ${I.length} states that tax heirs, the rate for each relationship and a calculator`,
  title: 'Inheritance Tax by State 2026: Rates by Heir and Calculator',
  description: `Inheritance tax by state in 2026: ${listOf(names)} tax heirs. Rates by relationship, exemptions, a calculator.`,
  h1: 'Inheritance tax by state',
  intro: 'There is no federal inheritance tax. Five states charge heirs, and the rate depends on who you were to the person who died.',
  resume: `An inheritance tax is charged on what each heir receives, not on the estate as a whole, and the federal government does not levy one. In 2026, ${listOf(names)} do. All of them exempt a surviving spouse, and the rate rises as the family tie weakens: children and grandchildren pay little or nothing, siblings more, and nieces, nephews, friends and unrelated heirs the most, up to ${num(maxRate(top), 0)}% in ${top.name}. The tax follows the residence of the person who died, plus any real estate located in the state, wherever the heir lives. A ${usd(share)} inheritance from a ${pa.name} parent is taxed ${usd(inheritanceTax(share, paChild))}, and the same amount left to a friend ${usd(inheritanceTax(share, paOther))}. The calculator gives the tax for each relationship in each state, from the rates published by the state revenue departments.`,
  tool: 'inheritance',
  toolProps: { state: pa.slug, price: share },
  fold: true,
  body: (h) => `<h2>Who pays, and on what</h2>
<p>The tax is owed on each heir's share, valued at the date of death after the estate's debts and expenses. The executor usually files the return and pays the tax out of the estate, then charges it to the share of the heir concerned, so in practice an heir receives the inheritance with the tax already withheld. Assets that pass outside a will, such as jointly held accounts and payable-on-death accounts, are often taxable too; life insurance paid to a named beneficiary is generally exempt. Retirement accounts are treated differently from state to state. The heir's own state of residence does not matter: a niece in Ohio inheriting from an aunt in ${pa.name} pays ${pa.name} tax.</p>
<h2>Rates by state and relationship</h2>
<p>Each state groups heirs into classes. The table lists them as the revenue departments publish them, with the exemption that comes before the rate where there is one.</p>
${h.table(['State', 'Classes of heirs and rates', 'Official source'], I.map((x) => [x.name, x.classes.map(classLine).join('<br>'), h.ext(x.urls[0], host(x.urls[0]))]), `Inheritance taxes for deaths in 2026, read on the official pages on ${h.day('2026-10-08')}.`, ['l', 'l', 'l'])}
${I.map((x) => `<h2>${x.name}</h2>\n<p>${x.notes}</p>`).join('\n')}
<h2>When there is also an estate tax</h2>
<p>An estate tax is paid by the estate as a whole once it passes a threshold; an inheritance tax depends on the heir. A family can face both: a large estate in a state that levies both pays its estate tax first, with a credit for the inheritance tax so the same dollars are not taxed twice. The thresholds and rates are on ${h.a('estate-tax-by-state', 'estate tax by state')}. Neither tax is an income tax: heirs do not report an inheritance as income, and inherited property generally takes a basis equal to its value at death, so selling an inherited house soon after the death produces little taxable gain. Heirs who move into the house instead start a new ownership period for the ${h.a('capital-gains-tax-on-home-sale', 'home sale exclusion')}.</p>`,
  faqs: [
    { q: 'Is there a federal inheritance tax?', a: `No. The federal government taxes large estates, above $15,000,000 per person for deaths in 2026, but it does not tax heirs on what they receive, and an inheritance is not income on the heir's federal return. Only a few states tax inheritances, and only when the person who died lived there or owned real estate there.` },
    { q: 'Do children pay inheritance tax?', a: `In most of the states with the tax, children pay nothing or a low rate. ${pa.name} is the main exception: lineal heirs such as children and grandchildren pay ${num(paChild.brackets[0]?.ratePct ?? 0, 1)}%, with no exemption amount. Elsewhere, children are exempt outright or above a modest threshold. In New Jersey, stepchildren are treated like children.` },
    { q: 'Does the state where the heir lives matter for inheritance tax?', a: `No. What matters is the state where the person who died lived, plus the state where any real estate is located. An heir living in a state with no inheritance tax still pays the tax of the deceased's state, and an heir living in a state with the tax pays nothing on an inheritance from a resident of a state without one.` },
    { q: 'Is life insurance subject to inheritance tax?', a: `Life insurance paid to a named beneficiary is generally exempt from inheritance tax, as Maryland's statute spells out. The policy can still count toward an estate tax if the deceased owned it, which matters in a state that levies both taxes. Proceeds paid to the estate itself, rather than to a named person, can be treated differently: check the state's rules.` },
    { q: 'How can heirs reduce inheritance tax?', a: `The person planning the estate has more options than the heirs: leaving more to a spouse or to exempt relatives, giving during life where the state does not add back gifts, and naming beneficiaries on life insurance. Heirs can sometimes benefit from a discount for early payment, as in ${pa.name}, and should claim every deductible debt and expense of the estate before the tax is computed.` },
  ],
  related: ['estate-tax-by-state', 'capital-gains-tax-on-home-sale', 'closing-costs-calculator', 'property-tax-by-state'],
  sources: ['irsEstate', 'rp202532'],
});
