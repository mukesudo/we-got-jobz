import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
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

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
