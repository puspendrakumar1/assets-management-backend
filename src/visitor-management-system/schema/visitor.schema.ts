import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VisitorDocument = Visitor & Document;

@Schema({ timestamps: true })
export class Visitor {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  host: string;

  // Type

  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;

  @Prop({ required: true }) contactNo: string;
  @Prop({ nullable: true }) vehileNo: string;
  @Prop({ required: true }) purposeOfVisit: string;

  @Prop({ nullable: true }) email: string;
  @Prop({ nullable: true }) company: string;

  @Prop({ required: true }) fromDateTime: Date;
  @Prop({ nullable: true }) toDateTime: Date;

  @Prop({ nullable: true }) actualVisitFromDateTime: Date;
  @Prop({ nullable: true }) actualVisitToDateTime: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  checkInCreatedBy: string;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  checkOutCreatedBy: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: string;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
