import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsOtherField } from 'src/common/Decorators/is-other-field.decorator';
import {
  UAMAccessToShareDrives,
  UAMGrantRevoke,
  UAMRequestTypeAction,
  UAMTypeOfAccessRequired,
  UAMTypeOfUser,
  UAMUserSystemData,
} from 'src/common/Enums';
import { enumValidatorMessage } from 'src/common/utils/enum-validation-message.unil';

export class UAMUser {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsOptional() @IsMongoId() department: string;
  @IsOptional() @IsString() location: string;
  @IsString() email: string;
  @IsOptional() @IsString() remarks: string;

  @IsEnum(UAMTypeOfUser, {
    message: enumValidatorMessage(UAMTypeOfUser, 'typeOfUser'),
  })
  typeOfUser: UAMTypeOfUser;
  @IsOtherField('typeOfUser', UAMTypeOfUser.Other, {
    message: 'typeOfUserOtherText is required.',
  })
  typeOfUserOtherText: 'Other only if typeofuser=other ';

  @IsEnum(UAMTypeOfAccessRequired, {
    message: enumValidatorMessage(
      UAMTypeOfAccessRequired,
      'typeOfAccessRequired',
    ),
  })
  typeOfAccessRequired: UAMTypeOfAccessRequired;
  @IsOtherField('typeOfAccessRequired', UAMTypeOfAccessRequired.Temporary, {
    message: 'ifTemporaryDateForDeactivation is required.',
  })
  @IsDateString()
  ifTemporaryDateForDeactivation: Date;

  @IsEnum(UAMGrantRevoke, {
    message: enumValidatorMessage(UAMGrantRevoke, 'accessTypeGrantRevoke'),
  })
  accessTypeGrantRevoke: UAMGrantRevoke;
}
export class UAMUserInformationNetworkServicesToBeGrantedRevoked {
  @IsBoolean() emailAccess: boolean;
  @IsBoolean() serverAccess: boolean;
  @IsBoolean() 'sharedDrive/folderAccess': boolean;
  @IsBoolean() APCERNetworkVPNAccess: boolean;
  @IsBoolean() others: boolean;
}

export class WindowsUserInformationUAM {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => UAMUser)
  users: UAMUser[];

  @IsDateString() dateOfRequest: Date;
  @IsOptional() @IsDateString() dateOfJoiningLeaving: Date;

  @ValidateNested()
  @Type(() => UAMUserInformationNetworkServicesToBeGrantedRevoked)
  networkServicesToBeGrantedRevoked: UAMUserInformationNetworkServicesToBeGrantedRevoked;
  @IsString() reportingManager: string;
  @IsBoolean() accessToDistributionList: boolean;
  @IsOptional() @IsString() comments: string;
}
export class WindowsAccessToShareDrivesUAM {
  @IsString() driveName: string;
  @IsString() folderName: string;
  @IsEnum(UAMAccessToShareDrives, {
    message: enumValidatorMessage(UAMAccessToShareDrives, 'accessRights'),
  })
  accessRights: UAMAccessToShareDrives;
  @IsEnum(UAMGrantRevoke, {
    message: enumValidatorMessage(UAMGrantRevoke, 'grantRevoke'),
  })
  grantRevoke: UAMGrantRevoke;
}
export class WindowsUserSystemDataAndEmailIdTreatmentUAM {
  @IsEnum(UAMUserSystemData, {
    message: enumValidatorMessage(UAMUserSystemData, 'userSystemData'),
  })
  userSystemData: UAMUserSystemData;
  @IsMongoId() @IsString() dataHandOverTo: string;
  @IsDateString() endUserConfirmationOnReceiptOfData: Date;
  @IsString() emailMailboxTransferredTo: string;
  @IsString() endUserConfirmationOnActivationOfMailbox: string;
  @IsString() @IsEmail() emailIdForwardedTo: string;
  @IsDateString() dateTillEmailIdToRemainActive: Date;
  @IsString() endUserConfirmatinoOnEmailForwarding: string;
}
export class WindowsUamApprovalsSubTypeUAM {
  @IsMongoId() user: string;
  @IsOptional() @IsString() signature: string;
  @IsOptional() @IsDateString() approvalDate: Date;
}
export class WindowsUamApprovalsUAM {
  @ValidateNested()
  @Type(() => WindowsUamApprovalsSubTypeUAM)
  requestedBy: WindowsUamApprovalsSubTypeUAM;

  @ValidateNested()
  @Type(() => WindowsUamApprovalsSubTypeUAM)
  headOfDepartmentDesignee: WindowsUamApprovalsSubTypeUAM;

  @ValidateNested()
  @Type(() => WindowsUamApprovalsSubTypeUAM)
  itHeadDesignee: WindowsUamApprovalsSubTypeUAM;

  @ValidateNested()
  @Type(() => WindowsUamApprovalsSubTypeUAM)
  dpoDesignee: WindowsUamApprovalsSubTypeUAM;
}
export class WindowsForITDepartmentUseOnlyExecutedByUAM {
  @IsMongoId() @IsString() user: string;
  @IsOptional() @IsString() signature: string;
  @IsDateString() date: Date;
}
export class WindowsForITDepartmentUseOnlyUAM {
  @IsDateString() activeDirectoryAccountDeactivationDate: Date;
  @IsDateString() activeDirectoryAccountDeletionDate: Date;
  @IsOptional() @IsString() comments: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WindowsForITDepartmentUseOnlyExecutedByUAM)
  executedBy: WindowsForITDepartmentUseOnlyExecutedByUAM[];
}

export class WindowsUAM {
  @ValidateNested()
  @Type(() => WindowsUserInformationUAM)
  userInformation: WindowsUserInformationUAM;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WindowsAccessToShareDrivesUAM)
  accessToShareDrives: WindowsAccessToShareDrivesUAM[];

  @ValidateNested()
  @Type(() => WindowsUserSystemDataAndEmailIdTreatmentUAM)
  userSystemDataAndEmailIdTreatment: WindowsUserSystemDataAndEmailIdTreatmentUAM;

  @ValidateNested()
  @Type(() => WindowsUamApprovalsUAM)
  uamApprovals: WindowsUamApprovalsUAM;

  @IsOptional()
  @ValidateNested()
  @Type(() => WindowsForITDepartmentUseOnlyUAM)
  forITDepartmentUseOnly: WindowsForITDepartmentUseOnlyUAM;
}
