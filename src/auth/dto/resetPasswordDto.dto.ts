import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO class for Reset Password
 * @export
 * @class ResetPasswordDto
 */
export class ResetPasswordDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
}
