import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { Roles } from 'src/common/Decorators/role.decorator';
import { UserRole } from 'src/common/Enums';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { PermissionGuard } from 'src/common/Guards/premission.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';
import { CommonResponse } from 'src/common/interfaces';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { IdDto } from 'src/dtos/id.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateVisitService } from './create-visit.service';
import { CreateVisitDTO } from './dto/create-visit.dto';
import { PaginateVisitService } from './paginate-visit.service';
import { VisitorDocument } from './schema/visitor.schema';
import { VisitorManagementSystemService } from './visitor-management-system.service';
import { VisitorManagementSystemDashboardService } from './vms-dashboard.service';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Controller('visitor-management-system')
export class VisitorManagementSystemController {
  constructor(
    private readonly createVisitService: CreateVisitService,
    private readonly paginateVisitService: PaginateVisitService,
    private readonly visitorManagementSystemService: VisitorManagementSystemService,
    private readonly visitorManagementSystemDashboardService: VisitorManagementSystemDashboardService,
  ) {}

  @Post('visit')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @HttpCode(HttpStatus.OK)
  async createVisit(
    @Body() createVisitDTO: CreateVisitDTO,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.createVisitService.createVisit(createVisitDTO, currentUser);
  }

  @Get('visit/paginate')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  // @Permissions(UserPermissions.VendorView)
  async paginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('searchText') searchText: string = '',
    @CurrentUser() currentUser: UserDocument,
  ): Promise<IPaginatedResponse<VisitorDocument>> {
    return this.paginateVisitService.paginate(
      {
        page,
        limit,
        searchText,
      },
      currentUser,
    );
  }

  @Put('visit/:id/check-in')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  async checkIn(
    @Param() params: IdDto,
    @CurrentUser()
    currentUser: UserDocument,
  ) {
    return await this.visitorManagementSystemService.checkInVisitor(
      params.id,
      currentUser,
    );
  }
  @Put('visit/:id/check-out')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  async checkOut(
    @Param() params: IdDto,
    @CurrentUser()
    currentUser: UserDocument,
  ) {
    return await this.visitorManagementSystemService.checkOutVisitor(
      params.id,
      currentUser,
    );
  }

  @Get('visit/dashboard')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  async getDashboard(@Query() query: any) {
    return this.visitorManagementSystemDashboardService.getDashboardData(query);
  }
}
