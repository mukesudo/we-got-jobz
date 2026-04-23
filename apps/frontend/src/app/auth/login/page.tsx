'use client';

import React from 'react';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get('callbackURL') || '/marketplace/jobs';
  const oauthError = searchParams.get('error');
  const oauthErrorDescription = searchParams.get('error_description');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const resolvedCallbackURL = React.useMemo(() => {
    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || '';
    try {
      return origin ? new URL(returnPath, origin).toString() : returnPath;
    } catch {
      return returnPath;
    }
  }, [returnPath]);

  const resolvedErrorCallbackURL = React.useMemo(() => {
    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || '';
    const errorPath = `/auth/login?callbackURL=${encodeURIComponent(returnPath)}`;
    try {
      return origin ? new URL(errorPath, origin).toString() : errorPath;
    } catch {
      return errorPath;
    }
  }, [returnPath]);

  React.useEffect(() => {
    if (oauthError) {
      const message = oauthErrorDescription
        ? decodeURIComponent(oauthErrorDescription)
        : decodeURIComponent(oauthError);
      setError(message);
    }
  }, [oauthError, oauthErrorDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: resolvedCallbackURL,
      });
      console.log('Sign-in result:', result);

      if (result.error) {
        setError(result.error.message || 'Failed to sign in');
      } else {
        router.push(returnPath);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:rounded-lg">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
            Sign in to We Got Jobz
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={async () => {
                await signIn.social({
                  provider: 'google',
                  callbackURL: resolvedCallbackURL,
                  errorCallbackURL: resolvedErrorCallbackURL,
                });
              }}
            >
              <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={async () => {
                await signIn.social({
                  provider: 'github',
                  callbackURL: resolvedCallbackURL,
                  errorCallbackURL: resolvedErrorCallbackURL,
                });
              }}
            >
              <Github className="w-5 h-5" />
              Sign in with GitHub
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center">Loading login...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
