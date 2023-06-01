import { IsOptional, IsNumber, IsString } from 'class-validator';

/**
 * DTO class for Disk Layout used in Laptop, PC, Server
 * @export
 * @class DiskLayoutDto
 */
export class DiskLayoutDto {
  @IsOptional() @IsString() device: string;
  @IsOptional() @IsString() type: string;
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() vendor: string;
  @IsOptional() @IsNumber() size: number;
  @IsOptional() @IsString() interfaceType: string;
  @IsOptional() @IsString() smartStatus: string;
}
