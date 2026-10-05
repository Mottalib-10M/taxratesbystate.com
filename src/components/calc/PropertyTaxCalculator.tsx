/**
 * Property tax calculator. Two modes:
 *  - "typical": the home value × the state's median effective rate (Census ACS 2024);
 *  - "bill": market value × assessment ratio − exemption, × mill rate ÷ 1,000, − credit.
 * First render = build defaults (RECETTE §17.5); the shared link is applied in useEffect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { propertyTax, millsFromEffective } from '../../lib/engine/property';
import type { CompactState } from '../../lib/engine/compact';
import { formatMoney, formatNumber } from '../../lib/format';
import { eff } from '../../lib/fmt';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { states: CompactState[]; state?: string; lockState?: boolean; value?: number; advanced?: boolean; censusYear: number; methodHref?: string; idPrefix?: string }
const usd = (n: number) => formatMoney(n, 0);

export default function PropertyTaxCalculator({ states, state = 'texas', lockState = false, value = 350000, advanced = false, censusYear, methodHref = '/en/method/', idPrefix = 'pt' }: Props) {
  const [slug, setSlug] = useState(state);
  const [mv, setMv] = useState(value);
  const [mode, setMode] = useState<'typical' | 'bill'>(advanced ? 'bill' : 'typical');
  const S0 = states.find((x) => x.slug === state) ?? states[0];
  const [ratio, setRatio] = useState(100);
  const [mills, setMills] = useState(Math.round(millsFromEffective(S0.census.effectiveRate) * 100) / 100);
  const [exempt, setExempt] = useState(0);
  const [credit, setCredit] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!lockState) { const s = str(u, 's', state); if (states.some((x) => x.slug === s)) setSlug(s); }
    setMv(num(u, 'v', value));
    if (str(u, 'm', '') === 'bill') setMode('bill');
    if (u.has('r')) setRatio(num(u, 'r', 100));
    if (u.has('mi')) setMills(num(u, 'mi', mills));
    setExempt(num(u, 'x', 0)); setCredit(num(u, 'c', 0));
  }, []);
  useEffect(() => { updateURL({ s: lockState ? undefined : slug, v: mv, m: mode === 'bill' ? 'bill' : undefined, r: mode === 'bill' && ratio !== 100 ? ratio : undefined, mi: mode === 'bill' ? mills : undefined, x: exempt || undefined, c: credit || undefined }); }, [slug, mv, mode, ratio, mills, exempt, credit]);
  const S = states.find((x) => x.slug === slug) ?? states[0];
  const pickState = (s: string) => {
    setSlug(s);
    const n = states.find((x) => x.slug === s);
    if (n) setMills(Math.round(millsFromEffective(n.census.effectiveRate) * 100) / 100);
  };
  const r = useMemo(() => (mode === 'typical'
    ? propertyTax({ marketValue: mv, millRate: S.census.effectiveRate * 1000 })
    : propertyTax({ marketValue: mv, assessmentRatio: ratio, exemption: exempt, millRate: mills, credit })), [S, mv, mode, ratio, mills, exempt, credit]);
  const p = idPrefix;
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  const hs = S.homestead;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {lockState
          ? <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0"><span className="mb-1 block text-sm font-medium text-navy-700">State</span><p className="flex h-12 items-center rounded-lg border border-navy-200 bg-navy-50 px-4 font-semibold text-navy-900">{S.name} · median rate {eff(S.census.effectiveRate)}</p><span /></div>
          : <SelectField id={`${p}-state`} label="State" value={slug} onChange={pickState} options={states.map((x) => ({ value: x.slug, label: `${x.name} (${eff(x.census.effectiveRate)})` }))} help={`Median tax ÷ median home value, Census ACS ${censusYear}.`} />}
        <NumberField id={`${p}-value`} label="Market value of the home" value={mv} onChange={setMv} unit="$" max={50_000_000} />
        <Toggle id={`${p}-mode`} label="Method" value={mode} onChange={(v) => setMode(v as 'typical' | 'bill')} options={[{ value: 'typical', label: 'Typical rate' }, { value: 'bill', label: 'My mill rate' }]} />
        {mode === 'bill' && <NumberField id={`${p}-mills`} label="Total mill rate (all levies)" value={mills} onChange={setMills} unit="mills" max={500} decimals={3} help="On your tax bill: dollars per $1,000 of taxable value." />}
        {mode === 'bill' && <NumberField id={`${p}-ratio`} label="Assessment ratio" value={ratio} onChange={setRatio} unit="%" max={100} decimals={2} help="Share of market value that is assessed (100 if your state uses full value)." />}
        {mode === 'bill' && <NumberField id={`${p}-exempt`} label="Exemptions off assessed value" value={exempt} onChange={setExempt} unit="$" max={10_000_000} help={hs.name ? `${S.name}: ${hs.name}${hs.amount && hs.amountType === 'value-exemption' ? `, ${usd(hs.amount)}` : ''}.` : undefined} />}
        {mode === 'bill' && <NumberField id={`${p}-credit`} label="Credits off the tax" value={credit} onChange={setCredit} unit="$" max={1_000_000} help="Some states give a credit or rebate instead of an exemption." />}
      </form>
      <div aria-live="polite" className="mt-6 rounded-xl bg-accent-50 p-4 sm:p-5">
        <p className="text-sm font-medium text-navy-700">Estimated property tax per year</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{usd(r.tax)}</p>
        <p className="mt-1 text-sm text-navy-700">{usd(r.monthly)} a month · {formatNumber(r.effectiveRate, 2)}% of market value</p>
        <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
          {mode === 'bill' && <tr><td className="py-1.5 pr-3 text-navy-700">Assessed value</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.assessedValue)}</td></tr>}
          {mode === 'bill' && <tr><td className="py-1.5 pr-3 text-navy-700">Taxable value after exemptions</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.taxableValue)}</td></tr>}
          {mode === 'bill' && r.credit > 0 && <tr><td className="py-1.5 pr-3 text-navy-700">Credit</td><td className="tabular-nums py-1.5 text-right text-navy-900">−{usd(r.credit)}</td></tr>}
          <tr><td className="py-1.5 pr-3 text-navy-700">Median bill in {S.name}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(S.census.medianTax)}</td></tr>
          <tr><td className="py-1.5 pr-3 text-navy-700">Median home value in {S.name}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(S.census.medianValue)}</td></tr>
        </tbody></table>
        <p className="mt-3 text-xs text-navy-600">{mode === 'typical'
          ? `Typical rate: what owners in ${S.name} paid, as a share of value (Census ACS ${censusYear}, homestead exemptions already included). Your county and city set the real levy.`
          : 'Your bill: market value × assessment ratio, minus exemptions, × mill rate ÷ 1,000, minus credits.'} <a className="underline" href={methodHref}>How this is calculated</a>.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy share link'}</button>
          <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
        </div>
      </div>
    </div>
  );
}
