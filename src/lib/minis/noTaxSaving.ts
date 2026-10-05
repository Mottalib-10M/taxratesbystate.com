/** No-sales-tax states: state tax avoided on a purchase compared with a taxing state. arg = [[name, rate], …]. */
import { usd, rate, parseArg } from './_kit';
export default (arg?: string) => {
  const list = parseArg<Array<[string, number]>>(arg, [['Example', 6]]);
  return {
    title: 'The state tax a purchase avoids',
    cta: 'Compare two states in full',
    inputs: [
      { id: 's', label: 'Compared with', def: 0, options: list.map(([n, r], i) => ({ value: String(i), label: `${n} (${rate(r)})` })) },
      { id: 'p', label: 'Purchase price', def: 1500, unit: '$', max: 50_000_000 },
    ],
    run: ({ s, p }: Record<string, number>) => {
      const [n, r] = list[s] ?? list[0];
      return {
        head: [`State tax you would pay in ${n}`, usd((p * r) / 100, 2)] as [string, string],
        rows: [['Statewide rate there', rate(r)], ['Owed as use tax if you live there', usd((p * r) / 100, 2)]] as Array<[string, string]>,
        note: 'Residents of a taxing state who buy across the border usually owe the same amount as use tax.',
      };
    },
  };
};
