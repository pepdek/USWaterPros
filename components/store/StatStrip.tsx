import { STORE } from '@/lib/store';

// Four proof numbers under the hero copy: big ink numerals, small gray labels, a hairline above.
export default function StatStrip() {
  const stats: [React.ReactNode, string][] = [
    [`${STORE.from}+`, 'Starting price'],
    [`${STORE.installHours} hrs`, 'Install time'],
    ['100%', 'Refundable'],
    ['Tacoma', 'Locally owned'],
  ];
  return (
    <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-7 border-t-2 border-ink/80 pt-6">
      {stats.map(([n, l]) => (
        <div key={l} className="flex flex-col-reverse gap-1">
          <dt className="font-mono text-[13px] font-semibold uppercase tracking-[.16em] text-[#5b6472] whitespace-nowrap">{l}</dt>
          <dd className="font-mono text-[40px] font-bold leading-none tracking-[.005em] whitespace-nowrap text-ink">{n}</dd>
        </div>
      ))}
    </dl>
  );
}
