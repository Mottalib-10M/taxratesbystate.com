/** Grocery sales tax over a year, at the state's rate on food. arg = [[name, stateFoodRate], …]. */
import { usd, rate, parseArg } from './_kit';
export default (arg?: string) => {
  const list = parseArg<Array<[string, number]>>(arg, [['Example', 4]]);
  return {
    title: 'State tax on a year of groceries',
    cta: 'Sales tax calculator with your local rate',
    inputs: [
      { id: 's', label: 'State', def: 0, options: list.map(([n, r], i) => ({ value: String(i), label: `${n} (${rate(r)})` })) },
      { id: 'w', label: 'Grocery bill per week', def: 200, unit: '$', max: 100_000 },
    ],
    run: ({ s, w }: Record<string, number>) => {
      const [n, r] = list[s] ?? list[0];
      const y = (w * 52 * r) / 100;
      return {
        head: [`State tax on food in ${n}, per year`, usd(y)] as [string, string],
        rows: [['Per week', usd((w * r) / 100, 2)], ['State rate on groceries', rate(r)]] as Array<[string, string]>,
        note: 'State part only; some states let cities or counties tax food as well.',
      };
    },
  };
};
