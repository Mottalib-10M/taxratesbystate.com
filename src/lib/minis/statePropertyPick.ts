/** Property tax by state: typical bill on a home value. arg = [[name, ratio, medianTax], …]. */
import { usd, eff, parseArg } from './_kit';
export default (arg?: string) => {
  const list = parseArg<Array<[string, number, number]>>(arg, [['Example', 0.01, 3000]]);
  return {
    title: 'Typical property tax in a state',
    cta: 'Your own bill, with your mill rate',
    inputs: [
      { id: 's', label: 'State', def: 0, options: list.map(([n, r], i) => ({ value: String(i), label: `${n} (${eff(r)})` })) },
      { id: 'v', label: 'Home value', def: 350000, unit: '$', max: 50_000_000 },
    ],
    run: ({ s, v }: Record<string, number>) => {
      const [n, r, med] = list[s] ?? list[0];
      return {
        head: [`Typical bill in ${n}`, usd(v * r)] as [string, string],
        rows: [['Per month', usd((v * r) / 12)], ['Median effective rate', eff(r)], ['Median bill in the state', usd(med)]] as Array<[string, string]>,
      };
    },
  };
};
