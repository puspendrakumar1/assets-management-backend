import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonResponse } from '../common/interfaces';
import { CreateVendorDto } from './dto/createVendor.dto';
import { ErrorCode } from 'src/common/ErrorCodes';
import { UpdateVendorDto } from './dto/updateVendor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Vendor, VendorDocument, VendorSchema } from './schemas/vendor.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
  ) {}

  async createVendor(
    createVendorDto: CreateVendorDto,
    currentUser: UserDocument,
  ): Promise<CommonResponse> {
    const vendor = await this.vendorModel.create({
      ...createVendorDto,
      createdBy: currentUser._id,
    });

    await vendor.save();
    return { message: 'Vendor Created Successfully', data: vendor };
  }

  async getVendors(): Promise<CommonResponse<VendorDocument[]>> {
    return {
      data: await this.vendorModel.find({
        isActive: true,
      }),
    };
  }

  async getVendorById(id: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel.findById(id);
    if (!vendor) {
      throw new NotFoundException(
        'Vendor Not Found',
        ErrorCode.VENDOR_NOT_FOUND,
      );
    }

    return vendor;
  }

  async updateVendorById(
    id: string,
    updateVendorByIdDto: UpdateVendorDto,
  ): Promise<VendorDocument> {
    await this.vendorModel.findByIdAndUpdate(id, {
      ...updateVendorByIdDto,
    });

    return this.getVendorById(id);
  }

  async deleteVendor(id: string): Promise<VendorDocument> {
    await this.vendorModel.findByIdAndUpdate(id, {
      isActive: false,
    });

    return this.getVendorById(id);
  }

  async paginate(query: any): Promise<IPaginatedResponse<VendorDocument>> {
    let filter: FilterQuery<VendorDocument> = { $or: [], $and: [] };
    const fieldData = [];
    let paths = VendorSchema['paths'];

    const schemaFields = Object.keys(VendorSchema['paths']);
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

    const total = await this.vendorModel.countDocuments(filter);
    const data = await this.vendorModel
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
