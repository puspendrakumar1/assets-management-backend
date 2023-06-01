import { Injectable } from '@nestjs/common';
import { AssetTypeSpecificFieldTypes } from '../schemas/asset.types';
import { CommonAssetFields } from '../types/asset.types';

@Injectable()
export class AssetTypesService {
  async getAssetTypes() {
    return {
      commonAssetFields: CommonAssetFields,
      assetTypeSpecificFieldTypes: AssetTypeSpecificFieldTypes,
    };
  }
}
