// import {
//   Body,
//   Controller,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Put,
//   UseGuards,
// } from '@nestjs/common';
// import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
// import { CommonResponse } from 'src/common/interfaces';
// import { User } from '../users/entities/user.entity';
// import { Roles } from '../common/Decorators/role.decorator';
// import { UserRole } from '../common/Enums';
// import { JwtAuthGuard } from '../common/Guards/jwt-auth.guard';
// import { RolesGuard } from '../common/Guards/roles.guards';
// import { IdDto } from '../dtos/id.dto';
// import { AuditAssetsService } from './audit-assets.service';
// import { VerifyAuditAssetDto } from './dtos/verifyAuditAsset.dto';

// @Controller('audit-assets')
// export class AuditAssetsController {
//   constructor(private readonly auditAssetsService: AuditAssetsService) {}

//   @Put(':id/verify')
//   @HttpCode(HttpStatus.OK)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
//   async verifyAuditAsset(
//     @Param() params: IdDto,
//     @Body()
//     verifyAuditAssetDto: VerifyAuditAssetDto,
//     @CurrentUser() user: User,
//   ): Promise<CommonResponse> {
//     await this.auditAssetsService.verifyAuditAsset(
//       params.id,
//       verifyAuditAssetDto,
//       user?.id,
//     );
//     return {
//       message: 'Audit Asset Verified',
//     };
//   }
// }
