import { IsOptional, IsNumber, IsString } from 'class-validator';

/**
 * DTO class for CPU used in Laptop, PC, Server
 * @export
 * @class CPUDto
 */
export class CPUDto {
  @IsOptional() @IsString() manufacturer: string;
  @IsOptional() @IsString() brand: string;
  @IsOptional() @IsNumber() cores: number;
  @IsOptional() @IsNumber() physicalCores: number;
  @IsOptional() @IsNumber() processors: number;
}
