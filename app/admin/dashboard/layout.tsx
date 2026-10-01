// Render at request time so the build doesn't need Supabase env vars.
export const dynamic = 'force-dynamic';
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
