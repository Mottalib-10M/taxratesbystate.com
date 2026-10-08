/** Seller's net proceeds: price − commission − transfer tax − other costs − mortgage payoff. */
import { usd, num } from './_kit';
export default () => ({
  title: 'What you walk away with as the seller',
  cta: '',
  inputs: [
    { id: 'p', label: 'Sale price', def: 450000, unit: '$', max: 500_000_000 },
    { id: 'c', label: 'Commission', def: 5, unit: '%', max: 10, decimals: 2 },
    { id: 't', label: 'Transfer tax you pay', def: 1, unit: '%', max: 10, decimals: 3 },
    { id: 'm', label: 'Mortgage payoff', def: 200000, unit: '$', max: 500_000_000 },
  ],
  run: ({ p, c, t, m }: Record<string, number>) => {
    const fees = (p * (c + t)) / 100;
    return {
      head: ['Net proceeds', usd(p - fees - m)] as [string, string],
      rows: [['Commission', usd((p * c) / 100)], ['Transfer tax', usd((p * t) / 100)], ['Costs as a share of the price', `${num(c + t, 2)}%`]] as Array<[string, string]>,
      note: 'Before title, attorney and prorated property tax, which your settlement statement adds.',
    };
  },
});
