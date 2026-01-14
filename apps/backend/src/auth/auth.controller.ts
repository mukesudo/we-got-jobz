import { Controller, Get } from '@nestjs/common';
import {
  Session,
  AllowAnonymous,
  OptionalAuth,
  AuthService,
} from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { auth } from './config';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService<typeof auth>) {}

  @Get('me')
  getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('public')
  @AllowAnonymous() // Allow anonymous access
  getPublic() {
    return { message: 'Public route' };
  }

  @Get('optional')
  @OptionalAuth() // Authentication is optional
  getOptional(@Session() session: UserSession) {
    return { authenticated: !!session };
  }
}
