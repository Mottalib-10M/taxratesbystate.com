/** Federal SALT deduction: sales tax (or income tax) plus property tax, against the cap. arg = {cap}. */
import { usd, parseArg } from './_kit';
export default (arg?: string) => {
  const a = parseArg<{ cap: number }>(arg, { cap: 40000 });
  return {
    title: 'State and local taxes against the federal cap',
    cta: 'Sales tax calculator',
    inputs: [
      { id: 's', label: 'Sales tax (or state income tax) paid', def: 2500, unit: '$', max: 10_000_000 },
      { id: 'p', label: 'Property tax paid', def: 6000, unit: '$', max: 10_000_000 },
    ],
    run: ({ s, p }: Record<string, number>) => {
      const tot = s + p;
      return {
        head: ['Deductible, within the cap', usd(Math.min(tot, a.cap))] as [string, string],
        rows: [['State and local taxes paid', usd(tot)], ['Above the cap (not deductible)', usd(Math.max(0, tot - a.cap))]] as Array<[string, string]>,
        note: 'Itemizers only; the cap is reduced at higher incomes (IRS Topic 503), which this tool does not model.',
      };
    },
  };
};
