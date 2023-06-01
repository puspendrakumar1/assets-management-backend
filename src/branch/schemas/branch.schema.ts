import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) address1: string;
  @Prop({ nullable: true }) address2: string;
  @Prop({ nullable: true }) address3: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) country: string;
  @Prop({ required: true }) state: string;
  @Prop({ nullable: true }) fqdn: string;
  @Prop({ required: true }) branchCode: string;

  @Prop({ default: true }) isActive: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  createdBy: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
