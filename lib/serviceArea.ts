// Where we have plumbers. Pierce County only for now; everyone else joins the waitlist.
// ponytail: static list. Move it to the database if the area changes often.
const PIERCE_EXTRA = new Set([
  '98303', '98304', '98321', '98323', '98327', '98328', '98329', '98330', '98332', '98333', '98335', '98338', '98344', '98349', '98351', '98354',
  '98360', '98371', '98372', '98373', '98374', '98375', '98385', '98387', '98388', '98390', '98391', '98396',
]);
// VERIFY: confirm this ZIP list matches where your plumbers will actually work.
export const isServedZip = (zip: string) => /^\d{5}$/.test(zip) && (/^984\d\d$/.test(zip) || PIERCE_EXTRA.has(zip));
export const SERVED_AREA = 'Pierce County';
