import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

/**
 * DTO class for Update Branch
 * @export
 * @class UpdateBranchDto
 */
export class UpdateBranchDto {
  @IsString() @IsOptional() name: string;

  @IsString() @IsOptional() address1: string;
  @IsString() @IsOptional() address2: string;
  @IsString() @IsOptional() address3: string;

  @IsString() @IsOptional() city: string;
  @IsString() @IsOptional() country: string;
  @IsString() @IsOptional() state: string;

  @IsString() @IsOptional() fqdn: string;
  @IsString() @IsOptional() branchCode: string;
}
