import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@we-got-jobz/db';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'https://automatic-barnacle-7pjx99qqxx4fxjrv-3001.app.github.dev'],
});
