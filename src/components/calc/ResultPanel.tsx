/** Shared result block of the real estate calculators: the headline figure, a sub-line, the detail rows and the note. */
import { useState, type ReactNode } from 'react';

interface Props { label: string; value: string; sub?: string; rows: Array<[string, string] | null | false>; note?: ReactNode; methodHref?: string }

export default function ResultPanel({ label, value, sub, rows, note, methodHref }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  return (
    <div aria-live="polite" className="mt-6 rounded-xl bg-accent-50 p-4 sm:p-5">
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-navy-700">{sub}</p>}
      <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
        {rows.filter((r): r is [string, string] => !!r).map(([l, x]) => <tr key={l}><td className="py-1.5 pr-3 text-navy-700">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{x}</td></tr>)}
      </tbody></table>
      {(note || methodHref) && <p className="mt-3 text-xs text-navy-600">{note} {methodHref && <a className="underline" href={methodHref}>How this is calculated</a>}</p>}
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy share link'}</button>
        <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
      </div>
    </div>
  );
}
