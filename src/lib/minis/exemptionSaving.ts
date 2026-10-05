/** Homestead exemption: tax saved = exemption × mills ÷ 1,000. */
import { usd } from './_kit';
export default () => ({
  title: 'What a homestead exemption saves',
  cta: 'Rebuild your whole bill',
  inputs: [
    { id: 'x', label: 'Exemption off assessed value', def: 50000, unit: '$', max: 10_000_000 },
    { id: 'm', label: 'Total mill rate', def: 20, unit: 'mills', max: 500, decimals: 3 },
  ],
  run: ({ x, m }: Record<string, number>) => {
    const s = (x * m) / 1000;
    return {
      head: ['Saved per year', usd(s)] as [string, string],
      rows: [['Saved per month', usd(s / 12)], ['Saved over 10 years (same levy)', usd(s * 10)]] as Array<[string, string]>,
      note: 'Applies only to the levies the exemption covers: some exemptions reduce school taxes only.',
    };
  },
});
