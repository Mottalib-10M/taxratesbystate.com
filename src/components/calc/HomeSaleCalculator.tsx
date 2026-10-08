/**
 * Capital gains tax on a home sale: Section 121 exclusion (IRS Pub. 523), federal 0/15/20% on the
 * taxable gain stacked on the other income (Rev. Proc. 2025-32), 25% cap on depreciation recapture,
 * NIIT 3.8%, and the state income tax at the state's rate (editable). First render = defaults (§17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import ResultPanel from './ResultPanel';
import { sec121, federalGainTax, stateGainTax, type Filing, type StateGain } from '../../lib/engine/realestate';
import { formatMoney } from '../../lib/format';
import { rate } from '../../lib/fmt';
import { readParams, num, str, updateURL } from '../../lib/url-state';

type S = StateGain & { flat: boolean; note: string | null };
interface Props { states: S[]; state?: string; price?: number; methodHref?: string; idPrefix?: string }
const usd = (n: number) => formatMoney(n, 0);
export const FILINGS = [{ value: 'joint', label: 'Married filing jointly' }, { value: 'single', label: 'Single' }, { value: 'hoh', label: 'Head of household' }, { value: 'separate', label: 'Married filing separately' }];

export default function HomeSaleCalculator({ states, state = 'california', price: p0 = 900000, methodHref, idPrefix = 'hs' }: Props) {
  const S0 = states.find((x) => x.slug === state) ?? states[0];
  const [slug, setSlug] = useState(S0.slug);
  const [filing, setFiling] = useState<Filing>('joint');
  const [price, setPrice] = useState(p0);
  const [basis, setBasis] = useState(350000);
  const [costs, setCosts] = useState(50000);
  const [yOwned, setYOwned] = useState(8);
  const [yUsed, setYUsed] = useState(8);
  const [income, setIncome] = useState(150000);
  const [stRate, setStRate] = useState(S0.topRatePct);
  const [recent, setRecent] = useState('no');
  const [reason, setReason] = useState('no');
  const [depr, setDepr] = useState(0);
  const [nqYears, setNqYears] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    const s = str(u, 's', S0.slug); const n = states.find((x) => x.slug === s);
    if (n) { setSlug(n.slug); setStRate(num(u, 'sr', n.topRatePct)); }
    const f = str(u, 'f', 'joint'); if (FILINGS.some((o) => o.value === f)) setFiling(f as Filing);
    setPrice(num(u, 'p', p0)); setBasis(num(u, 'b', 350000)); setCosts(num(u, 'c', 50000));
    setYOwned(num(u, 'yo', 8)); setYUsed(num(u, 'yu', 8)); setIncome(num(u, 'i', 150000));
    setRecent(str(u, 'r2', 'no')); setReason(str(u, 'pr', 'no')); setDepr(num(u, 'd', 0)); setNqYears(num(u, 'nq', 0));
  }, []);
  useEffect(() => { updateURL({ s: slug, f: filing, p: price, b: basis, c: costs, yo: yOwned, yu: yUsed, i: income, sr: stRate, r2: recent === 'yes' ? 'yes' : undefined, pr: reason === 'yes' ? 'yes' : undefined, d: depr || undefined, nq: nqYears || undefined }); }, [slug, filing, price, basis, costs, yOwned, yUsed, income, stRate, recent, reason, depr, nqYears]);
  const St = states.find((x) => x.slug === slug) ?? states[0];
  const pick = (s: string) => { setSlug(s); const n = states.find((x) => x.slug === s); if (n) setStRate(n.topRatePct); };
  const r = useMemo(() => {
    const x = sec121({ filing, price, sellingCosts: costs, basis, monthsOwned: Math.round(yOwned * 12), monthsUsed: Math.round(yUsed * 12), usedExclusionLast2y: recent === 'yes', partialReason: reason === 'yes', depreciationAfter1997: depr, nonqualifiedMonths: Math.round(nqYears * 12) });
    const short = yOwned <= 1;
    const capital = x.taxableGain - x.recapture;
    const fed = federalGainTax({ filing, otherTaxable: income, ltcg: short ? 0 : capital, unrecaptured: short ? 0 : x.recapture, shortTerm: short ? x.taxableGain : 0 });
    const state = stateGainTax(x.taxableGain, St, stRate, income);
    const total = fed.federalOnGain + fed.niit + state;
    return { x, fed, state, total, short };
  }, [filing, price, costs, basis, yOwned, yUsed, recent, reason, depr, nqYears, income, St, stRate]);
  const p = idPrefix;
  const net = price - costs - r.total;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={`${p}-filing`} label="Filing status" value={filing} onChange={(v) => setFiling(v as Filing)} options={FILINGS} />
        <SelectField id={`${p}-state`} label="State" value={slug} onChange={pick} options={states.map((x) => ({ value: x.slug, label: `${x.name} (${x.taxesCapitalGains ? rate(x.topRatePct) : 'no tax on the gain'})` }))} help="Top state income tax rate on the gain, editable below." />
        <NumberField id={`${p}-price`} label="Sale price" value={price} onChange={setPrice} unit="$" max={100_000_000} />
        <NumberField id={`${p}-basis`} label="Purchase price plus improvements" value={basis} onChange={setBasis} unit="$" max={100_000_000} help="Your cost basis: price paid, closing costs at purchase, improvements." />
        <NumberField id={`${p}-costs`} label="Selling costs" value={costs} onChange={setCosts} unit="$" max={10_000_000} help="Agent commission, transfer tax paid as seller, title, legal fees." />
        <NumberField id={`${p}-income`} label="Other taxable income this year" value={income} onChange={setIncome} unit="$" max={100_000_000} help="After deductions, without the sale." />
        <NumberField id={`${p}-owned`} label="Years you owned the home" value={yOwned} onChange={setYOwned} unit="yrs" max={80} decimals={1} />
        <NumberField id={`${p}-used`} label="Years you lived in it (last 5)" value={yUsed} onChange={setYUsed} unit="yrs" max={80} decimals={1} help="Main home only; 2 years out of the last 5 for the full exclusion." />
      </form>
      <details className="mt-4 rounded-lg border border-navy-200 px-4 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-navy-800">Advanced: partial exclusion, depreciation, state rate</summary>
        <div className="mt-3 grid gap-x-5 gap-y-4 pb-2 sm:grid-cols-2">
          <Toggle id={`${p}-recent`} label="Excluded a gain on another home in the last 2 years?" value={recent} onChange={setRecent} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
          <Toggle id={`${p}-reason`} label="Moving for work, health or an unforeseen event?" value={reason} onChange={setReason} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
          <NumberField id={`${p}-depr`} label="Depreciation claimed after May 6, 1997" value={depr} onChange={setDepr} unit="$" max={10_000_000} help="Home office or rental use; taxed up to 25%, never excluded." />
          <NumberField id={`${p}-nq`} label="Years rented out before living in it (after 2008)" value={nqYears} onChange={setNqYears} unit="yrs" max={80} decimals={1} help="Nonqualified use: that share of the gain is not excluded." />
          <NumberField id={`${p}-strate`} label={`State tax rate on the gain (${St.name})`} value={stRate} onChange={setStRate} unit="%" max={20} decimals={2} help={St.cgExclusionPct ? `${St.name} excludes ${St.cgExclusionPct}% of a long-term gain before this rate.` : St.flat ? 'Flat rate.' : 'Top rate shown; lower if your income stays in a lower bracket.'} />
        </div>
      </details>
      <ResultPanel label="Tax on the sale of your home" value={usd(r.total)} sub={`${usd(r.x.exclusion)} of the ${usd(r.x.gain)} gain excluded · you keep ${usd(net)} before paying off any mortgage`}
        rows={[
          ['Gain (price − selling costs − basis)', usd(r.x.gain)],
          ['Section 121 exclusion', `−${usd(r.x.exclusion)}`],
          ['Taxable gain', usd(r.x.taxableGain)],
          r.short ? ['Federal tax at ordinary rates (owned 1 year or less)', usd(r.fed.onShort)] : ['Federal capital gains tax (0% / 15% / 20%)', usd(r.fed.onLtcg)],
          r.fed.on1250 > 0 && ['Depreciation recapture (25% max)', usd(r.fed.on1250)],
          ['Net investment income tax (3.8%)', usd(r.fed.niit)],
          [`${St.name} income tax on the gain`, usd(r.state)],
        ]}
        note={!r.x.eligible ? 'No exclusion: the 2-out-of-5-year tests are not met and no qualifying reason was given. ' : !r.x.full ? 'Partial exclusion: maximum prorated over 24 months (IRS Publication 523). ' : undefined}
        methodHref={methodHref} />
    </div>
  );
}
