import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/Decorators/role.decorator';
import { UserRole } from 'src/common/Enums';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';
import { CommonResponse } from 'src/common/interfaces';
import { AssetTypesService } from './asset-types.service';

@Controller('asset-type')
export class AssetTypeController {
  constructor(private readonly assetTypesService: AssetTypesService) {}
  @Get('types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async getUniqueAssetTypes(): Promise<CommonResponse> {
    return {
      data: await this.assetTypesService.getAssetTypes(),
    };
  }
}
