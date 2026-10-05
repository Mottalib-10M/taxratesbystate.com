/** The 51 jurisdictions: official facts (src/data/states/*.json) joined to the Census ACS figures. */
import type { StateFacts, CensusRow } from './types';
import census from '../../data/census-acs.json';

const files = import.meta.glob<{ default: StateFacts }>('../../data/states/*.json', { eager: true });

export interface State extends StateFacts { census: CensusRow }

export const CENSUS = census as { source: string; year: number; retrieved_at: string; urls: Record<string, string>; states: Record<string, CensusRow> };

export const STATES: State[] = Object.entries(files)
  .map(([file, m]) => {
    const s = m.default;
    const base = file.split('/').pop()!.replace(/\.json$/, '');
    if (s.slug !== base) throw new Error(`${file}: slug "${s.slug}" differs from the file name`);
    const c = CENSUS.states[s.name];
    if (!c) throw new Error(`${file}: no Census row for "${s.name}"`);
    return { ...s, census: c };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const stateBySlug = (slug: string): State => {
  const s = STATES.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown state: ${slug}`);
  return s;
};
export const stateByAbbr = (abbr: string): State => {
  const s = STATES.find((x) => x.abbr === abbr);
  if (!s) throw new Error(`Unknown state: ${abbr}`);
  return s;
};

/** Rank (1 = highest) of a state for a numeric key, ties sharing the better rank. */
export function rank(s: State, key: (x: State) => number): number {
  const v = key(s);
  return STATES.filter((x) => key(x) > v).length + 1;
}

/** Latest date at which the facts were read (shown on the pages). */
export const FACTS_VERIFIED = STATES.reduce((m, s) => (s.verified > m ? s.verified : m), '');
