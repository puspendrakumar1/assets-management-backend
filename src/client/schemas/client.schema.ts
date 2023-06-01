import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { IClientBranch } from '../interface/client-branch.interface';
import { ClientBranch } from '../types/client-branch.type';

export type ClientDocument = Client & Document;

@Schema({
  timestamps: true,
})
export class Client {
  @Prop() name: string;
  @Prop() mobileNumber: string;
  @Prop() email: string;

  @Prop(raw([ClientBranch]))
  branch: IClientBranch[];

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  addedByUser: string | UserDocument;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
