/**
 * Estate tax calculator: federal estate tax for 2026 deaths (unified schedule, $15,000,000 basic
 * exclusion, Rev. Proc. 2025-32) plus the estate tax of the state of residence (official thresholds
 * and brackets, src/data/realestate-states-2026.json). Marital and charitable deductions lower both.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultPanel from './ResultPanel';
import { federalEstateTax, stateEstateTax, FED, type EstateState } from '../../lib/engine/realestate';
import { formatMoney, formatNumber } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Row { slug: string; name: string; estate: EstateState | null; inheritance: boolean }
interface Props { states: Row[]; state?: string; price?: number; methodHref?: string; idPrefix?: string }
const usd = (n: number) => formatMoney(n, 0);
const D = { debts: 150000, marital: 0, charity: 0, gifts: 0, dsue: 0 };

export default function EstateTaxCalculator({ states, state = 'massachusetts', price: p0 = 4000000, methodHref, idPrefix = 'et' }: Props) {
  const S0 = states.find((x) => x.slug === state) ?? states[0];
  const [slug, setSlug] = useState(S0.slug);
  const [gross, setGross] = useState(p0);
  const [debts, setDebts] = useState(D.debts);
  const [marital, setMarital] = useState(D.marital);
  const [charity, setCharity] = useState(D.charity);
  const [gifts, setGifts] = useState(D.gifts);
  const [dsue, setDsue] = useState(D.dsue);
  useEffect(() => {
    const u = readParams(window.location.search);
    const s = str(u, 's', S0.slug); if (states.some((x) => x.slug === s)) setSlug(s);
    setGross(num(u, 'g', p0)); setDebts(num(u, 'd', D.debts)); setMarital(num(u, 'm', D.marital)); setCharity(num(u, 'c', D.charity)); setGifts(num(u, 'lg', D.gifts)); setDsue(num(u, 'ds', D.dsue));
  }, []);
  useEffect(() => { updateURL({ s: slug, g: gross, d: debts, m: marital || undefined, c: charity || undefined, lg: gifts || undefined, ds: dsue || undefined }); }, [slug, gross, debts, marital, charity, gifts, dsue]);
  const St = states.find((x) => x.slug === slug) ?? states[0];
  const r = useMemo(() => {
    const taxable = Math.max(0, gross - debts - marital - charity);
    const fed = federalEstateTax(taxable, gifts, dsue);
    const stTax = stateEstateTax(taxable, St.estate ?? undefined);
    return { taxable, fed, stTax, total: fed + stTax, left: FED.estate.basicExclusion + dsue - gifts - taxable };
  }, [gross, debts, marital, charity, gifts, dsue, St]);
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={`${p}-state`} label="State of residence at death" value={slug} onChange={setSlug} options={states.map((x) => ({ value: x.slug, label: `${x.name}${x.estate ? ` (estate tax above ${usd(x.estate.exemption)})` : x.inheritance ? ' (inheritance tax)' : ''}` }))} />
        <NumberField id={`${p}-gross`} label="Gross estate (everything owned)" value={gross} onChange={setGross} unit="$" max={10_000_000_000} help="Home, investments, retirement accounts, life insurance you owned." />
        <NumberField id={`${p}-debts`} label="Debts, funeral and settlement costs" value={debts} onChange={setDebts} unit="$" max={10_000_000_000} />
        <NumberField id={`${p}-marital`} label="Left to a U.S. citizen spouse" value={marital} onChange={setMarital} unit="$" max={10_000_000_000} help="Unlimited marital deduction." />
        <NumberField id={`${p}-charity`} label="Left to charity" value={charity} onChange={setCharity} unit="$" max={10_000_000_000} />
        <NumberField id={`${p}-gifts`} label="Taxable gifts made since 1977" value={gifts} onChange={setGifts} unit="$" max={10_000_000_000} help={`Gifts above the annual exclusion (${usd(FED.estate.annualGiftExclusion)} per person in 2026).`} />
      </form>
      <details className="mt-4 rounded-lg border border-navy-200 px-4 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-navy-800">Advanced: unused exclusion of a late spouse</summary>
        <div className="mt-3 grid gap-x-5 gap-y-4 pb-2 sm:grid-cols-2">
          <NumberField id={`${p}-dsue`} label="Deceased spousal unused exclusion (DSUE)" value={dsue} onChange={setDsue} unit="$" max={100_000_000} help="Only if elected on the late spouse's Form 706 (federal only)." />
        </div>
      </details>
      <ResultPanel label="Estate tax due" value={usd(r.total)}
        sub={`${formatNumber(gross ? (r.total / gross) * 100 : 0, 1)}% of the gross estate`}
        rows={[
          ['Taxable estate', usd(r.taxable)],
          ['Federal estate tax', usd(r.fed)],
          ['Federal exclusion still unused', usd(Math.max(0, r.left))],
          [St.estate ? `${St.name} estate tax (exemption ${usd(St.estate.exemption)})` : `${St.name} estate tax`, St.estate ? usd(r.stTax) : 'none'],
        ]}
        note={St.inheritance ? `${St.name} also has an inheritance tax, paid by heirs according to their relationship: see the inheritance tax page. ` : !St.estate ? `${St.name} has no estate tax of its own. ` : 'State tax computed on the same taxable estate; state rules on gifts and deductions can differ. '}
        methodHref={methodHref} />
    </div>
  );
}
