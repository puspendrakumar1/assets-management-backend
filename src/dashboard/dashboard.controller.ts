import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { Roles } from 'src/common/Decorators/role.decorator';
import { UserRole } from 'src/common/Enums';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';
import { CommonResponse } from 'src/common/interfaces';
import { UserDocument } from 'src/users/schemas/user.schema';
import { DashboardService } from './dashboard.service';
import { DashboardResponse } from './types/dashboard.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async getDashboardData(
    @Query('expiring') expiring: boolean = false,
    @Query('expiringIn') expiringIn: number = 30,
    @Query() query: any,

    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<DashboardResponse>> {
    return this.dashboardService.getDashboardData(
      {
        ...query,
        expiring,
        expiringIn,
      },
      currentUser,
    );
  }
}
