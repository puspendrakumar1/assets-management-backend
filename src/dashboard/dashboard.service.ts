import { Injectable } from '@nestjs/common';
import { AssetService } from 'src/asset/asset.service';
import { AssetsAllocationStatus, WarrantyType } from 'src/common/Enums';
import { CommonResponse } from 'src/common/interfaces';
import { TicketingService } from 'src/ticketing/ticketing.service';
import { DashboardResponse } from './types/dashboard.type';
import * as moment from 'moment';
import { Asset, AssetDocument } from 'src/asset/schemas/asset.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Branch, BranchDocument } from 'src/branch/schemas/branch.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ITUserDashboardService } from './it-user-dashboard.service';
import { UsersDashboardService } from './users-dashboard.service';
import { UAMDashboardService } from './uam-dashboard.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ticketingService: TicketingService,
    private readonly assetService: AssetService,
    private readonly itUserDashboardService: ITUserDashboardService,
    private readonly usersDashboardService: UsersDashboardService,
    private readonly uamDashboardService: UAMDashboardService,

    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async getDashboardData(
    query: any,
    currentUser: UserDocument,
  ): Promise<CommonResponse<DashboardResponse>> {
    const assetsCountWithUpcommingExpireingInDays =
      await this.assetService.getAssetsCountWithUpcommingExpireingInNumberOfDays(
        query.expiringIn || 30,
      );

    return {
      data: {
        assets: {
          assetStatusCount: await this.assetService.getAssetStatusCount(),
          assetStatuses: ['In Pool', 'Assigned', 'Scrap', 'Down'],
          assetsCountWithUpcommingExpireingInDays: {
            WARRANTY:
              assetsCountWithUpcommingExpireingInDays.find(
                (assetsCountWithUpcommingExpireingIn30Day) =>
                  assetsCountWithUpcommingExpireingIn30Day._id ===
                  WarrantyType.WARRANTY,
              )?.count || 0,
            AMC:
              assetsCountWithUpcommingExpireingInDays.find(
                (assetsCountWithUpcommingExpireingIn30Day) =>
                  assetsCountWithUpcommingExpireingIn30Day._id ===
                  WarrantyType.AMC,
              )?.count || 0,
          },
          registeredAssets: await this.assetService.assetsCreatedInRangeCount(
            moment(query.startDate || new Date()).toDate(),
            moment(query.endDate || new Date()).toDate(),
          ),
          lastTenCreatedAssetsDetails: await this.lastTenCreatedAssets(),
          branchWiseOverallAssets: await this.branchWiseOverallAssets(),
          branchWiseAssetAllocationAssets:
            await this.branchWiseAssetAllocationAssets(),
        },

        ticket: {
          ticketStatusCount: await this.ticketingService.getTicketStatusCount(),
        },

        itUserSpecificDetails:
          await this.itUserDashboardService.getITUserDashboardDetails(
            currentUser._id,
          ),

        users: await this.usersDashboardService.getUsersDashboardDetails(),
        uam: {
          totalUAM: await this.uamDashboardService.totalUAM(),
          branchWiseUAM: await this.uamDashboardService.branchWiseUAM(),
        },
      },
    };
  }

  async branchWiseOverallAssets() {
    const branchWiseCount = await this.assetModel
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

    const branchesWithNoAssets = await this.branchModel.find({
      _id: { $nin: branchWiseCount.map((branch) => branch?._id) },
    });

    const branchesWithOverallAssetsCount = [
      ...branchWiseCount.map((branch) => ({
        _id: branch?._id,
        count: branch?.count,
        ...branch?.branch,
      })),
      ...branchesWithNoAssets.map((branch) => ({
        _id: branch?._id,
        count: 0,
        branchCode: branch?.branchCode,
        name: branch?.name,
      })),
    ];

    return branchesWithOverallAssetsCount;
  }

  async lastTenCreatedAssets() {
    const assets = await this.assetModel
      .find()
      .limit(10)
      .sort({ createdAt: -1 })
      .select({
        'server.system.serial': 1,
        'server.os.hostname': 1,
        'laptop.system.serial': 1,
        'laptop.os.hostname': 1,
        'pc.system.serial': 1,
        'pc.os.hostname': 1,
        type: 1,
        createdAt: 1,
      });

    return assets.map((asset) => ({
      _id: asset._id,
      serialNo: (asset[asset.type] && asset[asset.type]?.system?.serial) || '',
      hostName: (asset[asset.type] && asset[asset.type]?.os?.hostname) || '',
      type: asset?.type,
      createdAt: asset['createdAt'],
    }));
  }

  async branchWiseAssetAllocationAssets() {
    let assetCallStatusCount: {
      _id?: { allocationStatus: string; branch: string };
      count?: number;
    }[] = await this.assetModel
      .aggregate([
        {
          $group: {
            _id: {
              allocationStatus: '$allocationStatus',
              branch: '$branch',
            },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const branches = await this.branchModel
      .find()
      .select('_id name branchCode');
    return branches.map((branch) => {
      const currentBranchCounts = assetCallStatusCount.filter(
        (counts) => counts?._id?.branch?.toString() === branch?._id?.toString(),
      );

      const IN_POOL = currentBranchCounts.find(
        (c) => c._id.allocationStatus === AssetsAllocationStatus.IN_POOL,
      );
      const ASSIGNED = currentBranchCounts.find(
        (c) => c._id.allocationStatus === AssetsAllocationStatus.ASSIGNED,
      );
      const DOWN = currentBranchCounts.find(
        (c) => c._id.allocationStatus === AssetsAllocationStatus.DOWN,
      );
      const SCRAP = currentBranchCounts.find(
        (c) => c._id.allocationStatus === AssetsAllocationStatus.SCRAP,
      );

      return {
        ...branch.toJSON(),

        IN_POOL: IN_POOL ? IN_POOL.count : 0,
        ASSIGNED: ASSIGNED ? ASSIGNED.count : 0,
        SCRAP: SCRAP ? SCRAP.count : 0,
        DOWN: DOWN ? DOWN.count : 0,
      };
    });
  }
}
