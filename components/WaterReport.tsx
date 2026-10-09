'use client';
import { ewgZipUrl, profileForZip } from '@/lib/waterProfiles';

// Used by the "free water quality report" block: a typical profile for the ZIP's area, never invented numbers.
export default function WaterReport({ zip }: { zip: string }) {
  if (zip.length !== 5) return null;
  const p = profileForZip(zip);
  return (
    <div className="bg-ice text-ink rounded-3xl p-8 md:p-10 border border-cyan">
      {p ? (
        <>
          <p className="font-semibold">{p.area}: what homeowners here should check</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {p.rows.filter((r) => r.level === 'Common' || r.level === 'Possible').map((r) => <li key={r.label}>• {r.label}: {r.level.toLowerCase()}. {r.note}</li>)}
          </ul>
          <p className="text-xs">A typical profile for your area, not a lab test of your tap. <a className="underline" href={p.links[0][1]} target="_blank" rel="noopener noreferrer">See your utility’s report</a>.</p>
        </>
      ) : (
        <p className="text-sm">We don’t have a profile for {zip} yet. <a className="underline font-semibold" href={ewgZipUrl(zip)} target="_blank" rel="noopener noreferrer">Look up your ZIP in the EWG Tap Water Database</a>, or book a free consultation and we’ll review your area with you.</p>
      )}
    </div>
  );
}
