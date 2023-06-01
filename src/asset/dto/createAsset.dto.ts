import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { AssetsAllocationStatus, AssetTypes } from 'src/common/Enums';
import { LaptopDto } from './laptop.dto';
import { PCDto } from './pc.dto';
import { ServerDto } from './server.dto';
import { WarrantyDto } from './warranty.dto';

/**
 * DTO class for Create Asset
 * @export
 * @class CreateVendorDto
 */
export class CreateAssetDto {
  @IsString() @IsOptional() name: string;
  @IsString() assetCode: string;
  @IsString() @IsEnum(AssetTypes) type: AssetTypes;
  @IsOptional() @IsString() location: string;
  @IsOptional() @IsString() @IsMongoId() vendorId: string;
  @IsOptional() @IsString() sr_no?: string;
  @IsOptional() @IsString() life?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() subCategory?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WarrantyDto)
  warranty?: WarrantyDto[];

  @IsOptional() @IsString() @IsMongoId() branch: string;
  @IsOptional() @IsString() comment: string;

  @IsOptional()
  @IsString()
  @IsEnum(AssetsAllocationStatus)
  allocationStatus?: string;
  @IsOptional() @IsString() @IsMongoId() allocationToUserId?: string;

  @IsOptional() battery: any;

  @IsOptional() @ValidateNested() @Type(() => LaptopDto) laptop: LaptopDto;
  @IsOptional() @ValidateNested() @Type(() => ServerDto) server: ServerDto;
  @IsOptional() @ValidateNested() @Type(() => PCDto) pc: PCDto;

  @IsOptional() @IsDateString() purchaseDate: Date;
  @IsOptional() @IsString() poNumber: string;
}
