import { IsOptional, IsNumber } from 'class-validator';

/**
 * DTO class for Memory used in Laptop, PC, Server
 * @export
 * @class MemDto
 */
export class MemDto {
  @IsOptional() @IsNumber() total: number;
}
