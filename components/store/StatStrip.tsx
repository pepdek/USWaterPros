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
    <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-7 border-t border-black/10 pt-7">
      {stats.map(([n, l]) => (
        <div key={l} className="flex flex-col-reverse gap-1">
          <dt className="text-[12px] font-medium tracking-[.02em] text-[#6e6e73] whitespace-nowrap">{l}</dt>
          <dd className="text-[30px] font-semibold tracking-[-0.035em] whitespace-nowrap text-ink">{n}</dd>
        </div>
      ))}
    </dl>
  );
}
