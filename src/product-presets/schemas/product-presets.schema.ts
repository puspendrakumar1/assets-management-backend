import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductPresetsDocument = ProductPresets & Document;

@Schema({ timestamps: true })
export class ProductPresets {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  createdByUser: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;
  @Prop() name: string;
  @Prop() make: string;
  @Prop() productCode: string;
  @Prop() type: string;
  @Prop() weightlife: string;
  @Prop() warranty: number;
}

export const ProductPresetsSchema =
  SchemaFactory.createForClass(ProductPresets);
