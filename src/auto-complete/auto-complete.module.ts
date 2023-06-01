import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from 'src/asset/schemas/asset.schema';
import {
  Tickting,
  TicktingSchema,
} from 'src/ticketing/schemas/ticketing.schema';
import { AssetAutoCompleteService } from './asset-auto-complete.service';
import { AutoCompleteController } from './auto-complete.controller';
import { TicketingAutoCompleteService } from './ticketing-auto-complete.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    MongooseModule.forFeature([
      { name: Tickting.name, schema: TicktingSchema },
    ]),
  ],
  providers: [AssetAutoCompleteService, TicketingAutoCompleteService],
  controllers: [AutoCompleteController],
})
export class AutoCompleteModule {}
