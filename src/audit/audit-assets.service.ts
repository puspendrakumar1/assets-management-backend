// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Asset } from '../asset/entities/asset.entity';
// import { Repository } from 'typeorm';
// import { AuditAssetEntity } from './entities/audit-assets.entity';
// import { AuditEntity } from './entities/audit.entity';
// import { User } from '../users/entities/user.entity';
// import IAuditAsset from './interfaces/audit-assets.interface';
// import { VerifyAuditAssetDto } from './dtos/verifyAuditAsset.dto';
// import { ErrorCode } from 'src/common/ErrorCodes';

// @Injectable()
// export class AuditAssetsService {
//   constructor(
//     @InjectRepository(AuditEntity)
//     private readonly auditRepository: Repository<AuditEntity>,
//     @InjectRepository(AuditAssetEntity)
//     private readonly auditAssetRepository: Repository<AuditAssetEntity>,
//   ) {}

//   async generateAuditAssets(audit: AuditEntity) {
//     let assetTypeWhereCondition = '';
//     let allCategories = [];
//     if (audit.category.toUpperCase() !== 'ALL') {
//       allCategories = audit.category
//         .split(',')
//         .map((category) => category.trim().toUpperCase());
//       assetTypeWhereCondition = `asset.type IN (:allCategories)`;
//     }

//     const auditAssets: IAuditAsset[] = await this.auditRepository
//       .createQueryBuilder('audit')
//       .select(['audit.id as auditId', 'asset.id as assetId'])
//       .leftJoin(User, 'user', 'audit.departmentId = user.departmentId')
//       .leftJoin(Asset, 'asset', 'user.id = asset.allocationToUserId')
//       .where((qb) => {
//         qb.where(`audit.id = '${audit.id}'`);
//         qb.andWhere(`asset.id IS NOT NULL`);
//         if (assetTypeWhereCondition) {
//           qb.andWhere(assetTypeWhereCondition, {
//             allCategories,
//           });
//         }
//       })
//       .getRawMany();

//     await this.auditAssetRepository.insert(auditAssets);
//   }

//   async getAuditAssetById(id: string) {
//     return this.auditAssetRepository.findOne({ id });
//   }

//   async verifyAuditAsset(
//     id: string,
//     verifyAuditAssetDto: VerifyAuditAssetDto,
//     userId: string,
//   ) {
//     const auditAsset = await this.getAuditAssetById(id);
//     if (!auditAsset) {
//       throw new NotFoundException(
//         'Audit Asset Not Found',
//         ErrorCode.AUDIT_ASSET_NOT_FOUND,
//       );
//     }

//     const updateData = {
//       isVerified: true,
//       verifiedAt: new Date(),
//       verifiedBy: userId,
//     };
//     if (verifyAuditAssetDto.comment) {
//       Object.assign(updateData, { comment: verifyAuditAssetDto.comment });
//     }

//     await this.auditAssetRepository.update({ id }, updateData);
//   }
// }
