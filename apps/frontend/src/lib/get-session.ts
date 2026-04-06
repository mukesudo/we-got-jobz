import { headers } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:3000';

export async function getSession() {
  const cookie = (await headers()).get('cookie');

  if (!cookie) {
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/session`, {
      headers: { Cookie: cookie },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}
