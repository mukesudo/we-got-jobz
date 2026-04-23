import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserRole } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(id, updateUserRoleDto.role);
  }

  @Get('disputes')
  getDisputedContracts() {
    return this.adminService.getDisputedContracts();
  }

  @Get('disputes/:id')
  getDisputedContractById(@Param('id') id: string) {
    return this.adminService.getDisputedContractById(id);
  }

  @Put('disputes/:id/status')
  updateContractStatus(
    @Param('id') id: string,
    @Body() updateContractStatusDto: UpdateContractStatusDto,
  ) {
    return this.adminService.updateContractStatus(
      id,
      updateContractStatusDto.status,
    );
  }
}
