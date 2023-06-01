import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { IdDto } from 'src/dtos/id.dto';
import { CommonResponse } from '../common/interfaces';
import { CreateVendorDto } from './dto/createVendor.dto';
import { VendorService } from './vendor.service';
import { UpdateVendorDto } from './dto/updateVendor.dto';
import { VendorDocument } from './schemas/vendor.schema';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { Roles } from 'src/common/Decorators/role.decorator';
import { UserPermissions, UserRole } from 'src/common/Enums';
import { Permissions } from 'src/common/Decorators/permissions.decorator';
import { RolesGuard } from 'src/common/Guards/roles.guards';
import { PermissionGuard } from 'src/common/Guards/premission.guard';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @HttpCode(HttpStatus.OK)
  @Permissions(UserPermissions.VendorCreate)
  async createVendor(
    @Body() createVendorDto: CreateVendorDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.vendorService.createVendor(createVendorDto, currentUser);
  }
  @Get()
  // @Permissions(UserPermissions.VendorView)
  async getVendors(): Promise<CommonResponse<VendorDocument[]>> {
    return this.vendorService.getVendors();
  }

  @Get('paginate')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  // @Permissions(UserPermissions.VendorView)
  async paginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('searchText') searchText: string = '',
  ): Promise<IPaginatedResponse<VendorDocument>> {
    return this.vendorService.paginate({
      page,
      limit,
      searchText,
    });
  }

  @Get(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  // @Permissions(UserPermissions.VendorView)
  async getVendorById(
    @Param() params: IdDto,
  ): Promise<CommonResponse<VendorDocument>> {
    return {
      data: await this.vendorService.getVendorById(params.id),
    };
  }
  @Put(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.VendorUpdate)
  async updateVendorById(
    @Param() params: IdDto,
    @Body() updateVendorByIdDto: UpdateVendorDto,
  ): Promise<CommonResponse<VendorDocument>> {
    return {
      message: 'Vendor Updated Successfully',
      data: await this.vendorService.updateVendorById(
        params.id,
        updateVendorByIdDto,
      ),
    };
  }
  @Delete(':id')
  @Roles(UserRole.LEVEL1)
  @Permissions(UserPermissions.VendorDelete)
  async deleteVendor(
    @Param() params: IdDto,
  ): Promise<CommonResponse<VendorDocument>> {
    return {
      message: 'Vendor Delelted Successfully',
      data: await this.vendorService.deleteVendor(params.id),
    };
  }
}
