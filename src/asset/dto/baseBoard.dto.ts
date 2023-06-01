import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

/**
 * DTO class for Base Board used in Laptop, PC, Server
 * @export
 * @class BaseBoardDto
 */
export class BaseBoardDto {
  @IsOptional() @IsString() manufacturer: string;
  @IsOptional() @IsString() model: string;
  @IsOptional() @IsString() serial: string;
  @IsOptional() @IsNumber() memSlots: number;
}
