export type RedirectRow = { old_url: string; status_today: string; has_traffic_or_links: string; new_destination: string; redirect_type: string; reason: string };
export function parseCsv(text: string): RedirectRow[];
export function loadRows(file?: string): RedirectRow[];
export function redirectRows(rows: RedirectRow[]): RedirectRow[];
export function toNextRedirects(rows: RedirectRow[]): { source: string; destination: string; statusCode: number }[];
export const FILE: string;
