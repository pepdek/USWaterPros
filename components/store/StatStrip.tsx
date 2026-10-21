import { STORE } from '@/lib/store';
import { TEAL_ON_WHITE } from '@/lib/contrast';

// Four proof numbers under the hero button. Numbers are large bold type in a darkened brand teal (4.5:1+ on white); labels are ink.
export default function StatStrip() {
  const stats: [React.ReactNode, string][] = [
    [`${STORE.from}+`, 'Starting price'],
    [`${STORE.installHours} hrs`, 'On-site install'],
    ['100%', 'Refundable'],
    [<><span aria-hidden>★ </span>{STORE.since}</>, 'Local since'],
  ];
  return (
    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl bg-white p-5 shadow-lg">
      {stats.map(([n, l]) => (
        <div key={l} className="flex flex-col-reverse">
          <dt className="font-mono text-[11px] font-medium uppercase tracking-[.12em] text-[#3f4a4f] whitespace-nowrap">{l}</dt>
          <dd className="font-mono text-[26px] font-semibold tracking-tight whitespace-nowrap" style={{ color: TEAL_ON_WHITE }}>{n}</dd>
        </div>
      ))}
    </dl>
  );
}
