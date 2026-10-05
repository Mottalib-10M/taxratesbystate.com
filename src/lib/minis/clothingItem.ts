/** Clothing: state tax on one item under each state's rule. arg = [[name, rate, mode, threshold], …] (mode 0 taxed, 1 exempt, 2 excess, 3 item). */
import { usd, rate, parseArg } from './_kit';
export default (arg?: string) => {
  const list = parseArg<Array<[string, number, number, number]>>(arg, [['Example', 6, 0, 0]]);
  return {
    title: 'State tax on one piece of clothing',
    cta: 'Full calculator with your local rate',
    inputs: [
      { id: 's', label: 'State', def: 0, options: list.map(([n], i) => ({ value: String(i), label: n })) },
      { id: 'p', label: 'Price of the item', def: 200, unit: '$', max: 1_000_000, decimals: 2 },
    ],
    run: ({ s, p }: Record<string, number>) => {
      const [n, r, mode, T] = list[s] ?? list[0];
      const base = mode === 1 ? 0 : mode === 2 ? Math.max(0, p - T) : mode === 3 ? (p < T ? 0 : p) : p;
      const t = (base * r) / 100;
      const rule = mode === 1 ? 'clothing exempt' : mode === 2 ? `only the part above ${usd(T)} taxed` : mode === 3 ? `items under ${usd(T)} exempt, others taxed in full` : 'taxed like other goods';
      return {
        head: [`State tax in ${n}`, usd(t, 2)] as [string, string],
        rows: [['Rule', rule], ['Taxable part', usd(base, 2)], ['State rate', rate(r)]] as Array<[string, string]>,
      };
    },
  };
};
