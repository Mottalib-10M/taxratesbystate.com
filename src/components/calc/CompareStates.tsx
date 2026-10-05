/**
 * Two states side by side: state sales tax on a purchase and the typical property tax on a home.
 * Local sales taxes are left out on purpose (they vary by address): the comparison says so.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { salesTax } from '../../lib/engine/sales';
import { taxAtEffectiveRate } from '../../lib/engine/property';
import type { CompactState } from '../../lib/engine/compact';
import { formatMoney } from '../../lib/format';
import { rate, eff } from '../../lib/fmt';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { states: CompactState[]; a?: string; b?: string; censusYear: number; idPrefix?: string }
const usd = (n: number) => formatMoney(n, 0);

export default function CompareStates({ states, a = 'california', b = 'texas', censusYear, idPrefix = 'cmp' }: Props) {
  const [sa, setSa] = useState(a);
  const [sb, setSb] = useState(b);
  const [spend, setSpend] = useState(30000);
  const [home, setHome] = useState(400000);
  useEffect(() => {
    const u = readParams(window.location.search);
    const x = str(u, 'a', a), y = str(u, 'b', b);
    if (states.some((s) => s.slug === x)) setSa(x);
    if (states.some((s) => s.slug === y)) setSb(y);
    setSpend(num(u, 'sp', 30000)); setHome(num(u, 'h', 400000));
  }, []);
  useEffect(() => { updateURL({ a: sa, b: sb, sp: spend, h: home }); }, [sa, sb, spend, home]);
  const rows = useMemo(() => [sa, sb].map((slug) => {
    const S = states.find((s) => s.slug === slug) ?? states[0];
    const st = salesTax({ state: S.facts, price: spend });
    const pt = taxAtEffectiveRate(home, S.census.effectiveRate);
    return { S, st, pt, total: st.tax + pt };
  }), [sa, sb, spend, home, states]);
  const opts = states.map((s) => ({ value: s.slug, label: s.name }));
  const p = idPrefix;
  const diff = rows[0].total - rows[1].total;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={`${p}-a`} label="First state" value={sa} onChange={setSa} options={opts} />
        <SelectField id={`${p}-b`} label="Second state" value={sb} onChange={setSb} options={opts} />
        <NumberField id={`${p}-spend`} label="Taxable purchases in a year" value={spend} onChange={setSpend} unit="$" max={10_000_000} help="Goods taxed at the general rate (not groceries)." />
        <NumberField id={`${p}-home`} label="Home value" value={home} onChange={setHome} unit="$" max={50_000_000} />
      </form>
      <div aria-live="polite" className="mt-6 grid gap-4 sm:grid-cols-2">
        {rows.map(({ S, st, pt, total }) => (
          <div key={S.slug} className="rounded-xl bg-accent-50 p-4">
            <p className="text-sm font-semibold text-navy-900">{S.name}</p>
            <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{usd(total)}</p>
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
              <tr><td className="py-1.5 pr-3 text-navy-700">State sales tax · {rate(st.stateRate)}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(st.tax)}</td></tr>
              <tr><td className="py-1.5 pr-3 text-navy-700">Property tax · {eff(S.census.effectiveRate)}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(pt)}</td></tr>
            </tbody></table>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-navy-800">{diff === 0 ? 'Same total in both states.' : `${(diff > 0 ? rows[1] : rows[0]).S.name} costs ${usd(Math.abs(diff))} less a year on these figures.`} Local sales taxes are not included (they depend on the address); property tax uses each state's median effective rate, Census ACS {censusYear}.</p>
    </div>
  );
}
