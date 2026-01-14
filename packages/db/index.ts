import { prisma } from './client';
import * as Prisma from '@prisma/client';

export type PrismaClient = typeof prisma;
export { prisma, Prisma };