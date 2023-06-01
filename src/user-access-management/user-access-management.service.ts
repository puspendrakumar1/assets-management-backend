import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { renderFile } from 'ejs';
import {
  UAMAction,
  UAMType,
  UAMUserSystemData,
  UserRole,
} from 'src/common/Enums';
import { ErrorCode } from 'src/common/ErrorCodes';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CloseUAMDTO } from './dtos/close-uam.dto';
import { RejectUAMDTO } from './dtos/reject-uam.dto';
import { GenerateUserAccessManagementPDFService } from './generate-user-access-management-pdf.service';
import {
  UserAccessManagement,
  UserAccessManagementDocument,
} from './schemas/user-access-management.schema';
import { PaginateUserAccessManagementService } from './user-access-management-paginate.service';
import { NODEMAILER_EMAIL } from 'src/environment';
import { UAMPopulateFields } from './util/uam-populate.util';

@Injectable()
export class UserAccessManagementService {
  constructor(
    @InjectModel(UserAccessManagement.name)
    private userAccessManagementModel: Model<UserAccessManagementDocument>,
    private readonly nodemailerService: NodemailerService,
    private readonly paginateUserAccessManagementService: PaginateUserAccessManagementService,
    private readonly generateUserAccessManagementPDFService: GenerateUserAccessManagementPDFService,
  ) {
    // this.sendUAMEmail(UAMAction.Created, '61ff6442dd2ef5e5b2b46436');
  }

  async getUAMById(id: string, currentUser: UserDocument) {
    const filter = this.paginateUserAccessManagementService.uamFilter(
      { id },
      currentUser,
    );
    let userAccessManagement: UserAccessManagementDocument =
      await this.userAccessManagementModel.findOne(filter);
    if (!userAccessManagement) {
      throw new NotFoundException(
        'User Access Management not found',
        ErrorCode.UAM_NOT_FOUND,
      );
    }
    userAccessManagement = await this.userAccessManagementModel.populate(
      userAccessManagement,
      UAMPopulateFields,
    );

    return userAccessManagement;
  }

  async createUserAccessManagement(uam: any, currentUser: UserDocument) {
    if (uam.uamType === UAMType.Windows) {
      if (
        uam.windows.userSystemDataAndEmailIdTreatment !==
          UAMUserSystemData.NotRequired &&
        !uam.windows.uamApprovals.itHeadDesignee
      ) {
        throw new BadRequestException('itHeadDesignee is required');
      }
      if (
        uam.windows.userSystemDataAndEmailIdTreatment !==
          UAMUserSystemData.NotRequired &&
        !uam.windows.uamApprovals.dpoDesignee
      ) {
        throw new BadRequestException('dpoDesignee is required');
      }
    }

    uam.transaction = [
      {
        user: currentUser._id,
        createdAt: new Date(),
        action: UAMAction.Created,
      },
    ];
    uam.createdBy = currentUser._id;

    const newUAM = await new this.userAccessManagementModel(uam).save();

    // Send Email to createdBy user and IT Department
    // this.sendUAMEmail(UAMAction.Created, newUAM._id);

    return {
      data: newUAM,
    };
  }

  async updateUAM(id: string, uam: any, currentUser: UserDocument) {
    const userAccessManagement: UserAccessManagementDocument =
      await this.getUAMById(id, currentUser);
    if (
      currentUser.role !== UserRole.LEVEL1 &&
      currentUser._id.toString() !== userAccessManagement.createdBy.toString()
    ) {
      throw new ForbiddenException(
        'You are not allowed to Update UAM',
        ErrorCode.UAM_UPDATE_NOT_ALLOWED,
      );
    }

    if (
      userAccessManagement.status === UAMAction.Closed ||
      userAccessManagement.status === UAMAction.Rejected ||
      userAccessManagement.status ===
        UAMAction.AssignedToITAfterApprovalOfLineManager
    ) {
      throw new BadRequestException(
        `UAM already ${userAccessManagement.status}`,
      );
    }

    const deleteFields = [
      'uamNumber',
      'requestTypeAction',
      'transaction',
      'createdBy',
      'status',
      'assignedTo',
      'isAssignedToIT',
    ];
    deleteFields.forEach((field) => {
      delete uam[field];
    });

    return {
      data: await this.userAccessManagementModel.findByIdAndUpdate(id, uam, {
        new: true,
      }),
    };
  }

  async assignUAMNumber(
    id: string,
    uamNumber: string,
    currentUser: UserDocument,
  ) {
    const userAccessManagement: UserAccessManagementDocument =
      await this.getUAMById(id, currentUser);
    if (
      userAccessManagement.status === UAMAction.Closed ||
      userAccessManagement.status === UAMAction.Rejected
    ) {
      throw new BadRequestException(
        `UAM already ${userAccessManagement.status}`,
      );
    }
    if (
      userAccessManagement.status !== UAMAction.Created &&
      userAccessManagement.uamNumber
    ) {
      throw new BadRequestException(
        'UAM Number already Generated',
        ErrorCode.UAM_NUMBER_ALRADY_GENERATED,
      );
    }

    await this.userAccessManagementModel.findByIdAndUpdate(id, {
      uamNumber,
      status: UAMAction.AssignedToLineManager,
      assignedTo: currentUser.manager || null,
      isAssignedToIT: currentUser.manager ? false : true,
      $push: {
        transaction: [
          {
            user: currentUser._id,
            createdAt: new Date(),
            action: UAMAction.UAMNumberCreated,
          },
          {
            user: currentUser._id,
            createdAt: new Date(),
            action: UAMAction.AssignedToLineManager,
          },
        ],
      },
    });

    // Send Email to createdBy user, IT Department and Line Manager
    this.sendUAMEmail(UAMAction.AssignedToLineManager, id);

    return {
      message: 'UAM Number assigned',
    };
  }

  async approvalFromLineManager(id: string, currentUser: UserDocument) {
    const userAccessManagement: UserAccessManagementDocument =
      await this.getUAMById(id, currentUser);
    if (
      userAccessManagement.status === UAMAction.Closed ||
      userAccessManagement.status === UAMAction.Rejected
    ) {
      throw new BadRequestException(
        `UAM already ${userAccessManagement.status}`,
      );
    }

    if (userAccessManagement.status !== UAMAction.AssignedToLineManager) {
      throw new BadRequestException('Invalid Request');
    }

    await this.userAccessManagementModel.findByIdAndUpdate(id, {
      status: UAMAction.AssignedToITAfterApprovalOfLineManager,
      assignedTo: null,
      isAssignedToIT: true,
      $push: {
        transaction: [
          {
            user: currentUser._id,
            createdAt: new Date(),
            action: UAMAction.ApprovedByLineManager,
          },
          {
            user: currentUser._id,
            createdAt: new Date(),
            action: UAMAction.AssignedToITAfterApprovalOfLineManager,
          },
        ],
      },
    });

    // Send Email to createdBy user, IT Department and Line Manager
    this.sendUAMEmail(UAMAction.AssignedToITAfterApprovalOfLineManager, id);

    return {
      message: 'UAM Approved',
    };
  }

  async closeUAM(
    id: string,
    closeUAMDTO: CloseUAMDTO,
    currentUser: UserDocument,
  ) {
    const userAccessManagement: UserAccessManagementDocument =
      await this.getUAMById(id, currentUser);
    if (
      userAccessManagement.status === UAMAction.Closed ||
      userAccessManagement.status === UAMAction.Rejected
    ) {
      throw new BadRequestException(
        `UAM already ${userAccessManagement.status}`,
      );
    }

    await this.userAccessManagementModel.findByIdAndUpdate(id, {
      status: UAMAction.Closed,
      assignedTo: null,
      isAssignedToIT: false,
      $push: {
        transaction: [
          {
            user: currentUser._id,
            createdAt: new Date(),
            action: UAMAction.Closed,
            note: closeUAMDTO.note,
          },
        ],
      },
    });

    // Send Email to createdBy user, IT Department
    this.sendUAMEmail(UAMAction.Closed, id);

    return {
      message: 'UAM Closed',
    };
  }

  async rejectUAM(
    id: string,
    rejectUAMDTO: RejectUAMDTO,
    currentUser: UserDocument,
  ) {
    const userAccessManagement: UserAccessManagementDocument =
      await this.getUAMById(id, currentUser);
    if (
      userAccessManagement.status === UAMAction.Closed ||
      userAccessManagement.status === UAMAction.Rejected
    ) {
      throw new BadRequestException(
        `UAM already ${userAccessManagement.status}`,
      );
    }

    await this.userAccessManagementModel.findByIdAndUpdate(id, {
      status: UAMAction.Rejected,
      assignedTo: null,
      isAssignedToIT: false,
      $push: {
        transaction: [
          {
            user: currentUser._id,
            createdAt: new Date(),
            action: UAMAction.Rejected,
            note: rejectUAMDTO.note,
          },
        ],
      },
    });

    // Send Email to createdBy user, IT Department and Line Manager
    this.sendUAMEmail(UAMAction.Rejected, id);

    return {
      message: 'UAM Rejected',
    };
  }

  async sendUAMEmail(status: UAMAction, uamId: string) {
    let uamData = await this.userAccessManagementModel.findById(uamId);
    uamData = await this.userAccessManagementModel.populate(
      uamData,
      UAMPopulateFields,
    );
    const uam = uamData.toJSON();
    const emailMetadata = {
      Created: {
        subject: 'UAM Created',
        fileName: 'uam-created.ejs',
        body: 'New UAM is Created',
      },
      // UAMNumberCreated: {
      //   subject: 'UAM Number Generated',
      //   fileName: 'uam-number-created.ejs',
      //   body: 'UAM Number is Generated',
      // },
      AssignedToLineManager: {
        subject: 'Approval required for UAM',
        fileName: 'uam-assigned-to-line-manager.ejs',
        body: 'UAM number is generated please approve it',
      },
      ApprovedByLineManager: {
        subject: 'UAM Approved',
        fileName: 'uam-approved-by-line-manager.ejs',
        body: 'UAM is Approved',
      },
      AssignedToITAfterApprovalOfLineManager: {
        subject: '',
        fileName: 'uam-approved-by-line-manager.ejs',
        body: 'UAM is Approved',
      },
      Closed: {
        subject: 'UAM Closed',
        fileName: 'uam-closed.ejs',
        body: 'UAM is Closed',
      },
      Rejected: {
        subject: 'UAM Rejected',
        fileName: 'uam-rejected.ejs',
        body: 'UAM is Rejected',
      },
    };
    const metaData = emailMetadata[status];
    console.log(uam.windows.userInformation.users);
    await this.generateUserAccessManagementPDFService.getUAMPDF(uam);

    // const toEmails = this.getEmailsToSendFromUAM(uamData);

    // this.nodemailerService.sendEmail({
    //   to: toEmails,
    //   subject: metaData.subject,
    //   html: await renderFile(__dirname + `/templates/${metaData.fileName}`, {
    //     body: metaData.body,
    //   }),
    //   attachments: await this.generateUserAccessManagementPDFService.getUAMPDF(
    //     uam,
    //   ),
    // });
  }
  getEmailsToSendFromUAM(uam: UserAccessManagementDocument) {
    const toEmails = [];
    const toUsers = [];
    toUsers.push(uam?.createdBy as UserDocument);

    const uamWithType = uam[uam.uamType];

    if (
      uamWithType?.userInformation?.users &&
      uamWithType?.userInformation?.users.length
    ) {
      uamWithType?.userInformation?.users.forEach((userDetail) => {
        toEmails.push(userDetail?.email);
      });
    }
    if (uamWithType?.userInformation?.reportingManager) {
      toUsers.push(
        uamWithType?.userInformation?.reportingManager as UserDocument,
      );
    }
    if (uamWithType?.userSystemDataAndEmailIdTreatment?.dataHandOverTo) {
      toUsers.push(
        uamWithType?.userSystemDataAndEmailIdTreatment
          ?.dataHandOverTo as UserDocument,
      );
    }

    if (uamWithType?.uamApprovals?.requestedBy?.user) {
      toUsers.push(
        uamWithType?.uamApprovals?.requestedBy?.user as UserDocument,
      );
    }
    if (uamWithType?.uamApprovals?.headOfDepartmentDesignee?.user) {
      toUsers.push(
        uamWithType?.uamApprovals?.headOfDepartmentDesignee
          ?.user as UserDocument,
      );
    }
    if (uamWithType?.uamApprovals?.itHeadDesignee?.user) {
      toUsers.push(
        uamWithType?.uamApprovals?.itHeadDesignee?.user as UserDocument,
      );
    }
    if (uamWithType?.uamApprovals?.dpoDesignee?.user) {
      toUsers.push(
        uamWithType?.uamApprovals?.dpoDesignee?.user as UserDocument,
      );
    }

    if (
      uamWithType?.forITDepartmentUseOnly?.executedBy &&
      uamWithType?.forITDepartmentUseOnly?.executedBy.length
    ) {
      uamWithType?.forITDepartmentUseOnly?.executedBy.forEach(
        (executedByDetail) => {
          toUsers.push(executedByDetail?.user as UserDocument);
        },
      );
    }

    toUsers.forEach((toUser) => {
      toEmails.push(toUser?.email);
    });

    return [...new Set(toEmails)].filter((email) => email);
  }
}
