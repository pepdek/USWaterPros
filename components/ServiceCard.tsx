import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/lib/services';

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <div className="card p-8 md:p-10 flex flex-col gap-3">
      <div className="relative h-48 rounded-2xl bg-ice">
        <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 768px) 350px, 90vw" className="object-contain p-3" />
      </div>
      <h3 className="text-[22px] font-semibold tracking-[-0.025em] leading-tight">{s.name}</h3>
      <p className="!text-[16px] text-[#6e6e73]">{s.blurb}</p>
      <Link href={`/services/${s.slug}`} className="font-medium text-blue hover:underline mt-auto min-h-12 inline-flex items-center">Explore service <span aria-hidden className="ml-1">›</span></Link>
    </div>
  );
}
