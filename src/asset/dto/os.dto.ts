import { IsString, IsOptional } from 'class-validator';

/**
 * DTO class for OS used in Laptop, PC, Server
 * @export
 * @class OSDto
 */
export class OSDto {
  @IsOptional() @IsString() platform: string;
  @IsOptional() @IsString() distro: string;
  @IsOptional() @IsString() release: string;
  @IsOptional() @IsString() codename: string;
  @IsOptional() @IsString() arch: string;
  @IsOptional() @IsString() hostname: string;
  @IsOptional() @IsString() fqdn: string;
}
