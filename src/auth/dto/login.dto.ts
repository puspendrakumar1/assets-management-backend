import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

/**
 * DTO class for user sign up
 * @export
 * @class LoginDto
 */
export class LoginDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
