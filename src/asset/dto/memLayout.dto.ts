import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

/**
 * DTO class for Memory Layout used in Laptop, PC, Server
 * @export
 * @class MemLayoutDto
 */
export class MemLayoutDto {
  @IsOptional() @IsNumber() size: number;
  @IsOptional() @IsString() bank: string;
  @IsOptional() @IsString() type: string;
  @IsOptional() @IsBoolean() ecc: boolean;
  @IsOptional() @IsNumber() clockSpeed: number;
  @IsOptional() @IsString() manufacturer: string;
}
