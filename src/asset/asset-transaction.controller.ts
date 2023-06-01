import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/Decorators/role.decorator';
import { UserRole } from 'src/common/Enums';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';
import { CommonResponse } from 'src/common/interfaces';
import { AssetTransactionService } from './asset-transaction.service';

@Controller('asset-transaction')
export class AssetTransactionController {
  constructor(
    private readonly assetTransactionService: AssetTransactionService,
  ) {}

  @Get(':assetId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async getUniqueAssetTypes(
    @Param('assetId') assetId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CommonResponse> {
    let dateRange = null;
    if (startDate && endDate) {
      dateRange = {
        startDate,
        endDate,
      };
    }

    return {
      data: await this.assetTransactionService.getAssetTransactionsById(
        assetId,
        dateRange,
      ),
    };
  }
}
