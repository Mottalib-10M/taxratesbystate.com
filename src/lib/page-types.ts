/**
 * One page = ONE data file (CONTRIBUTING-PAGES.md):
 *  - a topic page: `src/content/pages/<id>.ts` (PageDef);
 *  - a state page: `src/data/states/<slug>.json` (official facts) + `src/content/states/<slug>.ts` (StateDef, the prose).
 * Routes, menus, footer, sitemap, schemas and internal links read them alone.
 */
import type { State, Category } from './kit';
import type { SalesResult } from './engine/sales';

export type Group = 'calculators' | 'sales' | 'property' | 'realestate';
export interface FAQ { q: string; a: string }

export interface Helpers {
  /** Internal link by page id or state slug. An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  usd: (n: number, decimals?: number) => string;
  /** Statutory rate in percent: 6.25 → "6.25%". */
  rate: (p: number) => string;
  /** Effective property tax ratio: 0.0131 → "1.31%". */
  eff: (ratio: number) => string;
  num: (n: number, decimals?: number) => string;
  day: (iso: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a general official source of params-2026.json. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL (state facts carry their own URLs). */
  ext: (url: string, text: string) => string;
  /** A state's facts and Census row. */
  st: (slug: string) => State;
  /** Sales tax engine shorthand. */
  tx: (slug: string, price: number, category?: Category, localRate?: number) => SalesResult;
  /** Typical property tax bill at the state's Census effective rate. */
  ptx: (slug: string, value: number) => number;
  /** Ruled box in the press style. */
  box: (title: string, html: string) => string;
  states: State[];
  /** The 51-state table (or a filtered part of it), generated from the facts. */
  stateTable: (cols?: 'all' | 'sales' | 'property' | 'groceries' | 'clothing', sortBy?: 'name' | 'rate' | 'eff' | 'bill', filter?: (s: State) => boolean, caption?: string) => string;
}

export type ToolKind = 'sales' | 'reverse' | 'property' | 'mills' | 'compare' | 'homesale' | 'x1031' | 'closing' | 'estate' | 'inheritance';
export interface ToolProps { state?: string; lockState?: boolean; category?: Category; price?: number; mode?: 'add' | 'remove'; advanced?: boolean }

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more, with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  tool?: ToolKind;
  toolProps?: ToolProps;
  /** Mini-simulator after the answer block (`src/lib/minis/<kind>.ts`). Ignored when `tool` is set. */
  mini?: string;
  /** Data for the mini (JSON string built from the facts with the kit). */
  miniArg?: string;
  /** Long article folded into one <details> per H2 (RECETTE §26); minis stay visible. */
  fold?: boolean;
  related: string[];
  /** Keys of params-2026.json > sources, or "state:<slug>" for a state's official rate page. */
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;

export interface StateDef {
  /** = file name = facts slug. */
  slug: string;
  /** Optional override; by default built from the facts. 50–60 characters. */
  title: string;
  description: string;
  intro: string;
  /** ONE paragraph of 120 words or more, what is singular about this state (RECETTE §21). */
  resume: string;
  /** Prose of the sales tax section (HTML), written for this state only. */
  sales: (h: Helpers) => string;
  /** Prose of the property tax section (HTML), written for this state only. */
  property: (h: Helpers) => string;
  faqs: FAQ[];
  /** Neighboring or comparable states (slugs) and topic pages (ids). */
  related: string[];
}
export const defineState = (s: StateDef): StateDef => s;
