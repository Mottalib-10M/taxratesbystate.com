/** Section 121 reduced maximum exclusion: $250,000 or $500,000 × months ÷ 24 (IRS Publication 523). */
import FED from '../../data/realestate-federal-2026.json';
import { usd } from './_kit';
export default () => ({
  title: 'Partial exclusion if you sell before 2 years',
  cta: '',
  inputs: [
    { id: 'j', label: 'Filing status', def: 1, options: [{ value: '1', label: 'Married filing jointly' }, { value: '0', label: 'Single' }] },
    { id: 'm', label: 'Months you owned and lived in the home', def: 14, unit: 'months', max: 600 },
    { id: 'g', label: 'Gain on the sale', def: 120000, unit: '$', max: 100_000_000 },
  ],
  run: ({ j, m, g }: Record<string, number>) => {
    const cap = j ? FED.sec121.joint : FED.sec121.single;
    const max = cap * Math.min(1, Math.max(0, m) / FED.sec121.partialDivisorMonths);
    const ex = Math.min(max, Math.max(0, g));
    return {
      head: ['Gain you can exclude', usd(ex)] as [string, string],
      rows: [['Reduced maximum exclusion', usd(max)], ['Gain left to tax', usd(Math.max(0, g - ex))], ['Full exclusion reached at', `${FED.sec121.partialDivisorMonths} months`]] as Array<[string, string]>,
      note: 'Only when the main reason for the sale is a job change, health or an unforeseen event (Publication 523).',
    };
  },
});
