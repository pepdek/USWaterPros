const P: Record<string, string> = {
  house: 'M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6',
  drop: 'M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z',
  flask: 'M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M8 15h8',
  glass: 'M6 3h12l-1.5 17a1 1 0 01-1 1h-7a1 1 0 01-1-1L6 3zM7 9h10',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  building: 'M5 21V5a1 1 0 011-1h8a1 1 0 011 1v16M15 10h3a1 1 0 011 1v10M3 21h18M9 8h2M9 12h2M9 16h2',
  clipboard: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4',
  check: 'M4 12l5 5L20 6',
  document: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  handshake: 'M2 12l5-5 4 2 4-2 5 5-7 7-3-2-2 2zM7 7l-3 3M17 7l3 3',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  badge: 'M12 2l3 3 4-.5.5 4 3 3-3 3-.5 4-4-.5-3 3-3-3-4 .5-.5-4-3-3 3-3 .5-4 4 .5z',
};

export default function Icon({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name]} />
    </svg>
  );
}
