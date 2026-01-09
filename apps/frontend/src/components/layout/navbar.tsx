'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';


export default function Navbar() {
  const { session: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    });
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-2xl text-blue-600">
              We Got Jobz
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {session?.user ? (
              <>
                <Link href="/marketplace/jobs" className="text-gray-700 hover:text-gray-900">
                  Jobs
                </Link>
                <Link href="/marketplace/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href={`/marketplace/profile/${session.user.id}`} className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-gray-900 flex items-center">
                    {session.user.name || session.user.email}
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  <div className="absolute hidden group-hover:block right-0 w-48 bg-white shadow-lg rounded-lg py-2 z-10">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {session?.user ? (
              <>
                <Link href="/marketplace/jobs" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">
                  Jobs
                </Link>
                <Link href="/marketplace/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
