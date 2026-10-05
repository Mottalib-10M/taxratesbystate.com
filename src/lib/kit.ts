/**
 * What a page file needs to write figures into its title, description, answer block and FAQ
 * without typing a single rate (RECETTE §17.4, point 7): the facts, the engines and the formatters.
 *   import { st, usd, rate, eff, sales } from '../../lib/kit';
 *   title: `Texas Sales Tax 2026: ${rate(st('texas').sales.stateRate)} State Rate…`
 */
import { STATES, stateBySlug, stateByAbbr, rank, CENSUS, FACTS_VERIFIED, type State } from './engine/states';
import { salesTax, preTaxFromTotal, addTax, removeTax, stateRateFor, localApplies, type Category } from './engine/sales';
import { propertyTax, taxAtEffectiveRate, millsToPercent, percentToMills } from './engine/property';
import { P } from './engine/params';
import { usd, rate, eff, num, day, dayShort } from './fmt';
export { STATES, stateByAbbr, rank, CENSUS, FACTS_VERIFIED, P, salesTax, preTaxFromTotal, addTax, removeTax, stateRateFor, localApplies, propertyTax, taxAtEffectiveRate, millsToPercent, percentToMills, usd, rate, eff, num, day, dayShort };
export type { State, Category };
export const st = (slug: string) => stateBySlug(slug);
/** Sales tax on a price in a state, state part only unless a local rate is given. */
export const tx = (slug: string, price: number, category: Category = 'general', localRate = 0) => salesTax({ state: st(slug), price, category, localRate });
/** Typical property tax bill (Census median ratio) on a home value in a state. */
export const ptx = (slug: string, value: number) => taxAtEffectiveRate(value, st(slug).census.effectiveRate);
/** States without a statewide sales tax. */
export const noSalesTax = () => STATES.filter((s) => !s.sales.hasStateSalesTax);
/** Natural list: "A, B and C". */
export const listOf = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
