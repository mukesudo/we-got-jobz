import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/jobs/${params.id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/jobs/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') || '',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/jobs/${params.id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
