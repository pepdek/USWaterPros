'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SERVICES } from '@/lib/services';

type Lead = { id: string; created_at: string; name: string; email: string; phone: string | null; zip_code: string; service_type: string; status: string };
const STATUSES = ['new', 'contacted', 'converted', 'lost'];

function Counter({ n }: { n: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const p = Math.min((t - t0) / 600, 1); setV(Math.round(n * p)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [n]);
  return <>{v}</>;
}

export default function Dashboard() {
  const sb = useMemo(() => supabase(), []);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [fs, setFs] = useState({ service: '', status: '', from: '', to: '' });
  const [login, setLogin] = useState({ email: '', password: '', err: '' });

  const load = () => sb.from('leads').select('*').order('created_at', { ascending: false }).limit(1000).then(({ data }) => setLeads((data as Lead[]) ?? []));

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => data.subscription.unsubscribe();
  }, [sb]);
  useEffect(() => {
    if (!authed) return;
    load();
    // live: any change to leads reloads the list
    const ch = sb.channel('leads').on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, load).subscribe();
    return () => { sb.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  if (authed === null) return null;
  if (!authed) {
    return (
      <main className="mx-auto max-w-sm p-6">
        <form className="card p-6 flex flex-col gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await sb.auth.signInWithPassword({ email: login.email, password: login.password });
          if (error) setLogin({ ...login, err: error.message });
        }}>
          <h2>Admin sign in</h2>
          <input className="field" type="email" placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
          <input className="field" type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          {login.err && <p className="text-coral text-sm">{login.err}</p>}
          <button className="btn btn-navy">Sign in</button>
        </form>
      </main>
    );
  }

  const rows = leads.filter((l) =>
    (!fs.service || l.service_type === fs.service) && (!fs.status || l.status === fs.status) &&
    (!fs.from || l.created_at >= fs.from) && (!fs.to || l.created_at <= fs.to + 'T23:59:59'));
  const converted = rows.filter((l) => l.status === 'converted').length;
  const zips = Object.entries(rows.reduce<Record<string, number>>((a, l) => ((a[l.zip_code] = (a[l.zip_code] ?? 0) + 1), a), {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 5);

  const setStatus = async (id: string, status: string) => {
    const t = new Date().toISOString();
    await sb.from('leads').update({ status, ...(status === 'contacted' && { contacted_at: t }), ...(status === 'converted' && { converted_at: t }) }).eq('id', id);
    load();
  };
  const csv = () => {
    const cols = ['created_at', 'name', 'email', 'phone', 'service_type', 'zip_code', 'status'] as const;
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const body = [cols.join(','), ...rows.map((l) => cols.map((c) => q(l[c])).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/csv' }));
    a.download = 'leads.csv'; a.click();
  };

  return (
    <main className="mx-auto max-w-6xl p-4 flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <h1 className="!text-3xl">Leads</h1>
        <div className="flex gap-2"><button className="btn btn-aqua" onClick={csv}>Export CSV</button><button className="btn btn-navy" onClick={() => sb.auth.signOut()}>Sign out</button></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4"><div className="text-4xl font-bold text-navy"><Counter n={rows.length} /></div>Leads</div>
        <div className="card p-4"><div className="text-4xl font-bold text-navy">{rows.length ? Math.round((converted / rows.length) * 100) : 0}%</div>Conversion rate</div>
        <div className="card p-4"><div className="font-bold text-navy">Top ZIPs</div>{zips.map(([z, n]) => <div key={z}>{z} · {n}</div>)}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <select className="field !w-auto" value={fs.service} onChange={(e) => setFs({ ...fs, service: e.target.value })}><option value="">All services</option>{SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select>
        <select className="field !w-auto" value={fs.status} onChange={(e) => setFs({ ...fs, status: e.target.value })}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <input className="field !w-auto" type="date" value={fs.from} onChange={(e) => setFs({ ...fs, from: e.target.value })} />
        <input className="field !w-auto" type="date" value={fs.to} onChange={(e) => setFs({ ...fs, to: e.target.value })} />
      </div>
      <div className="card overflow-x-auto !transform-none">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-navy">{['Name', 'Email', 'Phone', 'Service', 'ZIP', 'Time', 'Status'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{rows.map((l) => (
            <tr key={l.id} className="border-t border-black/5">
              <td className="p-3">{l.name}</td><td className="p-3">{l.email}</td><td className="p-3">{l.phone}</td>
              <td className="p-3">{l.service_type}</td><td className="p-3">{l.zip_code}</td>
              <td className="p-3">{new Date(l.created_at).toLocaleString()}</td>
              <td className="p-3"><select className="field !min-h-9 !w-auto" value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </main>
  );
}
