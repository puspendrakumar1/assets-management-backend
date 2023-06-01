import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserRole } from 'src/common/Enums';
import { UserDocument } from 'src/users/schemas/user.schema';
import {
  UserAccessManagement,
  UserAccessManagementDocument,
} from './schemas/user-access-management.schema';
import { UAMPopulateFields } from './util/uam-populate.util';

@Injectable()
export class PaginateUserAccessManagementService {
  constructor(
    @InjectModel(UserAccessManagement.name)
    private userAccessManagementModel: Model<UserAccessManagementDocument>,
  ) {}

  uamFilter(
    query: any,
    currentUser: UserDocument,
  ): FilterQuery<UserAccessManagementDocument> {
    const filter: FilterQuery<UserAccessManagementDocument> = {
      $or: [],
      $and: [],
    };
    if (currentUser.role === UserRole.LEVEL3) {
      filter.$or.push({
        createdBy: currentUser._id,
      });
      filter.$or.push({
        assignedTo: currentUser._id,
      });
    }
    if (currentUser.role === UserRole.LEVEL2) {
      filter.$or.push({
        isAssignedToIT: true,
      });
    }
    if (query.id) {
      filter.$or.push({
        _id: query.id,
      });
    }

    if (!filter.$or.length) {
      delete filter.$or;
    }
    if (!filter.$and.length) {
      delete filter.$and;
    }

    return filter;
  }

  async paginate(query: any, currentUser: UserDocument) {
    const filter: FilterQuery<UserAccessManagementDocument> = this.uamFilter(
      query,
      currentUser,
    );

    let page = (+query.page || 0) - 1;
    page = page <= 0 ? 0 : page;
    const limit = +query.limit || 10;

    const total = await this.userAccessManagementModel.countDocuments(filter);
    let data = await this.userAccessManagementModel
      .find(filter)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    data = await this.userAccessManagementModel.populate(
      data,
      UAMPopulateFields,
    );

    return {
      limit,
      page,
      totalPage: Math.ceil(total / limit),
      totaldata: total,
      data,
    };
  }
}
