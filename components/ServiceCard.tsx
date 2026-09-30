import Link from 'next/link';
import Icon from './Icon';
import type { Service } from '@/lib/services';

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <span className="text-aqua"><Icon name={s.icon} /></span>
      <h3 className="text-xl">{s.name}</h3>
      <p>{s.blurb}</p>
      <Link href={`/services/${s.slug}`} className="font-semibold text-navy underline mt-auto min-h-12 inline-flex items-center">Explore Service →</Link>
    </div>
  );
}
