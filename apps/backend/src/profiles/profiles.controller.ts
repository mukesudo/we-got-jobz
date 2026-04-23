import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth'; // Keep Session for consistency
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateFreelancerProfileDto } from './dto/create-freelancer-profile.dto';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import type { User } from '@prisma/client';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('freelancer')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FREELANCER, UserRole.CLIENT) // Allow client to switch to freelancer if they don't have a profile yet
  async createFreelancerProfile(
    @CurrentUser() user: User,
    @Body() createFreelancerProfileDto: CreateFreelancerProfileDto,
  ) {
    // Check if freelancer profile already exists
    const existingProfile = await this.profilesService.getFreelancerProfile(
      user.id,
    );
    if (existingProfile) {
      // If profile exists, update it instead of creating a new one
      return this.profilesService.updateFreelancerProfile(
        user.id,
        createFreelancerProfileDto,
      );
    }
    return this.profilesService.createFreelancerProfile(
      user.id,
      createFreelancerProfileDto,
    );
  }

  @Put('freelancer')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FREELANCER)
  async updateFreelancerProfile(
    @CurrentUser() user: User,
    @Body() updateFreelancerProfileDto: UpdateFreelancerProfileDto,
  ) {
    return this.profilesService.updateFreelancerProfile(
      user.id,
      updateFreelancerProfileDto,
    );
  }

  @Post('client')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FREELANCER, UserRole.CLIENT) // Allow freelancer to switch to client if they don't have a profile yet
  async createClientProfile(
    @CurrentUser() user: User,
    @Body() createClientProfileDto: CreateClientProfileDto,
  ) {
    // Check if client profile already exists
    const existingProfile = await this.profilesService.getClientProfile(
      user.id,
    );
    if (existingProfile) {
      // If profile exists, update it instead of creating a new one
      return this.profilesService.updateClientProfile(
        user.id,
        createClientProfileDto,
      );
    }
    return this.profilesService.createClientProfile(
      user.id,
      createClientProfileDto,
    );
  }

  @Put('client')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async updateClientProfile(
    @CurrentUser() user: User,
    @Body() updateClientProfileDto: UpdateClientProfileDto,
  ) {
    return this.profilesService.updateClientProfile(
      user.id,
      updateClientProfileDto,
    );
  }

  @Get(':userId')
  @AllowAnonymous()
  getProfile(@Param('userId') userId: string) {
    return this.profilesService.getUserProfile(userId);
  }
}
