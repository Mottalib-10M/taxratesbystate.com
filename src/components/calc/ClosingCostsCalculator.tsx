/**
 * Closing costs calculator, buyer or seller side. The statewide transfer tax and mortgage recording
 * tax come from the facts of each state (official sources); the local transfer tax, lender fees, title,
 * commission and prepaid items are the visitor's figures (Loan Estimate, listing agreement), with
 * editable defaults that are assumptions, not statistics.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import ResultPanel from './ResultPanel';
import { transferTax, transferExtras } from '../../lib/engine/realestate';
import type { TransferCompact } from '../../lib/realestate';
import { formatMoney, formatNumber } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { states: TransferCompact[]; state?: string; price?: number; methodHref?: string; idPrefix?: string }
const usd = (n: number) => formatMoney(n, 0);
const defShare = (payer: string | null, role: string) => (payer === 'split' ? 50 : payer === 'buyer' ? (role === 'buyer' ? 100 : 0) : role === 'seller' ? 100 : 0);
const D = { loan: 0.8, lender: 1, title: 2500, prepaid: 3000, comm: 5, payoff: 200000, other: 1000 };

export default function ClosingCostsCalculator({ states, state = 'new-york', price: p0 = 450000, methodHref, idPrefix = 'cc' }: Props) {
  const S0 = states.find((x) => x.slug === state) ?? states[0];
  const [slug, setSlug] = useState(S0.slug);
  const [role, setRole] = useState('buyer');
  const [price, setPrice] = useState(p0);
  const [loan, setLoan] = useState(Math.round(p0 * D.loan));
  const [payoff, setPayoff] = useState(D.payoff);
  const [share, setShare] = useState(defShare(S0.payer, 'buyer'));
  const [local, setLocal] = useState(0);
  const [lender, setLender] = useState(D.lender);
  const [title, setTitle] = useState(D.title);
  const [prepaid, setPrepaid] = useState(D.prepaid);
  const [comm, setComm] = useState(D.comm);
  const [other, setOther] = useState(D.other);
  useEffect(() => {
    const u = readParams(window.location.search);
    const s = str(u, 's', S0.slug); const n = states.find((x) => x.slug === s) ?? S0;
    const ro = str(u, 'ro', 'buyer') === 'seller' ? 'seller' : 'buyer';
    setSlug(n.slug); setRole(ro); setShare(num(u, 'sh', defShare(n.payer, ro)));
    const pr = num(u, 'p', p0); setPrice(pr); setLoan(num(u, 'l', Math.round(pr * D.loan))); setPayoff(num(u, 'po', D.payoff));
    setLocal(num(u, 'lt', 0)); setLender(num(u, 'lf', D.lender)); setTitle(num(u, 't', D.title)); setPrepaid(num(u, 'pp', D.prepaid)); setComm(num(u, 'cm', D.comm)); setOther(num(u, 'o', D.other));
  }, []);
  useEffect(() => { updateURL({ s: slug, ro: role, p: price, l: loan, po: payoff, sh: share, lt: local || undefined, lf: lender, t: title, pp: prepaid, cm: comm, o: other }); }, [slug, role, price, loan, payoff, share, local, lender, title, prepaid, comm, other]);
  const St = states.find((x) => x.slug === slug) ?? states[0];
  const pick = (s: string) => { setSlug(s); const n = states.find((x) => x.slug === s); if (n) setShare(defShare(n.payer, role)); };
  const pickRole = (r: string) => { setRole(r); setShare(defShare(St.payer, r)); };
  const r = useMemo(() => {
    const stateTT = transferTax(price, St.t);
    const yourState = (stateTT * share) / 100;
    const yourLocal = (price * local / 100) * share / 100;
    const buyer = role === 'buyer';
    const mortgageTax = buyer ? (loan * St.mortgagePct) / 100 : 0;
    const lenderFees = buyer ? (loan * lender) / 100 : 0;
    const commission = buyer ? 0 : (price * comm) / 100;
    const extras = transferExtras(price, St.t).filter((e) => e.who === role);
    const extra = extras.reduce((a, e) => a + e.amount, 0);
    const total = yourState + yourLocal + extra + mortgageTax + lenderFees + title + (buyer ? prepaid : 0) + commission + other;
    return { stateTT, yourState, yourLocal, extras, mortgageTax, lenderFees, commission, total, cash: buyer ? price - loan + total : price - payoff - total };
  }, [price, St, share, local, role, loan, lender, title, prepaid, comm, other, payoff]);
  const p = idPrefix;
  const buyer = role === 'buyer';
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={`${p}-role`} label="I am the" value={role} onChange={pickRole} options={[{ value: 'buyer', label: 'Buyer' }, { value: 'seller', label: 'Seller' }]} />
        <SelectField id={`${p}-state`} label="State" value={slug} onChange={pick} options={states.map((x) => ({ value: x.slug, label: x.name }))} />
        <NumberField id={`${p}-price`} label="Sale price" value={price} onChange={setPrice} unit="$" max={500_000_000} />
        {buyer
          ? <NumberField id={`${p}-loan`} label="Mortgage amount" value={loan} onChange={setLoan} unit="$" max={500_000_000} />
          : <NumberField id={`${p}-payoff`} label="Mortgage left to pay off" value={payoff} onChange={setPayoff} unit="$" max={500_000_000} />}
        <SelectField id={`${p}-share`} label="Your share of the transfer tax" value={String(share)} onChange={(v) => setShare(Number(v))} options={[{ value: '100', label: 'All of it' }, { value: '50', label: 'Half' }, { value: '0', label: 'None' }]} help="Set by law or custom in some states, by your contract in all." />
        <NumberField id={`${p}-local`} label="Local transfer tax rate (county or city)" value={local} onChange={setLocal} unit="%" max={10} decimals={3} help="0 if none; on your county recorder's fee schedule." />
        {buyer
          ? <NumberField id={`${p}-lender`} label="Lender fees (origination, points)" value={lender} onChange={setLender} unit="% of loan" max={10} decimals={2} help="Sections A and B of your Loan Estimate." />
          : <NumberField id={`${p}-comm`} label="Agent commission" value={comm} onChange={setComm} unit="%" max={10} decimals={2} help="As written in your listing agreement." />}
        <NumberField id={`${p}-title`} label="Title, escrow and settlement fees" value={title} onChange={setTitle} unit="$" max={1_000_000} help="Your estimate or Loan Estimate figure." />
      </form>
      <details className="mt-4 rounded-lg border border-navy-200 px-4 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-navy-800">Advanced: prepaid items and other fees</summary>
        <div className="mt-3 grid gap-x-5 gap-y-4 pb-2 sm:grid-cols-2">
          {buyer && <NumberField id={`${p}-prepaid`} label="Prepaid interest, insurance and escrow deposits" value={prepaid} onChange={setPrepaid} unit="$" max={1_000_000} help="Sections F and G of the Loan Estimate." />}
          <NumberField id={`${p}-other`} label="Other fees (recording, inspection, attorney, HOA)" value={other} onChange={setOther} unit="$" max={1_000_000} />
        </div>
      </details>
      <ResultPanel label={buyer ? 'Your closing costs as the buyer' : 'Your closing costs as the seller'} value={usd(r.total)}
        sub={`${formatNumber(price ? (r.total / price) * 100 : 0, 2)}% of the price · ${buyer ? `cash to close about ${usd(r.cash)}` : `net proceeds about ${usd(r.cash)}`}`}
        rows={[
          [`${St.name} transfer tax (whole tax: ${usd(r.stateTT)})`, usd(r.yourState)],
          ...r.extras.map((e) => [`${e.name} (${formatNumber(e.ratePct, 2)}%, paid by the ${e.who})`, usd(e.amount)] as [string, string]),
          local > 0 && ['Local transfer tax, your share', usd(r.yourLocal)],
          buyer && St.mortgagePct > 0 && ['Mortgage recording or intangible tax', usd(r.mortgageTax)],
          buyer && ['Lender fees', usd(r.lenderFees)],
          !buyer && ['Agent commission', usd(r.commission)],
          ['Title, escrow and settlement', usd(title)],
          buyer && ['Prepaid items and escrow deposits', usd(prepaid)],
          ['Other fees', usd(other)],
        ]}
        note={`${St.name}: ${St.rateText}`}
        methodHref={methodHref} />
    </div>
  );
}
