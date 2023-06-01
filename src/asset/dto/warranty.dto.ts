import {
  IsOptional,
  IsString,
  IsEnum,
  IsMongoId,
  IsDateString,
} from 'class-validator';
import { WarrantySiteType, WarrantyType } from 'src/common/Enums';

/**
 * DTO class for Warranty
 * @export
 * @class WarrantyDto
 */
export class WarrantyDto {
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsEnum(WarrantyType) type: WarrantyType;
  @IsOptional() @IsEnum(WarrantySiteType) warrantySiteType: WarrantySiteType;
  @IsOptional() @IsDateString() startAt: Date;
  @IsOptional() @IsDateString() endAt: Date;
  @IsOptional() @IsDateString() purchaseDate: Date;
  @IsOptional() @IsString() @IsMongoId() vendor: string;
  @IsOptional() @IsString() poNumber: string;
}
