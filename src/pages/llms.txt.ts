/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES, STATE_PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
import { route } from '../i18n/routes';
import { stateBySlug, CENSUS } from '../lib/engine/states';
export function GET() {
  const lines = [
    '# State Tax Calc',
    '',
    `> Sales tax and property tax for the 50 US states and DC. Statewide sales tax rates, grocery, clothing and prescription rules and 2026 sales tax holidays are read on each state's revenue department; property tax medians come from the U.S. Census Bureau (ACS ${CENSUS.year}, tables B25103 and B25077). Local sales tax rates are entered by the user from the state's official lookup, never guessed. Published by Radif Partners. Last updated ${LAST_UPDATED}.`,
    '',
    '## Calculators and guides',
    `- [Sales tax calculator](${SITE_URL}${route('home', 'en')})`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## States',
    ...STATE_PAGES.map((s) => `- [${stateBySlug(s.slug).name}](${SITE_URL}${route(s.slug, 'en')}): ${s.intro}`),
    '',
    '## About',
    `- [How we calculate](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
