// apps/backend/src/auth/config.ts   ← new file
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@we-got-jobz/db';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3001'],
  sessionExpiresIn: 60 * 60 * 24 * 7, // 7 days
  callbackURL: `${process.env.FRONTEND_URL}/api/auth/callback`,
});
