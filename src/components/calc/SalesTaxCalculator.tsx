/**
 * Sales tax calculator: the state part from the state's own rules (groceries, clothing, drugs),
 * the local part typed by the visitor (we never guess a city or county rate), forward or reverse.
 * First render = build defaults (RECETTE §17.5); the shared link is applied in useEffect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import StackedBar from '../ui/StackedBar';
import { salesTax, preTaxFromTotal, localApplies, type Category } from '../../lib/engine/sales';
import type { CompactState } from '../../lib/engine/compact';
import { formatMoney } from '../../lib/format';
import { rate } from '../../lib/fmt';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { states: CompactState[]; state?: string; lockState?: boolean; category?: Category; price?: number; mode?: 'add' | 'remove'; methodHref?: string; idPrefix?: string }
const usd = (n: number, d = 2) => formatMoney(n, d);
const CAT_LABEL: Record<Category, string> = { general: 'Most goods', groceries: 'Groceries (food for home)', clothing: 'Clothing (one item)', prescription: 'Prescription drugs' };

export default function SalesTaxCalculator({ states, state = 'california', lockState = false, category = 'general', price = 100, mode = 'add', methodHref = '/en/method/', idPrefix = 'st' }: Props) {
  const [slug, setSlug] = useState(state);
  const [amount, setAmount] = useState(price);
  const [local, setLocal] = useState(0);
  const [cat, setCat] = useState<Category>(category);
  const [m, setM] = useState<'add' | 'remove'>(mode);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!lockState) { const s = str(u, 's', state); if (states.some((x) => x.slug === s)) setSlug(s); }
    setAmount(num(u, 'p', price)); setLocal(num(u, 'l', 0));
    const c = str(u, 'c', category) as Category; if (c in CAT_LABEL) setCat(c);
    setM(str(u, 'm', mode) === 'remove' ? 'remove' : 'add');
  }, []);
  useEffect(() => { updateURL({ s: lockState ? undefined : slug, p: amount, l: local || undefined, c: cat === 'general' ? undefined : cat, m: m === 'add' ? undefined : m }); }, [slug, amount, local, cat, m]);
  const S = states.find((x) => x.slug === slug) ?? states[0];
  const r = useMemo(() => (m === 'add'
    ? salesTax({ state: S.facts, price: amount, localRate: local, category: cat })
    : preTaxFromTotal(amount, { state: S.facts, localRate: local, category: cat })), [S, amount, local, cat, m]);
  const lApplies = localApplies(S.facts, cat);
  const noState = !S.facts.sales.hasStateSalesTax;
  const p = idPrefix;
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {lockState
          ? <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0"><span className="mb-1 block text-sm font-medium text-navy-700">State</span><p className="flex h-12 items-center rounded-lg border border-navy-200 bg-navy-50 px-4 font-semibold text-navy-900">{S.name} · state rate {rate(S.facts.sales.stateRate)}</p><span /></div>
          : <SelectField id={`${p}-state`} label="State" value={slug} onChange={setSlug} options={states.map((x) => ({ value: x.slug, label: `${x.name} (${rate(x.facts.sales.stateRate)})` }))} help="Statewide rate, read on the state's revenue department site." />}
        <NumberField id={`${p}-price`} label={m === 'add' ? 'Price before tax' : 'Total paid, tax included'} value={amount} onChange={setAmount} unit="$" max={10_000_000} decimals={2} help={cat === 'clothing' ? 'Price of one item: clothing thresholds apply per item.' : undefined} />
        <NumberField id={`${p}-local`} label="Local rate (county, city, district)" value={local} onChange={setLocal} unit="%" max={10} decimals={3}
          help={!S.facts.sales.local.allowed ? `${S.name} has no local sales taxes.` : 'Type the local part from the state’s address lookup (link below).'} />
        <SelectField id={`${p}-cat`} label="What you are buying" value={cat} onChange={(v) => setCat(v as Category)} options={(Object.keys(CAT_LABEL) as Category[]).map((c) => ({ value: c, label: CAT_LABEL[c] }))} />
        <Toggle id={`${p}-mode`} label="Direction" value={m} onChange={(v) => setM(v as 'add' | 'remove')} options={[{ value: 'add', label: 'Add tax' }, { value: 'remove', label: 'Remove tax' }]} />
      </form>
      <div aria-live="polite" className="mt-6 rounded-xl bg-accent-50 p-4 sm:p-5">
        <p className="text-sm font-medium text-navy-700">{m === 'add' ? 'Total to pay' : 'Price before tax'}</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{usd(m === 'add' ? r.total : r.price)}</p>
        <p className="mt-1 text-sm text-navy-700">Sales tax {usd(r.tax)} · {rate(Math.round(r.effectiveRate * 1000) / 1000)} of the price{noState ? ` · ${S.name} has no statewide sales tax` : ''}</p>
        <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
          <tr><td className="py-1.5 pr-3 text-navy-700">Price before tax</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.price)}</td></tr>
          <tr><td className="py-1.5 pr-3 text-navy-700">State tax · {rate(r.stateRate)}{r.stateBase !== r.price ? ` on ${usd(r.stateBase)}` : ''}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.stateTax)}</td></tr>
          <tr><td className="py-1.5 pr-3 text-navy-700">Local tax · {lApplies ? rate(r.localRate) : 'not charged on this item'}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.localTax)}</td></tr>
          <tr><td className="py-1.5 pr-3 font-semibold text-navy-900">Total</td><td className="tabular-nums py-1.5 text-right font-semibold text-navy-900">{usd(r.total)}</td></tr>
        </tbody></table>
        {r.tax > 0 && <div className="mt-4"><StackedBar ariaPrefix="Breakdown" total={r.total} segments={[{ label: 'Price', value: r.price, color: '#3C3B6E' }, { label: 'State tax', value: r.stateTax, color: '#B22234' }, { label: 'Local tax', value: r.localTax, color: '#e8a0a8' }]} /></div>}
        <p className="mt-3 text-xs text-navy-600">Rule applied: {r.rule}. {S.lookupUrl && S.facts.sales.local.allowed ? <>Exact local rate for an address: <a className="underline" href={S.lookupUrl} target="_blank" rel="nofollow noopener noreferrer">{S.name} rate lookup</a>. </> : null}<a className="underline" href={methodHref}>How this is calculated</a>.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy share link'}</button>
          <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
        </div>
      </div>
    </div>
  );
}
