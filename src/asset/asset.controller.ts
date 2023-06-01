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
} from '@nestjs/common';
import { IdDto } from '../dtos/id.dto';
import { CommonResponse } from '../common/interfaces';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/createAsset.dto';
import { JwtAuthGuard } from '../common/Guards/jwt-auth.guard';
import { RolesGuard } from '../common/Guards/roles.guards';
import { UserPermissions, UserRole } from '../common/Enums';
import { Roles } from '../common/Decorators/role.decorator';
import { AssignAssetToUserDto } from './dto/assignAssetToUser.dto';
import { AssetDocument } from './schemas/asset.schema';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { AssetUserService } from './asset-user.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UpdateAllocationStatusDto } from './dto/update-allocation-status.dto';
import { Permissions } from 'src/common/Decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/Guards/premission.guard';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly assetUserService: AssetUserService,
  ) {}

  @Post()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @HttpCode(HttpStatus.OK)
  @Permissions(UserPermissions.AssetCreate)
  async createAsset(
    @Body() createAssetDto: CreateAssetDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.assetService.createAsset(createAssetDto, currentUser);
  }

  @Get()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.AssetView)
  async getAssets(): Promise<CommonResponse<AssetDocument[]>> {
    return this.assetService.getAssets();
  }

  @Get('paginate')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.AssetView)
  async paginate(
    // @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    // @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    // @Query('type') type: string = '',
    // @Query('searchText') searchText: string = '',
    @Query('expiring') expiring: boolean = false,
    @Query('expiringIn') expiringIn: number = 30,
    @Query() query: any,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<IPaginatedResponse<AssetDocument>> {
    return this.assetService.paginate(
      { ...query, expiring, expiringIn },
      currentUser,
    );
  }

  @Get(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.AssetView)
  async getAssetById(
    @Param() params: IdDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<AssetDocument>> {
    return {
      data: await this.assetService.getAssetById(params.id, currentUser),
    };
  }
  @Delete(':id')
  @Roles(UserRole.LEVEL1)
  @Permissions(UserPermissions.AssetDelete)
  async deleteAssetById(
    @Param() params: IdDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<AssetDocument>> {
    return {
      message: 'Asset Deleted',
      data: await this.assetService.deleteAssetById(params.id, currentUser),
    };
  }

  @Get('user/:userId')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.AssetView)
  async getAssetsByUser(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<AssetDocument[]>> {
    return {
      data: await this.assetUserService.getAssetsByUserId(userId, currentUser),
    };
  }

  @Put(':id/update-allocation-status/:status')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.AssetView)
  async updateAllocationStatus(@Param() params: UpdateAllocationStatusDto) {
    return this.assetService.updateAllocationStatus(params.id, params.status);
  }

  @Put(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.AssetUpdate)
  async updateAssetById(
    @Param() params: IdDto,
    @Body() updateAssetByIdDto: CreateAssetDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<CreateAssetDto>> {
    return {
      message: 'Asset Updated Successfully',
      data: await this.assetService.updateAssetById(
        params.id,
        updateAssetByIdDto,
        currentUser,
      ),
    };
  }

  @Put(':id/user/:userId/assign')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.AssetUpdate)
  async assignAssetToUser(
    @Param() assignAssetToUserDto: AssignAssetToUserDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.assetService.assignAssetToUser(
      assignAssetToUserDto,
      currentUser,
    );
  }

  @Delete(':id/remove-from-user')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.AssetUpdate)
  async removeAssetFromUser(@Param() idDto: IdDto): Promise<CommonResponse> {
    return this.assetService.removeAssetFromUser(idDto.id);
  }
}
