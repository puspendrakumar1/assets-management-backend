import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset, AssetDocument } from 'src/asset/schemas/asset.schema';

@Injectable()
export class AssetAutoCompleteService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async assetAutoComplete(id: string, searchText: string) {
    const pathToField =
      id === 'operatingSystem'
        ? 'os.codename'
        : id === 'processor'
        ? 'cpu.brand'
        : 'system.model';

    const laptopCount = await this.assetModel
      .aggregate([
        {
          $match: {
            [`laptop.${pathToField}`]: {
              $regex: searchText,
              $options: 'i',
            },
          },
        },
        {
          $group: {
            _id: `$laptop.${pathToField}`,
            count: { $sum: 1 },
          },
        },
      ])
      .sort({ count: -1 })
      .limit(10);

    const serverCount = await this.assetModel
      .aggregate([
        {
          $match: {
            [`server.${pathToField}`]: {
              $regex: searchText,
              $options: 'i',
            },
          },
        },
        { $unwind: '$server' },
        {
          $group: {
            _id: `$server.${pathToField}`,
            count: { $sum: 1 },
          },
        },
      ])
      .sort({ count: -1 })
      .limit(10);

    const pcCount = await this.assetModel
      .aggregate([
        {
          $match: {
            [`pc.${pathToField}`]: {
              $regex: searchText,
              $options: 'i',
            },
          },
        },
        { $unwind: '$pc' },
        {
          $group: {
            _id: `$pc.${pathToField}`,
            count: { $sum: 1 },
          },
        },
      ])
      .sort({ count: -1 })
      .limit(10);

    const autoCompleteData = [
      ...new Set(
        [...laptopCount, ...serverCount, ...pcCount]
          .sort((a, b) => b.count - a.count)
          .map((assetsCount) => assetsCount._id),
      ),
    ].filter((count) => count);

    const defaultAutoCompleteData =
      id === 'operatingSystem'
        ? ['Windows 7', 'Windows 8', 'Windows 10', 'Windows 11']
        : id === 'processor'
        ? ['Intel® i3', 'Intel® i5', 'Intel® i7', 'Intel® i9']
        : autoCompleteData;

    return [...new Set([...autoCompleteData, ...defaultAutoCompleteData])];
  }
}
