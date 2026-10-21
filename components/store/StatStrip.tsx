import { STORE } from '@/lib/store';

// Four proof numbers on the blue hero, no panel behind them. Light cyan numerals and white labels on the blue: 4.1:1 or better at the left edge where they sit, and the numerals are large type.
export default function StatStrip() {
  const stats: [React.ReactNode, string][] = [
    [`${STORE.from}+`, 'Starting price'],
    [`${STORE.installHours} hrs`, 'Install time'],
    ['100%', 'Refundable'],
    [<><span aria-hidden>★ </span>{STORE.since}</>, 'Local since'],
  ];
  return (
    <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 border-t border-white/25 pt-7">
      {stats.map(([n, l]) => (
        <div key={l} className="flex flex-col-reverse gap-1">
          <dt className="font-mono text-[11px] font-medium uppercase tracking-[.08em] text-white whitespace-nowrap">{l}</dt>
          <dd className="font-mono text-[28px] font-semibold tracking-tight whitespace-nowrap text-[#a8e9ef]">{n}</dd>
        </div>
      ))}
    </dl>
  );
}
