/** Local sales taxes: state + county + city + district = combined rate. */
import { usd, num } from './_kit';
export default () => ({
  title: 'Stack the rates of your address',
  cta: 'Use the combined rate in the calculator',
  inputs: [
    { id: 's', label: 'State rate', def: 6.25, unit: '%', max: 15, decimals: 3 },
    { id: 'c', label: 'County rate', def: 0.5, unit: '%', max: 10, decimals: 3 },
    { id: 'y', label: 'City rate', def: 1, unit: '%', max: 10, decimals: 3 },
    { id: 'd', label: 'Special districts', def: 0.5, unit: '%', max: 10, decimals: 3 },
  ],
  run: ({ s, c, y, d }: Record<string, number>) => {
    const tot = s + c + y + d;
    return {
      head: ['Combined rate', `${num(tot, 3)}%`] as [string, string],
      rows: [['Local part', `${num(c + y + d, 3)}%`], ['Tax on $100', usd(tot, 2)], ['Tax on $1,000', usd(tot * 10, 2)]] as Array<[string, string]>,
    };
  },
});
