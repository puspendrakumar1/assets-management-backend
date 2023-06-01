import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { enumValidatorMessage } from 'src/common/utils/enum-validation-message.unil';
import { UserPermissions, UserRole } from '../../common/Enums';

/**
 * DTO class for user sign up
 * @export
 * @class SignUpDto
 */
export class SignUpDto {
  @IsEmail() @IsString() @IsNotEmpty() email: string;
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() @IsEnum(UserRole) role: UserRole;
  @IsString() @IsOptional() departmentId?: string;
  @IsString() @IsOptional() @IsMongoId() branch?: string;
  @IsString() @IsOptional() mobileNumber?: string;
  @IsString() @IsOptional() @IsMongoId() manager?: string;
  @IsArray()
  @IsOptional()
  @IsEnum(UserPermissions, {
    each: true,
    message: enumValidatorMessage(UserPermissions, 'permissions'),
  })
  permissions?: string[];
}
