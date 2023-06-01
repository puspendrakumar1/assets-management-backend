// import { Module } from '@nestjs/common';
// import { AuditService } from './audit.service';
// import { AuditController } from './audit.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuditEntity } from './entities/audit.entity';
// import { UsersModule } from '../users/users.module';
// import { AuditAssetEntity } from './entities/audit-assets.entity';
// import { Asset } from '../asset/entities/asset.entity';
// import { User } from '../users/entities/user.entity';
// import { AuditAssetsService } from './audit-assets.service';
// import { AuditAssetsController } from './audit-assets.controller';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([AuditEntity, AuditAssetEntity, Asset, User]),
//     UsersModule,
//   ],
//   providers: [AuditService, AuditAssetsService],
//   controllers: [AuditController, AuditAssetsController],
// })
// export class AuditModule {}
