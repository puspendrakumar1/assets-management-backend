import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

/**
 * DTO class for Common Fields for Vendor
 * @export
 * @class CommonVendorDto
 */
export class CommonVendorDto {
  @IsString() @IsNotEmpty() address1: string;
  @IsString() @IsOptional() address2: string;
  @IsString() @IsOptional() address3: string;

  @IsString() @IsOptional() contactNo: string;
  @IsString() @IsOptional() contactPersonName: string;

  @IsString() @IsOptional() city: string;
  @IsString() @IsOptional() serviceNo: string;
}
