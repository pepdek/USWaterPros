import { NextRequest, NextResponse } from 'next/server';
import { badOrigin, rateLimited } from '@/lib/guard';
import { sendMail } from '@/lib/mail';
import { supabase } from '@/lib/supabase';
import { SERVICES } from '@/lib/services';
import { formatUSD, tierById } from '@/lib/pricing';
import { isServedZip } from '@/lib/serviceArea';

export async function POST(req: NextRequest) {
  if (badOrigin(req)) return NextResponse.json({ success: false }, { status: 403 });
  if (rateLimited(req, 'leads', 8)) return NextResponse.json({ success: false, error: 'slow_down' }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true, success: true, leadId: crypto.randomUUID() }); // honeypot: pretend it worked
  const s = (k: string, n: number) => String(b[k] ?? '').trim().slice(0, n);
  // Quiz submissions (from /quiz) carry a recommendation; they have no ZIP and store the full answers.
  const isQuiz = typeof b.recommendedSystem === 'string';
  const isTool = !isQuiz && b.service_type === 'water-diagnostic';
  // Wizard: 'instant-price' is captured at the price step (phone required); 'waitlist' is a ZIP outside the service area.
  const isWizard = !isQuiz && b.service_type === 'instant-price';
  const isWait = !isQuiz && b.service_type === 'waitlist';
  const wTier = isWizard ? tierById(s('tier', 20)) : undefined;
  const tool = isTool ? (() => { const t = (b.tool ?? {}) as Record<string, unknown>; const n = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    return { name: 'diagnostic', score: n(t.score), waste: n(t.waste), tier: String(t.tier ?? '').slice(0, 20), answers: (Array.isArray(t.answers) ? t.answers : []).slice(0, 10).map((x: unknown) => String(x).slice(0, 20)), sms_opt_in: t.sms_opt_in === true }; })() : null;
  const rec = s('recommendedSystem', 100);
  const quiz = isQuiz ? {
    location: s('location', 60), currentSituation: s('currentSituation', 60), servicePathA: s('servicePathA', 60), servicePathB: s('servicePathB', 60),
    householdSize: s('householdSize', 20), budgetComfort: s('budgetComfort', 60), timeline: s('timeline', 60),
    communicationPreference: s('communicationPreference', 20), urgencyPriority: s('urgencyPriority', 10),
    sessionId: s('sessionId', 40), waterSourceType: s('waterSourceType', 20) || null, showedWellWaterBranch: b.showedWellWaterBranch === true,
    tags: (Array.isArray(b.tags) ? b.tags : []).slice(0, 5).map((x: unknown) => String(x).slice(0, 40)) as string[], addons: (Array.isArray(b.addons) ? b.addons : []).slice(0, 4).map((x: unknown) => String(x).slice(0, 30)) as string[], wellTest: s('wellTest', 30) || null,
    waterConcerns: (Array.isArray(b.waterConcerns) ? b.waterConcerns : []).slice(0, 8).map((x: unknown) => String(x).slice(0, 40)) as string[],
    recommendedSystem: rec, recommendedPrice: Number(b.recommendedPrice) || 0,
  } : null;
  const quizService = quiz?.wellTest || /well/i.test(rec) ? 'well-water-treatment' : 'whole-home-water-filtration';
  // Lead source: whitelist the attribution object so only campaign/referrer fields are stored.
  const touch = (t: unknown) => { const o = (t ?? {}) as Record<string, unknown>; const g = (k: string) => (typeof o[k] === 'string' ? (o[k] as string).slice(0, 120) : ''); return { source: g('source'), medium: g('medium'), campaign: g('campaign'), content: g('content'), traffic_source: g('traffic_source'), landing_page: g('landing_page'), referrer: g('referrer'), gclid: g('gclid') ? 'yes' : '' }; };
  const at = (b.attribution ?? {}) as Record<string, unknown>;
  const attribution = b.attribution ? { first: touch(at.first), last: touch(at.last), lead_source: typeof at.lead_source === 'string' ? at.lead_source.slice(0, 120) : '' } : null;
  const lead = {
    id: crypto.randomUUID(),
    attribution, lead_source: attribution?.lead_source || null,
    name: s('name', 255) || (isWait ? 'Waitlist' : 'Water report request'), email: s('email', 255) || null, phone: s('phone', 20) || null,
    zip_code: isQuiz || isTool ? null : s('zip_code', 10), service_type: isQuiz ? quizService : s('service_type', 255), page_source: s('page_source', 255),
    ...(isWizard && wTier && { notes: `INSTANT PRICE: ${wTier.name} (${formatUSD(wTier.price)}) viewed. ZIP in service area.` }),
    ...(isWait && { notes: `WAITLIST: ZIP ${s('zip_code', 10)} is outside the service area.` }),
    ip_address: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || null,
    user_agent: req.headers.get('user-agent'),
    ...(tool && { quiz: tool, notes: `TOOL diagnostic: ${tool.score}/7 checked | est. waste ${formatUSD(tool.waste)}/yr | ${tool.tier} | SMS opt-in: ${tool.sms_opt_in ? 'YES' : 'no'} | yes: ${tool.answers.join(', ')}` }),
    ...(quiz && {
      quiz,
      notes: `QUIZ${quiz.tags.length ? ' [' + quiz.tags.join(',') + ']' : ''}: ${rec} (${formatUSD(quiz.recommendedPrice)}${quiz.addons.length ? ' incl. add-ons: ' + quiz.addons.join(', ') : ''}) | urgency ${quiz.urgencyPriority} | prefers ${quiz.communicationPreference} | timeline ${quiz.timeline} | household ${quiz.householdSize} | ${quiz.currentSituation} | budget: ${quiz.budgetComfort} | concerns: ${quiz.waterConcerns.join(', ')} | ${quiz.location}`,
    }),
  };
  const emailRequired = isQuiz || isTool || lead.service_type === 'water-report';
  const emailOk = lead.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) : !emailRequired;
  const digits = (lead.phone ?? '').replace(/\D/g, '').length;
  const phoneOk = (isWizard ? digits >= 10 : isWait ? digits >= 10 || !!lead.email : !(isQuiz || tool?.sms_opt_in) || digits >= 10);
  const zipOk = isQuiz || isTool || /^\d{5}$/.test(lead.zip_code ?? '');
  if (lead.name.length < 2 || !emailOk || !phoneOk || !zipOk
    || (isWizard && (!wTier || !isServedZip(lead.zip_code ?? ''))) || (isWait && isServedZip(lead.zip_code ?? ''))
    || !(isQuiz || isTool || isWizard || isWait || lead.service_type === 'water-report' || SERVICES.some((x) => x.slug === lead.service_type))) {
    return NextResponse.json({ success: false, error: 'invalid' }, { status: 400 });
  }
  // RLS lets the public site insert new leads only; everything else needs an admin login.
  const { error } = await supabase().from('leads').insert(lead);
  if (error) { console.error(error); return NextResponse.json({ success: false, error: 'db' }, { status: 500 }); }

  // Owner email (Resend or SendGrid, see lib/mail.ts). Failure never blocks the lead.
  await sendMail(`New lead: ${lead.service_type} (${lead.zip_code})`, `${lead.name}\n${lead.email}\n${lead.phone ?? ''}\n${lead.zip_code}`);
  return NextResponse.json({ ok: true, success: true, leadId: lead.id });
}
