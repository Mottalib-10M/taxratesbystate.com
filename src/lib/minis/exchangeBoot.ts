/** 1031 boot: what a smaller mortgage or cash taken out makes taxable now (Form 8824 instructions). */
import { usd } from './_kit';
export default () => ({
  title: 'Boot from cash out or a smaller loan',
  cta: '',
  inputs: [
    { id: 'c', label: 'Cash you keep from the sale', def: 40000, unit: '$', max: 100_000_000 },
    { id: 'o', label: 'Mortgage paid off on the old property', def: 300000, unit: '$', max: 500_000_000 },
    { id: 'n', label: 'New mortgage on the replacement', def: 260000, unit: '$', max: 500_000_000 },
  ],
  run: ({ c, o, n }: Record<string, number>) => {
    const debt = Math.max(0, o - n);
    const boot = c + debt;
    return {
      head: ['Boot taxed this year (up to your gain)', usd(boot)] as [string, string],
      rows: [['Cash boot', usd(c)], ['Mortgage boot', usd(debt)], ['New loan needed to avoid mortgage boot', usd(o)]] as Array<[string, string]>,
      note: 'Adding cash of your own at closing offsets mortgage boot dollar for dollar; it never offsets cash you take out.',
    };
  },
});
