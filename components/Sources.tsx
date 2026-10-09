import { SOURCES, type SourceId } from '@/lib/sources';

export default function Sources({ ids, className = '' }: { ids: readonly SourceId[]; className?: string }) {
  return (
    <p className={`text-xs text-ink/70 ${className}`}>
      Sources:{' '}
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && ' · '}
          <a href={SOURCES[id][1]} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">{SOURCES[id][0]}</a>
        </span>
      ))}
    </p>
  );
}
