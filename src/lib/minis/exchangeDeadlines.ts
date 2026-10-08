/** 1031 exchange: the 45-day identification and 180-day exchange deadlines from the closing date (Form 8824 instructions). */
import FED from '../../data/realestate-federal-2026.json';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export default () => ({
  title: 'Your 45-day and 180-day deadlines',
  cta: '',
  inputs: [
    { id: 'm', label: 'Month the property you sell closes (2026)', def: 9, options: MONTHS.map((n, i) => ({ value: String(i), label: n })) },
    { id: 'd', label: 'Day of the month', def: 15, max: 31 },
  ],
  run: ({ m, d }: Record<string, number>) => {
    const day = Math.max(1, Math.min(Math.round(d) || 1, new Date(Date.UTC(FED.year, m + 1, 0)).getUTCDate()));
    const start = Date.UTC(FED.year, m, day);
    const add = (n: number) => new Date(start + n * 86400000);
    const end = add(FED.x1031.exchangeDays);
    const returnDue = new Date(Date.UTC(FED.year + 1, 3, 15));
    const cut = end > returnDue;
    return {
      head: ['Identify the replacement by', fmt(add(FED.x1031.identifyDays))] as [string, string],
      rows: [
        ['Close on the replacement by', fmt(end)],
        ['Return due date to watch', cut ? 'April 15: extend your return' : 'not binding'],
        ['Days counted', 'calendar days, weekends and holidays included'],
      ] as Array<[string, string]>,
      note: cut ? 'The 180 days run past the April 15 due date: without an extension of your return the exchange period ends earlier.' : 'Both periods run at the same time from the day the old property is transferred.',
    };
  },
});
