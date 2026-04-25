import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3000";

type RouteContext = {
  params: Promise<{ all?: string[] }>;
};

async function proxyAuth(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const path = params.all?.join("/") ?? "";
  const targetUrl = new URL(`${BACKEND_URL}/api/auth/${path}`);
  targetUrl.search = new URL(request.url).search;

  const init: RequestInit = {
    method: request.method,
    headers: request.headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text(),
    redirect: "manual",
  };

  const response = await fetch(targetUrl.toString(), init);

  const nextResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      nextResponse.headers.set(key, value);
    }
  });

  const setCookies = (response.headers as any).getSetCookie?.();
  if (setCookies && Array.isArray(setCookies)) {
    setCookies.forEach((cookie) => nextResponse.headers.append("Set-Cookie", cookie));
  }

  return nextResponse;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyAuth(request, context);
}
