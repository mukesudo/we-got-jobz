import { createAuthClient } from "better-auth/react";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function isValidAbsoluteUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveAuthBaseURL(): string {
  const explicitAuthBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  if (explicitAuthBase && isValidAbsoluteUrl(explicitAuthBase)) {
    return trimTrailingSlash(explicitAuthBase);
  }

  const appBase = process.env.NEXT_PUBLIC_APP_URL;
  if (appBase && isValidAbsoluteUrl(appBase)) {
    return trimTrailingSlash(appBase);
  }

  return "http://localhost:3001";
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
});

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  updateUser,
  changePassword,
  changeEmail,
  setPassword,
} = authClient as typeof authClient & {
  updateUser: (payload?: Record<string, unknown>) => Promise<any>;
  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    revokeOtherSessions?: boolean;
  }) => Promise<any>;
  changeEmail: (payload: { newEmail: string; callbackURL?: string }) => Promise<any>;
  setPassword: (payload: { newPassword: string }) => Promise<any>;
};
