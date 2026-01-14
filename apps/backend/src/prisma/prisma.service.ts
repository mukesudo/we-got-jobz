import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, prisma } from '@we-got-jobz/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma; // Assign the globally available prisma instance
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Expose the prisma client methods
  get bid() {
    return this.prisma.bid;
  }

  get project() {
    return this.prisma.project;
  }

  get message() {
    return this.prisma.message;
  }

  get transaction() {
    return this.prisma.transaction;
  }

  get contract() {
    return this.prisma.contract;
  }

  get freelancerProfile() {
    return this.prisma.freelancerProfile;
  }

  get clientProfile() {
    return this.prisma.clientProfile;
  }

  get user() {
    return this.prisma.user;
  }

  get $transaction() {
    return this.prisma.$transaction;
  }
}
