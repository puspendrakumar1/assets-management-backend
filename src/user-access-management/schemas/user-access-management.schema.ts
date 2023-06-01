import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  UAMAccessToShareDrives,
  UAMAction,
  UAMGrantRevoke,
  UAMPriority,
  UAMRequestTypeAction,
  UAMType,
  UAMTypeOfAccessRequired,
  UAMTypeOfUser,
  UAMUserSystemData,
} from 'src/common/Enums';
import { UserDocument } from 'src/users/schemas/user.schema';

export type UserAccessManagementDocument = UserAccessManagement & Document;

const UserInformation = {
  users: [
    {
      firstName: { type: String, require: true },
      lastName: { type: String, require: true },
      department: {
        type: MongooseSchema.Types.ObjectId,
        require: false,
        ref: 'Department',
      },
      location: { type: String, require: false },
      email: { type: String, require: true },
      remarks: { type: String, require: false },
      typeOfUser: { type: String, enum: UAMTypeOfUser, require: false },
      typeOfUserOtherText: { type: String, require: false },
      typeOfAccessRequired: {
        type: String,
        enum: UAMTypeOfAccessRequired,
        require: false,
      },
      ifTemporaryDateForDeactivation: { type: Date, require: false },
      accessTypeGrantRevoke: {
        type: String,
        enum: UAMGrantRevoke,
        require: false,
      },
    },
  ],
  dateOfRequest: { type: Date, require: false },
  dateOfJoiningLeaving: { type: Date, require: false },
  networkServicesToBeGrantedRevoked: {
    type: {
      emailAccess: { type: Boolean, default: false },
      serverAccess: { type: Boolean, default: false },
      sharedDrive: { type: Boolean, default: false },
      APCERNetworkVPNAccess: { type: Boolean, default: false },
      others: { type: Boolean, default: false },
    },
    require: false,
  },
  reportingManager: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    require: false,
    autopopulate: false,
  },
  accessToDistributionList: { type: Boolean, default: false },
  comments: { type: String, require: false },
};
const AccessToShareDrives = {
  driveName: { type: String, require: false },
  folderName: { type: String, require: false },
  accessRights: { type: String, enum: UAMAccessToShareDrives },
  grantRevoke: { type: String, enum: UAMGrantRevoke },
};
const UserSystemDataAndEmailIdTreatment = {
  userSystemData: { type: String, enum: UAMUserSystemData, require: false },
  dataHandOverTo: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    require: false,
    autopopulate: false,
  },
  endUserConfirmationOnReceiptOfData: { type: String, require: false },
  emailMailboxTransferredTo: { type: String, require: false },
  endUserConfirmationOnActivationOfMailbox: {
    type: String,
    require: false,
  },
  emailIdForwardedTo: { type: String, require: false },
  dateTillEmailIdToRemainActive: { type: Date, require: false },
  endUserConfirmatinoOnEmailForwarding: { type: String, require: false },
};
const UAMApprovals = {
  requestedBy: {
    user: {
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
      require: false,
      autopopulate: false,
    },
    signature: { type: String, require: false },
    approvalDate: { type: Date, require: false },
  },
  headOfDepartmentDesignee: {
    user: {
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
      require: false,
      autopopulate: false,
    },
    signature: { type: String, require: false },
    approvalDate: { type: Date, require: false },
  },
  itHeadDesignee: {
    user: {
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
      require: false,
      autopopulate: false,
    },
    signature: { type: String, require: false },
    approvalDate: { type: Date, require: false },
  },
  dpoDesignee: {
    user: {
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
      require: false,
      autopopulate: false,
    },
    signature: { type: String, require: false },
    approvalDate: { type: Date, require: false },
  },
};
const ForITDepartmentUseOnly = {
  activeDirectoryAccountDeactivationDate: { type: Date, require: false },
  activeDirectoryAccountDeletionDate: { type: Date, require: false },
  comments: { type: String, require: false },
  executedBy: {
    type: [
      {
        user: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
          require: false,
          autopopulate: false,
        },
        signature: { type: String, require: false },
        date: { type: Date, require: false },
      },
    ],
    require: false,
  },
};

const WindowsUAM = {
  userInformation: {
    type: UserInformation,
  },
  accessToShareDrives: {
    type: [AccessToShareDrives],
  },
  userSystemDataAndEmailIdTreatment: {
    type: UserSystemDataAndEmailIdTreatment,
  },
  uamApprovals: {
    type: UAMApprovals,
  },
  forITDepartmentUseOnly: {
    type: ForITDepartmentUseOnly,
  },
};
@Schema({ timestamps: true })
export class UserAccessManagement {
  @Prop() uamNumber: string;

  @Prop({
    enum: UAMRequestTypeAction,
    required: false,
  })
  requestTypeAction: string;

  @Prop({
    type: WindowsUAM,
  })
  windows: any;

  /**
   * [
   *    {
   *        userId: '1',
   *        createdAt: '2022-01-03',
   *        action: 'Created'
   *    },
   *    {
   *        userId: '2',
   *        createdAt: '2022-01-04',
   *        action: 'UAMNumberCreated'
   *    },
   *    {
   *        userId: '3',
   *        createdAt: '2022-01-05',
   *        action: 'AssignedToLineManager'
   *    },
   *    {
   *        userId: '4',
   *        createdAt: '2022-01-06',
   *        action: 'AssignedToITAfterApprovalOfLineManager'
   *    },
   *    {
   *        userId: '2',
   *        createdAt: '2022-01-07',
   *        action: 'Closed'
   *    }
   * ]
   */
  @Prop(
    raw([
      {
        user: {
          nullable: true,
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
          autopopulate: false,
        },
        createdAt: { type: Date },
        action: { type: String, enum: UAMAction },
        note: { type: String },
      },
    ]),
  )
  transaction: any;

  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    autopopulate: false,
  })
  createdBy: string | UserDocument;

  @Prop({
    type: String,
    enum: UAMAction,
    default: UAMAction.Created,
  })
  status: string;

  @Prop({
    nullable: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    autopopulate: false,
  })
  assignedTo: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isAssignedToIT: boolean;

  @Prop({
    enum: UAMPriority,
    type: String,
    default: UAMPriority.Low,
  })
  priority: string;

  @Prop({
    enum: UAMType,
    type: String,
    default: UAMType.Windows,
  })
  uamType: string;
}

export const UserAccessManagementSchema =
  SchemaFactory.createForClass(UserAccessManagement);
