import { WarrantySiteType, WarrantyType } from 'src/common/Enums';
import { VendorDocument } from 'src/vendor/schemas/vendor.schema';

export interface IWarranty {
  name: string;
  description: string;
  type: WarrantyType;
  warrantySiteType: WarrantySiteType;
  startAt: Date;
  endAt: Date;

  purchaseDate?: Date;
  vendor?: string | VendorDocument;
  poNumber?: string | number;
}
