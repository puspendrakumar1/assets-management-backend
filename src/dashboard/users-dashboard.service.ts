import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Branch, BranchDocument } from 'src/branch/schemas/branch.schema';

@Injectable()
export class UsersDashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {
    this.thisWeekNewJoinees();
  }

  async getUsersDashboardDetails() {
    return {
      totalUsers: await this.getTotalUsers(),
      thisWeekNewJoinees: await this.thisWeekNewJoinees(),
      branchWiseUsers: await this.branchWiseUsers(),
    };
  }

  private async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }
  private async thisWeekNewJoinees() {
    const users = await this.userModel.aggregate([
      {
        $match: {
          $and: [
            {
              createdAt: {
                $gte: moment().startOf('week').toDate(),
              },
            },
            {
              createdAt: {
                $lte: moment().endOf('week').toDate(),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'assets',
          localField: '_id',
          foreignField: 'allocationToUserId',
          as: 'assets',
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          lastName: 1,
          firstName: 1,
          'assets._id': 1,
          createdAt: 1,
        },
      },
    ]);

    return users.map((user) => ({
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      isAssetAllocated: user?.assets?.length ? true : false,
      totalAssetsAllocated: user?.assets?.length,
      createdAt: user?.createdAt,
    }));
  }
  private async branchWiseUsers() {
    const branchWiseCount = await this.userModel
      .aggregate([
        {
          $group: {
            _id: '$branch',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'branches',
            localField: '_id',
            foreignField: '_id',
            as: 'branch',
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            'branch._id': 1,
            'branch.name': 1,
            'branch.branchCode': 1,
          },
        },
        {
          $unwind: '$branch',
        },
      ])
      .exec();

    const branchesWithNoUsers = await this.branchModel.find({
      _id: { $nin: branchWiseCount.map((branch) => branch._id) },
    });

    const branchesWithOverallUsersCount = [
      ...branchWiseCount.map((branch) => ({
        _id: branch?._id,
        count: branch?.count,
        ...branch?.branch,
      })),
      ...branchesWithNoUsers.map((branch) => ({
        _id: branch?._id,
        count: 0,
        branchCode: branch?.branchCode,
        name: branch?.name,
      })),
    ];

    return branchesWithOverallUsersCount;
  }
}
