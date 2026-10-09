import type { ReactNode } from 'react';

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-12 md:py-16 [&_h2]:mt-10 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:grid [&_ul]:gap-2 [&_p]:mt-3 [&_ul]:mt-3">
      <h1>{title}</h1>
      <p className="text-ink/70">Last updated: {updated}</p>
      {children}
    </main>
  );
}
