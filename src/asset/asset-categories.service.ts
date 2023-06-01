import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset, AssetDocument } from './schemas/asset.schema';

@Injectable()
export class AssetCategoriesService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}
  async getDistinctCategories() {
    const assets = await this.assetModel.distinct('type');

    return assets.map((asset) => asset.type);
  }
}
