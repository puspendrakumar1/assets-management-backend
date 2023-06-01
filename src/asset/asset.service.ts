import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { CommonResponse } from '../common/interfaces';
import { CreateAssetDto } from './dto/createAsset.dto';
import { ErrorCode } from '../common/ErrorCodes';
import { AssignAssetToUserDto } from './dto/assignAssetToUser.dto';
import { UsersService } from '../users/users.service';
import {
  AssetsAllocationStatus,
  AssetTypes,
  UserRole,
  WarrantyType,
} from 'src/common/Enums';
import { AssetTransactionService } from './asset-transaction.service';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AssetDocument, Asset, AssetSchema } from './schemas/asset.schema';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { generateTimeLineData } from 'src/common/utils/asset-transactions-timeline.util';
import { IAssetsCountExpireingInDays } from './interfaces/assets-count-expireing-in-days.interface';
import { isMongoId } from 'class-validator';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AssetService {
  constructor(
    private readonly userService: UsersService,
    private readonly assetTransactionService: AssetTransactionService,

    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async createAsset(
    createAssetDto: CreateAssetDto,
    currentUser: any,
  ): Promise<CommonResponse> {
    if (
      createAssetDto.type === AssetTypes.Laptop ||
      createAssetDto.type === AssetTypes.PC ||
      createAssetDto.type === AssetTypes.Server
    ) {
      await this.uniqueFieldValidation(createAssetDto);
    }
    if (createAssetDto.type === AssetTypes.UPS) {
      return {
        message: 'Asset Created Successfully',
        data: await this.createUPSAsset(createAssetDto, currentUser),
      };
    }

    const asset = await this.assetModel.create({
      ...createAssetDto,
      addedByUser: currentUser,
    });
    await asset.save();

    this.assetTransactionService.createAssetTransaction(
      asset.id,
      AssetsAllocationStatus.IN_POOL,
    );
    return { message: 'Asset Created Successfully', data: asset };
  }
  async createUPSAsset(createAssetDto: CreateAssetDto, addedByUser: string) {
    const batteryDetails: Asset[] = createAssetDto.battery;
    delete createAssetDto.battery;

    const upsAsset: AssetDocument = await this.assetModel.create({
      ...createAssetDto,
      addedByUser,
    });
    // await upsAsset.save();

    const batteryAssets: Asset[] = batteryDetails.map((battery) => ({
      ...battery,
      parentAssetId: upsAsset.id,
    }));
    const insertedBatteries: AssetDocument[] = await this.assetModel.insertMany(
      batteryAssets,
    );
    await this.assetTransactionService.createAssetTransactions(
      insertedBatteries.map((asset) => ({
        assetId: asset.id,
        allocationStatus: AssetsAllocationStatus.IN_POOL,
      })),
    );
    return {
      ...upsAsset.toJSON(),
      battery: insertedBatteries,
    };
  }

  async getAssets(): Promise<CommonResponse<AssetDocument[]>> {
    return {
      data: await this.assetModel.find({}),
    };
  }

  async getAssetById(
    id: string,
    currentUser: UserDocument,
  ): Promise<AssetDocument> {
    const filter: FilterQuery<AssetDocument> = {
      _id: new ObjectId(id),
    };
    if (currentUser.role === UserRole.LEVEL3) {
      filter.allocationToUserId = currentUser._id;
    }

    // let asset = await this.assetModel.findOne(filter, {
    //   'branch.createdBy': 0,
    // });

    let asset: any = await this.assetModel
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'assettransactions',
            localField: '_id',
            foreignField: 'assetId',
            as: 'assetTransactions',
          },
        },
      ])
      .exec();
    if (!asset.length) {
      throw new NotFoundException('Asset Not Found', ErrorCode.ASSET_NOT_FOUND);
    }

    asset = asset[0];
    asset = await this.assetModel.populate(asset, [
      {
        path: 'branch',
        select: {
          createdBy: 0,
        },
      },
      {
        path: 'venderId',
      },
      {
        path: 'allocationToUserId',
        select: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          // branch: 0,
          // departmentId: 0,
        },
      },
      {
        path: 'assetTransactions',
        populate: {
          path: 'allocationToUserId',
          model: 'User',
          select: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            // branch: 0,
            // departmentId: 0,
          },
        },
      },
    ]);

    if (asset.assetTransactions && asset.assetTransactions.length) {
      asset.previousUser = this.getPreviousUserOfAssetFromTransaction(
        asset.assetTransactions,
        asset?.allocationToUserId?._id.toString(),
      );
    }
    const assetTransactions =
      await this.assetTransactionService.getAssetTransactionsById(id);
    asset.timeline = generateTimeLineData(asset.assetTransactions);

    delete asset.assetTransactions;

    return asset;
  }
  getPreviousUserOfAssetFromTransaction(
    transactions: any,
    currentAllocationToUserId: string,
  ) {
    const previousAssignedTransactions = transactions
      .filter(
        (transaction) =>
          transaction.allocationStatus === AssetsAllocationStatus.ASSIGNED &&
          transaction?.allocationToUserId?._id?.toString() !==
            currentAllocationToUserId,
      )
      .sort((a, b) => b.createdAt - a.createdAt);

    return previousAssignedTransactions && previousAssignedTransactions.length
      ? previousAssignedTransactions[0]?.user
      : null;
  }

  async deleteAssetById(id: string, currentUser: UserDocument) {
    const asset = await this.getAssetById(id, currentUser);

    await this.assetModel.findByIdAndDelete(id);
    return asset;
  }

  async updateAssetById(
    id: string,
    updateAssetByIdDto: CreateAssetDto,
    currentUser: UserDocument,
  ): Promise<CreateAssetDto> {
    const asset = await this.getAssetById(id, currentUser);

    await this.assetModel.findByIdAndUpdate(id, updateAssetByIdDto);
    if (
      updateAssetByIdDto.allocationStatus &&
      asset.allocationStatus !== updateAssetByIdDto.allocationStatus
    ) {
      await this.assetTransactionService.createAssetTransactions([
        {
          assetId: id,
          allocationStatus: updateAssetByIdDto.allocationStatus,
          allocationToUserId: updateAssetByIdDto.allocationToUserId || null,
        },
      ]);
    }

    return updateAssetByIdDto;
  }

  async assetFilters(
    query: any,
    userId: string,
  ): Promise<FilterQuery<AssetDocument>> {
    let filter: FilterQuery<AssetDocument> = {
      parentAssetId: { $eq: null },
      $or: [],
      $and: [],
    };
    const fieldData = [];
    let paths = AssetSchema['paths'];

    const schemaFields = Object.keys(AssetSchema['paths']);
    schemaFields.forEach((field) => {
      if (paths[field]['instance'] === 'String') {
        fieldData.push(paths[field]);
      }
    });

    const filterFields = fieldData.map((fData) => fData.path);

    for (const key in query) {
      if (
        !['limit', 'page', 'searchText', 'expiring', 'expiringIn'].includes(key)
      ) {
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
    if (query['searchText']) {
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
    }

    if (query.expiring) {
      const expiringAssetIds =
        await this.getAssetIdsWithCountWithUpcommingExpireingInNumberOfdays(
          query.expiringIn,
        );

      if (expiringAssetIds.length) {
        filter = {
          _id: {
            $in: expiringAssetIds,
          },
        };
      }
    }
    if (query.expired) {
      // const expired
    }

    if (!filter?.$or?.length) {
      delete filter.$or;
    }
    if (!filter?.$and?.length) {
      delete filter.$and;
    }

    if (userId) {
      filter.allocationToUserId = userId;
    }

    return filter;
  }

  async getAssetByFilter(
    filter: FilterQuery<AssetDocument>,
  ): Promise<AssetDocument[]> {
    return this.assetModel
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'assets',
            localField: '_id',
            foreignField: 'parentAssetId',
            as: 'battery',
          },
        },
      ])
      .exec();
  }

  async paginate(
    query: any,
    currentUser: UserDocument,
  ): Promise<IPaginatedResponse<AssetDocument>> {
    const filter: FilterQuery<AssetDocument> = await this.assetFilters(
      query,
      currentUser.role === UserRole.LEVEL3 ? currentUser._id : null,
    );

    const total = await this.assetModel.countDocuments(filter);
    let data: any = await this.assetModel
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'assets',
            localField: '_id',
            foreignField: 'parentAssetId',
            as: 'battery',
          },
        },
        {
          $lookup: {
            from: 'assettransactions',
            localField: '_id',
            foreignField: 'assetId',
            as: 'assetTransactions',
          },
        },
        {
          $unwind: {
            path: '$assetTransactions',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'assetTransactions.allocationToUserId',
            foreignField: '_id',
            as: 'assetTransactions.user',
          },
        },
        {
          $group: {
            _id: '$_id',
            // name: { $first: "$assetTransactions" },
            assetData: {
              $first: '$$ROOT',
            },
            assetTransactions: { $push: '$assetTransactions' },
          },
        },
      ])
      .skip((query.page - 1) * +query.limit)
      .limit(+query.limit)
      .sort({ createdAt: -1 })
      .exec();

    data = data.map((d) => {
      delete d.assetData.assetTransactions;
      const assetData = d.assetData;
      delete d.assetData;
      const temp = {
        ...d,
        ...assetData,
      };
      temp.assetTransactions = temp.assetTransactions.map((tr) => {
        const user = tr?.user?.length
          ? {
              _id: tr.user[0]._id,
              firstName: tr.user[0].firstName,
              lastName: tr.user[0].lastName,
            }
          : null;
        return {
          ...tr,
          user,
        };
      });

      return temp;
    });

    data = await this.assetModel.populate(data, [
      {
        path: 'branch',
        select: {
          createdBy: 0,
        },
      },
      {
        path: 'venderId',
      },
      {
        path: 'allocationToUserId',
        select: {
          _id: 1,
          firstName: 1,
          lastName: 1,
        },
      },
    ]);

    data = data.map((d: any) => {
      const currentAssetTimeline = generateTimeLineData(d.assetTransactions);
      let previousUser = null;
      if (d.assetTransactions && d.assetTransactions.length) {
        previousUser = this.getPreviousUserOfAssetFromTransaction(
          d.assetTransactions,
          d?.allocationToUserId?._id.toString(),
        );
      }

      delete d.assetTransactions;

      return {
        ...d,
        timeline: currentAssetTimeline,
        previousUser,
      };
    });

    return {
      limit: +query.limit,
      page: +query.page,
      totalPage: Math.ceil(total / query.limit),
      totaldata: total,
      data,
    };
  }

  async assignAssetToUser(
    assignAssetToUserDto: AssignAssetToUserDto,
    currentUser: UserDocument,
  ) {
    const asset = await this.getAssetById(assignAssetToUserDto.id, currentUser);
    const user = await this.userService.findById(
      assignAssetToUserDto.userId,
      currentUser,
    );
    if (!user) {
      throw new NotFoundException('User not Found', ErrorCode.USER_NOT_FOUND);
    }
    if (asset.allocationToUserId !== assignAssetToUserDto.userId) {
      await this.assetModel.findByIdAndUpdate(assignAssetToUserDto.id, {
        allocationToUserId: assignAssetToUserDto.userId,
        allocationStatus: AssetsAllocationStatus.ASSIGNED,
      });
      await this.userService.addAssetIdToUser(
        assignAssetToUserDto.userId,
        assignAssetToUserDto.id,
      );

      this.assetTransactionService.createAssetTransaction(
        assignAssetToUserDto.id,
        AssetsAllocationStatus.ASSIGNED,
        assignAssetToUserDto.userId,
      );
    }

    return {
      message: 'Asset Assigned Successfully',
      data: await this.getAssetById(assignAssetToUserDto.id, currentUser),
    };
  }
  async removeAssetFromUser(id: string) {
    let asset = await this.assetModel.findById(id);

    await this.userService.removeAssetFromUser(asset.allocationToUserId, id);
    asset = await this.assetModel.findByIdAndUpdate(
      id,
      {
        allocationToUserId: null,
        allocationStatus: AssetsAllocationStatus.IN_POOL,
      },
      {
        new: true,
      },
    );
    this.assetTransactionService.createAssetTransaction(
      id,
      AssetsAllocationStatus.IN_POOL,
      null,
    );

    return {
      message: 'Removed Assigned Asset Successfully',
      data: asset,
    };
  }

  async getAssetStatusCount() {
    const assetCallStatusCount: { _id: string; count: number }[] =
      await this.assetModel
        .aggregate([
          {
            $group: {
              _id: '$allocationStatus',
              count: { $sum: 1 },
            },
          },
        ])
        .exec();

    const assetAllocationStatusCount = {
      IN_POOL: 0,
      ASSIGNED: 0,
      SCRAP: 0,
      DOWN: 0,
    };

    Object.keys(AssetsAllocationStatus).forEach((status) => {
      const currentAssetStatusCount = assetCallStatusCount.find(
        (currentCount) => currentCount?._id === status,
      );

      if (currentAssetStatusCount) {
        Object.assign(assetAllocationStatusCount, {
          [currentAssetStatusCount._id]: currentAssetStatusCount?.count,
        });
      } else {
        Object.assign(assetAllocationStatusCount, {
          [status]: 0,
        });
      }
    });

    return assetAllocationStatusCount;
  }

  async uniqueFieldValidation(createAssetDto: CreateAssetDto | any) {
    const serialCount = await this.assetModel.count({
      [`${createAssetDto.type}.system.serial`]:
        createAssetDto[createAssetDto.type]?.system?.serial,
    });
    const hostnameCount = await this.assetModel.count({
      [`${createAssetDto.type}.os.hostname`]:
        createAssetDto[createAssetDto.type]?.os?.hostname,
    });

    const errorField = [];
    if (serialCount) {
      errorField.push('Serial No.');
    }
    if (hostnameCount) {
      errorField.push('Hostname');
    }

    if (errorField.length) {
      throw new BadRequestException(`${errorField.join(', ')} must be unique`);
    }
  }

  async getAssetsCountWithUpcommingExpireingInNumberOfDays(
    numberOfDays: number,
  ): Promise<IAssetsCountExpireingInDays[]> {
    let assetsCountExpireingInDays: IAssetsCountExpireingInDays[] =
      await this.assetModel.aggregate([
        {
          $unwind: '$warranty',
        },
        {
          $group: {
            _id: '$warranty.type',
            data: {
              $push: {
                assetId: '$_id',
                warranty: '$warranty',
              },
            },
          },
        },
        {
          $unwind: '$data',
        },
        {
          $group: {
            _id: '$_id',
            data: {
              $push: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$data.warranty.endAt', moment().toDate()] },
                      {
                        $lt: [
                          '$data.warranty.endAt',
                          moment().add(numberOfDays, 'days').toDate(),
                        ],
                      },
                    ],
                  },
                  '$data',
                  '$$REMOVE',
                ],
              },
            },
          },
        },
      ]);

    assetsCountExpireingInDays = assetsCountExpireingInDays.map(
      (assetsCountExpireingInDay) => ({
        ...assetsCountExpireingInDay,
        count: assetsCountExpireingInDay?.data?.length,
      }),
    );

    return assetsCountExpireingInDays;
  }
  async getAssetIdsWithCountWithUpcommingExpireingInNumberOfdays(
    numberOfDays: number,
  ): Promise<string[]> {
    const assetsCountExpireingInDays: IAssetsCountExpireingInDays[] =
      await this.getAssetsCountWithUpcommingExpireingInNumberOfDays(
        numberOfDays,
      );

    let assetIds: string[] = [];
    assetsCountExpireingInDays.forEach((assetsCountExpireingInDay) => {
      assetIds.push(...assetsCountExpireingInDay.data.map((d) => d.assetId));
    });

    return assetIds;
  }

  async assetsCreatedInRangeCount(startDate: Date, endDate: Date) {
    return this.assetModel.count({
      $and: [
        {
          createdAt: { $gte: moment(startDate).startOf('day').toDate() },
        },
        {
          createdAt: { $lt: moment(endDate).endOf('day').toDate() },
        },
      ],
    });
  }

  async updateAllocationStatus(id: string, status: AssetsAllocationStatus) {
    if (status === AssetsAllocationStatus.ASSIGNED) {
      return;
    }
    const asset = await this.assetModel.findById(id);
    if (!asset) {
      throw new NotFoundException('Asset Not found', ErrorCode.ASSET_NOT_FOUND);
    }

    if (
      asset.allocationStatus &&
      asset.allocationStatus === AssetsAllocationStatus.ASSIGNED
    ) {
      await this.userService.removeAssetFromUser(asset.allocationToUserId, id);
    }

    this.assetTransactionService.createAssetTransaction(id, status, null);

    return {
      data: await this.assetModel.findByIdAndUpdate(
        id,
        {
          allocationToUserId: null,
          allocationStatus: status,
        },
        {
          new: true,
        },
      ),
    };
  }
}
