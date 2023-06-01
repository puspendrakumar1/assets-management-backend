import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema({ timestamps: true })
export class Vendor {
  @Prop() name: string;
  @Prop({ nullable: true }) email: string;

  @Prop({ nullable: true }) address1: string;
  @Prop({ nullable: true }) address2: string;
  @Prop({ nullable: true }) address3: string;

  @Prop({ nullable: true }) contactNo: string;
  @Prop({ nullable: true }) contactPersonName: string;

  @Prop({ nullable: true }) city: string;

  @Prop({ nullable: true }) serviceNo: string;

  @Prop({ default: true }) isActive: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  createdBy: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
