/** State page: typical property tax on a home value, at the state's Census median effective rate. */
import { usd, eff, parseArg } from './_kit';
interface A { name: string; ratio: number; medianTax: number; medianValue: number }
export default (arg?: string) => {
  const a = parseArg<A>(arg, { name: 'this state', ratio: 0.009, medianTax: 0, medianValue: 0 });
  return {
    title: `Property tax on a home in ${a.name}`,
    cta: 'Full property tax calculator, with your mill rate',
    inputs: [{ id: 'v', label: 'Home value', def: a.medianValue || 300000, unit: '$', max: 50_000_000 }],
    run: ({ v }: Record<string, number>) => {
      const tax = v * a.ratio;
      return {
        head: ['Typical bill per year', usd(tax)] as [string, string],
        rows: [['Per month', usd(tax / 12)], [`Median effective rate in ${a.name}`, eff(a.ratio)], ['Median bill paid', usd(a.medianTax)]] as Array<[string, string]>,
        note: 'Census median ratio; your county, city and school district set the real levy.',
      };
    },
  };
};
