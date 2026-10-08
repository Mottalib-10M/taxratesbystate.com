import { route, type Locale } from './routes';
import { PAGES, pageById, STATE_PAGES } from '../lib/pages';
import { stateBySlug } from '../lib/engine/states';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Sales tax calculator', method: 'How we calculate', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUP_LABEL: Record<Group, string> = { calculators: 'Calculators', sales: 'Sales tax', property: 'Property tax', realestate: 'Real estate' };
export const GROUP_ORDER: Group[] = ['calculators', 'sales', 'property', 'realestate'];
export const label = (id: string, _lang?: Locale) => CORE[id] ?? pageById(id)?.nav ?? (STATE_PAGES.some((s) => s.slug === id) ? stateBySlug(id).name : id);
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUP_ORDER.map((g) => ({ label: GROUP_LABEL[g], links: inGroup(g, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [...navCategories(lang), { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
/** Every state page, in the footer row (two clicks at most from anywhere, RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => STATE_PAGES.map((s) => link(s.slug, lang));
