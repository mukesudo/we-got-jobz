import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule as BetterAuthModule, AuthGuard } from '@thallesp/nestjs-better-auth';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppService } from './app.service';
import { auth } from "./auth"; // Your Better Auth instance

@Module({
  imports: [
    PrismaModule,
    AuthModule.forRoot({ auth }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,  // Protects all routes
    },
  ],
})
export class AppModule {

}
