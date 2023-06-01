import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO class for Create Client
 * @export
 * @class CreateClientDto
 */
export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
