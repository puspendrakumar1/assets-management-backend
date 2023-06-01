import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Visitor, VisitorDocument } from './schema/visitor.schema';
import { VMSPopulateFields } from './utils/visitor-management-system-populate.util';

@Injectable()
export class PaginateVisitService {
  constructor(
    @InjectModel(Visitor.name) private visitorModel: Model<VisitorDocument>,
  ) {}

  getVisitFilters(query: any, userId: string): FilterQuery<VisitorDocument> {
    let filter: FilterQuery<VisitorDocument> = { $or: [], $and: [] };

    if (!filter.$or.length) {
      delete filter.$or;
    }
    if (!filter.$and.length) {
      delete filter.$and;
    }

    return filter;
  }

  async paginate(query: any, currentUser: UserDocument) {
    let filter: FilterQuery<VisitorDocument> = this.getVisitFilters(
      query,
      currentUser._id,
    );

    const total = await this.visitorModel.countDocuments(filter);
    let data: any = await this.visitorModel
      .aggregate([
        {
          $match: filter,
        },
      ])
      .skip((query.page - 1) * +query.limit)
      .limit(+query.limit)
      .sort({ createdAt: -1 })
      .exec();
    data = await this.visitorModel.populate(data, VMSPopulateFields);

    return {
      limit: +query.limit,
      page: +query.page,
      totalPage: Math.ceil(total / query.limit),
      totaldata: total,
      data,
    };
  }
}
