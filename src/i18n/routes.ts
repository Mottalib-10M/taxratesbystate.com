import { makeRouter, type RouteDef } from './routes-core';
import { PAGES, STATE_PAGES } from '../lib/pages';
/** English only (United States). The /en/ prefix is kept from the trame so that the checkers and the
 *  root redirect behave as on every other site of the portfolio. */
export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, slug: string, noindex = false): RouteDef<Locale> => ({ id, paths: { en: `/en/${slug}/` }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { en: '/en/' } },
  R('method', 'method'),
  R('about', 'about'),
  R('widget', 'widget', true),
  R('contact', 'contact', true),
  R('editorial', 'editorial-policy', true),
  R('privacy', 'privacy', true),
  R('terms', 'legal-notice', true),
  R('cookies', 'cookies', true),
];
/** State pages live at /en/<state>/ (e.g. /en/texas/); their id is the slug. */
export const ROUTES: RouteDef<Locale>[] = [CORE[0], ...PAGES.map((p) => R(p.id, p.slug)), ...STATE_PAGES.map((s) => R(s.slug, s.slug)), ...CORE.slice(1)];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
