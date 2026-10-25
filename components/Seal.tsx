// A round "licensed local plumbers" seal: navy disc, cream lettering set on a circle, a red star in the middle. Pure SVG, decorative.
export default function Seal({ className = '' }: { className?: string }) {
  const star = (cx: number, cy: number, r: number) => Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.42 : r; return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`; }).join(' ');
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <defs><path id="seal-ring" d="M100 100 m-70 0 a70 70 0 1 1 140 0 a70 70 0 1 1 -140 0" /></defs>
      <circle cx="100" cy="100" r="96" fill="#0b2545" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#fbf8f1" strokeOpacity=".55" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="#fbf8f1" strokeOpacity=".4" strokeWidth="1" />
      <text fill="#fbf8f1" style={{ fontFamily: 'var(--sign)', fontWeight: 700, fontSize: 16 }}>
        <textPath href="#seal-ring" startOffset="0" textLength="432" lengthAdjust="spacing">★ LICENSED LOCAL PLUMBERS ★ TACOMA, WASHINGTON ★</textPath>
      </text>
      <polygon points={star(100, 100, 30)} fill="#b3202a" />
    </svg>
  );
}
