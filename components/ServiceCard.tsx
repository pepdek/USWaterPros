import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/lib/services';

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <div className="card p-8 md:p-10 flex flex-col gap-3">
      <div className="relative h-48 rounded-lg bg-ice">
        <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 768px) 350px, 90vw" className="object-contain p-3" />
      </div>
      <h3 className="text-xl">{s.name}</h3>
      <p>{s.blurb}</p>
      <Link href={`/services/${s.slug}`} className="font-semibold text-ink underline mt-auto min-h-12 inline-flex items-center">Explore Service →</Link>
    </div>
  );
}
