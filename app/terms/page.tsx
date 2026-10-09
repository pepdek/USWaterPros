import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { PHONE, PHONE_HREF } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Use | US Water Pros',
  description: 'Terms for using uswaterpros.com, our free tools and our text messaging program.',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" updated="October 9, 2026">
      <p>These terms apply to your use of uswaterpros.com (the “site”), operated by US Water Pros (“we,” “us”). By using the site you agree to them. If you do not agree, please do not use the site. Our <a href="/privacy" className="underline">Privacy Policy</a> explains how we handle your information.</p>

      <h2>What the site is</h2>
      <p>The site provides information about our water filtration and treatment services and free tools such as the quiz, cost calculator, savings diagnostic and area water report. Submitting a form requests a consultation. It is not a contract for services.</p>

      <h2>Information and tools are estimates</h2>
      <ul>
        <li>Content on this site is general information, not medical, legal or engineering advice.</li>
        <li>Quiz results, cost and savings figures and area water reports are estimates based on public data and the answers you give. Your actual water, needs and costs can differ.</li>
        <li>Area water data comes from public utility reports and may be out of date. Only a water test of your own tap or well shows what is in your water.</li>
        <li>Prices shown on the site are starting points. A written quote after a consultation and any needed testing is the price we will honor.</li>
      </ul>

      <h2>Services and agreements</h2>
      <p>Installation and service work is covered by a separate written quote or agreement, including its warranty terms. If anything on this site conflicts with that agreement, the agreement controls.</p>

      <h2>Your use of the site</h2>
      <p>You agree to give accurate contact information and not to misuse the site: no scraping, interfering with its operation, submitting false or spam requests, or attempting unauthorized access.</p>

      <h2 id="sms">Text messaging (SMS) terms</h2>
      <ul>
        <li>If you check the text-message box or text us, you agree to receive texts from US Water Pros at the number you provide, including responses to your request, appointment details and follow-ups. Messages may be sent using automated technology.</li>
        <li>Consent is not a condition of any purchase.</li>
        <li>Message frequency varies. Message and data rates may apply.</li>
        <li>Reply STOP at any time to opt out, or HELP for help. You can also call <a href={PHONE_HREF} className="underline">{PHONE}</a>.</li>
        <li>Carriers are not liable for delayed or undelivered messages.</li>
        <li>We do not share your phone number with third parties for their marketing.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>The site’s text, graphics, logos and design belong to US Water Pros or its licensors. You may view and share pages for personal, non-commercial use, but may not copy or reuse them commercially without our written permission. Third-party names and sources are the property of their owners.</p>

      <h2>Third-party links</h2>
      <p>The site links to outside sites, such as utilities, health departments and government agencies. We do not control them and are not responsible for their content.</p>

      <h2>Disclaimers</h2>
      <p>The site is provided “as is” and “as available.” To the fullest extent the law allows, we disclaim all warranties, express or implied, including that the site will be uninterrupted or error-free, and that any estimate or result is accurate for your home.</p>

      <h2>Limitation of liability</h2>
      <p>To the fullest extent the law allows, US Water Pros is not liable for indirect, incidental, special or consequential damages arising from your use of the site, and our total liability for any claim relating to the site is limited to one hundred US dollars. Nothing here limits liability that cannot be limited by law, or our obligations under a written service agreement.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Washington. Any dispute relating to the site will be brought in the state or federal courts located in Pierce County, Washington.</p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows the latest version. Continued use of the site after a change means you accept it.</p>

      <h2>Contact</h2>
      <p>US Water Pros, serving Pierce, Kitsap and Thurston Counties, WA. Call or text <a href={PHONE_HREF} className="underline">{PHONE}</a>.</p>
    </LegalPage>
  );
}
