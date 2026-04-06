import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@we-got-jobz/db'; // Import from our shared client
import { UserRole } from './types/user-role';

export const auth = betterAuth({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}`,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
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
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3001',
  ],
  sessionExpiresIn: 60 * 60 * 24 * 7,
  callbackURL: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
  userCreated: async (user: { role: any; id: any; }) => {
    // Ensure the user has a default role if not already set, e.g., CLIENT
    if (!user.role) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.CLIENT },
      });
    }

    // Create a ClientProfile for every new user by default
    // This can be modified later to allow users to choose FreelancerProfile
    const existingClientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingClientProfile) {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
        },
      });
    }
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });
    if (!existingWallet) {
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });
    }
    return user;
  }
});
  
