import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  TicketingCallStatus,
  TicketingChatBy,
  TicketingPriority,
} from 'src/common/Enums';
import { TicktingDocument } from 'src/ticketing/schemas/ticketing.schema';
import { UserDocument } from 'src/users/schemas/user.schema';

export type TicktingChatDocument = TicktingChat & Document;

@Schema({ timestamps: true })
export class TicktingChat {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  messageByUser: string | UserDocument;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Ticketing',
    required: true,
  })
  ticket: string | ObjectId | TicktingDocument;

  @Prop({ required: true }) message: string;
  @Prop({ enum: TicketingChatBy }) chatBy: string;
  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  mentionedUsers: string[] | UserDocument[];
}

export const TicktingChatSchema = SchemaFactory.createForClass(TicktingChat);
