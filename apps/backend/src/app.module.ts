import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule as LocalAuthModule } from './auth/auth.module';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { auth } from './auth/config'; // your Better Auth config
import { JobsModule } from './jobs/jobs.module';
import { TalentModule } from './talent/talent.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ContractsModule } from './contracts/contracts.module';
import { BidsModule } from './bids/bids.module';
import { AdminModule } from './admin/admin.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    LocalAuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // or an array if you want .env.local too
    }),
    JobsModule,
    TalentModule,
    ProposalsModule,
    ContractsModule,
    BidsModule,
    ProfilesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Protects all routes
    },
  ],
})
export class AppModule {}
