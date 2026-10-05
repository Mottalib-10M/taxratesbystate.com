/** Registry: every file of `src/content/pages/` and `src/content/states/` is loaded here. */
import type { PageDef, StateDef } from './page-types';
import { STATES } from './engine/states';
const mods = import.meta.glob<{ default: PageDef }>(['../content/pages/*.ts', '!../content/pages/_*.ts'], { eager: true });
export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.id !== base) throw new Error(`${file}: id "${g.id}" differs from the file name`);
    return g;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const pageById = (id: string) => PAGES.find((p) => p.id === id);

const smods = import.meta.glob<{ default: StateDef }>('../content/states/*.ts', { eager: true });
export const STATE_PAGES: StateDef[] = Object.entries(smods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.slug !== base) throw new Error(`${file}: slug "${g.slug}" differs from the file name`);
    if (!STATES.some((s) => s.slug === g.slug)) throw new Error(`${file}: no facts file src/data/states/${g.slug}.json`);
    return g;
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));
export const statePageBySlug = (slug: string) => STATE_PAGES.find((p) => p.slug === slug);
