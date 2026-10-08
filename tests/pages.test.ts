/**
 * Every page file is checked before it reaches the build (CONTRIBUTING-PAGES.md): snippet lengths,
 * answer block, FAQ length and uniqueness, links, sources, simulator, banned phrases.
 * One page only: PAGE_FILES=texas npx vitest run tests/pages.test.ts
 */
import { describe, it, expect } from 'vitest';
import { PAGES, STATE_PAGES } from '../src/lib/pages';
import { HOME } from '../src/content/home';
import { helpers } from '../src/lib/helpers';
import { MINIS } from '../src/lib/mini-specs';
import { SOURCES } from '../src/lib/engine/params';
import { STATES } from '../src/lib/engine/states';
import { ROUTES } from '../src/i18n/routes';

const only = (process.env.PAGE_FILES ?? '').split(',').filter(Boolean);
const pages = only.length ? PAGES.filter((p) => only.includes(p.id)) : PAGES;
const states = only.length ? STATE_PAGES.filter((p) => only.includes(p.slug)) : STATE_PAGES;
const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const BANNED = [/—/, /&mdash;/, /it[’']s important to note/i, /dive into/i, /whether you[’']re/i, /in today[’']s world/i, /\bMoreover\b/, /\bAdditionally\b/, /\bFurthermore\b/, /navigat(e|ing) the/i, /\bdelve\b/i];
const allQ = [...HOME.faqs.map((f) => f.q), ...PAGES.flatMap((p) => p.faqs.map((f) => f.q)), ...STATE_PAGES.flatMap((p) => p.faqs.map((f) => f.q))];
const allTitles = [HOME.title, ...PAGES.map((p) => p.title), ...STATE_PAGES.map((p) => p.title)];
const allDesc = [HOME.description, ...PAGES.map((p) => p.description), ...STATE_PAGES.map((p) => p.description)];
const ids = new Set(ROUTES.map((r) => r.id));
const h = helpers();
const snippet = (title: string, description: string) => {
  expect(title.length, title).toBeGreaterThanOrEqual(50); expect(title.length, title).toBeLessThanOrEqual(60);
  expect(description.length, description).toBeGreaterThanOrEqual(150); expect(description.length, description).toBeLessThanOrEqual(160);
  expect(title).toMatch(/2026/); expect(description).toMatch(/2026/);
  expect(allTitles.filter((t) => t === title).length, title).toBe(1);
  expect(allDesc.filter((t) => t === description).length, description).toBe(1);
};
const faqCheck = (faqs: Array<{ q: string; a: string }>, min: number, max: number) => {
  expect(faqs.length).toBeGreaterThanOrEqual(min); expect(faqs.length).toBeLessThanOrEqual(max);
  for (const f of faqs) {
    const n = words(f.a); expect(n, f.q).toBeGreaterThanOrEqual(42); expect(n, f.q).toBeLessThanOrEqual(88);
    expect(allQ.filter((q) => q === f.q).length, f.q).toBe(1);
  }
};
const clean = (text: string) => {
  for (const b of BANNED) expect(text, String(b)).not.toMatch(b);
  expect(text).not.toMatch(/NaN|undefined|\[object|Infinity/);
};

describe('home', () => {
  it('snippets, answer block, FAQ, sections', () => {
    snippet(HOME.title, HOME.description);
    expect(words(HOME.resume)).toBeGreaterThanOrEqual(120);
    faqCheck(HOME.faqs, 6, 8);
    const secs = HOME.sections(h);
    expect(secs.length).toBeGreaterThanOrEqual(5);
    clean([HOME.resume, HOME.intro, HOME.tableIntro(h), HOME.propertyIntro, ...secs.map((s) => s.title + s.html), ...HOME.faqs.flatMap((f) => [f.q, f.a])].join(' '));
    for (const sl of HOME.sourceStates) expect(STATES.some((s) => s.slug === sl), sl).toBe(true);
  });
});

describe.each(pages.map((p) => [p.id, p] as const))('page %s', (_id, p) => {
  it('snippets (RECETTE §11)', () => { snippet(p.title, p.description); expect(p.slug).toMatch(/^[a-z0-9-]+$/); });
  it('answer block of 120 words or more (RECETTE §21)', () => expect(words(p.resume)).toBeGreaterThanOrEqual(120));
  it('FAQ: unique, 40 to 90 words (RECETTE §7)', () => faqCheck(p.faqs, 3, 8));
  it('links, sources, simulator', () => {
    expect(() => p.body(h)).not.toThrow();
    for (const r of p.related) expect(ids.has(r), `related ${r}`).toBe(true);
    expect(p.related.length).toBeGreaterThanOrEqual(3);
    expect(p.sources.length).toBeGreaterThanOrEqual(2);
    for (const s of p.sources) expect(s.includes(':') ? STATES.some((x) => x.slug === s.split(':')[1]) : !!SOURCES[s], s).toBe(true);
    expect(!!p.tool || !!p.mini, 'a tool or a mini-simulator (RECETTE §9.3)').toBe(true);
    if (p.mini) { expect(MINIS[p.mini], p.mini).toBeTruthy(); const spec = MINIS[p.mini](p.miniArg); const out = spec.run(Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]))); expect(out.head[1]).not.toMatch(/NaN|undefined/); }
    for (const m of p.body(h).matchAll(/<!--mini:([A-Za-z0-9_-]+?)(?:\|[a-z-]+)?-->/g)) expect(MINIS[m[1]], m[1]).toBeTruthy();
  });
  it('no banned phrase, no em dash', () => clean([p.title, p.description, p.h1, p.intro, p.resume, p.card, ...p.faqs.flatMap((f) => [f.q, f.a]), p.body(h)].join(' ')));
  it('body length (guides 600+ words of prose outside tables, tool pages 250+)', () => {
    const n = words(p.body(h).replace(/<table[\s\S]*?<\/table>/g, ''));
    expect(n).toBeGreaterThanOrEqual(p.tool ? 250 : 600);
  });
});

describe.each(states.map((p) => [p.slug, p] as const))('state %s', (_s, p) => {
  it('snippets (RECETTE §11)', () => snippet(p.title, p.description));
  it('answer block of 120 words or more (RECETTE §21)', () => expect(words(p.resume)).toBeGreaterThanOrEqual(120));
  it('FAQ: 3 to 5, unique, 40 to 90 words', () => faqCheck(p.faqs, 3, 5));
  it('prose: 180+ words on each tax, related pages exist', () => {
    expect(words(p.sales(h))).toBeGreaterThanOrEqual(180);
    expect(words(p.property(h))).toBeGreaterThanOrEqual(180);
    expect(p.related.length).toBeGreaterThanOrEqual(3);
    for (const r of p.related) expect(ids.has(r), `related ${r}`).toBe(true);
  });
  it('no banned phrase, no em dash', () => clean([p.title, p.description, p.intro, p.resume, ...p.faqs.flatMap((f) => [f.q, f.a]), p.sales(h), p.property(h)].join(' ')));
});

it('slugs are unique', () => { const s = [...PAGES.map((p) => p.slug), ...STATE_PAGES.map((p) => p.slug)]; expect(new Set(s).size).toBe(s.length); });
