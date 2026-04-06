import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // Your Backend API URL
});

// console.log('Auth Client Base URL:', process.env.NEXT_PUBLIC_API_URL);

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
