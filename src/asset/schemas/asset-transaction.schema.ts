import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Model } from 'mongoose';

export type AssetTransactionDocument = AssetTransaction & Document;

@Schema({ timestamps: true })
export class AssetTransaction {
  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Asset',
    // autopopulate: true,
  })
  assetId: string;
  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  allocationToUserId: string;
  @Prop() allocationStatus: string;
}

export const AssetTransactionSchema =
  SchemaFactory.createForClass(AssetTransaction);
