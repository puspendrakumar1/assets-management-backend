import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { AssetService } from 'src/asset/asset.service';
import { Asset, AssetDocument } from 'src/asset/schemas/asset.schema';
import {
  ScannedAsset,
  ScannedAssetDocument,
  ScannedAssetSchema,
} from 'src/asset/schemas/scanned-asset.schema';
import { B_TO_MB } from 'src/common/constants';
import { AssetCategories } from 'src/common/Enums';
import { ErrorCode } from 'src/common/ErrorCodes';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { UserDocument } from 'src/users/schemas/user.schema';
import { MoveToInPollDto } from './dto/move-to-in-poll.dto';

@Injectable()
export class ExeAgentService {
  constructor(
    @InjectModel(ScannedAsset.name)
    private scannedAssetModel: Model<ScannedAssetDocument>,
    @InjectModel(Asset.name)
    private assetModel: Model<AssetDocument>,

    private readonly assetService: AssetService,
  ) {}

  async createScannedAsset(
    scannedAsset: ScannedAssetDocument,
    currentUser: UserDocument,
  ) {
    if (scannedAsset.mem) {
      const memKeys = Object.keys(scannedAsset.mem);
      memKeys.forEach((key) => {
        scannedAsset.mem[key] = scannedAsset.mem[key] * B_TO_MB;
      });
    }

    scannedAsset.memLayout =
      scannedAsset?.memLayout &&
      scannedAsset?.memLayout?.map((memL) => ({
        ...memL,
        size: memL.size * B_TO_MB,
      }));

    const newScannedAsset: ScannedAssetDocument = new this.scannedAssetModel({
      ...scannedAsset,
      user: currentUser._id,
    });
    await newScannedAsset.save();

    return {
      data: newScannedAsset,
    };
  }

  async paginate(
    query: any,
    currentUser: UserDocument,
  ): Promise<IPaginatedResponse<ScannedAssetDocument>> {
    let filter: FilterQuery<ScannedAssetDocument> = { $or: [], $and: [] };
    const fieldData = [];
    let paths = ScannedAssetSchema['paths'];

    const schemaFields = Object.keys(ScannedAssetSchema['paths']);
    schemaFields.forEach((field) => {
      if (paths[field]['instance'] === 'String') {
        fieldData.push(paths[field]);
      }
    });

    const filterFields = fieldData.map((fData) => fData.path);

    for (const key in query) {
      if (!['limit', 'page', 'searchText'].includes(key)) {
        if (isMongoId(query[key])) {
          filter.$and.push({
            [key]: new ObjectId(query[key]),
          });
        } else {
          filter.$and.push({
            [key]: {
              $regex: query[key],
              $options: 'i',
            },
          });
        }
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

    // TODO:  Add Level wise permission
    filter.user = { $eq: currentUser._id };

    if (!filter?.$or?.length) {
      delete filter.$or;
    }
    if (!filter?.$and?.length) {
      delete filter.$and;
    }

    const total = await this.scannedAssetModel.countDocuments(filter);
    const data = await this.scannedAssetModel
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

  async deleteCreateScannedAssetById(id: string, currentUser: UserDocument) {
    const asset = await this.scannedAssetModel.findOneAndDelete({
      _id: id,
      user: currentUser._id,
    });
    if (!asset) {
      throw new NotFoundException(
        'Scanned Asset Not Found',
        ErrorCode.ASSET_NOT_FOUND,
      );
    }

    return {
      data: asset,
    };
  }

  async moveScannedAssetToInPoll(
    moveToInPollDto: MoveToInPollDto,
    currentUser: UserDocument,
  ) {
    const scannedAsset = await this.scannedAssetModel
      .findOne({
        _id: moveToInPollDto.id,
        user: currentUser._id,
      })
      .select('-_id -__v -user -createdAt -updatedAt');
    if (!scannedAsset) {
      throw new NotFoundException(
        'Scanned Asset Not Found',
        ErrorCode.ASSET_NOT_FOUND,
      );
    }

    const asset = await this.assetModel.create({
      type: moveToInPollDto.type,
      category: AssetCategories.Hardware,
      branch: currentUser.branch,
    });
    Object.assign(asset, {
      [moveToInPollDto.type]: scannedAsset,
    });
    await this.assetService.uniqueFieldValidation(asset);
    asset.save();
    await this.scannedAssetModel.findByIdAndDelete(moveToInPollDto.id);

    return {
      data: asset,
    };
  }
}
