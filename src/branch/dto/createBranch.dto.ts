import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

/**
 * DTO class for Create Branch
 * @export
 * @class CreateBranchDto
 */
export class CreateBranchDto {
  @IsString() @IsNotEmpty() name: string;

  @IsString() @IsNotEmpty() address1: string;
  @IsString() address2: string;
  @IsString() address3: string;

  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() country: string;
  @IsString() @IsNotEmpty() state: string;

  @IsString() @IsOptional() fqdn: string;
  @IsString() @IsNotEmpty() branchCode: string;
}
