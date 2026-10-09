import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { PHONE, PHONE_HREF } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | US Water Pros',
  description: 'What US Water Pros collects when you use uswaterpros.com, how we use it, who we share it with, and your choices.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="October 9, 2026">
      <p>US Water Pros (“we,” “us”) provides water filtration and treatment services in Washington State. This policy explains what we collect on uswaterpros.com, how we use it, and the choices you have. We do not sell your personal information.</p>

      <h2>What we collect</h2>
      <p><strong>Information you give us.</strong> When you request a consultation, take the quiz, use our water tools or text or call us, you may give us:</p>
      <ul>
        <li>Name, email address, phone number and ZIP code</li>
        <li>Your answers to quiz and diagnostic questions (for example water source, concerns and household details)</li>
        <li>Anything you write in a message to us</li>
        <li>Your choice to receive text messages, and when you made it</li>
      </ul>
      <p><strong>Information collected automatically.</strong> We and our analytics providers collect:</p>
      <ul>
        <li>Pages viewed, buttons clicked, quiz and tool progress, and device, browser and approximate location data</li>
        <li>How you reached us: the referring site and campaign details such as UTM parameters or ad click identifiers</li>
        <li>Cookies and similar browser storage (see below)</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to you, schedule consultations and provide quotes and services</li>
        <li>To send the texts, calls or emails you asked for and follow up on your request</li>
        <li>To understand which pages, tools and ads bring in customers, and to improve the site</li>
        <li>To keep the site secure, prevent spam and meet legal obligations</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We share information only with service providers that help us run the business, under their own terms and only as needed:</p>
      <ul>
        <li>Hosting and database providers (Netlify and Supabase) that store the site and the information you submit</li>
        <li>Google (Tag Manager and Analytics) for site analytics</li>
        <li>Technicians or partners who perform your service, only what they need to contact you and do the work</li>
      </ul>
      <p>We may also disclose information if the law requires it, or in a sale or reorganization of our business. We do not sell your personal information or share it for third-party advertising.</p>

      <h2>Cookies and analytics</h2>
      <p>We use Google Tag Manager and Google Analytics, which set cookies and use browser storage to measure traffic and understand how people find us. We also save your first and most recent traffic source in your browser so we can tell which channels lead to requests. You can block or delete cookies in your browser settings, or install Google’s opt-out browser add-on. The site works without them.</p>

      <h2>Text messages and calls</h2>
      <p>We text or call you only if you asked us to or opted in. Phone numbers you give for text messaging are not shared with third parties for marketing. See our <a href="/terms#sms" className="underline">SMS terms</a> for how to stop messages.</p>

      <h2>How long we keep it</h2>
      <p>We keep lead and customer records as long as needed to serve you, meet legal and accounting requirements and resolve disputes. Analytics data is kept by Google under its own retention settings.</p>

      <h2>Security</h2>
      <p>We use access controls and encrypted connections, and we limit who can see lead information. No system is perfectly secure, so we cannot guarantee absolute security.</p>

      <h2>Your choices</h2>
      <p>You can ask us to see, correct or delete the personal information we hold about you, or to stop contacting you. Call or text us at <a href={PHONE_HREF} className="underline">{PHONE}</a> and we will respond within a reasonable time. To stop texts, reply STOP to any message.</p>

      <h2>Children</h2>
      <p>This site is for homeowners and is not directed to children under 13. We do not knowingly collect information from children.</p>

      <h2>Changes</h2>
      <p>We may update this policy. The date at the top shows the latest version, and material changes will be posted on this page.</p>

      <h2>Contact</h2>
      <p>US Water Pros, serving Pierce, Kitsap and Thurston Counties, WA. Call or text <a href={PHONE_HREF} className="underline">{PHONE}</a>.</p>
    </LegalPage>
  );
}
