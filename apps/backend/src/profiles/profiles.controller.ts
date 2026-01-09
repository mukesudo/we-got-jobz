import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  @AllowAnonymous()
  getProfile(@Param('userId') userId: string) {
    return this.profilesService.getUserProfile(userId);
  }
}
