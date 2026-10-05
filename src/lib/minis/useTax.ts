/** Use tax: what is still owed when an out-of-state seller charged less than your home rate. */
import { usd } from './_kit';
export default () => ({
  title: 'Use tax still owed on a purchase',
  cta: 'Find your home state’s rate',
  inputs: [
    { id: 'p', label: 'Purchase price', def: 1200, unit: '$', max: 50_000_000 },
    { id: 'r', label: 'Your combined home rate', def: 8, unit: '%', max: 15, decimals: 3 },
    { id: 'c', label: 'Sales tax the seller charged', def: 0, unit: '$', max: 10_000_000, decimals: 2 },
  ],
  run: ({ p, r, c }: Record<string, number>) => {
    const due = (p * r) / 100;
    const owed = Math.max(0, due - c);
    return {
      head: ['Use tax to report', usd(owed, 2)] as [string, string],
      rows: [['Tax at your home rate', usd(due, 2)], ['Credit for tax already paid', usd(Math.min(c, due), 2)]] as Array<[string, string]>,
      note: 'Most states give credit for sales tax legally paid to another state, up to their own rate.',
    };
  },
});
