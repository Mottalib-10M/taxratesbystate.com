/** Sales tax holidays: state tax waived on a qualifying purchase. arg = [[label, stateRate], …]. */
import { usd, rate, parseArg } from './_kit';
export default (arg?: string) => {
  const list = parseArg<Array<[string, number]>>(arg, [['Example', 6]]);
  return {
    title: 'What a holiday weekend saves',
    cta: 'Sales tax calculator',
    inputs: [
      { id: 's', label: 'Holiday', def: 0, options: list.map(([n], i) => ({ value: String(i), label: n })) },
      { id: 'p', label: 'Qualifying items bought', def: 400, unit: '$', max: 1_000_000 },
    ],
    run: ({ s, p }: Record<string, number>) => {
      const [n, r] = list[s] ?? list[0];
      return {
        head: ['State tax saved', usd((p * r) / 100, 2)] as [string, string],
        rows: [['Holiday', n], ['State rate waived', rate(r)]] as Array<[string, string]>,
        note: 'Each item must be under the holiday’s price cap; local taxes are waived only where the locality joins in.',
      };
    },
  };
};
