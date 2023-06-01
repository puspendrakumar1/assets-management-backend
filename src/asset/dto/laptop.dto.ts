import { Type } from 'class-transformer';
import { IsOptional, IsArray, IsObject, ValidateNested } from 'class-validator';
import { BaseBoardDto } from './baseBoard.dto';
import { BatteryDto } from './battery.dto';
import { CPUDto } from './cpu.dto';
import { DiskLayoutDto } from './diskLayout.dto';
import { MemDto } from './mem.dto';
import { MemLayoutDto } from './memLayout.dto';
import { OSDto } from './os.dto';
import { SystemDto } from './system.dto';

/**
 * DTO class for Laptop
 * @export
 * @class LaptopDto
 */
export class LaptopDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SystemDto)
  system: SystemDto;

  @IsOptional() @IsObject() @ValidateNested() @Type(() => OSDto) os: OSDto;
  @IsOptional() @IsObject() @ValidateNested() @Type(() => MemDto) mem: MemDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemLayoutDto)
  memLayout: MemLayoutDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiskLayoutDto)
  diskLayout: DiskLayoutDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BatteryDto)
  battery: BatteryDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BaseBoardDto)
  baseboard: BaseBoardDto;

  @IsOptional() @IsObject() @ValidateNested() @Type(() => CPUDto) cpu: CPUDto;
}
