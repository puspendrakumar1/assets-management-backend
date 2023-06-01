import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommonResponse } from 'src/common/interfaces';
import { AddTicketingService } from './add-ticketing.service';
import { AddTicketingDto } from './dto/add-ticketing.dto';
import { UpdateTicketingCallStatusDto } from './dto/update-ticketing-call-status.dto';
import { GetTicketFieldsService } from './get-ticket-fields.service';
import { UpdateTicketingService } from './update-ticketing.service';
import { JwtAuthGuard } from '../common/Guards/jwt-auth.guard';
import { RolesGuard } from '../common/Guards/roles.guards';
import { UserPermissions, UserRole } from '../common/Enums';
import { Roles } from '../common/Decorators/role.decorator';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { TicktingDocument } from './schemas/ticketing.schema';
import { PaginateTicketingService } from './ticket-paginate.service';
import { IdDto } from 'src/dtos/id.dto';
import { GetTicketingService } from './get-ticket.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { TicketingService } from './ticketing.service';
import { Permissions } from 'src/common/Decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/Guards/premission.guard';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Controller('ticketing')
export class TicketingController {
  constructor(
    private readonly addTicketingSerive: AddTicketingService,
    private readonly updateTicketingService: UpdateTicketingService,
    private readonly getTicketFields: GetTicketFieldsService,
    private readonly paginateTicketingService: PaginateTicketingService,
    private readonly getTicketingService: GetTicketingService,
    private readonly ticketingService: TicketingService,
  ) {}

  @Post()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @HttpCode(HttpStatus.OK)
  @Permissions(UserPermissions.TicketCreate)
  async createTicketing(
    @Body() addTicketingDto: AddTicketingDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.addTicketingSerive.addTicketing(addTicketingDto, currentUser);
  }

  @Get('fields')
  @HttpCode(HttpStatus.OK)
  @Permissions(UserPermissions.TicketView)
  async getTicketFileds() {
    return this.getTicketFields.getTicketFields();
  }

  // @Put()
  // @HttpCode(HttpStatus.OK)
  // async updateTicketingCallStatus(
  //   @Body() updateTicketingCallStatusDto: UpdateTicketingCallStatusDto,
  // ): Promise<CommonResponse> {
  //   return this.updateTicketingService.updateTicketingCall(
  //     updateTicketingCallStatusDto,
  //   );
  // }

  @Get('paginate')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.TicketView)
  async paginate(
    @Query() query: any,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<IPaginatedResponse<TicktingDocument>> {
    return this.paginateTicketingService.paginate(query, currentUser);
  }

  @Get(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.TicketView)
  async getTicketById(
    @Param() params: IdDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<TicktingDocument>> {
    return {
      data: await this.getTicketingService.getTicketById(
        params.id,
        currentUser,
      ),
    };
  }
  @Put(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.TicketUpdate)
  async updateTicketById(
    @Param() params: IdDto,
    @Body() updateTicketingCallStatusDto: UpdateTicketingCallStatusDto,
  ): Promise<CommonResponse<TicktingDocument>> {
    return this.updateTicketingService.updateTicketingCall(
      params.id,
      updateTicketingCallStatusDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.LEVEL1)
  @Permissions(UserPermissions.TicketDelete)
  async deleteTicketById(@Param() params: IdDto) {
    return this.ticketingService.deleteTicketById(params.id);
  }
}
