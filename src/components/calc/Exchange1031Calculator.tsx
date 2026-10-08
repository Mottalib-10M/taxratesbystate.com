/**
 * 1031 exchange calculator (Form 8824 instructions): realized gain, cash and mortgage boot, gain
 * recognized now, gain deferred, basis of the replacement property, and the tax deferred compared with
 * a plain sale (federal 0/15/20%, 25% on depreciation, NIIT 3.8%, state rate editable).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultPanel from './ResultPanel';
import { exchange1031, federalGainTax, stateGainTax, type Filing, type StateGain } from '../../lib/engine/realestate';
import { formatMoney } from '../../lib/format';
import { rate } from '../../lib/fmt';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { FILINGS } from './HomeSaleCalculator';

type S = StateGain & { flat: boolean; note: string | null };
interface Props { states: S[]; state?: string; price?: number; methodHref?: string; idPrefix?: string }
const usd = (n: number) => formatMoney(n, 0);
const D = { b: 420000, d: 180000, c: 45000, m: 250000, r: 1000000, n: 450000, i: 180000 };

export default function Exchange1031Calculator({ states, state = 'florida', price: p0 = 800000, methodHref, idPrefix = 'x1' }: Props) {
  const S0 = states.find((x) => x.slug === state) ?? states[0];
  const [slug, setSlug] = useState(S0.slug);
  const [filing, setFiling] = useState<Filing>('joint');
  const [sale, setSale] = useState(p0);
  const [costs, setCosts] = useState(D.c);
  const [basis, setBasis] = useState(D.b);
  const [depr, setDepr] = useState(D.d);
  const [oldDebt, setOldDebt] = useState(D.m);
  const [repl, setRepl] = useState(D.r);
  const [newDebt, setNewDebt] = useState(D.n);
  const [income, setIncome] = useState(D.i);
  const [stRate, setStRate] = useState(S0.topRatePct);
  useEffect(() => {
    const u = readParams(window.location.search);
    const s = str(u, 's', S0.slug); const n = states.find((x) => x.slug === s);
    if (n) { setSlug(n.slug); setStRate(num(u, 'sr', n.topRatePct)); }
    const f = str(u, 'f', 'joint'); if (FILINGS.some((o) => o.value === f)) setFiling(f as Filing);
    setSale(num(u, 'p', p0)); setCosts(num(u, 'c', D.c)); setBasis(num(u, 'b', D.b)); setDepr(num(u, 'd', D.d));
    setOldDebt(num(u, 'm', D.m)); setRepl(num(u, 'r', D.r)); setNewDebt(num(u, 'n', D.n)); setIncome(num(u, 'i', D.i));
  }, []);
  useEffect(() => { updateURL({ s: slug, f: filing, p: sale, c: costs, b: basis, d: depr, m: oldDebt, r: repl, n: newDebt, i: income, sr: stRate }); }, [slug, filing, sale, costs, basis, depr, oldDebt, repl, newDebt, income, stRate]);
  const St = states.find((x) => x.slug === slug) ?? states[0];
  const pick = (s: string) => { setSlug(s); const n = states.find((x) => x.slug === s); if (n) setStRate(n.topRatePct); };
  const r = useMemo(() => {
    const x = exchange1031({ salePrice: sale, costs, adjustedBasis: basis, depreciation: depr, oldDebt, replacementPrice: repl, newDebt });
    const tax = (u: number, g: number) => { const f = federalGainTax({ filing, otherTaxable: income, ltcg: g, unrecaptured: u }); return f.federalOnGain + f.niit + stateGainTax(u + g, St, stRate, income); };
    const allU = Math.min(x.realized, Math.max(0, depr));
    const sold = tax(allU, x.realized - allU);
    const now = tax(x.recognized1250, x.recognizedCapital);
    return { x, sold, now, deferredTax: sold - now };
  }, [sale, costs, basis, depr, oldDebt, repl, newDebt, filing, income, St, stRate]);
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-sale`} label="Sale price of the property you give up" value={sale} onChange={setSale} unit="$" max={500_000_000} />
        <NumberField id={`${p}-basis`} label="Adjusted basis (after depreciation)" value={basis} onChange={setBasis} unit="$" max={500_000_000} help="Purchase price + improvements − depreciation taken." />
        <NumberField id={`${p}-depr`} label="Depreciation taken over the years" value={depr} onChange={setDepr} unit="$" max={500_000_000} help="Taxed up to 25% when recognized." />
        <NumberField id={`${p}-old`} label="Mortgage paid off at the sale" value={oldDebt} onChange={setOldDebt} unit="$" max={500_000_000} />
        <NumberField id={`${p}-repl`} label="Price of the replacement property" value={repl} onChange={setRepl} unit="$" max={500_000_000} />
        <NumberField id={`${p}-new`} label="New mortgage on the replacement" value={newDebt} onChange={setNewDebt} unit="$" max={500_000_000} />
        <SelectField id={`${p}-filing`} label="Filing status" value={filing} onChange={(v) => setFiling(v as Filing)} options={FILINGS} />
        <SelectField id={`${p}-state`} label="State" value={slug} onChange={pick} options={states.map((x) => ({ value: x.slug, label: `${x.name} (${x.taxesCapitalGains ? rate(x.topRatePct) : 'no tax on the gain'})` }))} />
      </form>
      <details className="mt-4 rounded-lg border border-navy-200 px-4 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-navy-800">Advanced: costs, other income, state rate</summary>
        <div className="mt-3 grid gap-x-5 gap-y-4 pb-2 sm:grid-cols-2">
          <NumberField id={`${p}-costs`} label="Exchange and selling costs" value={costs} onChange={setCosts} unit="$" max={50_000_000} help="Commission, intermediary fee, title, transfer tax." />
          <NumberField id={`${p}-income`} label="Other taxable income this year" value={income} onChange={setIncome} unit="$" max={100_000_000} />
          <NumberField id={`${p}-strate`} label={`State tax rate on the gain (${St.name})`} value={stRate} onChange={setStRate} unit="%" max={20} decimals={2} help={St.cgExclusionPct ? `${St.name} excludes ${St.cgExclusionPct}% of a long-term gain before this rate.` : 'Top rate by default; lower if your income stays in a lower bracket.'} />
        </div>
      </details>
      <ResultPanel label="Tax deferred by the exchange" value={usd(Math.max(0, r.deferredTax))}
        sub={r.x.boot > 0 ? `${usd(r.x.recognized)} of boot taxed now: ${usd(r.now)} due this year` : 'No boot: the whole gain is deferred'}
        rows={[
          ['Realized gain', usd(r.x.realized)],
          ['Cash boot (equity not reinvested)', usd(r.x.cashBoot)],
          ['Mortgage boot (debt not replaced)', usd(r.x.debtBoot)],
          ['Gain recognized now', usd(r.x.recognized)],
          ['Gain deferred', usd(r.x.deferred)],
          ['Basis of the replacement property', usd(r.x.newBasis)],
          ['Tax on a plain sale instead', usd(r.sold)],
        ]}
        note="Federal 0/15/20% stacked on your other income, 25% cap on depreciation, 3.8% NIIT, state rate on the recognized gain. Exchange costs are treated as reducing the amount realized."
        methodHref={methodHref} />
    </div>
  );
}
