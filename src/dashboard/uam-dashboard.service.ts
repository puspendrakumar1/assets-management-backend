import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from 'src/branch/schemas/branch.schema';
import { UAMAction } from 'src/common/Enums';
import {
  UserAccessManagement,
  UserAccessManagementDocument,
} from 'src/user-access-management/schemas/user-access-management.schema';

@Injectable()
export class UAMDashboardService {
  constructor(
    @InjectModel(UserAccessManagement.name)
    private userAccessManagementModel: Model<UserAccessManagementDocument>,

    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async totalUAM() {
    return this.userAccessManagementModel.countDocuments();
  }

  async branchWiseUAM() {
    let data = await this.userAccessManagementModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
          },
        },
        {
          $unwind: '$createdBy',
        },
        {
          $group: {
            _id: {
              status: '$status',
              branch: '$createdBy.branch',
            },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();
    data = await this.userAccessManagementModel.populate(data, [
      {
        path: '_id.branch',
        model: 'Branch',
      },
    ]);

    const branches = await this.branchModel
      .find()
      .select('_id name branchCode');
    return branches.map((branch) => {
      const currentBranchCounts = data.filter(
        (counts) =>
          counts?._id?.branch?._id?.toString() === branch?._id?.toString(),
      );

      const Created = currentBranchCounts.find(
        (c) => c?._id?.status === UAMAction.Created,
      );
      const UAMNumberCreated = currentBranchCounts.find(
        (c) => c?._id?.status === UAMAction.UAMNumberCreated,
      );
      const ApprovedByLineManager = currentBranchCounts.find(
        (c) => c?._id?.status === UAMAction.ApprovedByLineManager,
      );
      const AssignedToITAfterApprovalOfLineManager = currentBranchCounts.find(
        (c) =>
          c?._id?.status === UAMAction.AssignedToITAfterApprovalOfLineManager,
      );
      const Closed = currentBranchCounts.find(
        (c) => c?._id?.status === UAMAction.Closed,
      );
      const Rejected = currentBranchCounts.find(
        (c) => c?._id?.status === UAMAction.Rejected,
      );

      return {
        ...branch.toJSON(),

        Created: Created ? Created.count : 0,
        UAMNumberCreated: UAMNumberCreated ? UAMNumberCreated.count : 0,
        ApprovedByLineManager: ApprovedByLineManager
          ? ApprovedByLineManager?.count
          : 0,
        AssignedToITAfterApprovalOfLineManager:
          AssignedToITAfterApprovalOfLineManager
            ? AssignedToITAfterApprovalOfLineManager?.count
            : 0,
        Closed: Closed ? Closed?.count : 0,
        Rejected: Rejected ? Rejected?.count : 0,
      };
    });
  }
}
