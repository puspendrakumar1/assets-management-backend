import { WarrantyType } from 'src/common/Enums';
import { IWarranty } from './warranty.interface';

export interface IAssetsCountExpireingInDays {
  _id: WarrantyType;
  data: { assetId: string; warranty: IWarranty }[];
  count?: number;
}
