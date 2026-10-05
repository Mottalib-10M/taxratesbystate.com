/** Sales tax by state: pick a state, see its statewide tax on a price. arg = [[name, rate], …]. */
import { usd, rate, parseArg } from './_kit';
export default (arg?: string) => {
  const list = parseArg<Array<[string, number]>>(arg, [['Example', 6]]);
  return {
    title: 'State sales tax on your purchase',
    cta: 'Add your local rate in the full calculator',
    inputs: [
      { id: 's', label: 'State', def: 0, options: list.map(([n, r], i) => ({ value: String(i), label: `${n} (${rate(r)})` })) },
      { id: 'p', label: 'Price before tax', def: 500, unit: '$', max: 50_000_000 },
    ],
    run: ({ s, p }: Record<string, number>) => {
      const [n, r] = list[s] ?? list[0];
      const t = (p * r) / 100;
      return {
        head: [`State tax in ${n}`, usd(t, 2)] as [string, string],
        rows: [['Statewide rate', rate(r)], ['Total before local taxes', usd(p + t, 2)]] as Array<[string, string]>,
        note: 'Statewide part only: counties and cities add their own rate in most states.',
      };
    },
  };
};
