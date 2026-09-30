'use client';
import { useEffect, useState } from 'react';

type R = { city: string; hardPct: number; warning: string };

// Fetches mock water-quality data for a ZIP; renders nothing until 5 digits.
export default function WaterReport({ zip }: { zip: string }) {
  const [r, setR] = useState<R | null>(null);
  useEffect(() => {
    setR(null);
    if (zip.length !== 5) return;
    fetch(`/api/water-quality?zip=${zip}`).then((x) => x.json()).then(setR).catch(() => {});
  }, [zip]);
  if (!r) return null;
  return (
    <div className="bg-ice text-navy rounded-lg p-4 border-l-4 border-coral">
      <p className="font-semibold">⚠ {r.city}: {r.warning}</p>
      <p className="text-sm">Hard water detected in {r.hardPct}% of homes in your area.</p>
    </div>
  );
}
