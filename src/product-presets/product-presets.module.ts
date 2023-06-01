import { Module } from '@nestjs/common';
import { ProductPresetsService } from './product-presets.service';
import { ProductPresetsController } from './product-presets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductPresets,
  ProductPresetsSchema,
} from './schemas/product-presets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductPresets.name, schema: ProductPresetsSchema },
    ]),
  ],
  providers: [ProductPresetsService],
  controllers: [ProductPresetsController],
})
export class ProductPresetsModule {}
