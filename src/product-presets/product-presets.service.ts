import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ErrorCode } from 'src/common/ErrorCodes';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { AddProductPresetsDto } from './dtos/product-presents.dto';
import {
  ProductPresets,
  ProductPresetsDocument,
  ProductPresetsSchema,
} from './schemas/product-presets.schema';

@Injectable()
export class ProductPresetsService {
  constructor(
    @InjectModel(ProductPresets.name)
    private productPresentsModel: Model<ProductPresetsDocument>,
  ) {}

  async create(addProductPresetsDto: AddProductPresetsDto, currentUser: any) {
    const productPresents = await this.productPresentsModel.insertMany({
      ...addProductPresetsDto,
      createdByUser: currentUser._id,
    });

    return {
      message: 'Product presets Created Successfully',
      data: productPresents,
    };
  }

  async paginate(
    query: any,
  ): Promise<IPaginatedResponse<ProductPresetsDocument>> {
    let filter: FilterQuery<ProductPresetsDocument> = { $or: [], $and: [] };
    const fieldData = [];
    let paths = ProductPresetsSchema['paths'];

    const schemaFields = Object.keys(ProductPresetsSchema['paths']);
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

    const total = await this.productPresentsModel.countDocuments(filter);
    const data = await this.productPresentsModel
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

  async getById(id: string): Promise<ProductPresetsDocument> {
    const ticket = await this.productPresentsModel.findById(id);
    if (!ticket) {
      throw new NotFoundException(
        'Product Preset Not Found',
        ErrorCode.PRODUCT_PRESET_NOT_FOUND,
      );
    }

    return ticket;
  }

  async getSuggetions(query: any): Promise<ProductPresetsDocument[]> {
    let filter: FilterQuery<ProductPresetsDocument> = { $and: [] };
    filter.$and = [
      {
        active: true,
        name: {
          $regex: query?.searchText || '',
          $options: 'i',
        },
      },
    ];

    return this.productPresentsModel
      .find(filter)
      .select('name type make -createdByUser')
      .exec();
  }
}
