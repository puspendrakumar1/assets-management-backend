import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  AssetTransaction,
  AssetTransactionDocument,
} from './schemas/asset-transaction.schema';

@Injectable()
export class AssetTransactionService {
  constructor(
    @InjectModel(AssetTransaction.name)
    private assetTransactionModel: Model<AssetTransactionDocument>,
  ) {}
  async createAssetTransaction(
    assetId: string,
    allocationStatus: string,
    allocationToUserId: string = null,
  ) {
    const assetTransaction = await this.assetTransactionModel.create({
      assetId,
      allocationStatus,
      allocationToUserId,
    });
    // await assetTransaction.save();
  }
  async createAssetTransactions(
    data: {
      assetId: string;
      allocationStatus: string;
      allocationToUserId?: string;
    }[],
  ) {
    await this.assetTransactionModel.insertMany(data);
  }

  async getAssetTransactionsById(
    assetId: string,
    dateRange: {
      startDate: Date;
      endDate: Date;
    } = null,
  ) {
    const filter: FilterQuery<AssetTransactionDocument> = {
      assetId,
    };
    if (dateRange) {
      Object.assign(filter, {
        createdAt: {
          $gte: new Date(dateRange.startDate),
          $lte: new Date(dateRange.endDate),
        },
      });
    }

    const assetTransaction = await this.assetTransactionModel.find(filter);
    return assetTransaction;
  }
}
