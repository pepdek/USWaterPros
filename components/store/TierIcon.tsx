// Line drawings of each system with a color spot printed slightly off-register behind them (see Icon.tsx).
const TANK = (x: number, h = 34) => (
  <g key={x} transform={`translate(${x} 0)`}>
    <rect x="0" y={44 - h} width="14" height={h} rx="7" />
    <path d={`M3 ${44 - h + 4}h8`} />
    <rect x="2" y={44 - h - 5} width="10" height="5" rx="1.5" />
  </g>
);
const BRINE = (x: number) => <g key={`b${x}`} transform={`translate(${x} 0)`}><rect x="0" y="22" width="16" height="22" rx="3" /><path d="M0 28h16" /></g>;

export default function TierIcon({ id }: { id: string }) {
  const parts = id === 'essential' ? [TANK(10), <path key="f" d="M34 38h20M34 31h20" />] : id === 'complete' ? [TANK(6), BRINE(26), <path key="f" d="M48 38h8" />] : [TANK(4, 34), TANK(24, 28), BRINE(44)];
  return (
    <svg className="ico" width="76" height="57" viewBox="0 0 64 48" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <g transform="translate(1.4 1.6)" fill="var(--spot)" stroke="none">{parts}</g>
      <g stroke="currentColor" strokeWidth="1.8">{parts}</g>
    </svg>
  );
}
