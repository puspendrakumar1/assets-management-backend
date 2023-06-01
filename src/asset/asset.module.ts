import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { AssetCategoriesService } from './asset-categories.service';
import { AssetTransactionService } from './asset-transaction.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from './schemas/asset.schema';
import { VendorModule } from 'src/vendor/vendor.module';
import {
  AssetTransaction,
  AssetTransactionSchema,
} from './schemas/asset-transaction.schema';
import { AssetTypesService } from './asset-types/asset-types.service';
import { AssetTransactionController } from './asset-transaction.controller';
import { AssetTypeController } from './asset-types/asset-types.controller';
import { AssetUserService } from './asset-user.service';

@Module({
  imports: [
    VendorModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      { name: AssetTransaction.name, schema: AssetTransactionSchema },
    ]),
  ],
  providers: [
    AssetService,
    AssetCategoriesService,
    AssetTransactionService,
    AssetTypesService,
    AssetUserService,
  ],
  controllers: [
    AssetController,
    AssetTransactionController,
    AssetTypeController,
  ],
  exports: [AssetService],
})
export class AssetModule {}
