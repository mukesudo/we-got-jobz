import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule as LocalAuthModule } from './auth/auth.module';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { auth } from './auth/config'; // your Better Auth config

@Module({
  imports: [PrismaModule,
    AuthModule.forRoot({ auth }),
    LocalAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // or an array if you want .env.local too
    }),
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
