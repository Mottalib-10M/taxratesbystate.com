/** How property tax is calculated: market value × assessment ratio × mills. */
import { usd, num } from './_kit';
export default () => ({
  title: 'From market value to tax, in mills',
  cta: 'Full property tax calculator',
  inputs: [
    { id: 'v', label: 'Market value', def: 300000, unit: '$', max: 50_000_000 },
    { id: 'r', label: 'Assessment ratio', def: 100, unit: '%', max: 100, decimals: 2 },
    { id: 'm', label: 'Total mill rate', def: 20, unit: 'mills', max: 500, decimals: 3 },
  ],
  run: ({ v, r, m }: Record<string, number>) => {
    const assessed = (v * r) / 100;
    const tax = (assessed * m) / 1000;
    return {
      head: ['Tax per year', usd(tax)] as [string, string],
      rows: [['Assessed value', usd(assessed)], ['Mills as a percent', `${num(m / 10, 3)}%`], ['Share of market value', `${num(v > 0 ? (tax / v) * 100 : 0, 2)}%`]] as Array<[string, string]>,
    };
  },
});
