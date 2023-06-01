import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { CommonVendorDto } from './commonVendorFields.dto';

/**
 * DTO class for Create Vendor
 * @export
 * @class CreateVendorDto
 */
export class CreateVendorDto extends CommonVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
