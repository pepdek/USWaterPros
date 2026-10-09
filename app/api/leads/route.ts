import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SERVICES } from '@/lib/services';
import { formatUSD } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const s = (k: string, n: number) => String(b[k] ?? '').trim().slice(0, n);
  // Quiz submissions (from /quiz) carry a recommendation; they have no ZIP and store the full answers.
  const isQuiz = typeof b.recommendedSystem === 'string';
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
  const lead = {
    id: crypto.randomUUID(),
    name: s('name', 255) || 'Water report request', email: s('email', 255), phone: s('phone', 20) || null,
    zip_code: isQuiz ? null : s('zip_code', 10), service_type: isQuiz ? quizService : s('service_type', 255), page_source: s('page_source', 255),
    ip_address: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || null,
    user_agent: req.headers.get('user-agent'),
    ...(quiz && {
      quiz,
      notes: `QUIZ${quiz.tags.length ? ' [' + quiz.tags.join(',') + ']' : ''}: ${rec} (${formatUSD(quiz.recommendedPrice)}${quiz.addons.length ? ' incl. add-ons: ' + quiz.addons.join(', ') : ''}) | urgency ${quiz.urgencyPriority} | prefers ${quiz.communicationPreference} | timeline ${quiz.timeline} | household ${quiz.householdSize} | ${quiz.currentSituation} | budget: ${quiz.budgetComfort} | concerns: ${quiz.waterConcerns.join(', ')} | ${quiz.location}`,
    }),
  };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  const phoneOk = !isQuiz || (lead.phone ?? '').replace(/\D/g, '').length >= 10;
  const zipOk = isQuiz || /^\d{5}$/.test(lead.zip_code ?? '');
  if (lead.name.length < 2 || !emailOk || !phoneOk || !zipOk
    || !(isQuiz || lead.service_type === 'water-report' || SERVICES.some((x) => x.slug === lead.service_type))) {
    return NextResponse.json({ success: false, error: 'invalid' }, { status: 400 });
  }
  // RLS lets the public site insert new leads only; everything else needs an admin login.
  const { error } = await supabase().from('leads').insert(lead);
  if (error) { console.error(error); return NextResponse.json({ success: false, error: 'db' }, { status: 500 }); }

  // ponytail: SendGrid via fetch, skipped silently if unconfigured. Failure never blocks the lead.
  const { SENDGRID_API_KEY: key, ADMIN_NOTIFY_EMAIL: to } = process.env;
  if (key && to) {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }], from: { email: to },
        subject: `New lead: ${lead.service_type} (${lead.zip_code})`,
        content: [{ type: 'text/plain', value: `${lead.name}\n${lead.email}\n${lead.phone ?? ''}\n${lead.zip_code}` }],
      }),
    }).catch(console.error);
  }
  return NextResponse.json({ ok: true, success: true, leadId: lead.id });
}
