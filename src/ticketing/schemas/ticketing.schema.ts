import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TicketingCallStatus, TicketingPriority } from 'src/common/Enums';
import { User, UserDocument } from 'src/users/schemas/user.schema';

export type TicktingDocument = Tickting & Document;

@Schema({ timestamps: true })
export class Tickting {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  requestFromUserId: string | UserDocument;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  assignedToUserId: string | UserDocument;
  @Prop() callMedium: string;
  @Prop({ enum: ['Incident', 'Request'] }) natureOfCall: string;
  @Prop() category: string;
  // @Prop() subCategory: string;
  @Prop({
    enum: TicketingCallStatus,
  })
  callStatus: string;
  @Prop({
    enum: TicketingPriority,
  })
  priority: string;
  @Prop({ required: false }) description?: string;
  @Prop({ required: false }) subject?: string;
  @Prop({ required: false }) closingDescription?: string;

  @Prop({ required: false }) ticketClosedAt?: Date;
  @Prop([
    {
      userId: {
        type: MongooseSchema.Types.ObjectId,
        ref: User,
        // autopopulate: true,
      },
      from: Date,
    },
  ])
  callesAttenedByUser?: {
    userId: string | UserDocument;
    from: Date;
  }[];
}

export const TicktingSchema = SchemaFactory.createForClass(Tickting);
