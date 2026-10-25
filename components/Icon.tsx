// Our own icon set, drawn like a screen print: a navy line drawing with a flat color spot printed a hair off-register behind it.
// The line uses currentColor. The spot is sky blue on light surfaces and flag red on dark ones (see .ico in globals.css), so one component works everywhere.
// 32 x 32 grid, 2px line, round caps. Add a new icon by adding a [line, spot] pair; the spot may be empty.
const ICONS: Record<string, [string, string]> = {
  drop: ['M16 4C16 4 7 14 7 20a9 9 0 0018 0C25 14 16 4 16 4zM12 21.5a4.2 4.2 0 003.6 3.6', 'M16 4C16 4 7 14 7 20a9 9 0 0018 0C25 14 16 4 16 4z'],
  layers: ['M16 5l11 6-11 6-11-6zM5 16l11 6 11-6M5 21l11 6 11-6', 'M16 5l11 6-11 6-11-6z'],
  shield: ['M16 4l10 3.5V15c0 6-4.5 10-10 12-5.5-2-10-6-10-12V7.5zM11.5 15.5l3.5 3.5 6-7', 'M16 4l10 3.5V15c0 6-4.5 10-10 12-5.5-2-10-6-10-12V7.5z'],
  glass: ['M8 5h16l-2 20a2 2 0 01-2 1.8h-8a2 2 0 01-2-1.8zM9 12h14', 'M9.2 12h13.6l-1.6 13.6a1 1 0 01-1 .9h-8.4a1 1 0 01-1-.9z'],
  flask: ['M12 4h8M13 4v8l-6 11a2.5 2.5 0 002.2 3.7h13.6A2.5 2.5 0 0025 23l-6-11V4M10.5 19h11', 'M10.5 19h11l3 5.5a2 2 0 01-1.6 3H9.1a2 2 0 01-1.6-3z'],
  building: ['M6 27V8l9-4v23M15 13l11 4v10M4 27h24M10.5 11h1M10.5 15.5h1M10.5 20h1M20 21h2M20 25h2', 'M6 8l9-4v23H6z'],
  house: ['M4 15L16 5l12 10M7 13v14h18V13M13 27v-8h6v8', 'M7 13l9-7.5 9 7.5v14H7z'],
  document: ['M9 4h10l6 6v18H9zM19 4v6h6M13 16h8M13 21h8', 'M9 4h10l6 6v18H9z'],
  clipboard: ['M11 6h10v4H11zM9 8H7v20h18V8h-2M12 16h8M12 21h5', 'M7 8h18v20H7z'],
  check: ['M9 16.5l5 5 9-10', 'M16 5a11 11 0 100 22 11 11 0 000-22z'],
  clock: ['M16 5a11 11 0 100 22 11 11 0 000-22zM16 10v6.5l4.5 2.5', 'M16 5a11 11 0 100 22 11 11 0 000-22z'],
  // A five-point star on a spot disc: "one fixed, installed price".
  badge: ['M16 4.5l3.4 7 7.6 1.1-5.5 5.4 1.3 7.6L16 22l-6.8 3.6 1.3-7.6L5 12.6l7.6-1.1z', 'M16 5a11 11 0 100 22 11 11 0 000-22z'],
  calculator: ['M7 4h18v24H7zM11 9h10v5H11zM11.5 19h.01M16 19h.01M20.5 19h.01M11.5 24h.01M16 24h.01M20.5 24h.01', 'M11 9h10v5H11z'],
  chart: ['M6 26V16M13 26V8M20 26v-7M27 26V12M3 26h26', 'M10.5 6h5v20h-5z'],
  handshake: ['M3 17l6-6 5 2.5 5-2.5 6 6-9 9-4-3-3 3zM9 11l-4 4M23 11l4 4', 'M9 11l5 2.5 5-2.5 6 6-9 9-4-3-3 3-6-9z'],
  tag: ['M4 16V6a2 2 0 012-2h10l12 12-10 10zM11 11h.01', 'M4 6a2 2 0 012-2h10l12 12-10 10L4 16z'],
  calendar: ['M5 7h22v20H5zM5 13h22M11 4v5M21 4v5M12 20l3 3 5-6', 'M5 7h22v6H5z'],
  // A pipe wrench: "licensed local plumbers".
  wrench: ['M22.5 4.5a6 6 0 00-7.6 7.7L5 22.2a3 3 0 004.2 4.2l10-10A6 6 0 0027.5 9L23 13.5l-4-4z', 'M22.5 4.5a6 6 0 00-7.6 7.7l4 4a6 6 0 007.6-7.7L23 13.5l-4-4z'],
  refund: ['M26 16a10 10 0 11-3.2-7.3M26 5v5h-5M12 16.5l3 3 5-6', 'M16 6a10 10 0 100 20 10 10 0 000-20z'],
};

export default function Icon({ name, size = 32 }: { name: string; size?: number }) {
  const [line, spot] = ICONS[name] ?? ICONS.drop;
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 32 32" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {spot && <path d={spot} transform="translate(1.6 1.8)" fill="var(--spot)" stroke="none" />}
      <path d={line} stroke="currentColor" strokeWidth="2.1" />
    </svg>
  );
}
