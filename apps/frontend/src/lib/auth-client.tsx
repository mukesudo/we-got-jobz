'use client';

import { useState, useCallback, createContext, ReactNode } from 'react';

// Session type
export interface Session {
  user?: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  };
  isAuthenticated: boolean;
}

// Context type
type SessionContextType = {
  session: Session | null;
  setSession: (session: Session | null) => void;
} | null;

// Create context for session management
const SessionContext = createContext<SessionContextType>(null);

// Session provider component (for app layout)
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session in components
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { session, loading, fetchSession };
}

// Email auth object
export const signIn = {
  async email({
    email,
    password,
    callbackURL,
  }: {
    email: string;
    password: string;
    callbackURL?: string;
  }) {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.message || 'Sign in failed',
          },
        };
      }

      if (callbackURL) {
        window.location.href = callbackURL;
      }

      return data;
    } catch {
      return {
        error: {
          message: 'An error occurred during sign in',
        },
      };
    }
  },
};

// Email signup object
export const signUp = {
  async email({
    email,
    password,
    name,
    callbackURL,
    role,
  }: {
    email: string;
    password: string;
    name: string;
    callbackURL?: string;
    role?: 'CLIENT' | 'FREELANCER';
  }) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role: role || 'CLIENT' }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.message || 'Sign up failed',
          },
        };
      }

      if (callbackURL) {
        window.location.href = callbackURL;
      }

      return data;
    } catch {
      return {
        error: {
          message: 'An error occurred during sign up',
        },
      };
    }
  },
};

// Sign out function
export async function signOut(p0: { fetchOptions: { onSuccess: () => void; }; }) {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Sign out failed');
  }

  return await response.json();
} 

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session');
    return response.ok;
  } catch {
    return false;
  }
}
