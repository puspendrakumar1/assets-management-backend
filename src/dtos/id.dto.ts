import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO class for Id
 * @export
 * @class IdDto
 */
export class IdDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  id: string;
}
