import { IsString, IsOptional } from 'class-validator';

/**
 * DTO class for System used in Laptop, PC, Server
 * @export
 * @class SystemDto
 */
export class SystemDto {
  @IsOptional() @IsString() manufacturer: string;
  @IsOptional() @IsString() model: string;
  @IsOptional() @IsString() serial: string;
}
