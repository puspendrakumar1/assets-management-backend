import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../common/Enums';

/**
 * DTO class for user edit
 * @export
 * @class EditUserDto
 */
export class EditUserDto {
  @IsString() @IsOptional() firstName?: string;
  @IsString() @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @IsString() @IsOptional() lastName?: string;
  @IsString() @IsOptional() departmentId?: string;
  @IsString() @IsOptional() mobileNumber?: string;
  @IsString() @IsOptional() @IsMongoId() branch?: string;
}
