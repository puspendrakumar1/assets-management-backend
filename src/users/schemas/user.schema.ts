import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserPermissions, UserRole } from '../../common/Enums';
const mongoosePaginate = require('mongoose-paginate-v2');

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop() email: string;
  @Prop() password: string;
  @Prop({
    default: UserRole.LEVEL3,
    enum: UserRole,
  })
  role: string;
  @Prop({ default: true }) isActive: boolean;
  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Department',
    // autopopulate: true,
  })
  departmentId: string;

  @Prop({ nullable: true }) mobileNumber: string;
  @Prop([
    {
      nullable: true,
      type: MongooseSchema.Types.ObjectId,
      ref: 'Asset',
    },
  ])
  allocatedAssets: string[];
  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Branch',
    // autopopulate: true,
  })
  branch: string;
  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    // autopopulate: true,
  })
  manager: string;

  @Prop([
    {
      enum: UserPermissions,
      type: String,
    },
  ])
  permissions: string[];

  @Prop([
    {
      type: Date,
      nullable: true,
    },
  ])
  passwordChangedAt: Date[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
