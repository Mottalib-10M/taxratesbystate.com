/** Annual gift exclusion 2026 ($19,000 per recipient, Rev. Proc. 2025-32): what can leave an estate tax-free each year. */
import FED from '../../data/realestate-federal-2026.json';
import { usd } from './_kit';
export default () => ({
  title: 'Gifts that never touch the exemption',
  cta: '',
  inputs: [
    { id: 'r', label: 'Number of people you give to', def: 4, max: 200 },
    { id: 'c', label: 'Married couple splitting gifts?', def: 1, options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }] },
    { id: 'y', label: 'Years of giving', def: 10, max: 60 },
  ],
  run: ({ r, c, y }: Record<string, number>) => {
    const per = FED.estate.annualGiftExclusion * (c ? 2 : 1);
    return {
      head: ['Moved out of the estate, tax-free', usd(per * r * y)] as [string, string],
      rows: [['Per recipient per year', usd(per)], ['Per year, all recipients', usd(per * r)]] as Array<[string, string]>,
      note: `Annual exclusion ${usd(FED.estate.annualGiftExclusion)} in ${FED.year}, indexed later; held constant here. Some states with an estate tax add back recent gifts.`,
    };
  },
});
