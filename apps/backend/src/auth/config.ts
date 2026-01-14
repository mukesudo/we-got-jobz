// apps/backend/src/auth/config.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@we-got-jobz/db'; // Import from our shared client

export const auth = betterAuth({
  baseURL: process.env.BACKEND_URL || `http://localhost:3000`,
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
  sessionExpiresIn: 60 * 60 * 24 * 7,
  callbackURL: `${process.env.FRONTEND_URL}/auth/callback`,
  inject: process.env.DATABASE_URL,
});
