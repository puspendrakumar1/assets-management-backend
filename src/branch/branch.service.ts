import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonResponse } from '../common/interfaces';
import { CreateBranchDto } from './dto/createBranch.dto';
import { ErrorCode } from 'src/common/ErrorCodes';
import { UpdateBranchDto } from './dto/updateBranch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Branch, BranchDocument, BranchSchema } from './schemas/branch.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async createBranch(
    createBranchDto: CreateBranchDto,
    currentUser: UserDocument,
  ): Promise<CommonResponse> {
    const branch = await this.branchModel.create({
      ...createBranchDto,
      createdBy: currentUser._id,
    });

    await branch.save();
    return { message: 'Branch Created Successfully', data: branch };
  }

  async getBranchs(): Promise<CommonResponse<BranchDocument[]>> {
    return {
      data: await this.branchModel.find({
        isActive: true,
      }),
    };
  }

  async getBranchById(id: string): Promise<BranchDocument> {
    const branch = await this.branchModel.findById(id);
    if (!branch) {
      throw new NotFoundException(
        'Branch Not Found',
        ErrorCode.VENDOR_NOT_FOUND,
      );
    }

    return branch;
  }

  async updateBranchById(
    id: string,
    updateBranchByIdDto: UpdateBranchDto,
  ): Promise<BranchDocument> {
    await this.branchModel.findByIdAndUpdate(id, {
      ...updateBranchByIdDto,
    });

    return this.getBranchById(id);
  }

  async deleteBranch(id: string): Promise<BranchDocument> {
    await this.branchModel.findByIdAndUpdate(id, {
      isActive: false,
    });

    return this.getBranchById(id);
  }

  async paginate(query: any): Promise<IPaginatedResponse<BranchDocument>> {
    let filter: FilterQuery<BranchDocument> = { $or: [], $and: [] };
    const fieldData = [];
    let paths = BranchSchema['paths'];

    const schemaFields = Object.keys(BranchSchema['paths']);
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

    if (!filter.$or.length) {
      delete filter.$or;
    }
    if (!filter.$and.length) {
      delete filter.$and;
    }

    const total = await this.branchModel.countDocuments(filter);
    const data = await this.branchModel
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'branch',
            as: 'userCount',
          },
        },
        {
          $lookup: {
            from: 'assets',
            localField: '_id',
            foreignField: 'branch',
            as: 'assetCount',
          },
        },
        {
          $addFields: {
            userCount: {
              $size: '$userCount',
            },
            assetCount: {
              $size: '$assetCount',
            },
          },
        },
      ])
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
