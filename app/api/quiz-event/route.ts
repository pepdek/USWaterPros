import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SCREENS = new Set(['q1', 'q2', 'i1', 'q3', 'i2', 'qwell', 'q4a', 'q5', 'q6', 'i3', 'q7', 'q8', 'result', 'submitted']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Saves the quiz answers so far, one row per step. Anonymous: no name, email or phone is ever accepted here.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (!UUID.test(String(b.sessionId)) || !SCREENS.has(b.screen)) return NextResponse.json({ ok: false }, { status: 400 });
  const a = (b.answers ?? {}) as Record<string, unknown>;
  const s = (k: string, n = 60) => (typeof a[k] === 'string' ? (a[k] as string).slice(0, n) : null);
  const answers = {
    location: s('location'), currentSituation: s('currentSituation'), waterSourceType: s('waterSourceType', 20), servicePathA: s('servicePathA'),
    householdSize: s('householdSize', 20), budgetComfort: s('budgetComfort'), timeline: s('timeline'), communicationPreference: s('communicationPreference', 20),
    waterConcerns: (Array.isArray(a.waterConcerns) ? a.waterConcerns : []).slice(0, 8).map((x: unknown) => String(x).slice(0, 40)),
  };
  const r = (b.recommendation ?? null) as { path?: string; label?: string } | null;
  const recommendation = r ? { path: String(r.path ?? '').slice(0, 20), label: String(r.label ?? '').slice(0, 80) } : null;
  const at = (b.attribution?.last ?? null) as Record<string, unknown> | null;
  const g = (k: string) => (at && typeof at[k] === 'string' ? (at[k] as string).slice(0, 80) : '');
  const attribution = at ? { source: g('source'), medium: g('medium'), campaign: g('campaign'), traffic_source: g('traffic_source'), landing_page: g('landing_page') } : null;
  const { error } = await supabase().from('quiz_events').insert({ session_id: b.sessionId, screen: b.screen, answers, recommendation, attribution });
  if (error) { console.error(error); return NextResponse.json({ ok: false }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
