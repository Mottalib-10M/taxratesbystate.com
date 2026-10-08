/** National parameters and the general official sources (src/data/params-2026.json). */
import raw from '../../data/params-2026.json';
import fed from '../../data/realestate-federal-2026.json';
export const P = raw;
export type SourceKey = keyof typeof raw.sources;
/** General sources: sales/property (params-2026.json) and real estate federal sources (realestate-federal-2026.json). */
export const SOURCES: Record<string, { url: string; label: string }> = { ...raw.sources, ...fed.sources };
export const RETRIEVED_AT = raw.retrieved_at;
