/** Assessment caps: taxable value with and without a cap on yearly increases. */
import { usd, num } from './_kit';
export default () => ({
  title: 'An assessment cap over the years',
  cta: 'Property tax calculator',
  inputs: [
    { id: 'v', label: 'Assessed value today', def: 300000, unit: '$', max: 50_000_000 },
    { id: 'g', label: 'Market growth per year', def: 6, unit: '%', max: 50, decimals: 2 },
    { id: 'c', label: 'Cap on yearly increase', def: 3, unit: '%', max: 50, decimals: 2 },
    { id: 'n', label: 'Years', def: 10, max: 50 },
  ],
  run: ({ v, g, c, n }: Record<string, number>) => {
    const yrs = Math.round(n);
    const market = v * (1 + g / 100) ** yrs;
    const capped = v * (1 + Math.min(g, c) / 100) ** yrs;
    return {
      head: [`Capped value after ${num(yrs)} years`, usd(capped)] as [string, string],
      rows: [['Market value then', usd(market)], ['Value kept off the tax roll', usd(market - capped)]] as Array<[string, string]>,
      note: 'A sale usually resets the assessment to market value in capped states.',
    };
  },
});
