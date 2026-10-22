// Promise: after payment we text the customer to confirm the install time by the end of the NEXT business day (Mon-Fri, Pacific time).
// Holidays are not modelled. VERIFY if you want them skipped.
const TZ = 'America/Los_Angeles';

const parts = (d: Date) => {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }).formatToParts(d);
  const g = (t: string) => f.find((p) => p.type === t)!.value;
  return { y: +g('year'), m: +g('month'), d: +g('day'), wd: g('weekday') };
};

// 23:59:59 Pacific on the next business day after `paidAt`.
export function confirmDeadline(paidAt: Date): Date {
  const { y, m, d, wd } = parts(paidAt);
  const add = wd === 'Fri' ? 3 : wd === 'Sat' ? 2 : 1; // Fri -> Mon, Sat -> Mon, Sun -> Mon, else tomorrow
  const target = new Date(Date.UTC(y, m - 1, d + (wd === 'Sun' ? 1 : add), 12));
  const { y: ty, m: tm, d: td } = parts(target);
  // 23:59:59 Pacific on that calendar day, using that day's real UTC offset (handles daylight saving).
  const noon = new Date(Date.UTC(ty, tm - 1, td, 20));
  const name = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'shortOffset' }).formatToParts(noon).find((p) => p.type === 'timeZoneName')!.value; // e.g. GMT-7
  const hours = Number(name.replace('GMT', '') || 0);
  return new Date(Date.UTC(ty, tm - 1, td, 23, 59, 59) - hours * 3600_000);
}
