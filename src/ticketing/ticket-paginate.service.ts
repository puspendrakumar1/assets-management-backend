import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserRole } from 'src/common/Enums';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { UserDocument } from 'src/users/schemas/user.schema';
import {
  Tickting,
  TicktingDocument,
  TicktingSchema,
} from './schemas/ticketing.schema';

@Injectable()
export class PaginateTicketingService {
  constructor(
    @InjectModel(Tickting.name)
    private ticktingModel: Model<TicktingDocument>,
  ) {}

  ticketingFilter(query: any, userId: string): FilterQuery<TicktingDocument> {
    let filter: FilterQuery<TicktingDocument> = { $or: [], $and: [] };
    const fieldData = [];
    let paths = TicktingSchema['paths'];

    const schemaFields = Object.keys(TicktingSchema['paths']);
    schemaFields.forEach((field) => {
      if (paths[field]['instance'] === 'String') {
        fieldData.push(paths[field]);
      }
    });

    const filterFields = fieldData.map((fData) => fData.path);

    for (const key in query) {
      if (!['limit', 'page', 'searchText'].includes(key)) {
        filter.$and.push({
          [key]: {
            $regex: query[key],
            $options: 'i',
          },
        });
      }
    }
    filterFields.forEach((key) => {
      if (!['_id', '__v'].includes(key)) {
        filter.$or.push({
          [key]: {
            $regex: query['searchText'] || '',
            $options: 'i',
          },
        });
      }
    });

    if (userId) {
      filter.requestFromUserId = userId;
    }

    if (!filter?.$or?.length) {
      delete filter.$or;
    }
    if (!filter?.$and?.length) {
      delete filter.$and;
    }

    return filter;
  }

  async paginate(
    query: any,
    currentUser: UserDocument,
  ): Promise<IPaginatedResponse<TicktingDocument>> {
    const filter: FilterQuery<TicktingDocument> = this.ticketingFilter(
      query,
      currentUser.role === UserRole.LEVEL3 ? currentUser._id : null,
    );

    const total = await this.ticktingModel.countDocuments(filter);
    const data = await this.ticktingModel
      .find(filter)
      .skip((query.page - 1) * +query.limit)
      .limit(+query.limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      limit: +query.limit,
      page: +query.page,
      totalPage: Math.ceil(total / query.limit),
      totaldata: total,
      data,
    };
  }
}
