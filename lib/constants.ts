export const PHONE = '(253) 777-0901';
export const PHONE_HREF = 'tel:+12537770901';
export const SMS_HREF = 'sms:+12537770901';
// Aliases on the one Google Workspace mailbox (team@). Add a new alias in Google Admin before using it here.
export const SUPPORT_EMAIL = 'support@uswaterpros.com';
export const PRIVACY_EMAIL = 'privacy@uswaterpros.com';
export const SOCIAL: [string, string][] = [
  ['LinkedIn', 'https://www.linkedin.com/company/uswaterpros'],
  ['Facebook', 'https://www.facebook.com/USWaterPros'],
];
export const SAME_AS = SOCIAL.map(([, u]) => u);
