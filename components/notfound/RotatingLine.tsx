'use client';
import { useEffect, useState } from 'react';

// Shows the first line on the server (and with JavaScript off), then swaps to a random one on load.
export default function RotatingLine({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { setI(Math.floor(Math.random() * lines.length)); }, [lines.length]);
  return <p className="!py-0 font-light italic text-[17px]" style={{ color: 'var(--nf-muted)' }}>{lines[i]}</p>;
}
