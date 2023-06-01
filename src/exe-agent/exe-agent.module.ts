import { Module } from '@nestjs/common';
import { ExeAgentService } from './exe-agent.service';
import { ExeAgentController } from './exe-agent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ScannedAsset,
  ScannedAssetSchema,
} from 'src/asset/schemas/scanned-asset.schema';
import { Asset, AssetSchema } from 'src/asset/schemas/asset.schema';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScannedAsset.name, schema: ScannedAssetSchema },
      { name: Asset.name, schema: AssetSchema },
    ]),
    AssetModule,
  ],
  providers: [ExeAgentService],
  controllers: [ExeAgentController],
})
export class ExeAgentModule {}
