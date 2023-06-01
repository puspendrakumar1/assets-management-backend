import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { CommonVendorDto } from './commonVendorFields.dto';

/**
 * DTO class for Update Vendor
 * @export
 * @class UpdateVendorDto
 */
export class UpdateVendorDto extends CommonVendorDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
