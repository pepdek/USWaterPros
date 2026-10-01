import Link from 'next/link';

export type Crumb = { label: string; href?: string };
const BASE = 'https://uswaterpros.com';

// Hidden under 640px. Emits BreadcrumbList JSON-LD. Last item is the current page.
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...items];
  const schema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href && { item: BASE + c.href }) })),
  };
  return (
    <nav aria-label="Breadcrumb" className="hidden sm:block mt-3 mb-4 font-sans text-xs text-navy">
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {c.href && i < all.length - 1
              ? <Link href={c.href} className="hover:text-white hover:underline">{c.label}</Link>
              : <span aria-current={i === all.length - 1 ? 'page' : undefined} className="font-semibold">{c.label}</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </nav>
  );
}
