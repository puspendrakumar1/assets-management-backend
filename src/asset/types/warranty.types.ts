import { WarrantySiteType, WarrantyType } from 'src/common/Enums';
import { Schema as MongooseSchema } from 'mongoose';

export const Warranty: any = {
  name: String,
  description: String,
  type: { type: String, enum: WarrantyType },
  warrantySiteType: { type: String, enum: WarrantySiteType },
  startAt: Date,
  endAt: Date,

  purchaseDate: Date,
  vendor: {
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Vendor',
    // autopopulate: true,
  },
  poNumber: String,
};
