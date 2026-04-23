import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Session() session: UserSession) {
    if (!session) throw new UnauthorizedException();
    return this.usersService.getUserById(session.user.id);
  }

  @Get('me/stats')
  async myStats(@Session() session: UserSession) {
    if (!session) throw new UnauthorizedException();
    return this.usersService.getMyStats(session.user.id);
  }

  @Patch('me')
  async updateMe(
    @Session() session: UserSession,
    @Body() payload: Record<string, unknown>,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.usersService.updateUser(session.user.id, payload);
  }

  @Get(':id')
  @AllowAnonymous()
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
