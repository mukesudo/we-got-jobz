
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skip = searchParams.get('skip');
  const take = searchParams.get('take');
  const search = searchParams.get('search');
  const params = new URLSearchParams();
  if (skip) params.set('skip', skip);
  if (take) params.set('take', take);
  if (search) params.set('search', search);
  const url = `${BACKEND_URL}/jobs${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') || '',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
