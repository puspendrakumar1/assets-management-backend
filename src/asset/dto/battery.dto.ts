import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

/**
 * DTO class for Battery used in Laptop, PC, Server
 * @export
 * @class BatteryDto
 */
export class BatteryDto {
  @IsOptional() @IsBoolean() hasBattery: boolean;
  @IsOptional() @IsNumber() maxCapacity: number;
  @IsOptional() @IsString() capacityUnit: string;
  @IsOptional() @IsString() type: string;
  @IsOptional() @IsString() manufacturer: string;
}
