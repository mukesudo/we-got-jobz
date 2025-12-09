import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { auth } from '@we-got-jobz/common/src/auth.config';

@Module({
  imports: [PrismaModule, AuthModule.forRoot({ auth })],
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
