/**
 * Inheritance tax calculator: tax on one heir's share in the states that tax heirs, by the class
 * of relationship (official rates and exemptions, src/data/realestate-states-2026.json).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultPanel from './ResultPanel';
import { inheritanceTax, type InhClass } from '../../lib/engine/realestate';
import { formatMoney, formatNumber } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Row { slug: string; name: string; classes: InhClass[] }
interface Props { states: Row[]; state?: string; price?: number; methodHref?: string; idPrefix?: string }
const usd = (n: number) => formatMoney(n, 0);

export default function InheritanceTaxCalculator({ states, state = 'pennsylvania', price: p0 = 300000, methodHref, idPrefix = 'it' }: Props) {
  const S0 = states.find((x) => x.slug === state) ?? states[0];
  const [slug, setSlug] = useState(S0.slug);
  const first = (r: Row) => Math.min(1, r.classes.length - 1);
  const [cls, setCls] = useState(first(S0));
  const [share, setShare] = useState(p0);
  useEffect(() => {
    const u = readParams(window.location.search);
    const s = str(u, 's', S0.slug); const n = states.find((x) => x.slug === s);
    if (n) { setSlug(n.slug); const c = num(u, 'k', first(n)); setCls(c >= 0 && c < n.classes.length ? c : first(n)); }
    setShare(num(u, 'v', p0));
  }, []);
  useEffect(() => { updateURL({ s: slug, k: cls, v: share }); }, [slug, cls, share]);
  const St = states.find((x) => x.slug === slug) ?? states[0];
  const C = St.classes[cls] ?? St.classes[0];
  const r = useMemo(() => {
    const all = St.classes.map((c) => ({ who: c.who, tax: inheritanceTax(share, c) }));
    return { tax: inheritanceTax(share, C), all };
  }, [St, C, share]);
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={`${p}-state`} label="State where the deceased lived" value={slug} onChange={(s) => { setSlug(s); const n = states.find((x) => x.slug === s); setCls(n ? first(n) : 0); }} options={states.map((x) => ({ value: x.slug, label: x.name }))} help="Real estate is taxed by the state where it sits." />
        <SelectField id={`${p}-class`} label="Heir's relationship to the deceased" value={String(cls)} onChange={(v) => setCls(Number(v))} options={St.classes.map((c, i) => ({ value: String(i), label: c.who }))} />
        <NumberField id={`${p}-share`} label="Value this heir receives" value={share} onChange={setShare} unit="$" max={10_000_000_000} help="After the estate's debts and expenses." />
      </form>
      <ResultPanel label={`${St.name} inheritance tax on this share`} value={usd(r.tax)}
        sub={`${formatNumber(share ? (r.tax / share) * 100 : 0, 1)}% of the share · heir keeps ${usd(share - r.tax)}`}
        rows={r.all.map((a) => [`Same share, ${a.who}`, usd(a.tax)] as [string, string])}
        note="Each heir is taxed on what he or she receives; exemptions apply per heir. Discounts for early payment are not included. "
        methodHref={methodHref} />
    </div>
  );
}
