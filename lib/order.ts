import { TIERS, type TierId } from './pricing';

// Install-time windows offered in the wizard. We confirm the exact time by text.
export const WINDOWS = ['Morning', 'Afternoon', 'Anytime'] as const;
export type Window = (typeof WINDOWS)[number];

export type OrderInput = { tier: TierId; date: string; window: Window; address: string };

// Earliest bookable day: 3 days out (skips Sundays). Latest: 60 days out.
export function bookableRange(from = new Date()) {
  const d = new Date(from); d.setHours(0, 0, 0, 0);
  const min = new Date(d); min.setDate(min.getDate() + 3);
  const max = new Date(d); max.setDate(max.getDate() + 60);
  return { min, max };
}
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export function validOrder(o: Partial<OrderInput>, now = new Date()): o is OrderInput {
  if (!TIERS.some((t) => t.id === o.tier)) return false;
  if (!WINDOWS.includes(o.window as Window)) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(o.date ?? '')) return false;
  const day = new Date(o.date + 'T12:00:00');
  const { min, max } = bookableRange(now);
  if (Number.isNaN(day.getTime()) || day < min || day > max || day.getDay() === 0) return false;
  return (o.address ?? '').trim().length >= 8;
}
