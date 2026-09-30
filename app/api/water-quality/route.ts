import { NextRequest, NextResponse } from 'next/server';

// ponytail: mock data, deterministic per ZIP. Swap body for a real EWG/EPA lookup later.
const KNOWN: Record<string, [string, number]> = {
  '27': ['Raleigh, NC', 92], '10': ['New York, NY', 45], '60': ['Chicago, IL', 88],
  '77': ['Houston, TX', 78], '85': ['Phoenix, AZ', 98], '90': ['Los Angeles, CA', 95],
};

export function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get('zip') ?? '';
  if (!/^\d{5}$/.test(zip)) return NextResponse.json({ error: 'bad zip' }, { status: 400 });
  const [city, hardPct] = KNOWN[zip.slice(0, 2)] ?? [`ZIP ${zip}`, 60 + (Number(zip) % 35)];
  const warning = hardPct > 75 ? 'Hard water and possible chlorine byproducts reported' : 'Elevated minerals and chlorine reported';
  return NextResponse.json({ city, hardPct, warning });
}
