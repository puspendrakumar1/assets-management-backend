import { Injectable } from '@nestjs/common';
import { AssetDocument, Asset, AssetSchema } from './schemas/asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AssetsAllocationStatus, AssetTypes, UserRole } from 'src/common/Enums';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AssetUserService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async getAssetsByUserId(
    userId: string,
    currentUser: UserDocument,
  ): Promise<AssetDocument[]> {
    if (currentUser.role === UserRole.LEVEL3 && currentUser._id !== userId) {
      return [];
    }

    return this.assetModel.find({
      allocationToUserId: userId,
      allocationStatus: AssetsAllocationStatus.ASSIGNED,
      type: {
        $in: [
          AssetTypes.Laptop,
          AssetTypes.Keyboard,
          AssetTypes.Mouse,
          AssetTypes.Headphone,
        ],
      },
    });
  }
}
