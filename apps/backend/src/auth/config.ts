// apps/backend/src/auth/config.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@we-got-jobz/db'; // Import from our shared client
import { UserRole } from '@we-got-jobz/db';

const DEFAULT_BACKEND_URL = 'http://localhost:3000';
const DEFAULT_FRONTEND_URL = 'http://localhost:3001';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function getNormalizedUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return trimTrailingSlash(url.toString());
  } catch {
    return null;
  }
}

function getNormalizedOrigin(value: string | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const backendBaseURL =
  getNormalizedUrl(process.env.BACKEND_URL) ||
  getNormalizedUrl(process.env.BETTER_AUTH_URL) ||
  DEFAULT_BACKEND_URL;

const frontendBaseURL =
  getNormalizedUrl(process.env.FRONTEND_URL) ||
  getNormalizedUrl(process.env.NEXT_PUBLIC_APP_URL) ||
  DEFAULT_FRONTEND_URL;

const trustedOrigins = Array.from(
  new Set(
    [
      getNormalizedOrigin(frontendBaseURL),
      getNormalizedOrigin(process.env.FRONTEND_URL),
      getNormalizedOrigin(process.env.NEXT_PUBLIC_APP_URL),
      getNormalizedOrigin(DEFAULT_FRONTEND_URL),
    ].filter((origin): origin is string => Boolean(origin)),
  ),
);

export const auth = betterAuth({
  baseURL: backendBaseURL,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: { type: 'string', required: false },
      notificationsEmail: { type: 'boolean', required: false },
      notificationsMarketing: { type: 'boolean', required: false },
      notificationsJobAlerts: { type: 'boolean', required: false },
      notificationsMessages: { type: 'boolean', required: false },
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectURI: backendBaseURL
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      redirectURI: backendBaseURL
    },
  },
  trustedOrigins,
  sessionExpiresIn: 60 * 60 * 24 * 7,
  callbackURL: `${frontendBaseURL}/auth/select-role`,
  inject: process.env.DATABASE_URL,
  userCreated: async (user: { id: string; role?: UserRole | null }) => {
    const role = user.role ?? UserRole.CLIENT;
    if (!user.role) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
    }

    if (role === UserRole.CLIENT) {
      const existingClientProfile = await prisma.clientProfile.findUnique({
        where: { userId: user.id },
      });
      if (!existingClientProfile) {
        await prisma.clientProfile.create({ data: { userId: user.id } });
      }
    }

    if (role === UserRole.FREELANCER) {
      const existingFreelancerProfile =
        await prisma.freelancerProfile.findUnique({
          where: { userId: user.id },
        });
      if (!existingFreelancerProfile) {
        await prisma.freelancerProfile.create({ data: { userId: user.id } });
      }
    }

    const existingWallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });
    if (!existingWallet) {
      await prisma.wallet.create({ data: { userId: user.id, balance: 0 } });
    }

    return user;
  },
});
