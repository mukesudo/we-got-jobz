// apps/backend/src/auth/config.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@we-got-jobz/db'; // Import from our shared client
import { UserRole } from '@prisma/client';

export const auth = betterAuth({
  baseURL: process.env.BACKEND_URL || `http://localhost:3000`,
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
      const existingFreelancerProfile = await prisma.freelancerProfile.findUnique({
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
